
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const winston = require('winston');
const { body, validationResult } = require('express-validator');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'printeasy_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

// Initialize PostgreSQL connection pool
const pool = new Pool(DB_CONFIG);

// Configure Winston logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

// Create logs directory if it doesn't exist
if (!fs.existsSync('logs')) {
  fs.mkdirSync('logs');
}

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "blob:"],
    },
  },
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// Stricter rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many login attempts, please try again later.',
  skipSuccessfulRequests: true,
});

// Middleware
app.use(compression());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images and documents are allowed.'));
    }
  }
});

// Database initialization with enhanced schema
async function initializeDatabase() {
  try {
    // Enhanced users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        phone VARCHAR(20) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE,
        password_hash VARCHAR(255),
        role VARCHAR(50) DEFAULT 'customer',
        shop_id INTEGER,
        is_active BOOLEAN DEFAULT true,
        needs_name_update BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Enhanced shops table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS shops (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        address TEXT NOT NULL,
        phone VARCHAR(20) NOT NULL,
        email VARCHAR(255),
        rating DECIMAL(3,2) DEFAULT 0.00,
        total_reviews INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        services TEXT[],
        operating_hours JSONB,
        owner_id INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Enhanced orders table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(50) PRIMARY KEY,
        customer_id INTEGER REFERENCES users(id),
        shop_id INTEGER REFERENCES shops(id),
        customer_name VARCHAR(255) NOT NULL,
        customer_phone VARCHAR(20) NOT NULL,
        customer_email VARCHAR(255),
        order_type VARCHAR(50) NOT NULL,
        status VARCHAR(50) DEFAULT 'new',
        description TEXT,
        special_instructions TEXT,
        is_urgent BOOLEAN DEFAULT false,
        total_amount DECIMAL(10,2),
        services TEXT[],
        pages INTEGER,
        copies INTEGER,
        paper_type VARCHAR(100),
        binding VARCHAR(100),
        color BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Order files table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS order_files (
        id SERIAL PRIMARY KEY,
        order_id VARCHAR(50) REFERENCES orders(id) ON DELETE CASCADE,
        filename VARCHAR(255) NOT NULL,
        original_name VARCHAR(255) NOT NULL,
        file_path TEXT NOT NULL,
        file_size INTEGER NOT NULL,
        mime_type VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Messages table for order chat
    await pool.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        order_id VARCHAR(50) REFERENCES orders(id) ON DELETE CASCADE,
        sender_type VARCHAR(50) NOT NULL,
        sender_id INTEGER NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Notifications table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        order_id VARCHAR(50) REFERENCES orders(id),
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        type VARCHAR(50) DEFAULT 'info',
        is_read BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes for better performance
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
      CREATE INDEX IF NOT EXISTS idx_orders_shop_id ON orders(shop_id);
      CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
      CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
      CREATE INDEX IF NOT EXISTS idx_messages_order_id ON messages(order_id);
      CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
      CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    `);

    logger.info('Enhanced database initialized successfully');
  } catch (error) {
    logger.error('Database initialization error:', error);
    throw error;
  }
}

// JWT Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Validation middleware
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

// API Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Enhanced authentication routes
app.post('/api/auth/login', 
  authLimiter,
  [
    body('phone').matches(/^[0-9]{10}$/).withMessage('Phone number must be exactly 10 digits'),
  ],
  validateRequest,
  async (req, res) => {
    try {
      const { phone } = req.body;

      // Check if user exists
      let result = await pool.query('SELECT * FROM users WHERE phone = $1', [phone]);
      let user = result.rows[0];

      // Create user if doesn't exist
      if (!user) {
        const insertResult = await pool.query(
          'INSERT INTO users (phone, role, needs_name_update) VALUES ($1, $2, $3) RETURNING *',
          [phone, 'customer', true]
        );
        user = insertResult.rows[0];
        logger.info(`New user created: ${user.id}`);
      }

      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: user.id, 
          phone: user.phone, 
          role: user.role 
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Remove password hash from response
      delete user.password_hash;

      res.json({
        message: 'Login successful',
        token,
        user
      });

      logger.info(`User login: ${user.id}`);
    } catch (error) {
      logger.error('Login error:', error);
      res.status(500).json({ error: 'Login failed' });
    }
  }
);

// Update user name
app.patch('/api/users/name',
  authenticateToken,
  [
    body('name').notEmpty().withMessage('Name is required'),
  ],
  validateRequest,
  async (req, res) => {
    try {
      const { name } = req.body;
      const { userId } = req.user;

      const result = await pool.query(
        'UPDATE users SET name = $1, needs_name_update = false, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
        [name, userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      const user = result.rows[0];
      delete user.password_hash;

      res.json({
        message: 'Name updated successfully',
        user
      });

      logger.info(`User name updated: ${userId}`);
    } catch (error) {
      logger.error('Update name error:', error);
      res.status(500).json({ error: 'Failed to update name' });
    }
  }
);

// Create walk-in order
app.post('/api/orders/walkin',
  [
    body('customerName').notEmpty().withMessage('Customer name is required'),
    body('customerPhone').matches(/^[0-9]{10}$/).withMessage('Phone number must be exactly 10 digits'),
    body('shopId').notEmpty().withMessage('Shop ID is required'),
  ],
  validateRequest,
  async (req, res) => {
    try {
      const {
        customerName,
        customerPhone,
        specialInstructions,
        shopId
      } = req.body;

      // Generate order ID
      const orderId = `WI${Date.now().toString().slice(-6)}`;

      const orderResult = await pool.query(
        `INSERT INTO orders (id, shop_id, customer_name, customer_phone, order_type, status, special_instructions)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [orderId, shopId, customerName, customerPhone, 'walk-in', 'new', specialInstructions]
      );

      const order = orderResult.rows[0];

      res.status(201).json({
        message: 'Walk-in order created successfully',
        order
      });

      logger.info(`Walk-in order created: ${orderId}`);
    } catch (error) {
      logger.error('Create walk-in order error:', error);
      res.status(500).json({ error: 'Failed to create walk-in order' });
    }
  }
);

// Get orders by shop
app.get('/api/orders/shop/:shopId', async (req, res) => {
  try {
    const { shopId } = req.params;
    const { status, orderType } = req.query;

    let query = 'SELECT * FROM orders WHERE shop_id = $1';
    let params = [shopId];
    let paramCount = 1;

    if (status) {
      paramCount++;
      query += ` AND status = $${paramCount}`;
      params.push(status);
    }

    if (orderType) {
      paramCount++;
      query += ` AND order_type = $${paramCount}`;
      params.push(orderType);
    }

    query += ' ORDER BY is_urgent DESC, created_at DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    logger.error('Get shop orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Update order status
app.patch('/api/orders/:orderId/status',
  [
    body('status').isIn(['new', 'confirmed', 'processing', 'ready', 'completed', 'cancelled']).withMessage('Valid status required'),
  ],
  validateRequest,
  async (req, res) => {
    try {
      const { orderId } = req.params;
      const { status } = req.body;

      const result = await pool.query(
        'UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
        [status, orderId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Order not found' });
      }

      res.json({
        message: 'Order status updated',
        order: result.rows[0]
      });

      logger.info(`Order ${orderId} status updated to ${status}`);
    } catch (error) {
      logger.error('Update order status error:', error);
      res.status(500).json({ error: 'Failed to update order status' });
    }
  }
);

// Get all shops
app.get('/api/shops', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM shops WHERE is_active = true ORDER BY rating DESC, name ASC'
    );
    res.json(result.rows);
  } catch (error) {
    logger.error('Get shops error:', error);
    res.status(500).json({ error: 'Failed to fetch shops' });
  }
});

// Admin: Update shop details
app.patch('/api/admin/shops/:shopId',
  authenticateToken,
  [
    body('name').optional().notEmpty().withMessage('Shop name cannot be empty'),
    body('phone').optional().matches(/^[0-9]{10}$/).withMessage('Phone number must be exactly 10 digits'),
    body('email').optional().isEmail().withMessage('Valid email required'),
  ],
  validateRequest,
  async (req, res) => {
    try {
      const { shopId } = req.params;
      const { name, address, phone, email } = req.body;

      // Check if user is admin
      if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
      }

      const updates = [];
      const values = [];
      let paramCount = 0;

      if (name) {
        paramCount++;
        updates.push(`name = $${paramCount}`);
        values.push(name);
      }
      if (address) {
        paramCount++;
        updates.push(`address = $${paramCount}`);
        values.push(address);
      }
      if (phone) {
        paramCount++;
        updates.push(`phone = $${paramCount}`);
        values.push(phone);
      }
      if (email) {
        paramCount++;
        updates.push(`email = $${paramCount}`);
        values.push(email);
      }

      if (updates.length === 0) {
        return res.status(400).json({ error: 'No valid fields to update' });
      }

      paramCount++;
      updates.push(`updated_at = CURRENT_TIMESTAMP`);
      values.push(shopId);

      const query = `UPDATE shops SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`;
      const result = await pool.query(query, values);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Shop not found' });
      }

      res.json({
        message: 'Shop updated successfully',
        shop: result.rows[0]
      });

      logger.info(`Shop ${shopId} updated by admin ${req.user.userId}`);
    } catch (error) {
      logger.error('Update shop error:', error);
      res.status(500).json({ error: 'Failed to update shop' });
    }
  }
);

// File serving
app.use('/uploads', express.static('uploads'));

// Error handling middleware
app.use((error, req, res, next) => {
  logger.error('Unhandled error:', error);
  
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 10MB.' });
    }
  }
  
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  await pool.end();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  await pool.end();
  process.exit(0);
});

// Start server
async function startServer() {
  try {
    await initializeDatabase();
    
    app.listen(PORT, () => {
      logger.info(`Enhanced PrintEasy backend server running on port ${PORT}`);
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
      console.log(`📚 API Documentation: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

module.exports = app;

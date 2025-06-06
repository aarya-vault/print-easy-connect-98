
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

// Database initialization
async function initializeDatabase() {
  try {
    // Create tables if they don't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(20) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE,
        password_hash VARCHAR(255),
        role VARCHAR(50) DEFAULT 'customer',
        shop_id INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

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
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        customer_id INTEGER REFERENCES users(id),
        shop_id INTEGER REFERENCES shops(id),
        order_type VARCHAR(50) NOT NULL,
        status VARCHAR(50) DEFAULT 'new',
        description TEXT,
        instructions TEXT,
        is_urgent BOOLEAN DEFAULT false,
        total_amount DECIMAL(10,2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS order_files (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
        filename VARCHAR(255) NOT NULL,
        original_name VARCHAR(255) NOT NULL,
        file_path TEXT NOT NULL,
        file_size INTEGER NOT NULL,
        mime_type VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
        sender_type VARCHAR(50) NOT NULL,
        sender_id INTEGER NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes for better performance
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
      CREATE INDEX IF NOT EXISTS idx_orders_shop_id ON orders(shop_id);
      CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
      CREATE INDEX IF NOT EXISTS idx_messages_order_id ON messages(order_id);
    `);

    logger.info('Database initialized successfully');
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

// Authentication routes
app.post('/api/auth/login', 
  authLimiter,
  [
    body('phone').isMobilePhone().withMessage('Valid phone number required'),
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
          'INSERT INTO users (name, phone, role) VALUES ($1, $2, $3) RETURNING *',
          [`Customer ${phone.slice(-4)}`, phone, 'customer']
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

app.post('/api/auth/login-email',
  authLimiter,
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  validateRequest,
  async (req, res) => {
    try {
      const { email, password } = req.body;

      const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      const user = result.rows[0];

      if (!user || !user.password_hash) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const validPassword = await bcrypt.compare(password, user.password_hash);
      if (!validPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { 
          userId: user.id, 
          email: user.email, 
          role: user.role 
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      delete user.password_hash;

      res.json({
        message: 'Login successful',
        token,
        user
      });

      logger.info(`Business user login: ${user.id}`);
    } catch (error) {
      logger.error('Email login error:', error);
      res.status(500).json({ error: 'Login failed' });
    }
  }
);

// Orders routes
app.get('/api/orders', authenticateToken, async (req, res) => {
  try {
    const { role, userId } = req.user;
    let query, params;

    if (role === 'customer') {
      query = `
        SELECT o.*, s.name as shop_name, s.phone as shop_phone, s.address as shop_address
        FROM orders o
        JOIN shops s ON o.shop_id = s.id
        WHERE o.customer_id = $1
        ORDER BY o.created_at DESC
      `;
      params = [userId];
    } else if (role === 'shop_owner') {
      // Get shop_id for the shop owner
      const shopResult = await pool.query('SELECT shop_id FROM users WHERE id = $1', [userId]);
      const shopId = shopResult.rows[0]?.shop_id;

      if (!shopId) {
        return res.status(400).json({ error: 'Shop not found for user' });
      }

      query = `
        SELECT o.*, u.name as customer_name, u.phone as customer_phone, u.email as customer_email
        FROM orders o
        JOIN users u ON o.customer_id = u.id
        WHERE o.shop_id = $1
        ORDER BY o.is_urgent DESC, o.created_at DESC
      `;
      params = [shopId];
    } else {
      // Admin - get all orders
      query = `
        SELECT o.*, u.name as customer_name, u.phone as customer_phone, u.email as customer_email,
               s.name as shop_name, s.phone as shop_phone, s.address as shop_address
        FROM orders o
        JOIN users u ON o.customer_id = u.id
        JOIN shops s ON o.shop_id = s.id
        ORDER BY o.created_at DESC
      `;
      params = [];
    }

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    logger.error('Get orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

app.post('/api/orders',
  authenticateToken,
  upload.array('files', 10),
  [
    body('shopId').isInt().withMessage('Valid shop ID required'),
    body('orderType').isIn(['uploaded-files', 'walk-in']).withMessage('Valid order type required'),
    body('customerName').notEmpty().withMessage('Customer name required'),
    body('customerPhone').isMobilePhone().withMessage('Valid phone number required'),
  ],
  validateRequest,
  async (req, res) => {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      const {
        shopId,
        orderType,
        customerName,
        customerPhone,
        customerEmail,
        description,
        instructions,
        isUrgent = false
      } = req.body;

      // Create order
      const orderResult = await client.query(
        `INSERT INTO orders (customer_id, shop_id, order_type, status, description, instructions, is_urgent)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [req.user.userId, shopId, orderType, 'new', description, instructions, isUrgent]
      );

      const order = orderResult.rows[0];

      // Handle file uploads
      if (req.files && req.files.length > 0) {
        for (const file of req.files) {
          await client.query(
            `INSERT INTO order_files (order_id, filename, original_name, file_path, file_size, mime_type)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [order.id, file.filename, file.originalname, file.path, file.size, file.mimetype]
          );
        }
      }

      await client.query('COMMIT');

      res.status(201).json({
        message: 'Order created successfully',
        order: {
          ...order,
          files: req.files?.map(f => ({
            filename: f.filename,
            originalName: f.originalname,
            size: f.size,
            mimetype: f.mimetype
          })) || []
        }
      });

      logger.info(`New order created: ${order.id} by user ${req.user.userId}`);
    } catch (error) {
      await client.query('ROLLBACK');
      logger.error('Create order error:', error);
      res.status(500).json({ error: 'Failed to create order' });
    } finally {
      client.release();
    }
  }
);

app.patch('/api/orders/:orderId/status',
  authenticateToken,
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

      logger.info(`Order ${orderId} status updated to ${status} by user ${req.user.userId}`);
    } catch (error) {
      logger.error('Update order status error:', error);
      res.status(500).json({ error: 'Failed to update order status' });
    }
  }
);

// Shops routes
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

// Messages/Chat routes
app.get('/api/orders/:orderId/messages', authenticateToken, async (req, res) => {
  try {
    const { orderId } = req.params;

    const result = await pool.query(
      `SELECT m.*, u.name as sender_name 
       FROM messages m
       JOIN users u ON m.sender_id = u.id
       WHERE m.order_id = $1
       ORDER BY m.created_at ASC`,
      [orderId]
    );

    res.json(result.rows);
  } catch (error) {
    logger.error('Get messages error:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

app.post('/api/orders/:orderId/messages',
  authenticateToken,
  [
    body('message').notEmpty().withMessage('Message content required'),
  ],
  validateRequest,
  async (req, res) => {
    try {
      const { orderId } = req.params;
      const { message } = req.body;
      const { userId, role } = req.user;

      const result = await pool.query(
        `INSERT INTO messages (order_id, sender_type, sender_id, message)
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [orderId, role, userId, message]
      );

      res.status(201).json({
        message: 'Message sent',
        data: result.rows[0]
      });

      logger.info(`Message sent for order ${orderId} by user ${userId}`);
    } catch (error) {
      logger.error('Send message error:', error);
      res.status(500).json({ error: 'Failed to send message' });
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
      logger.info(`PrintEasy backend server running on port ${PORT}`);
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

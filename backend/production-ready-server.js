
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
const JWT_SECRET = process.env.JWT_SECRET || 'production-jwt-secret-change-this';
const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'printeasy_production',
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
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
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
    fileSize: 10 * 1024 * 1024,
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

// Database initialization with complete production schema
async function initializeDatabase() {
  try {
    // Users table with offline module support
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

    // Shops table with offline module preference
    await pool.query(`
      CREATE TABLE IF NOT EXISTS shops (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(100) UNIQUE NOT NULL,
        address TEXT NOT NULL,
        phone VARCHAR(20) NOT NULL,
        email VARCHAR(255),
        owner_name VARCHAR(255) NOT NULL,
        owner_id INTEGER REFERENCES users(id),
        rating DECIMAL(3,2) DEFAULT 0.00,
        total_reviews INTEGER DEFAULT 0,
        total_orders INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        allows_offline_orders BOOLEAN DEFAULT true,
        opening_time TIME DEFAULT '09:00:00',
        closing_time TIME DEFAULT '18:00:00',
        services TEXT[],
        operating_hours JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Orders table with enhanced tracking
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
        description TEXT NOT NULL,
        special_instructions TEXT,
        is_urgent BOOLEAN DEFAULT false,
        total_amount DECIMAL(10,2),
        services TEXT[],
        pages INTEGER,
        copies INTEGER DEFAULT 1,
        paper_type VARCHAR(100),
        binding VARCHAR(100),
        color BOOLEAN DEFAULT false,
        estimated_completion TIMESTAMP,
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

    // Order status history
    await pool.query(`
      CREATE TABLE IF NOT EXISTS order_status_history (
        id SERIAL PRIMARY KEY,
        order_id VARCHAR(50) REFERENCES orders(id) ON DELETE CASCADE,
        old_status VARCHAR(50),
        new_status VARCHAR(50) NOT NULL,
        changed_by INTEGER REFERENCES users(id),
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Chat messages table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS chat_messages (
        id SERIAL PRIMARY KEY,
        order_id VARCHAR(50) REFERENCES orders(id) ON DELETE CASCADE,
        sender_id INTEGER REFERENCES users(id),
        sender_type VARCHAR(20) NOT NULL,
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Notifications table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        shop_id INTEGER REFERENCES shops(id),
        order_id VARCHAR(50) REFERENCES orders(id),
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        type VARCHAR(50) DEFAULT 'info',
        is_read BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create performance indexes
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
      CREATE INDEX IF NOT EXISTS idx_orders_shop_id ON orders(shop_id);
      CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
      CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
      CREATE INDEX IF NOT EXISTS idx_orders_urgent ON orders(is_urgent);
      CREATE INDEX IF NOT EXISTS idx_messages_order_id ON chat_messages(order_id);
      CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
      CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_shops_active ON shops(is_active);
      CREATE INDEX IF NOT EXISTS idx_shops_offline ON shops(allows_offline_orders);
    `);

    // Insert default admin user
    const adminExists = await pool.query('SELECT id FROM users WHERE email = $1', ['admin@printeasy.com']);
    if (adminExists.rows.length === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await pool.query(
        'INSERT INTO users (name, phone, email, password_hash, role) VALUES ($1, $2, $3, $4, $5)',
        ['PrintEasy Admin', '9999999999', 'admin@printeasy.com', hashedPassword, 'admin']
      );
    }

    // Insert sample shop
    const shopExists = await pool.query('SELECT id FROM shops WHERE slug = $1', ['quick-print-solutions']);
    if (shopExists.rows.length === 0) {
      const shopResult = await pool.query(
        `INSERT INTO shops (name, slug, address, phone, email, owner_name, allows_offline_orders) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
        ['Quick Print Solutions', 'quick-print-solutions', 'Shop 12, MG Road, Bangalore', '+91 98765 43210', 'shop@printeasy.com', 'Shop Owner', true]
      );

      // Create shop owner
      const shopOwnerExists = await pool.query('SELECT id FROM users WHERE email = $1', ['shop@printeasy.com']);
      if (shopOwnerExists.rows.length === 0) {
        const hashedPassword = await bcrypt.hash('password', 10);
        await pool.query(
          'INSERT INTO users (name, phone, email, password_hash, role, shop_id) VALUES ($1, $2, $3, $4, $5, $6)',
          ['Shop Owner', '9876543210', 'shop@printeasy.com', hashedPassword, 'shop_owner', shopResult.rows[0].id]
        );
      }
    }

    logger.info('Production database initialized successfully');
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
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
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

      let result = await pool.query('SELECT * FROM users WHERE phone = $1', [phone]);
      let user = result.rows[0];

      if (!user) {
        const insertResult = await pool.query(
          'INSERT INTO users (phone, role, needs_name_update) VALUES ($1, $2, $3) RETURNING *',
          [phone, 'customer', true]
        );
        user = insertResult.rows[0];
        logger.info(`New user created: ${user.id}`);
      }

      const token = jwt.sign(
        { 
          userId: user.id, 
          phone: user.phone, 
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

      logger.info(`User login: ${user.id}`);
    } catch (error) {
      logger.error('Login error:', error);
      res.status(500).json({ error: 'Login failed' });
    }
  }
);

// Email login for business users
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

// Get all shops with offline module info
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

// Create order with file upload support
app.post('/api/orders',
  upload.array('files', 10),
  [
    body('shopId').isInt().withMessage('Valid shop ID required'),
    body('orderType').isIn(['uploaded-files', 'walk-in']).withMessage('Valid order type required'),
    body('customerName').notEmpty().withMessage('Customer name required'),
    body('customerPhone').matches(/^[0-9]{10}$/).withMessage('Phone number must be exactly 10 digits'),
    body('description').notEmpty().withMessage('Order description required'),
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
        specialInstructions,
        isUrgent = false
      } = req.body;

      // Generate order ID
      const prefix = orderType === 'uploaded-files' ? 'UF' : 'WI';
      const orderId = `${prefix}${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;

      // Create order
      const orderResult = await client.query(
        `INSERT INTO orders (id, shop_id, customer_name, customer_phone, customer_email, 
         order_type, status, description, special_instructions, is_urgent)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
        [orderId, shopId, customerName, customerPhone, customerEmail, 
         orderType, 'new', description, specialInstructions, isUrgent]
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

      // Update shop order count
      await client.query(
        'UPDATE shops SET total_orders = total_orders + 1 WHERE id = $1',
        [shopId]
      );

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

      logger.info(`New order created: ${order.id}`);
    } catch (error) {
      await client.query('ROLLBACK');
      logger.error('Create order error:', error);
      res.status(500).json({ error: 'Failed to create order' });
    } finally {
      client.release();
    }
  }
);

// Get orders by shop with filtering
app.get('/api/orders/shop/:shopId', async (req, res) => {
  try {
    const { shopId } = req.params;
    const { status, orderType, urgent } = req.query;

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

    if (urgent === 'true') {
      query += ' AND is_urgent = true';
    }

    query += ' ORDER BY is_urgent DESC, created_at DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    logger.error('Get shop orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Update order status with history tracking
app.patch('/api/orders/:orderId/status',
  [
    body('status').isIn(['new', 'confirmed', 'processing', 'ready', 'completed', 'cancelled']).withMessage('Valid status required'),
  ],
  validateRequest,
  async (req, res) => {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      const { orderId } = req.params;
      const { status, notes } = req.body;

      // Get current order
      const currentOrder = await client.query('SELECT * FROM orders WHERE id = $1', [orderId]);
      if (currentOrder.rows.length === 0) {
        return res.status(404).json({ error: 'Order not found' });
      }

      const oldStatus = currentOrder.rows[0].status;

      // Update order status
      const result = await client.query(
        'UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
        [status, orderId]
      );

      // Record status history
      await client.query(
        'INSERT INTO order_status_history (order_id, old_status, new_status, notes) VALUES ($1, $2, $3, $4)',
        [orderId, oldStatus, status, notes]
      );

      await client.query('COMMIT');

      res.json({
        message: 'Order status updated',
        order: result.rows[0]
      });

      logger.info(`Order ${orderId} status updated from ${oldStatus} to ${status}`);
    } catch (error) {
      await client.query('ROLLBACK');
      logger.error('Update order status error:', error);
      res.status(500).json({ error: 'Failed to update order status' });
    } finally {
      client.release();
    }
  }
);

// Admin: Get all users
app.get('/api/admin/users', 
  authenticateToken,
  async (req, res) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
      }

      const result = await pool.query(
        'SELECT id, name, phone, email, role, shop_id, is_active, created_at FROM users ORDER BY created_at DESC'
      );
      res.json(result.rows);
    } catch (error) {
      logger.error('Get users error:', error);
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  }
);

// Admin: Update shop
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
      const { name, address, phone, email, ownerName, isActive, allowsOfflineOrders } = req.body;

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
      if (ownerName) {
        paramCount++;
        updates.push(`owner_name = $${paramCount}`);
        values.push(ownerName);
      }
      if (typeof isActive === 'boolean') {
        paramCount++;
        updates.push(`is_active = $${paramCount}`);
        values.push(isActive);
      }
      if (typeof allowsOfflineOrders === 'boolean') {
        paramCount++;
        updates.push(`allows_offline_orders = $${paramCount}`);
        values.push(allowsOfflineOrders);
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
      logger.info(`Production PrintEasy backend server running on port ${PORT}`);
      console.log(`🚀 Production Server is running on http://localhost:${PORT}`);
      console.log(`📚 API Health Check: http://localhost:${PORT}/api/health`);
      console.log(`🔐 Admin Login: admin@printeasy.com / admin123`);
      console.log(`🏪 Shop Login: shop@printeasy.com / password`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

module.exports = app;

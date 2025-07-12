
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { Pool } = require('pg');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Environment variables
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';
const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE || '10485760'); // 10MB default

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disabled for dev, enable in production
}));

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', apiLimiter);

// Middleware
app.use(cors());
app.use(express.json());
app.use(compression()); // Compress responses
app.use('/uploads', express.static('uploads'));
app.use(morgan(NODE_ENV === 'production' ? 'combined' : 'dev')); // Request logging

// Database connection
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'printeasy_shop',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
  ssl: NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Test database connection
pool.query('SELECT NOW()', (err) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Connected to PostgreSQL database');
  }
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  // Join shop room for real-time updates
  socket.on('join-shop', (shopId) => {
    socket.join(`shop-${shopId}`);
    console.log(`Client ${socket.id} joined shop-${shopId}`);
  });

  // Join order room for real-time updates
  socket.on('join-order', (orderId) => {
    socket.join(`order-${orderId}`);
    console.log(`Client ${socket.id} joined order-${orderId}`);
  });

  // Handle chat messages
  socket.on('send-message', async (data) => {
    try {
      const { orderId, message, senderId, senderType } = data;
      
      // Input validation
      if (!orderId || !message || !senderId || !senderType) {
        socket.emit('error', { message: 'Invalid message data' });
        return;
      }
      
      // Save message to database
      const result = await pool.query(`
        INSERT INTO chat_messages (order_id, sender_id, sender_type, message, created_at)
        VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
        RETURNING *
      `, [orderId, senderId, senderType, message]);
      
      // Get shop ID for the order to broadcast to shop
      const orderResult = await pool.query('SELECT shop_id FROM orders WHERE id = $1', [orderId]);
      
      if (orderResult.rows.length > 0) {
        // Broadcast to order participants
        io.to(`order-${orderId}`).emit('new-message', result.rows[0]);
        
        // Also notify the shop
        io.to(`shop-${orderResult.rows[0].shop_id}`).emit('order-notification', {
          type: 'message',
          orderId,
          message: `New message for order #${orderId}`
        });
      }
    } catch (error) {
      console.error('Error saving message:', error);
      socket.emit('error', { message: 'Failed to save message' });
    }
  });

  // Handle order status notifications
  socket.on('order-status-change', async (data) => {
    const { orderId, status, shopId } = data;
    io.to(`shop-${shopId}`).emit('order-status-update', { orderId, status });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Ensure uploads directory exists
const uploadsDir = process.env.UPLOAD_PATH || 'uploads';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer configuration for file uploads with improved security
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Create shop-specific directories
    const shopId = req.params.shopId || 'default';
    const shopDir = path.join(uploadsDir, shopId);
    
    if (!fs.existsSync(shopDir)) {
      fs.mkdirSync(shopDir, { recursive: true });
    }
    
    cb(null, shopDir);
  },
  filename: (req, file, cb) => {
    // Sanitize filename to prevent directory traversal attacks
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(sanitizedName));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: MAX_FILE_SIZE, // From environment variable with default
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf', 
      'image/jpeg', 
      'image/png', 
      'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, JPEG, PNG, and Word documents are allowed.'), false);
    }
  }
});

// Enhanced search endpoint with security and pagination
app.get('/api/orders/search', async (req, res) => {
  try {
    const { q, shopId = 1, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    
    if (!q) {
      return res.json({
        data: [],
        pagination: { page, limit, total: 0, totalPages: 0 }
      });
    }
    
    // Use parameterized query to prevent SQL injection
    const searchQuery = `
      SELECT o.*, 
             json_agg(
               json_build_object(
                 'id', f.id,
                 'name', f.original_name,
                 'type', f.mime_type,
                 'size', f.file_size,
                 'url', f.file_path
               )
             ) FILTER (WHERE f.id IS NOT NULL) as files
      FROM orders o
      LEFT JOIN order_files f ON o.id = f.order_id
      WHERE o.shop_id = $1 AND (
        LOWER(o.customer_name) LIKE LOWER($2) OR
        LOWER(o.id::text) LIKE LOWER($2) OR
        o.customer_phone LIKE $2
      )
      GROUP BY o.id 
      ORDER BY o.is_urgent DESC, o.created_at DESC
      LIMIT $3 OFFSET $4
    `;
    
    const countQuery = `
      SELECT COUNT(*) FROM orders
      WHERE shop_id = $1 AND (
        LOWER(customer_name) LIKE LOWER($2) OR
        LOWER(id::text) LIKE LOWER($2) OR
        customer_phone LIKE $2
      )
    `;
    
    const [results, countResult] = await Promise.all([
      pool.query(searchQuery, [shopId, `%${q}%`, limit, offset]),
      pool.query(countQuery, [shopId, `%${q}%`])
    ]);
    
    const total = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(total / limit);
    
    res.json({
      data: results.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages
      }
    });
  } catch (error) {
    console.error('Error searching orders:', error);
    res.status(500).json({ error: 'Failed to search orders' });
  }
});

// Get all orders for a shop with enhanced filtering, caching and pagination
app.get('/api/orders', async (req, res) => {
  try {
    const { 
      shopId = 1, 
      status, 
      orderType, 
      urgent,
      page = 1,
      limit = 20,
      sortBy = 'created_at',
      sortOrder = 'desc'
    } = req.query;
    
    const offset = (page - 1) * limit;
    
    // Validate sort parameters to prevent SQL injection
    const allowedSortFields = ['created_at', 'customer_name', 'status', 'order_type'];
    const allowedSortOrders = ['asc', 'desc'];
    
    const actualSortField = allowedSortFields.includes(sortBy) ? sortBy : 'created_at';
    const actualSortOrder = allowedSortOrders.includes(sortOrder.toLowerCase()) ? sortOrder : 'desc';
    
    let query = `
      SELECT o.*, 
             json_agg(
               json_build_object(
                 'id', f.id,
                 'name', f.original_name,
                 'type', f.mime_type,
                 'size', f.file_size,
                 'url', f.file_path
               )
             ) FILTER (WHERE f.id IS NOT NULL) as files
      FROM orders o
      LEFT JOIN order_files f ON o.id = f.order_id
      WHERE o.shop_id = $1
    `;
    
    let countQuery = `
      SELECT COUNT(*) FROM orders
      WHERE shop_id = $1
    `;
    
    const params = [shopId];
    let paramCount = 1;
    
    if (status && status !== 'all') {
      paramCount++;
      query += ` AND o.status = $${paramCount}`;
      countQuery += ` AND status = $${paramCount}`;
      params.push(status);
    }
    
    if (orderType && orderType !== 'all') {
      paramCount++;
      query += ` AND o.order_type = $${paramCount}`;
      countQuery += ` AND order_type = $${paramCount}`;
      params.push(orderType);
    }
    
    if (urgent === 'true') {
      query += ` AND o.is_urgent = true`;
      countQuery += ` AND is_urgent = true`;
    }
    
    query += ` GROUP BY o.id`;
    
    // Add sorting
    query += ` ORDER BY o.is_urgent DESC, o.${actualSortField} ${actualSortOrder}`;
    
    // Add pagination
    query += ` LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(limit);
    params.push(offset);
    
    const [results, countResult] = await Promise.all([
      pool.query(query, params),
      pool.query(countQuery, params.slice(0, paramCount))
    ]);
    
    const total = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(total / limit);
    
    res.json({
      data: results.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages
      }
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Create new order with real-time notification and transaction safety
app.post('/api/orders', async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const {
      shopId = 1,
      customerName,
      customerPhone,
      customerEmail,
      orderType,
      description,
      instructions,
      services,
      pages,
      copies,
      paperType,
      binding,
      color,
      isUrgent = false
    } = req.body;
    
    // Input validation
    if (!customerName || !customerPhone) {
      return res.status(400).json({ error: 'Customer name and phone are required' });
    }
    
    const orderResult = await client.query(`
      INSERT INTO orders (
        shop_id, customer_name, customer_phone, customer_email,
        order_type, description, instructions, services,
        pages, copies, paper_type, binding, color, is_urgent
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *
    `, [
      shopId, customerName, customerPhone, customerEmail,
      orderType, description, instructions, JSON.stringify(services),
      pages, copies, paperType, binding, color, isUrgent
    ]);
    
    // Log the creation
    await client.query(`
      INSERT INTO order_status_history (order_id, status, changed_at, notes)
      VALUES ($1, 'new', CURRENT_TIMESTAMP, 'Order created')
    `, [orderResult.rows[0].id]);
    
    await client.query('COMMIT');
    
    // Emit real-time notification to shop
    io.to(`shop-${shopId}`).emit('new-order', {
      ...orderResult.rows[0],
      isNew: true,
      notification: `New order from ${customerName}`
    });
    
    res.status(201).json(orderResult.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  } finally {
    client.release();
  }
});

// Update order status with real-time notification and auditing
app.put('/api/orders/:id/status', async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { id } = req.params;
    const { status, notes } = req.body;
    const validStatuses = ['new', 'confirmed', 'processing', 'ready', 'completed', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }
    
    const result = await client.query(
      'UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [status, id]
    );
    
    if (result.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Order not found' });
    }
    
    // Log status change
    await client.query(`
      INSERT INTO order_status_history (order_id, status, changed_at, notes)
      VALUES ($1, $2, CURRENT_TIMESTAMP, $3)
    `, [id, status, notes || `Status changed to ${status}`]);
    
    await client.query('COMMIT');
    
    // Emit real-time update
    const order = result.rows[0];
    io.to(`shop-${order.shop_id}`).emit('order-updated', order);
    io.to(`order-${id}`).emit('status-changed', { 
      orderId: id, 
      status, 
      timestamp: new Date().toISOString() 
    });
    
    res.json(order);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  } finally {
    client.release();
  }
});

// Toggle order urgency with real-time notification
app.put('/api/orders/:id/urgent', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      'UPDATE orders SET is_urgent = NOT is_urgent, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    // Emit real-time update
    const order = result.rows[0];
    io.to(`shop-${order.shop_id}`).emit('order-updated', order);
    
    res.json(order);
  } catch (error) {
    console.error('Error toggling order urgency:', error);
    res.status(500).json({ error: 'Failed to toggle order urgency' });
  }
});

// Get chat messages for an order with pagination
app.get('/api/orders/:id/messages', async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;
    
    const [messages, countResult] = await Promise.all([
      pool.query(`
        SELECT * FROM chat_messages 
        WHERE order_id = $1 
        ORDER BY created_at ASC
        LIMIT $2 OFFSET $3
      `, [id, limit, offset]),
      
      pool.query(`
        SELECT COUNT(*) FROM chat_messages 
        WHERE order_id = $1
      `, [id])
    ]);
    
    const total = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(total / limit);
    
    res.json({
      data: messages.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages
      }
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Get quick reply templates
app.get('/api/quick-replies', async (req, res) => {
  try {
    const { type } = req.query; // 'shop' or 'customer'
    
    const result = await pool.query(`
      SELECT * FROM quick_reply_templates 
      WHERE sender_type = $1 
      ORDER BY usage_count DESC
    `, [type]);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching quick replies:', error);
    res.status(500).json({ error: 'Failed to fetch quick replies' });
  }
});

// Upload files for an order with improved error handling
app.post('/api/orders/:id/files', upload.array('files', 10), async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { id } = req.params;
    const files = req.files;
    
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }
    
    // Verify order exists
    const orderCheck = await client.query('SELECT id, shop_id FROM orders WHERE id = $1', [id]);
    if (orderCheck.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Order not found' });
    }
    
    const shopId = orderCheck.rows[0].shop_id;
    
    const filePromises = files.map(file => {
      return client.query(`
        INSERT INTO order_files (order_id, original_name, file_path, mime_type, file_size)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `, [id, file.originalname, file.path, file.mimetype, file.size]);
    });
    
    const fileResults = await Promise.all(filePromises);
    
    // Update order record to reflect new files
    await client.query(`
      UPDATE orders 
      SET updated_at = CURRENT_TIMESTAMP,
          files_count = files_count + $1
      WHERE id = $2
    `, [files.length, id]);
    
    await client.query('COMMIT');
    
    // Get order details for real-time update
    io.to(`shop-${shopId}`).emit('order-files-uploaded', {
      orderId: id,
      shopId: shopId,
      filesCount: files.length,
      files: fileResults.map(result => result.rows[0])
    });
    
    io.to(`order-${id}`).emit('files-uploaded', {
      orderId: id,
      filesCount: files.length,
      timestamp: new Date().toISOString()
    });
    
    res.json(fileResults.map(result => result.rows[0]));
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error uploading files:', error);
    res.status(500).json({ error: 'Failed to upload files' });
  } finally {
    client.release();
  }
});

// Get shop dashboard stats with real-time capability and caching
app.get('/api/shop/:id/stats', async (req, res) => {
  try {
    const { id } = req.params;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const [todayOrders, urgentOrders, pendingOrders, totalOrders, recentOrders, ordersByStatus] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM orders WHERE shop_id = $1 AND created_at >= $2', [id, today]),
      pool.query('SELECT COUNT(*) FROM orders WHERE shop_id = $1 AND is_urgent = true', [id]),
      pool.query("SELECT COUNT(*) FROM orders WHERE shop_id = $1 AND status IN ('new', 'confirmed', 'processing')", [id]),
      pool.query('SELECT COUNT(*) FROM orders WHERE shop_id = $1', [id]),
      pool.query('SELECT * FROM orders WHERE shop_id = $1 ORDER BY created_at DESC LIMIT 5', [id]),
      pool.query(`
        SELECT status, COUNT(*) 
        FROM orders 
        WHERE shop_id = $1 
        GROUP BY status
      `, [id])
    ]);
    
    // Format status counts for easy consumption by frontend charts
    const statusCounts = {};
    ordersByStatus.rows.forEach(row => {
      statusCounts[row.status] = parseInt(row.count);
    });
    
    res.json({
      todayOrders: parseInt(todayOrders.rows[0].count),
      urgentOrders: parseInt(urgentOrders.rows[0].count),
      pendingOrders: parseInt(pendingOrders.rows[0].count),
      totalOrders: parseInt(totalOrders.rows[0].count),
      recentOrders: recentOrders.rows,
      ordersByStatus: statusCounts
    });
  } catch (error) {
    console.error('Error fetching shop stats:', error);
    res.status(500).json({ error: 'Failed to fetch shop stats' });
  }
});

// Health check endpoint for monitoring
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API documentation endpoint (only in development mode)
if (NODE_ENV !== 'production') {
  app.get('/api/docs', (req, res) => {
    res.sendFile(path.join(__dirname, 'api-docs.html'));
  });
}

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large' });
    }
    return res.status(400).json({ error: error.message });
  }
  
  // Log errors but don't expose details in production
  const errorMessage = NODE_ENV === 'production' 
    ? 'Internal server error' 
    : error.message || 'Internal server error';
  
  res.status(500).json({ error: errorMessage });
});

// Start server with graceful shutdown
server.listen(PORT, () => {
  console.log(`Enhanced server running on port ${PORT}`);
  console.log('Real-time features enabled with Socket.io');
  console.log(`Environment: ${NODE_ENV}`);
});

// Graceful shutdown
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

async function shutdown() {
  console.log('Shutting down server gracefully...');
  
  // Close server first, so it stops accepting new connections
  server.close(() => {
    console.log('HTTP server closed');
  });
  
  // Then close database pool
  try {
    await pool.end();
    console.log('Database connections closed');
  } catch (err) {
    console.error('Error closing database connections:', err);
  }
  
  // Exit process
  process.exit(0);
}

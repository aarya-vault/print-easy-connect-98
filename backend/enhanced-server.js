
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { Pool } = require('pg');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3001;

// Database connection
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'printeasy_shop',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  // Join shop room for real-time updates
  socket.on('join-shop', (shopId) => {
    socket.join(`shop-${shopId}`);
    console.log(`Client ${socket.id} joined shop-${shopId}`);
  });

  // Handle chat messages
  socket.on('send-message', async (data) => {
    try {
      const { orderId, message, senderId, senderType } = data;
      
      // Save message to database
      const result = await pool.query(`
        INSERT INTO chat_messages (order_id, sender_id, sender_type, message, created_at)
        VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
        RETURNING *
      `, [orderId, senderId, senderType, message]);
      
      // Broadcast to order participants
      io.to(`order-${orderId}`).emit('new-message', result.rows[0]);
    } catch (error) {
      console.error('Error saving message:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Ensure uploads directory exists
const uploadsDir = 'uploads';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
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
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'), false);
    }
  }
});

// Enhanced search endpoint
app.get('/api/orders/search', async (req, res) => {
  try {
    const { q, shopId = 1 } = req.query;
    
    if (!q) {
      return res.json([]);
    }
    
    const query = `
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
        LOWER(o.id) LIKE LOWER($2) OR
        o.customer_phone LIKE $2
      )
      GROUP BY o.id 
      ORDER BY o.is_urgent DESC, o.created_at DESC
      LIMIT 20
    `;
    
    const result = await pool.query(query, [shopId, `%${q}%`]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error searching orders:', error);
    res.status(500).json({ error: 'Failed to search orders' });
  }
});

// Get all orders for a shop with enhanced filtering
app.get('/api/orders', async (req, res) => {
  try {
    const { shopId = 1, status, orderType, urgent, limit = 50 } = req.query;
    
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
    
    const params = [shopId];
    let paramCount = 1;
    
    if (status && status !== 'all') {
      paramCount++;
      query += ` AND o.status = $${paramCount}`;
      params.push(status);
    }
    
    if (orderType && orderType !== 'all') {
      paramCount++;
      query += ` AND o.order_type = $${paramCount}`;
      params.push(orderType);
    }
    
    if (urgent === 'true') {
      query += ` AND o.is_urgent = true`;
    }
    
    query += ` GROUP BY o.id ORDER BY o.is_urgent DESC, o.created_at DESC LIMIT $${paramCount + 1}`;
    params.push(limit);
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Create new order with real-time notification
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
    
    await client.query('COMMIT');
    
    // Emit real-time notification to shop
    io.to(`shop-${shopId}`).emit('new-order', orderResult.rows[0]);
    
    res.status(201).json(orderResult.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  } finally {
    client.release();
  }
});

// Update order status with real-time notification
app.put('/api/orders/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const result = await pool.query(
      'UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [status, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    // Log status change
    await pool.query(`
      INSERT INTO order_status_history (order_id, status, changed_at)
      VALUES ($1, $2, CURRENT_TIMESTAMP)
    `, [id, status]);
    
    // Emit real-time update
    const order = result.rows[0];
    io.to(`shop-${order.shop_id}`).emit('order-updated', order);
    
    res.json(order);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Failed to update order status' });
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

// Get chat messages for an order
app.get('/api/orders/:id/messages', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(`
      SELECT * FROM chat_messages 
      WHERE order_id = $1 
      ORDER BY created_at ASC
    `, [id]);
    
    res.json(result.rows);
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

// Upload files for an order
app.post('/api/orders/:id/files', upload.array('files', 10), async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { id } = req.params;
    const files = req.files;
    
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }
    
    const filePromises = files.map(file => {
      return client.query(`
        INSERT INTO order_files (order_id, original_name, file_path, mime_type, file_size)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `, [id, file.originalname, file.path, file.mimetype, file.size]);
    });
    
    const fileResults = await Promise.all(filePromises);
    
    await client.query('COMMIT');
    
    // Get order details for real-time update
    const orderResult = await pool.query('SELECT shop_id FROM orders WHERE id = $1', [id]);
    if (orderResult.rows.length > 0) {
      io.to(`shop-${orderResult.rows[0].shop_id}`).emit('order-files-uploaded', {
        orderId: id,
        files: fileResults.map(result => result.rows[0])
      });
    }
    
    res.json(fileResults.map(result => result.rows[0]));
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error uploading files:', error);
    res.status(500).json({ error: 'Failed to upload files' });
  } finally {
    client.release();
  }
});

// Get shop dashboard stats with real-time capability
app.get('/api/shop/:id/stats', async (req, res) => {
  try {
    const { id } = req.params;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const [todayOrders, urgentOrders, pendingOrders, totalOrders] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM orders WHERE shop_id = $1 AND created_at >= $2', [id, today]),
      pool.query('SELECT COUNT(*) FROM orders WHERE shop_id = $1 AND is_urgent = true', [id]),
      pool.query("SELECT COUNT(*) FROM orders WHERE shop_id = $1 AND status IN ('new', 'confirmed', 'processing')", [id]),
      pool.query('SELECT COUNT(*) FROM orders WHERE shop_id = $1', [id])
    ]);
    
    res.json({
      todayOrders: parseInt(todayOrders.rows[0].count),
      urgentOrders: parseInt(urgentOrders.rows[0].count),
      pendingOrders: parseInt(pendingOrders.rows[0].count),
      totalOrders: parseInt(totalOrders.rows[0].count)
    });
  } catch (error) {
    console.error('Error fetching shop stats:', error);
    res.status(500).json({ error: 'Failed to fetch shop stats' });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large' });
    }
  }
  res.status(500).json({ error: 'Internal server error' });
});

server.listen(PORT, () => {
  console.log(`Enhanced server running on port ${PORT}`);
  console.log('Real-time features enabled with Socket.io');
});

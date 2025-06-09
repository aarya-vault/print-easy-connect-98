
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const path = require('path');
const http = require('http');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/orders');
const shopRoutes = require('./routes/shops');
const fileRoutes = require('./routes/files');
const chatRoutes = require('./routes/chat');

const app = express();
const server = http.createServer(app);

// Security middleware with relaxed settings for development
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Very permissive CORS for development - allows all origins
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Content-Length', 'X-Kuma-Revision']
}));

// Handle preflight requests explicitly
app.options('*', cors());

// Rate limiting - very permissive for development
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 2000, // Very high limit for development
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for health checks and development
    return req.path === '/health' || process.env.NODE_ENV === 'development';
  }
});
app.use('/api', limiter);

// General middleware
app.use(compression());
app.use(morgan('combined'));
app.use(express.json({ limit: '1gb' })); // Very high limits for development
app.use(express.urlencoded({ extended: true, limit: '1gb' }));

// Serve static files (uploaded files)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'PrintEasy API Server',
    version: '1.0.0',
    status: 'running',
    documentation: 'Import postman-collection.json for complete API testing',
    endpoints: {
      auth: '/api/auth',
      orders: '/api/orders', 
      shops: '/api/shops',
      files: '/api/files',
      chat: '/api/chat',
      health: '/health'
    }
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/shops', shopRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/chat', chatRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method,
    suggestion: 'Check the API documentation or import the Postman collection'
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  
  // Handle multer errors
  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'File too large.' });
  }
  
  if (error.code === 'LIMIT_FILE_COUNT') {
    return res.status(400).json({ error: 'Too many files.' });
  }

  if (error.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({ error: 'Unexpected file field.' });
  }

  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || '0.0.0.0';

// Start server with proper database connection
async function startServer() {
  try {
    const { sequelize } = require('./models');
    
    // Test database connection
    await sequelize.authenticate();
    console.log('✓ Database connection established successfully.');

    // Sync database (create tables if they don't exist)
    await sequelize.sync({ alter: true });
    console.log('✓ Database synchronized successfully.');

    // Start server
    server.listen(PORT, HOST, () => {
      console.log(`\n🚀 PrintEasy API server running on http://${HOST}:${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 CORS: Enabled for all origins`);
      console.log(`📁 File uploads: Unlimited size and type`);
      console.log(`💬 Chat system: Enabled`);
      console.log(`📱 Phone login: Enabled`);
      console.log(`📋 Postman collection: backend/postman-collection.json`);
      console.log(`🔍 Health check: http://${HOST}:${PORT}/health\n`);
    });

  } catch (error) {
    console.error('❌ Unable to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

startServer();

module.exports = { app, server };

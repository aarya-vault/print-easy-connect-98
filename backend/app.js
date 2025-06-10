const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const path = require('path');
const http = require('http');
require('dotenv').config();

// Import middleware
const errorHandler = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/orders');
const shopRoutes = require('./routes/shops');
const fileRoutes = require('./routes/files');
const chatRoutes = require('./routes/chat');
const adminRoutes = require('./routes/admin');

const app = express();
const server = http.createServer(app);

// Security middleware with development-friendly settings
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Enhanced CORS configuration for development
app.use(cors({
  origin: function(origin, callback) {
    // Allow all origins in development
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With', 
    'Accept', 
    'Origin',
    'Access-Control-Allow-Credentials'
  ],
  exposedHeaders: ['Content-Length', 'X-Kuma-Revision'],
  optionsSuccessStatus: 200
}));

// Handle preflight requests for all routes
app.options('*', cors());

// Rate limiting with generous limits for development
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5000, // Very high limit for development
  message: {
    success: false,
    error: 'Too many requests',
    message: 'Please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    return req.path === '/health' || process.env.NODE_ENV === 'development';
  }
});

app.use('/api', limiter);

// General middleware
app.use(compression());
app.use(morgan('combined'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files (uploaded files)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Enhanced health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    success: true,
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV || 'development',
    version: '2.0.0',
    database: 'Connected',
    services: {
      authentication: 'Active',
      fileUpload: 'Active',
      chat: 'Active',
      orders: 'Active'
    }
  });
});

// Enhanced root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'PrintEasy API Server v2.0',
    version: '2.0.0',
    status: 'running',
    documentation: 'Import postman-collection.json for complete API testing',
    testCredentials: {
      customer: { phone: '9876543210', note: 'Auto-login, no password required' },
      shopOwner: { email: 'shop@printeasy.com', password: 'password123' },
      admin: { email: 'admin@printeasy.com', password: 'admin123' }
    },
    endpoints: {
      auth: '/api/auth',
      orders: '/api/orders', 
      shops: '/api/shops',
      files: '/api/files',
      chat: '/api/chat',
      health: '/health'
    },
    features: [
      'Phone-based customer authentication',
      'Email-based shop owner/admin authentication',
      'Real-time order tracking',
      'File upload and management',
      'Chat system',
      'Role-based access control'
    ]
  });
});

// API routes with proper mounting
app.use('/api/auth', require('./routes/auth'));
app.use('/api/shops', require('./routes/shops'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/files', require('./routes/files'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/admin', require('./routes/admin'));

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false,
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method,
    message: 'The requested endpoint does not exist',
    suggestion: 'Check the API documentation or import the Postman collection',
    availableRoutes: ['/api/auth', '/api/orders', '/api/shops', '/api/files', '/api/chat']
  });
});

// Global error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || '0.0.0.0';

// Enhanced server startup with database initialization
async function startServer() {
  try {
    const { sequelize } = require('./models');
    
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');

    // Sync database (create tables if they don't exist)
    await sequelize.sync({ alter: true });
    console.log('✅ Database synchronized successfully.');

    // Create test data if in development
    if (process.env.NODE_ENV !== 'production') {
      try {
        const { createTestData } = require('./seeders/comprehensive-test-data');
        await createTestData();
      } catch (seedError) {
        console.log('ℹ️  Test data already exists or creation skipped');
      }
    }

    // Start server
    server.listen(PORT, HOST, () => {
      console.log(`\n🚀 PrintEasy API v2.0 server running on http://${HOST}:${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 CORS: Enabled for all origins (development mode)`);
      console.log(`📁 File uploads: 50MB limit, all types accepted`);
      console.log(`💬 Real-time chat: Enabled`);
      console.log(`🔐 Authentication: Phone + Email login ready`);
      console.log(`📋 API Testing: Import backend/postman-collection.json`);
      console.log(`🔍 Health check: http://${HOST}:${PORT}/health`);
      console.log(`📚 Test credentials available at: http://${HOST}:${PORT}/`);
      console.log(`\n👤 Quick Test Logins:`);
      console.log(`   Customer: 9876543210`);
      console.log(`   Shop: shop@printeasy.com / password123`);
      console.log(`   Admin: admin@printeasy.com / admin123\n`);
    });

  } catch (error) {
    console.error('❌ Unable to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

startServer();

module.exports = { app, server };

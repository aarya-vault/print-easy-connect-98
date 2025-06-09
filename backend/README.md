# PrintEasy Backend - Complete Documentation

## Table of Contents
1. [Overview](#overview)
2. [Technology Stack](#technology-stack)
3. [Quick Start Guide](#quick-start-guide)
4. [Database Schema (Sequelize)](#database-schema-sequelize)
5. [API Endpoints](#api-endpoints)
6. [Authentication System](#authentication-system)
7. [File Upload System](#file-upload-system)
8. [Chat System](#chat-system)
9. [Testing](#testing)
10. [Deployment](#deployment)
11. [Troubleshooting](#troubleshooting)

## Overview

PrintEasy is a platform connecting customers with local print shops. The backend provides:
- **Phone-based authentication** for customers (auto-registration)
- **Email authentication** for shop owners and admins
- **Unlimited file uploads** (any type, any size)
- **Simplified order management** (3 statuses: received, started, completed)
- **Real-time chat** between customers and shops
- **Clean REST API** with proper error handling

## Technology Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL 14+ with Sequelize ORM
- **Authentication**: JWT tokens (7-day expiry)
- **File Upload**: Multer (unlimited size/type)
- **Security**: Helmet, CORS, Rate limiting
- **Documentation**: This README + Postman collection

## Quick Start Guide

### Prerequisites
```bash
# Install Node.js 18+ and PostgreSQL 14+
node --version  # Should be 18+
psql --version  # Should be 14+
```

### 1. Database Setup
```bash
# Create database
createdb printeasy_dev

# Or using psql
psql -U postgres
CREATE DATABASE printeasy_dev;
\q
```

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Update .env with your database credentials
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=printeasy_dev
# DB_USER=postgres
# DB_PASSWORD=your_password
```

### 3. Start the Server
```bash
# Development mode (auto-restart)
npm run dev

# Or production mode
npm start
```

Server starts at: `http://localhost:3001`

### 4. Seed Test Data
```bash
# Create sample users, shops, and orders
npm run db:seed
```

### 5. Test the API
- Import `postman-collection.json` into Postman
- Or test health endpoint: `GET http://localhost:3001/health`

## Database Schema (Sequelize)

### Philosophy
- **Only ID fields are required** (auto-generated)
- **All other fields are optional** except foreign keys
- **Simple relationships** with proper associations
- **No complex validations** - keep it flexible

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  phone VARCHAR(20) UNIQUE,           -- Optional for customers
  email VARCHAR(255) UNIQUE,          -- Optional for shop owners
  name VARCHAR(255),                  -- Optional, auto-generated if missing
  password VARCHAR(255),              -- Optional, only for shop owners/admin
  role ENUM('customer', 'shop_owner', 'admin') DEFAULT 'customer',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Shops Table
```sql
CREATE TABLE shops (
  id SERIAL PRIMARY KEY,
  owner_id INTEGER REFERENCES users(id),
  name VARCHAR(255),                  -- Optional
  address TEXT,                       -- Optional  
  phone VARCHAR(20),                  -- Optional
  email VARCHAR(255),                 -- Optional
  is_active BOOLEAN DEFAULT true,
  rating DECIMAL(3,2) DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Orders Table
```sql
CREATE TABLE orders (
  id VARCHAR(20) PRIMARY KEY,         -- Custom format: UF000001, WI000001
  shop_id INTEGER REFERENCES shops(id),
  customer_id INTEGER REFERENCES users(id),
  customer_name VARCHAR(255),         -- Optional, copied from user
  customer_phone VARCHAR(20),         -- Optional, copied from user
  order_type ENUM('uploaded-files', 'walk-in'),
  description TEXT,                   -- Optional
  status ENUM('received', 'started', 'completed') DEFAULT 'received',
  is_urgent BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Files Table
```sql
CREATE TABLE order_files (
  id SERIAL PRIMARY KEY,
  order_id VARCHAR(20) REFERENCES orders(id),
  filename VARCHAR(255),              -- Optional
  original_name VARCHAR(255),         -- Optional
  file_path TEXT,                     -- Optional
  file_size BIGINT,                   -- Optional
  mime_type VARCHAR(100),             -- Optional
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Messages Table
```sql
CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  order_id VARCHAR(20) REFERENCES orders(id),
  sender_id INTEGER REFERENCES users(id),
  message TEXT,                       -- Optional
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Sequelize Models
All models are in `backend/models/` directory:
- `User.js` - User management with roles
- `Shop.js` - Shop information and ratings
- `Order.js` - Order tracking with custom IDs
- `File.js` - File attachments for orders
- `Message.js` - Chat messages between users

### Sequelize Associations
```javascript
// User associations
User.hasMany(Order, { foreignKey: 'customer_id', as: 'orders' });
User.hasMany(Shop, { foreignKey: 'owner_id', as: 'ownedShops' });
User.hasMany(Message, { foreignKey: 'sender_id', as: 'sentMessages' });

// Shop associations  
Shop.belongsTo(User, { foreignKey: 'owner_id', as: 'owner' });
Shop.hasMany(Order, { foreignKey: 'shop_id', as: 'orders' });

// Order associations
Order.belongsTo(User, { foreignKey: 'customer_id', as: 'customer' });
Order.belongsTo(Shop, { foreignKey: 'shop_id', as: 'shop' });
Order.hasMany(File, { foreignKey: 'order_id', as: 'files' });
Order.hasMany(Message, { foreignKey: 'order_id', as: 'messages' });

// File associations
File.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });

// Message associations
Message.belongsTo(User, { foreignKey: 'sender_id', as: 'sender' });
Message.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });
```

## API Endpoints

### Base URL
```
http://localhost:3001/api
```

### Authentication Endpoints

#### Customer Phone Login (Auto-registration)
```http
POST /auth/phone-login
Content-Type: application/json

{
  "phone": "9876543210"
}

Response:
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "phone": "9876543210",
    "name": "Customer 3210",
    "role": "customer"
  }
}
```

#### Shop Owner Email Login
```http
POST /auth/email-login
Content-Type: application/json

{
  "email": "shop@example.com",
  "password": "password"
}

Response:
{
  "success": true,
  "message": "Login successful", 
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 2,
    "email": "shop@example.com",
    "name": "Shop Owner",
    "role": "shop_owner",
    "shop_id": 1
  }
}
```

#### Get Current User
```http
GET /auth/me
Authorization: Bearer <token>

Response:
{
  "success": true,
  "user": {
    "id": 1,
    "phone": "9876543210",
    "name": "John Doe",
    "role": "customer"
  }
}
```

### Shop Endpoints

#### Get All Shops
```http
GET /shops

Response:
{
  "success": true,
  "shops": [
    {
      "id": 1,
      "name": "Quick Print Shop",
      "address": "123 Main Street",
      "phone": "9876543210",
      "rating": 4.5,
      "owner": {
        "name": "Shop Owner",
        "phone": "9876543210"
      }
    }
  ]
}
```

### Order Endpoints

#### Create Order with Files
```http
POST /orders
Authorization: Bearer <token>
Content-Type: multipart/form-data

shopId: 1
orderType: uploaded-files
description: Print my documents
customerName: John Doe
customerPhone: 9876543210
files: [file1.pdf, file2.jpg, ...]

Response:
{
  "success": true,
  "message": "Order created successfully",
  "order": {
    "id": "UF000001",
    "shop_id": 1,
    "customer_id": 1,
    "order_type": "uploaded-files",
    "description": "Print my documents",
    "status": "received"
  },
  "files": [
    {
      "id": 1,
      "filename": "file1.pdf",
      "original_name": "document.pdf",
      "file_size": 2048576
    }
  ]
}
```

#### Get Customer Orders
```http
GET /orders/customer
Authorization: Bearer <token>

Response:
{
  "success": true,
  "orders": [
    {
      "id": "UF000001",
      "shop": {
        "name": "Quick Print Shop",
        "phone": "9876543210"
      },
      "description": "Print my documents",
      "status": "received",
      "is_urgent": false,
      "created_at": "2024-01-01T10:00:00Z"
    }
  ]
}
```

#### Update Order Status (Shop Owner)
```http
PATCH /orders/UF000001/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "started"
}

Response:
{
  "success": true,
  "message": "Order status updated successfully"
}
```

### File Endpoints

#### Upload Additional Files
```http
POST /files/upload/UF000001
Authorization: Bearer <token>
Content-Type: multipart/form-data

files: [file3.pdf, file4.jpg]

Response:
{
  "success": true,
  "message": "Files uploaded successfully",
  "files": [
    {
      "id": 3,
      "filename": "file3.pdf",
      "file_size": 1024000
    }
  ]
}
```

#### Download File
```http
GET /files/download/1
Authorization: Bearer <token>

Response: File download (binary data)
```

### Chat Endpoints

#### Send Message
```http
POST /chat/send
Authorization: Bearer <token>
Content-Type: application/json

{
  "orderId": "UF000001",
  "message": "When will my order be ready?",
  "recipientId": 2
}

Response:
{
  "success": true,
  "message": {
    "id": 1,
    "order_id": "UF000001",
    "sender_id": 1,
    "message": "When will my order be ready?",
    "created_at": "2024-01-01T10:30:00Z"
  }
}
```

## Authentication System

### Phone-Based Authentication (Customers)
- **No password required** - just phone number
- **Auto-registration** - new customers created automatically  
- **JWT tokens** - 7-day expiry
- **Simple flow**: Enter phone → Get token → Access dashboard

### Email Authentication (Shop Owners/Admin)
- **Email + password** required
- **Bcrypt hashing** for password security
- **Role-based access** - shop_owner or admin
- **JWT tokens** - 7-day expiry

### JWT Token Structure
```javascript
{
  "userId": 1,
  "phone": "9876543210", // or email for shop owners
  "role": "customer",
  "iat": 1640995200,
  "exp": 1641600000
}
```

### Authentication Middleware
```javascript
// Verify JWT token
const authenticateToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findByPk(decoded.userId);
  next();
};
```

## File Upload System

### Key Features
- **No size limits** - unlimited file size
- **No type restrictions** - any file type allowed
- **No count limits** - unlimited files per order
- **Auto-organization** - files stored in `uploads/orders/`

### Upload Configuration
```javascript
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads/orders');
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ 
  storage: storage
  // No limits - accept everything
});
```

### File Storage Structure
```
backend/
├── uploads/
│   └── orders/
│       ├── 1640995200000-123456789-document.pdf
│       ├── 1640995201000-987654321-image.jpg
│       └── 1640995202000-456789123-spreadsheet.xlsx
```

### File Metadata
Each uploaded file gets stored with:
- **Unique filename** - timestamp + random + original name
- **Original name** - user's original filename
- **File size** - in bytes
- **MIME type** - detected automatically
- **File path** - relative to uploads directory

## Chat System

### Real-time Messaging
- **Order-based chat** - messages tied to specific orders
- **Role-based access** - customers and shop owners only
- **Read status tracking** - mark messages as read
- **Message history** - persistent storage

### Message Flow
1. **Customer** creates order
2. **Shop owner** receives order notification
3. **Both parties** can chat about the order
4. **Messages** stored in database with timestamps
5. **Unread count** tracked per user

### Chat API Usage
```javascript
// Send message
POST /chat/send
{
  "orderId": "UF000001",
  "message": "When will my order be ready?",
  "recipientId": 2
}

// Get order messages
GET /chat/order/UF000001

// Get unread count
GET /chat/unread-count
```

## Testing

### Test Credentials

After running `npm run db:seed`, you can use these accounts:

#### Customer Account
- **Phone**: `9876543210`
- **Login**: Use phone login endpoint
- **Auto-created**: Name will be "Customer 3210"

#### Shop Owner Account
- **Email**: `shop@example.com`
- **Password**: `password`
- **Shop**: "Quick Print Shop"

#### Admin Account
- **Email**: `admin@example.com`
- **Password**: `password`
- **Access**: Full system access

### Testing with Postman

1. **Import Collection**: Load `postman-collection.json`
2. **Set Variables**: 
   - `baseUrl`: `http://localhost:3001/api`
   - `authToken`: (will be set after login)
3. **Test Login**: Try customer phone login
4. **Copy Token**: Use in subsequent requests
5. **Test Endpoints**: Try creating orders, uploading files

### Manual Testing Steps

```bash
# 1. Test health endpoint
curl http://localhost:3001/health

# 2. Test customer login
curl -X POST http://localhost:3001/api/auth/phone-login \
  -H "Content-Type: application/json" \
  -d '{"phone":"9876543210"}'

# 3. Test shop login  
curl -X POST http://localhost:3001/api/auth/email-login \
  -H "Content-Type: application/json" \
  -d '{"email":"shop@example.com","password":"password"}'

# 4. Test file upload (replace <token>)
curl -X POST http://localhost:3001/api/orders \
  -H "Authorization: Bearer <token>" \
  -F "shopId=1" \
  -F "orderType=uploaded-files" \
  -F "description=Test order" \
  -F "files=@test-file.pdf"
```

## Deployment

### Environment Variables

Create `.env` file:
```env
# Server Configuration
NODE_ENV=production
PORT=3001
JWT_SECRET=your-super-secure-jwt-secret-minimum-32-characters

# Database Configuration  
DB_HOST=your-db-host
DB_PORT=5432
DB_NAME=printeasy_production
DB_USER=your-db-user
DB_PASSWORD=your-db-password

# CORS Configuration
FRONTEND_URL=https://yourdomain.com

# File Upload Configuration
UPLOAD_DIR=uploads
```

### Production Deployment

#### Using PM2 (Recommended)
```bash
# Install PM2 globally
npm install -g pm2

# Start application
pm2 start app.js --name "printeasy-api"

# Monitor
pm2 monit

# Auto-restart on system reboot
pm2 startup
pm2 save
```

#### Using Docker
```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
EXPOSE 3001

CMD ["node", "app.js"]
```

#### Using Docker Compose
```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - DB_HOST=postgres
    depends_on:
      - postgres
    volumes:
      - ./uploads:/app/uploads

  postgres:
    image: postgres:14
    environment:
      POSTGRES_DB: printeasy_production
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### Database Migration
```bash
# Production database setup
createdb printeasy_production

# Run migrations (Sequelize will auto-create tables)
npm start

# Seed production data (optional)
npm run db:seed
```

### Nginx Configuration
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Static file serving
    location /uploads/ {
        alias /path/to/your/backend/uploads/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## Troubleshooting

### Common Issues

#### Database Connection Failed
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Check connection
psql -U postgres -h localhost -d printeasy_dev

# Verify credentials in .env file
cat .env | grep DB_
```

#### Port Already in Use
```bash
# Find process using port 3001
lsof -i :3001

# Kill process
kill -9 <PID>

# Or change port in .env
PORT=3002
```

#### CORS Errors
```javascript
// Check CORS configuration in app.js
app.use(cors({
  origin: true, // Allow all origins in development
  credentials: true
}));
```

#### File Upload Issues
```bash
# Check uploads directory permissions
ls -la uploads/
chmod 755 uploads/
chmod 755 uploads/orders/

# Check disk space
df -h
```

#### JWT Token Issues
```bash
# Check JWT secret length (minimum 32 characters)
echo $JWT_SECRET | wc -c

# Verify token in JWT debugger: https://jwt.io
```

### Debug Mode

Enable detailed logging:
```javascript
// Add to app.js
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`, req.body);
    next();
  });
}
```

### Database Debug

Enable Sequelize logging:
```javascript
// In config/database.js
module.exports = {
  development: {
    // ... other config
    logging: console.log, // Enable SQL logging
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
};
```

### Performance Monitoring

Add basic monitoring:
```javascript
// Health endpoint with detailed info
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    nodeVersion: process.version,
    environment: process.env.NODE_ENV
  });
});
```

### Log Files

Structured logging with Winston:
```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: 'printeasy-api' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});
```

---

## Quick Reference

### NPM Scripts
```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm run db:seed    # Seed test data
npm test           # Run tests (if available)
```

### API Quick Test
```bash
# Health check
curl http://localhost:3001/health

# Customer login
curl -X POST http://localhost:3001/api/auth/phone-login \
  -H "Content-Type: application/json" \
  -d '{"phone":"9876543210"}'
```

### Project Structure
```
backend/
├── app.js                  # Main application file
├── config/
│   └── database.js         # Sequelize configuration
├── models/
│   ├── index.js           # Model associations
│   ├── User.js            # User model
│   ├── Shop.js            # Shop model
│   ├── Order.js           # Order model
│   ├── File.js            # File model
│   └── Message.js         # Message model
├── routes/
│   ├── auth.js            # Authentication routes
│   ├── orders.js          # Order management routes
│   ├── shops.js           # Shop routes
│   ├── files.js           # File upload routes
│   └── chat.js            # Chat routes
├── middleware/
│   ├── auth.js            # Authentication middleware
│   └── upload.js          # File upload middleware
├── seeders/
│   └── 20240101000001-demo-data.js  # Test data
├── uploads/               # File storage directory
├── .env                   # Environment variables
├── package.json           # Dependencies
├── postman-collection.json # API testing collection
└── README.md              # This documentation
```

This documentation covers everything you need to understand, deploy, and maintain the PrintEasy backend. For additional help, check the Postman collection or examine the source code directly.

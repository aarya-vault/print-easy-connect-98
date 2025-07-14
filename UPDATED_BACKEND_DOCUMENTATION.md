
# PrintEasy Backend Documentation

## Overview
PrintEasy is a simplified order management platform connecting customers with print shops. This backend documentation covers the streamlined system without revenue/pricing complexities.

## Technology Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT + bcrypt
- **File Upload**: Multer
- **Real-time**: Socket.io
- **Security**: Helmet, CORS, Rate Limiting

## Core Dependencies

### Production Dependencies
```json
{
  "express": "^4.18.2",           // Web framework
  "cors": "^2.8.5",               // Cross-origin requests
  "helmet": "^7.0.0",             // Security headers
  "pg": "^8.11.3",                // PostgreSQL client
  "bcrypt": "^5.1.0",             // Password hashing
  "jsonwebtoken": "^9.0.2",       // JWT authentication
  "multer": "^1.4.5",             // File upload handling
  "socket.io": "^4.7.2",          // Real-time communication
  "express-rate-limit": "^6.8.1", // Rate limiting
  "express-validator": "^7.0.1",  // Input validation
  "winston": "^3.10.0",           // Logging
  "compression": "^1.7.4",        // Response compression
  "morgan": "^1.10.0"             // HTTP request logging
}
```

## Database Schema (Simplified)

### Core Tables

#### 1. Users Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(15) UNIQUE,
    role user_role NOT NULL DEFAULT 'customer',
    status user_status NOT NULL DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TYPE user_role AS ENUM ('customer', 'shop_owner', 'admin');
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'suspended');
```

#### 2. Shops Table (Simplified)
```sql
CREATE TABLE shops (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    owner_id INTEGER REFERENCES users(id),
    email VARCHAR(255),
    phone VARCHAR(15),
    address TEXT,
    status shop_status DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TYPE shop_status AS ENUM ('pending', 'approved', 'rejected', 'suspended');
```

#### 3. Orders Table (No Pricing)
```sql
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES users(id),
    shop_id INTEGER REFERENCES shops(id),
    order_type order_type NOT NULL,
    status order_status DEFAULT 'new',
    description TEXT,
    is_urgent BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TYPE order_type AS ENUM ('uploaded-files', 'walk-in');
CREATE TYPE order_status AS ENUM ('new', 'processing', 'ready', 'completed', 'cancelled');
```

#### 4. Order Files Table
```sql
CREATE TABLE order_files (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    filename VARCHAR(255),
    original_name VARCHAR(255),
    file_path TEXT,
    file_size INTEGER,
    mime_type VARCHAR(100),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## API Endpoints

### Authentication Routes

#### POST /api/auth/phone-login
Customer phone-based authentication
```javascript
// Request
{
  "phone": "9876543210"
}

// Response
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "phone": "9876543210",
    "name": "Customer Name",
    "role": "customer"
  }
}
```

#### POST /api/auth/email-login
Shop owner/admin email authentication
```javascript
// Request
{
  "email": "shop@example.com",
  "password": "password123"
}

// Response
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": 2,
    "email": "shop@example.com",
    "name": "Shop Owner",
    "role": "shop_owner"
  }
}
```

### Customer Routes

#### GET /api/customer/dashboard
Get customer dashboard data
```javascript
// Response
{
  "stats": {
    "totalOrders": 15,
    "activeOrders": 3,
    "completedOrders": 12
  },
  "recentOrders": [...],
  "nearbyShops": [...]
}
```

#### GET /api/customer/shops
Get nearby shops
```javascript
// Query Parameters: ?search=quick&location=bangalore

// Response
{
  "shops": [
    {
      "id": 1,
      "name": "Quick Print Solutions",
      "address": "MG Road, Bangalore",
      "phone": "9876543210",
      "distance": "0.5 km",
      "estimatedTime": "15-20 mins",
      "isOpen": true
    }
  ]
}
```

#### POST /api/customer/orders
Create new order
```javascript
// Request (File Upload)
{
  "shopId": 1,
  "orderType": "uploaded-files",
  "description": "Print 5 copies with binding",
  "isUrgent": false,
  "files": [/* multipart files */]
}

// Request (Walk-in)
{
  "shopId": 1,
  "orderType": "walk-in",
  "description": "Lamination service",
  "isUrgent": true
}

// Response
{
  "success": true,
  "orderId": "ORD001",
  "message": "Order placed successfully"
}
```

### Shop Owner Routes

#### GET /api/shop/dashboard
Get shop dashboard with orders by status
```javascript
// Response
{
  "stats": {
    "newOrders": 5,
    "processingOrders": 3,
    "readyOrders": 2,
    "completedOrders": 15
  },
  "orders": {
    "new": [...],
    "processing": [...],
    "ready": [...],
    "completed": [...]
  }
}
```

#### PUT /api/shop/orders/:id/status
Update order status
```javascript
// Request
{
  "status": "processing"
}

// Response
{
  "success": true,
  "message": "Order status updated"
}
```

#### PUT /api/shop/orders/:id/urgency
Toggle order urgency
```javascript
// Request
{
  "isUrgent": true
}

// Response
{
  "success": true,
  "message": "Order urgency updated"
}
```

### Admin Routes

#### GET /api/admin/dashboard
Get admin dashboard overview
```javascript
// Response
{
  "stats": {
    "totalUsers": 245,
    "totalShops": 18,
    "totalOrders": 1024,
    "pendingShops": 3
  },
  "recentUsers": [...],
  "pendingShops": [...]
}
```

#### GET /api/admin/users
Get all users with filtering
```javascript
// Query: ?role=customer&status=active&search=john

// Response
{
  "users": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "9876543210",
      "role": "customer",
      "status": "active",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 245
  }
}
```

#### PUT /api/admin/shops/:id/approve
Approve shop application
```javascript
// Response
{
  "success": true,
  "message": "Shop approved successfully"
}
```

#### PUT /api/admin/shops/:id/reject
Reject shop application
```javascript
// Request
{
  "reason": "Incomplete documentation"
}

// Response
{
  "success": true,
  "message": "Shop application rejected"
}
```

### File Upload Routes

#### POST /api/files/upload
Upload files for orders
```javascript
// Multipart form data
// files: [File objects]
// orderId: string

// Response
{
  "success": true,
  "files": [
    {
      "id": 1,
      "filename": "resume_001.pdf",
      "originalName": "resume.pdf",
      "fileSize": 245760,
      "url": "/uploads/resume_001.pdf"
    }
  ]
}
```

## Real-time Communication (Socket.io)

### Events

#### Customer Events
- `order_status_updated`: Order status changed
- `order_ready`: Order is ready for pickup
- `shop_message`: Message from shop owner

#### Shop Events
- `new_order`: New order received
- `order_cancelled`: Customer cancelled order

#### Connection Example
```javascript
// Client-side connection
const socket = io('http://localhost:3000');

// Join user room
socket.emit('join_room', { userId: 123, role: 'customer' });

// Listen for order updates
socket.on('order_status_updated', (data) => {
  console.log('Order status updated:', data);
});
```

## Authentication & Security

### JWT Token Structure
```javascript
{
  "userId": 123,
  "role": "customer",
  "iat": 1640995200,
  "exp": 1641081600
}
```

### Security Middleware
- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Input Validation**: Express-validator for request validation
- **File Upload Security**: Multer with file type restrictions

### Protected Routes
All API routes except authentication require JWT token in Authorization header:
```
Authorization: Bearer <jwt_token>
```

## Error Handling

### Standard Error Response
```javascript
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid phone number format",
    "details": {
      "field": "phone",
      "value": "invalid_phone"
    }
  }
}
```

### Error Codes
- `VALIDATION_ERROR`: Input validation failed
- `UNAUTHORIZED`: Authentication required
- `FORBIDDEN`: Insufficient permissions
- `NOT_FOUND`: Resource not found
- `INTERNAL_ERROR`: Server error

## Environment Variables

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/printeasy
DB_HOST=localhost
DB_PORT=5432
DB_NAME=printeasy
DB_USER=printeasy_user
DB_PASSWORD=secure_password

# Authentication
JWT_SECRET=your_super_secure_jwt_secret_key_here
JWT_EXPIRES_IN=24h

# Server
PORT=3000
NODE_ENV=production

# File Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760  # 10MB

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100

# CORS
ALLOWED_ORIGINS=http://localhost:5173,https://yourdomain.com
```

## Deployment Configuration

### Production Server Setup
```javascript
// Enhanced security for production
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// Compression for performance
app.use(compression());

// Production logging
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

### Health Check Endpoint
```javascript
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  });
});
```

## API Testing

### Example Test Cases
```javascript
// Customer phone login
curl -X POST http://localhost:3000/api/auth/phone-login \
  -H "Content-Type: application/json" \
  -d '{"phone": "9876543210"}'

// Create order
curl -X POST http://localhost:3000/api/customer/orders \
  -H "Authorization: Bearer your_jwt_token" \
  -H "Content-Type: application/json" \
  -d '{
    "shopId": 1,
    "orderType": "walk-in",
    "description": "Print documents",
    "isUrgent": false
  }'

// Update order status (shop owner)
curl -X PUT http://localhost:3000/api/shop/orders/1/status \
  -H "Authorization: Bearer shop_jwt_token" \
  -H "Content-Type: application/json" \
  -d '{"status": "processing"}'
```

This simplified backend removes all pricing/revenue complexity while maintaining core order management functionality. The system focuses on connecting customers with print shops and managing order workflows efficiently.


# PrintEasy Enhanced Backend Documentation

## Overview

PrintEasy backend is built with Node.js, Express.js, PostgreSQL, and Socket.IO to provide a complete real-time printing service management system.

## Architecture

### Core Technologies
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL 14+
- **Real-time**: Socket.IO
- **File Upload**: Multer
- **Authentication**: JWT
- **Security**: Helmet, CORS, Rate Limiting

### Project Structure
```
backend/
├── app.js                 # Main application file
├── config/
│   └── database.js        # Database configuration
├── middleware/
│   ├── auth.js           # Authentication middleware
│   └── upload.js         # File upload middleware
├── routes/
│   ├── auth.js           # Authentication routes
│   ├── orders.js         # Order management routes
│   ├── shops.js          # Shop management routes
│   ├── files.js          # File upload/download routes
│   └── chat.js           # Chat messaging routes
├── services/
│   └── socketService.js  # WebSocket service
├── database/
│   └── complete-schema.sql # Database schema
└── uploads/              # File storage directory
```

## API Endpoints

### Authentication (`/api/auth`)

#### POST `/api/auth/phone-login`
Customer login via phone number.
```json
{
  "phone": "9876543210"
}
```

#### POST `/api/auth/email-login`
Shop owner/admin login via email and password.
```json
{
  "email": "shop@example.com",
  "password": "password123"
}
```

#### PATCH `/api/auth/update-profile`
Update user profile (requires authentication).
```json
{
  "name": "Updated Name"
}
```

#### GET `/api/auth/profile`
Get current user profile (requires authentication).

### Orders (`/api/orders`)

#### GET `/api/orders/shop`
Get all orders for shop owner (requires shop_owner role).

#### GET `/api/orders/customer`
Get all orders for customer (requires customer role).

#### POST `/api/orders`
Create new order (requires customer role).
```json
{
  "shopId": 1,
  "orderType": "uploaded-files",
  "description": "Business cards printing",
  "instructions": "Premium paper, color printing",
  "services": ["Color Printing", "Premium Paper"],
  "pages": 10,
  "copies": 100,
  "paperType": "Premium",
  "binding": "None",
  "color": true
}
```

#### PATCH `/api/orders/:orderId/status`
Update order status (requires authentication).
```json
{
  "status": "processing"
}
```

#### PATCH `/api/orders/:orderId/urgency`
Toggle order urgency (requires shop_owner role).

### Shops (`/api/shops`)

#### GET `/api/shops`
Get all active shops (public endpoint).

#### GET `/api/shops/:identifier`
Get shop by ID or slug (public endpoint).

#### PUT `/api/shops/:shopId`
Update shop details (requires shop_owner role).
```json
{
  "name": "Updated Shop Name",
  "address": "New Address",
  "phone": "+91 98765 43210",
  "opening_time": "09:00:00",
  "closing_time": "18:00:00"
}
```

### Files (`/api/files`)

#### POST `/api/files/upload/:orderId`
Upload files for an order (requires authentication).
- Supports: PDF, Images (JPEG, PNG), Word documents
- Maximum: 5 files, 10MB each
- Content-Type: multipart/form-data

#### GET `/api/files/order/:orderId`
Get files for an order (requires authentication).

#### GET `/api/files/download/:fileId`
Download/view a file (requires authentication).

#### DELETE `/api/files/:fileId`
Delete a file (requires customer role).

### Chat (`/api/chat`)

#### GET `/api/chat/order/:orderId`
Get chat messages for an order (requires authentication).

#### POST `/api/chat/send`
Send a message (requires authentication).
```json
{
  "orderId": "UF001",
  "message": "Hello, when will my order be ready?",
  "recipientId": 2
}
```

#### GET `/api/chat/unread-count`
Get unread message count (requires authentication).

## WebSocket Events

### Connection
Clients connect with JWT token in auth object:
```javascript
const socket = io('http://localhost:3001', {
  auth: { token: 'jwt_token_here' }
});
```

### Client Events

#### `send_message`
Send a chat message.
```javascript
socket.emit('send_message', {
  orderId: 'UF001',
  message: 'Hello!',
  recipientId: 2
});
```

#### `typing_start`
Indicate user started typing.
```javascript
socket.emit('typing_start', {
  orderId: 'UF001',
  recipientId: 2
});
```

#### `typing_stop`
Indicate user stopped typing.
```javascript
socket.emit('typing_stop', {
  orderId: 'UF001',
  recipientId: 2
});
```

### Server Events

#### `new_message`
Receive a new message.
```javascript
socket.on('new_message', (data) => {
  console.log('New message:', data);
});
```

#### `order_updated`
Receive order status update.
```javascript
socket.on('order_updated', (order) => {
  console.log('Order updated:', order);
});
```

#### `new_order`
Receive new order notification (shop owners only).
```javascript
socket.on('new_order', (order) => {
  console.log('New order:', order);
});
```

#### `notification`
Receive general notifications.
```javascript
socket.on('notification', (notification) => {
  console.log('Notification:', notification);
});
```

## Database Schema

### Key Tables

#### `users`
Stores all users (customers, shop owners, admins).
- Supports both phone and email authentication
- Role-based access control
- Email/phone verification flags

#### `shops`
Stores shop information.
- Linked to shop owner via `owner_id`
- Includes operating hours, rating, location
- Offline module toggle for walk-in orders

#### `orders`
Stores all orders with auto-generated IDs.
- Separate sequences for upload (UF) and walk-in (WI) orders
- Status tracking with history
- File attachments support
- Service specifications (pages, copies, binding, etc.)

#### `order_files`
Stores uploaded file metadata.
- Links to order and uploader
- File type validation
- Secure file path storage

#### `chat_messages`
Stores chat messages between customers and shops.
- Order-specific conversations
- Read status tracking
- Real-time delivery support

### Performance Optimizations
- Strategic indexes on frequently queried columns
- Connection pooling for database connections
- Prepared statements for security
- Query optimization for large datasets

## Security Features

### Authentication & Authorization
- JWT-based authentication with expiration
- Role-based access control (RBAC)
- Token validation on every request
- Automatic token refresh mechanism

### File Security
- File type validation (whitelist approach)
- File size limits (10MB per file, 5 files max)
- Secure file storage outside web root
- Permission-based file access

### API Security
- Rate limiting (100 requests/15 minutes)
- Stricter limits for file uploads (20/15 minutes)
- CORS configuration
- Helmet.js security headers
- Input validation and sanitization

### Database Security
- Parameterized queries (SQL injection prevention)
- Connection pooling with limits
- Encrypted password storage (bcrypt)
- User session tracking

## Performance Features

### File Handling
- Streaming file downloads for large files
- Efficient file storage organization
- Automatic file cleanup for deleted orders
- Progress tracking for uploads

### Real-time Features
- WebSocket connection management
- Room-based message routing
- Connection state tracking
- Automatic reconnection handling

### Database Optimization
- Indexed queries for common operations
- Connection pooling (max 20 connections)
- Query timeout configuration
- Prepared statement caching

## Deployment Configuration

### Environment Variables
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=printeasy_shop
DB_USER=postgres
DB_PASSWORD=your_password

# Application
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com

# Security
JWT_SECRET=your_super_secret_jwt_key
```

### Production Setup
1. **Database**: PostgreSQL 14+ with proper indexing
2. **File Storage**: Dedicated volume for uploads
3. **Process Management**: PM2 or similar
4. **Reverse Proxy**: Nginx for static files and SSL
5. **Monitoring**: Application and database monitoring
6. **Backups**: Automated database and file backups

### Scaling Considerations
- Horizontal scaling with load balancers
- Redis for session storage and caching
- CDN for file delivery
- Database read replicas for heavy queries
- WebSocket clustering for multiple instances

## Error Handling

### Global Error Handler
- Catches all unhandled errors
- Appropriate error codes and messages
- Development vs production error details
- Error logging for debugging

### File Upload Errors
- File size limit handling
- Invalid file type rejection
- Storage space management
- Upload progress error recovery

### WebSocket Error Handling
- Connection failure recovery
- Message delivery confirmation
- Automatic reconnection logic
- Graceful degradation for offline scenarios

## Monitoring & Logging

### Application Logging
- Request/response logging with Morgan
- Error logging with timestamps
- Performance metrics tracking
- User action audit trails

### Health Checks
- `/health` endpoint with system status
- Database connectivity checks
- File system availability
- Memory and CPU usage reporting

### Performance Monitoring
- API response time tracking
- Database query performance
- File upload/download metrics
- WebSocket connection statistics

This documentation provides a comprehensive guide to the PrintEasy backend system, covering all aspects from basic setup to advanced deployment considerations.

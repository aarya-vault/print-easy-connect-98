
# PrintEasy Backend Requirements - Production Ready

## Overview
Complete backend architecture for PrintEasy - a print service platform that connects customers with print shops through upload orders and walk-in management.

## Technology Stack
- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Database**: PostgreSQL (v14+)
- **Authentication**: JWT
- **File Upload**: Multer
- **Security**: Helmet, CORS, Rate Limiting
- **Logging**: Winston
- **Validation**: Express Validator

## Database Schema

### 1. Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  phone VARCHAR(20) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE,
  password_hash VARCHAR(255),
  role VARCHAR(50) DEFAULT 'customer', -- 'customer', 'shop_owner', 'admin'
  shop_id INTEGER REFERENCES shops(id),
  is_active BOOLEAN DEFAULT true,
  needs_name_update BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. Shops Table
```sql
CREATE TABLE shops (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  address TEXT NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  owner_name VARCHAR(255) NOT NULL,
  owner_id INTEGER REFERENCES users(id),
  rating DECIMAL(3,2) DEFAULT 0.00,
  total_orders INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  allows_offline_orders BOOLEAN DEFAULT true,
  opening_time TIME DEFAULT '09:00:00',
  closing_time TIME DEFAULT '18:00:00',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. Orders Table (Simplified Status)
```sql
CREATE TABLE orders (
  id VARCHAR(50) PRIMARY KEY, -- UF001, WI001 format
  customer_id INTEGER REFERENCES users(id),
  shop_id INTEGER REFERENCES shops(id),
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  order_type VARCHAR(50) NOT NULL, -- 'uploaded-files', 'walk-in'
  status VARCHAR(50) DEFAULT 'received', -- 'received', 'started', 'completed'
  description TEXT,
  is_urgent BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4. Order Files Table
```sql
CREATE TABLE order_files (
  id SERIAL PRIMARY KEY,
  order_id VARCHAR(50) REFERENCES orders(id) ON DELETE CASCADE,
  filename VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 5. Order Status History
```sql
CREATE TABLE order_status_history (
  id SERIAL PRIMARY KEY,
  order_id VARCHAR(50) REFERENCES orders(id) ON DELETE CASCADE,
  old_status VARCHAR(50),
  new_status VARCHAR(50) NOT NULL,
  changed_by INTEGER REFERENCES users(id),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Phone number login (creates user if not exists)
- `POST /api/auth/login-email` - Email/password login for business users
- `PATCH /api/users/name` - Update user name (first time setup)

### Shops
- `GET /api/shops` - Get all active shops
- `GET /api/shops/:shopId` - Get shop details
- `POST /api/shops` - Create new shop (admin only)
- `PATCH /api/shops/:shopId` - Update shop (admin/owner)
- `DELETE /api/shops/:shopId` - Deactivate shop (admin only)

### Orders
- `POST /api/orders` - Create new order with file upload
- `GET /api/orders/customer/:customerId` - Get customer orders
- `GET /api/orders/shop/:shopId` - Get shop orders with filters
- `PATCH /api/orders/:orderId/status` - Update order status
- `GET /api/orders/:orderId` - Get order details
- `PATCH /api/orders/:orderId/urgent` - Toggle urgent status

### Admin
- `GET /api/admin/users` - Get all users with pagination
- `PATCH /api/admin/users/:userId` - Update user details
- `DELETE /api/admin/users/:userId` - Deactivate user
- `GET /api/admin/shops` - Get all shops for admin
- `GET /api/admin/stats` - Dashboard statistics

### File Management
- `GET /uploads/:filename` - Serve uploaded files
- `POST /api/files/upload` - Direct file upload endpoint
- `DELETE /api/files/:fileId` - Delete file

## Security Requirements

### Authentication & Authorization
- JWT tokens with 24-hour expiry
- Role-based access control (customer, shop_owner, admin)
- Protected routes with middleware
- Phone number verification for new users

### Rate Limiting
- General API: 100 requests per 15 minutes
- Auth endpoints: 5 attempts per 15 minutes
- File upload: 10 uploads per hour per user

### Input Validation
- Express Validator for all inputs
- File type validation (PDF, DOC, DOCX, JPG, PNG)
- File size limits (10MB per file)
- Phone number format validation
- Email format validation

### Security Headers
- Helmet.js for security headers
- CORS configuration
- Content Security Policy
- XSS protection

## File Upload Configuration

### Storage
- Local storage with organized directory structure
- Path format: `uploads/shop-{shopId}/order-{orderId}/filename`
- File naming: timestamp + random string + original extension

### Validation
- Maximum file size: 10MB per file
- Allowed formats: .pdf, .doc, .docx, .jpg, .jpeg, .png
- Virus scanning (future enhancement)

## Error Handling

### Error Response Format
```json
{
  "error": "Error message",
  "details": "Additional error details",
  "code": "ERROR_CODE",
  "timestamp": "2023-XX-XX"
}
```

### Logging
- Winston logger with file rotation
- Error logs: `logs/error.log`
- Combined logs: `logs/combined.log`
- Console output in development

## Performance Optimization

### Database
- Indexes on frequently queried columns
- Connection pooling (max 20 connections)
- Query optimization for order listings
- Pagination for large datasets

### Caching
- In-memory caching for shop listings
- File metadata caching
- User session caching

### Compression
- Gzip compression for API responses
- Image optimization for uploaded files

## Environment Configuration

### Required Environment Variables
```bash
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=printeasy_production
DB_USER=postgres
DB_PASSWORD=your_password

# Security
JWT_SECRET=your-super-secret-jwt-key
ENCRYPTION_KEY=your-encryption-key

# Server
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com

# File Upload
UPLOAD_DIR=uploads
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=pdf,doc,docx,jpg,jpeg,png

# Email (future)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

## Deployment Requirements

### Server Specifications
- **Minimum**: 2 CPU cores, 4GB RAM, 50GB storage
- **Recommended**: 4 CPU cores, 8GB RAM, 100GB SSD
- **Operating System**: Ubuntu 20.04 LTS or CentOS 8

### Database Setup
1. Install PostgreSQL 14+
2. Create database and user
3. Run migration scripts
4. Set up backup strategy

### Application Deployment
1. Install Node.js 18+
2. Install PM2 for process management
3. Configure nginx as reverse proxy
4. Set up SSL certificates
5. Configure log rotation

### Monitoring & Backup
- Application monitoring with PM2
- Database backup every 6 hours
- Log rotation and archival
- Health check endpoints
- Performance monitoring

## Testing Strategy

### Unit Tests
- User authentication
- Order creation and management
- File upload functionality
- Database operations

### Integration Tests
- API endpoint testing
- Database integration
- File system operations
- Authentication flows

### Load Testing
- Concurrent user handling
- File upload stress testing
- Database performance under load

## Future Enhancements

### Phase 2 Features
- Real-time notifications with WebSocket
- Chat system between customers and shops
- Payment integration
- SMS notifications
- Email notifications
- Mobile app API optimization

### Scalability Considerations
- Database sharding strategy
- CDN for file storage
- Redis for session management
- Microservices architecture migration
- Docker containerization

This backend architecture provides a solid foundation for the PrintEasy platform with room for growth and scalability.

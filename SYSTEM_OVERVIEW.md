
# PrintEasy System Overview

## Architecture Overview

PrintEasy is a full-stack web application that connects customers with local print shops through a digital platform.

### Technology Stack
- **Frontend**: React 18 + TypeScript + Vite
- **UI Library**: Tailwind CSS + Shadcn/UI components
- **State Management**: React Context + TanStack Query
- **Backend**: Node.js + Express.js
- **Database**: PostgreSQL with connection pooling
- **Real-time**: Socket.io for WebSocket connections
- **Authentication**: JWT-based with phone/email login
- **File Storage**: Local file system with organized structure

### System Components

#### 1. Frontend Application
- **Customer Portal**: Order placement, tracking, file uploads
- **Shop Dashboard**: Order management, customer communication
- **Admin Panel**: User management, shop onboarding, analytics
- **Real-time Chat**: WebSocket-based messaging system

#### 2. Backend API
- **Authentication Service**: Phone/email login, JWT tokens
- **Order Management**: CRUD operations, status updates
- **File Upload Service**: Multi-file upload with validation
- **Chat Service**: Real-time messaging between customers and shops
- **Shop Management**: Shop profiles, services, location data

#### 3. Database Schema
```sql
-- Core Tables
users (id, name, phone, email, role, shop_id, created_at)
shops (id, name, address, phone, services, owner_id, created_at)
orders (id, customer_id, shop_id, type, status, description, created_at)
order_files (id, order_id, filename, file_path, file_size, mime_type)
messages (id, order_id, sender_id, recipient_id, message, created_at)
notifications (id, user_id, order_id, title, message, type, is_read)
```

### Order Flow

#### Upload Orders
1. Customer selects shop
2. Uploads files (PDF, DOC, images)
3. Specifies print requirements (copies, paper type, binding)
4. Shop receives notification
5. Shop processes order and updates status
6. Customer gets real-time updates
7. Order completion and pickup

#### Walk-in Orders
1. Customer scans QR code or visits shop page
2. Pre-books appointment with service description
3. Visits shop with booking reference
4. Shop processes in-person service
5. Order marked complete

### User Roles & Permissions

#### Customer
- Place orders (upload files or walk-in booking)
- Track order status in real-time
- Chat with shop owners
- View order history
- Rate and review shops

#### Shop Owner
- Manage incoming orders
- Update order status (new → confirmed → processing → ready → completed)
- Chat with customers
- View shop analytics
- Manage shop profile and services

#### Admin
- Complete user management (CRUD operations)
- Shop onboarding and verification
- Platform analytics and reporting
- System configuration
- Content moderation

### Security Features
- JWT token authentication
- Rate limiting on API endpoints
- Input validation and sanitization
- Secure file upload with type checking
- HTTPS enforcement
- SQL injection prevention
- XSS protection

### Performance Optimizations
- Database connection pooling
- Query optimization with indexes
- Frontend code splitting
- Image optimization
- Gzip compression
- Redis caching (production ready)

### Monitoring & Logging
- Winston logging system
- Error tracking and reporting
- API performance monitoring
- Database query logging
- User activity tracking

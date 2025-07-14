
# PrintEasy Backend Architecture & Documentation

## Overview
PrintEasy is a comprehensive print shop management platform with three user roles: Customers, Shop Owners, and Admins. The backend provides REST APIs for authentication, order management, file handling, and real-time communications.

## Technology Stack

### Core Dependencies
```json
{
  "express": "^4.18.2",           // Web application framework
  "cors": "^2.8.5",              // Cross-Origin Resource Sharing
  "helmet": "^7.1.0",            // Security middleware
  "compression": "^1.7.4",        // Response compression
  "morgan": "^1.10.0",           // HTTP request logger
  "winston": "^3.11.0"           // Advanced logging
}
```

### Database & ORM
```json
{
  "pg": "^8.11.3",               // PostgreSQL client
  "express-validator": "^7.0.1"   // Input validation
}
```

### Authentication & Security
```json
{
  "jsonwebtoken": "^9.0.2",      // JWT token generation
  "bcrypt": "^5.1.1",            // Password hashing
  "express-rate-limit": "^7.1.5" // API rate limiting
}
```

### File Handling
```json
{
  "multer": "^1.4.5",            // File upload middleware
  "sharp": "^0.32.6"             // Image processing
}
```

### Real-time Communication
```json
{
  "socket.io": "^4.7.4"          // WebSocket communication
}
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone VARCHAR(10) UNIQUE,           -- Customer phone (10 digits)
    email VARCHAR(255) UNIQUE,          -- Shop owner/admin email
    password_hash VARCHAR(255),         -- Hashed password for email users
    name VARCHAR(255),                  -- User full name
    role user_role NOT NULL,            -- ENUM: customer, shop_owner, admin
    is_verified BOOLEAN DEFAULT false,   -- Phone/email verification status
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

**Field Details:**
- `phone`: Required for customers, exactly 10 digits, unique constraint
- `email`: Required for shop owners/admins, unique constraint
- `password_hash`: Only for email-based authentication (shop owners/admins)
- `role`: Determines user permissions and dashboard access
- `is_verified`: Future feature for SMS/email verification

### Shops Table
```sql
CREATE TABLE shops (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,         -- Shop display name
    address TEXT NOT NULL,              -- Full address
    phone VARCHAR(15),                  -- Shop contact number
    email VARCHAR(255),                 -- Shop contact email
    description TEXT,                   -- Shop description
    services TEXT[],                    -- Array of services offered
    rating DECIMAL(3,2) DEFAULT 0.0,    -- Average rating (0.00-5.00)
    total_reviews INTEGER DEFAULT 0,     -- Total number of reviews
    is_active BOOLEAN DEFAULT true,      -- Shop operational status
    is_verified BOOLEAN DEFAULT false,   -- Admin verification status
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

**Business Logic:**
- `owner_id`: Links to users table, CASCADE delete when user deleted
- `services`: PostgreSQL array of strings (e.g., {'Printing', 'Binding', 'Scanning'})
- `rating`: Calculated from customer reviews, updated via triggers
- `is_verified`: Admin approval required for new shops

### Orders Table
```sql
CREATE TABLE orders (
    id VARCHAR(10) PRIMARY KEY,         -- Format: UF001, WI002
    customer_id UUID REFERENCES users(id),
    shop_id UUID REFERENCES shops(id),
    order_type order_type_enum NOT NULL, -- uploaded_files, walk_in
    status order_status_enum DEFAULT 'received', -- received, started, completed, cancelled
    description TEXT,                    -- Customer requirements
    total_pages INTEGER,                -- Total pages to print
    copies INTEGER DEFAULT 1,           -- Number of copies
    color_pages INTEGER DEFAULT 0,      -- Color pages count
    paper_type VARCHAR(50),             -- A4, A3, etc.
    binding_type VARCHAR(50),           -- Spiral, Perfect, etc.
    is_urgent BOOLEAN DEFAULT false,    -- Priority flag
    estimated_cost DECIMAL(10,2),       -- Shop's estimate
    final_cost DECIMAL(10,2),          -- Final charged amount
    customer_notes TEXT,                -- Customer instructions
    shop_notes TEXT,                    -- Shop internal notes
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP              -- Completion timestamp
);
```

**ID Generation Logic:**
- `UF` prefix for uploaded file orders (UF001, UF002, ...)
- `WI` prefix for walk-in orders (WI001, WI002, ...)
- Sequential numbering within each type

**Status Workflow:**
1. `received` → Order created, awaiting shop confirmation
2. `started` → Shop has begun processing
3. `completed` → Order ready for pickup/delivery
4. `cancelled` → Order cancelled by customer or shop

### Order Files Table
```sql
CREATE TABLE order_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id VARCHAR(10) REFERENCES orders(id) ON DELETE CASCADE,
    original_name VARCHAR(255) NOT NULL, -- User's filename
    stored_name VARCHAR(255) NOT NULL,   -- Server storage filename
    file_path TEXT NOT NULL,            -- Full file path
    file_size BIGINT NOT NULL,          -- File size in bytes
    mime_type VARCHAR(100) NOT NULL,     -- File MIME type
    page_count INTEGER,                 -- PDF page count
    upload_status VARCHAR(20) DEFAULT 'pending', -- pending, processed, failed
    created_at TIMESTAMP DEFAULT NOW()
);
```

**File Processing:**
- Only linked to `uploaded_files` orders
- Automatic page counting for PDFs
- File validation for supported formats (PDF, DOC, DOCX, JPG, PNG)
- Maximum file size: 10MB per file

## API Documentation

### Authentication Endpoints

#### POST /api/auth/phone-login
**Purpose**: Customer authentication via phone number
**Request Body**:
```json
{
  "phone": "9876543210"  // Exactly 10 digits
}
```
**Response**:
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "uuid",
    "phone": "9876543210",
    "name": "John Doe",
    "role": "customer",
    "needsNameUpdate": false
  }
}
```
**Business Logic**:
- Validates phone format (exactly 10 digits)
- Creates new customer account if not exists
- Sets `needsNameUpdate: true` for new users
- Returns JWT token valid for 24 hours

#### POST /api/auth/email-login
**Purpose**: Shop owner/admin authentication
**Request Body**:
```json
{
  "email": "shop@example.com",
  "password": "securepassword"
}
```
**Response**:
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "uuid",
    "email": "shop@example.com",
    "name": "Shop Owner",
    "role": "shop_owner",
    "shopId": "shop_uuid"
  }
}
```

### Customer Endpoints

#### GET /api/customer/dashboard
**Purpose**: Customer dashboard data
**Headers**: `Authorization: Bearer {token}`
**Response**:
```json
{
  "stats": {
    "totalOrders": 15,
    "activeOrders": 3,
    "completedOrders": 12,
    "totalSpent": 1250.50
  },
  "recentOrders": [...],
  "nearbyShops": [...],
  "visitedShops": [...]
}
```

#### POST /api/customer/orders
**Purpose**: Create new order
**Request Body**:
```json
{
  "shopId": "uuid",
  "orderType": "uploaded_files", // or "walk_in"
  "description": "Print 10 copies of resume",
  "isUrgent": false,
  "files": ["file_id_1", "file_id_2"] // Only for uploaded_files
}
```

### Shop Owner Endpoints

#### GET /api/shop/orders
**Purpose**: Get shop's orders by status
**Query Parameters**:
- `status`: received, started, completed, cancelled
- `page`: Page number for pagination
- `limit`: Orders per page (default: 50)

#### PUT /api/shop/orders/:id/status
**Purpose**: Update order status
**Request Body**:
```json
{
  "status": "started",
  "shopNotes": "Starting work on order",
  "estimatedCost": 150.00
}
```

### Admin Endpoints

#### GET /api/admin/analytics
**Purpose**: Platform-wide analytics
**Response**:
```json
{
  "totalUsers": 1250,
  "totalShops": 45,
  "totalOrders": 5670,
  "monthlyRevenue": 125000,
  "topShops": [...],
  "orderTrends": [...]
}
```

## Page Documentation

### Homepage (/)
**Purpose**: Customer entry point and authentication
**Features**:
- Phone number login for customers
- Service information display
- Statistics showcase
- Mobile-responsive design

**Mobile Optimizations**:
- Touch-friendly phone input with numeric keypad
- Collapsible navigation menu
- Optimized hero section layout
- Bottom-aligned CTA buttons

**User Flow**:
1. Customer enters phone number
2. System validates format (10 digits)
3. Auto-creates account if new user
4. Redirects to customer dashboard
5. Shows name collection popup for new users

### Customer Dashboard (/customer/dashboard)
**Purpose**: Order management and shop discovery
**Components**:
- Statistics cards (total orders, active, completed, spent)
- Recent orders list with status tracking
- Nearby shops browser with ratings
- Quick order creation buttons

**Mobile Features**:
- Horizontal scrolling stats cards
- Swipe actions on order items
- Bottom navigation tabs
- Pull-to-refresh functionality
- Infinite scroll for order history

**Conditions & Logic**:
- Filter orders by status (all, active, completed)
- Search functionality for orders and shops
- Location-based shop recommendations
- Recently visited shops prioritization

### Shop Dashboard (/shop/dashboard)
**Purpose**: Order management for shop owners
**Layout**: Four-column grid system
- Column 1: New Orders (status: received)
- Column 2: In Progress (status: started)
- Column 3: Ready (status: completed)
- Column 4: Order History

**Mobile Adaptations**:
- Accordion layout replacing columns
- Swipe navigation between sections
- Quick action buttons for status updates
- Real-time order notifications

**Business Rules**:
- Orders auto-refresh every 10 seconds
- Priority indication for urgent orders
- File preview for uploaded documents
- Customer contact integration (call/chat)

### Admin Dashboard (/admin/dashboard)
**Purpose**: Platform oversight and management
**Sections**:
- Analytics overview with charts
- User management (customers, shop owners)
- Shop verification and approval
- System health monitoring

**Mobile Features**:
- Responsive data tables with horizontal scroll
- Touch-friendly form controls
- Streamlined approval workflows
- Quick action menus

**Access Control**:
- Admin-only route protection
- Role-based feature access
- Audit trail for all actions
- Secure data handling

## Error Handling & Validation

### Input Validation Rules
- **Phone numbers**: Exactly 10 digits, no special characters
- **Email addresses**: Valid email format, unique constraint
- **File uploads**: Max 10MB, supported formats only
- **Order descriptions**: Max 1000 characters
- **Shop names**: 3-100 characters, required

### Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Phone number must be exactly 10 digits",
    "field": "phone"
  }
}
```

### Common Error Codes
- `VALIDATION_ERROR`: Input validation failed
- `UNAUTHORIZED`: Authentication required
- `FORBIDDEN`: Insufficient permissions
- `NOT_FOUND`: Resource not found
- `RATE_LIMITED`: Too many requests
- `SERVER_ERROR`: Internal server error

## Security Measures

### Authentication
- JWT tokens with 24-hour expiry
- Secure password hashing with bcrypt
- Role-based access control
- Rate limiting on auth endpoints

### File Security
- Virus scanning on uploads
- File type validation
- Secure file storage with random names
- Access control for file downloads

### Data Protection
- SQL injection prevention
- XSS protection headers
- CORS configuration
- Environment variable secrets

## Performance Optimization

### Database
- Proper indexing on frequently queried fields
- Connection pooling
- Query optimization
- Caching frequently accessed data

### API
- Response compression
- Pagination for large datasets
- Efficient JSON serialization
- CDN for static assets

## Deployment & Environment

### Environment Variables
```env
DATABASE_URL=postgresql://username:password@host:port/database
JWT_SECRET=your-super-secure-jwt-secret
FILE_UPLOAD_PATH=/uploads
MAX_FILE_SIZE=10485760
REDIS_URL=redis://localhost:6379
```

### Production Checklist
- [ ] Database migrations applied
- [ ] Environment variables configured
- [ ] SSL certificates installed
- [ ] File upload directory permissions set
- [ ] Log rotation configured
- [ ] Monitoring and alerts setup
- [ ] Backup strategy implemented

This documentation provides comprehensive coverage of the PrintEasy backend architecture, ensuring developers understand the system's structure, business logic, and implementation details.

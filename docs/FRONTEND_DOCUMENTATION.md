
# PrintEasy Frontend Documentation

## Overview
PrintEasy is a React-based web application built with TypeScript, Vite, and Tailwind CSS. It serves as a digital platform connecting customers with local print shops following the PRD specifications.

## Technology Stack
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with golden/black/white theme
- **UI Components**: Shadcn/UI
- **State Management**: React Context API + TanStack Query
- **Routing**: React Router v6
- **Icons**: Lucide React
- **HTTP Client**: Axios

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (Shadcn/UI)
│   ├── auth/           # Authentication components
│   ├── layout/         # Layout components (UniversalHeader)
│   ├── shop/           # Shop-specific components
│   ├── admin/          # Admin-specific components (RealTimeAnalytics)
│   ├── customer/       # Customer-specific components
│   ├── qr/             # QR code components
│   └── chat/           # Chat components
├── pages/              # Page components
│   ├── admin/          # Admin dashboard
│   ├── shop/           # Shop owner pages
│   ├── customer/       # Customer pages
│   └── *.tsx           # General pages
├── contexts/           # React contexts (AuthContext, SocketContext)
├── services/           # API services (apiService)
├── types/              # TypeScript type definitions
└── lib/                # Library configurations
```

## Core Features

### 1. Authentication System
- **Phone-based authentication** for customers (no password required)
- **Email/password authentication** for shop owners and admins
- **Role-based access control** (customer, shop_owner, admin)
- **JWT token management** with automatic refresh

### 2. User Roles & Dashboards

#### Customer Dashboard
- Browse nearby print shops
- Place orders (digital files or walk-in bookings)
- Track order status in real-time
- View order history

#### Shop Owner Dashboard
- **4-Column Layout for Active Orders**:
  - Digital New Orders (status: pending)
  - Digital In Progress Orders (status: in_progress, ready)
  - Walk-in New Orders (status: pending)
  - Walk-in In Progress Orders (status: in_progress, ready)
- **Order History Tab** for completed/cancelled orders
- **QR Code Generation** for customer direct access
- **Order Management**: Status updates, urgency flagging
- **Customer Communication**: Direct calling integration

#### Admin Dashboard
- **Real-time Analytics** with live data from PostgreSQL
- **User Management**: CRUD operations for all users
- **Shop Management**: Create, edit, activate/deactivate shops
- **Offline Access Control**: Toggle walk-in order availability per shop
- **System Monitoring**: Order trends, shop performance metrics

### 3. Order Management System
- **Order Types**: Digital (file upload), Walk-in (text description)
- **Order Status Flow**: pending → in_progress → ready → completed
- **Priority System**: Urgent order flagging and filtering
- **File Management**: Multiple file upload with secure storage
- **Dynamic Visibility**: Walk-in orders only shown if shop allows offline access

## API Integration

### Base Configuration
```typescript
const API_BASE_URL = 'http://localhost:3001/api'
```

### Key Endpoints (as per PRD)
- `POST /auth/phone-login` - Customer authentication
- `POST /auth/email-login` - Shop owner/admin authentication
- `GET /shops/my-shop` - Shop owner's shop details
- `GET /orders/shop` - Shop active orders
- `GET /orders/shop/history` - Shop completed orders
- `PATCH /orders/:id/status` - Update order status
- `GET /admin/analytics/dashboard` - Real-time analytics
- `GET /admin/users` - User management
- `GET /admin/shops` - Shop management
- `POST /admin/shops` - Create new shop

## Data Models (TypeScript Interfaces)

### User
```typescript
interface User {
  id: string;                    // UUID
  name: string;
  email?: string;               // Required for shop_owner/admin
  phone?: string;               // Required for customers
  role: 'customer' | 'shop_owner' | 'admin';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
```

### Shop
```typescript
interface Shop {
  id: string;                   // UUID
  owner_user_id: string;        // UUID reference to users
  name: string;
  address: string;
  contact_number: string;
  email: string;
  is_active: boolean;           // Controls shop visibility
  allow_offline_access: boolean; // Controls walk-in order availability
  shop_timings: string;
  slug: string;                 // Unique URL identifier
  qr_code_url?: string;         // Generated QR code image URL
  owner?: User;
  created_at: string;
  updated_at: string;
}
```

### Order
```typescript
interface Order {
  id: string;                   // UUID
  customer_id: string;          // UUID reference to users
  shop_id: string;              // UUID reference to shops
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  order_type: 'digital' | 'walkin';
  notes: string;                // Unified description/instructions
  status: 'pending' | 'in_progress' | 'ready' | 'completed' | 'cancelled';
  is_urgent?: boolean;
  files?: OrderFile[];
  customer?: User;
  shop?: Shop;
  created_at: string;
  updated_at: string;
}
```

### OrderFile
```typescript
interface OrderFile {
  id: string;                   // UUID
  order_id: string;             // UUID reference to orders
  file_name: string;            // Unique filename for storage
  original_name?: string;       // User's original filename
  mime_type: string;
  file_url: string;             // Public access URL
  backend_file_path: string;    // Internal server path
  restrict_download: boolean;
  created_at: string;
  updated_at: string;
}
```

## Backend API Requirements

### Database Schema (PostgreSQL/Sequelize)

#### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(20) UNIQUE,
  password VARCHAR(255),
  role ENUM('customer', 'shop_owner', 'admin') DEFAULT 'customer',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Shops Table
```sql
CREATE TABLE shops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id UUID REFERENCES users(id) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  contact_number VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  allow_offline_access BOOLEAN DEFAULT true,
  shop_timings VARCHAR(255) DEFAULT 'Mon-Sat 9 AM - 8 PM',
  slug VARCHAR(255) UNIQUE NOT NULL,
  qr_code_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Orders Table
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES users(id) NOT NULL,
  shop_id UUID REFERENCES shops(id) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  customer_email VARCHAR(255),
  order_type ENUM('digital', 'walkin') NOT NULL,
  notes TEXT NOT NULL,
  status ENUM('pending', 'in_progress', 'ready', 'completed', 'cancelled') DEFAULT 'pending',
  is_urgent BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Files Table
```sql
CREATE TABLE files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  original_name VARCHAR(255),
  mime_type VARCHAR(100),
  file_url TEXT NOT NULL,
  backend_file_path TEXT UNIQUE NOT NULL,
  restrict_download BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Required API Endpoints

#### Authentication
- `POST /api/auth/phone-login` - { phone: string } → { success, token, user }
- `POST /api/auth/email-login` - { email, password } → { success, token, user }
- `GET /api/auth/me` - → { user }
- `PATCH /api/auth/profile` - { name } → { success, user }

#### Shop Operations
- `GET /api/shops/my-shop` - → { shop }
- `POST /api/shops/:shopId/generate-qr` - → { success, qrCodeUrl }
- `GET /api/shops/slug/:slug` - → { shop }
- `GET /api/orders/shop` - → { orders }
- `GET /api/orders/shop/history` - → { orders }
- `PATCH /api/orders/:orderId/status` - { status } → { success, order }
- `PATCH /api/orders/:orderId/urgency` - → { success, order }

#### Customer Operations
- `GET /api/shops` - → { shops }
- `POST /api/orders` - { shopId, orderType, notes } → { success, order }
- `GET /api/orders/customer` - → { orders }
- `GET /api/orders/customer/history` - → { orders }

#### File Management
- `POST /api/files/upload/:orderId` - FormData → { success, files }
- `GET /api/files/order/:orderId` - → { files }
- `GET /api/files/download/:fileId` - → File stream

#### Admin Operations
- `GET /api/admin/analytics/dashboard` - → { stats, orderTrends, ... }
- `GET /api/admin/users` - → { users, pagination }
- `GET /api/admin/shops` - → { shops }
- `POST /api/admin/shops` - { shopName, ownerEmail, ... } → { success, shop, owner }
- `PATCH /api/admin/shops/:shopId` - { is_active, allow_offline_access, ... } → { success, shop }

## Design System

### Color Scheme (Golden/Black/White Theme)
- **Primary**: Golden (#D4AF37, #B8941F, #9A7B1A)
- **Neutral**: White to Black (#FFFFFF to #000000)
- **Success**: Green (#10B981)
- **Warning**: Orange/Golden variants
- **Error**: Red (#EF4444)

### Typography
- **Headings**: Inter font family, bold weights
- **Body**: System font stack, medium/regular weights
- **Code**: Monospace for IDs and technical text

### Component Patterns
- **Cards**: Consistent padding, hover effects, rounded corners
- **Buttons**: Golden primary, outline variants, proper loading states
- **Badges**: Status-specific colors, consistent sizing
- **Forms**: Clear validation, accessible labels

## State Management

### Context Providers
1. **AuthContext**: User authentication state, login/logout methods
2. **SocketContext**: Real-time updates (future WebSocket integration)

### TanStack Query
- **Query Keys**: Hierarchical structure for cache management
- **Mutations**: Status updates, order creation, user management
- **Automatic Refetching**: 30-second intervals for real-time data
- **Error Handling**: Toast notifications, retry logic

## Routing Structure

```
/                           # Home page
/login                      # Authentication page
/shop/:slug                 # Public shop order page (QR code destination)
/customer/dashboard         # Customer dashboard
/customer/order/new         # New order creation
/shop/dashboard             # Shop owner dashboard (4-column + history)
/admin/dashboard            # Admin dashboard (analytics + management)
/admin/add-shop             # Add new shop form
/notifications              # User notifications
/profile                    # User profile management
```

## Critical Implementation Notes

### 1. Data Consistency
- All API responses return data objects, not full Axios responses
- TypeScript interfaces strictly match database schema
- No dummy data - all information from PostgreSQL

### 2. Role-Based Access
- Frontend routes protected by user role
- API endpoints enforce role-based permissions
- Dynamic UI rendering based on user capabilities

### 3. Shop-Specific Features
- QR codes link directly to shop's order page
- Walk-in orders only visible if `allow_offline_access = true`
- Shop owners see only their shop's orders

### 4. Order Management
- 4-column dashboard layout as specified in PRD
- Clear status progression with action buttons
- Real-time updates with query invalidation

### 5. Admin Capabilities
- Complete CRUD for users and shops
- Real-time analytics with live PostgreSQL data
- Shop activation/deactivation controls
- Offline access toggles per shop

## Performance Considerations

### Frontend Optimization
- React.memo for order cards to prevent unnecessary re-renders
- Lazy loading for non-critical components
- Efficient query invalidation strategies
- Optimistic updates for status changes

### API Efficiency
- Pagination for large data sets
- Selective data fetching with Sequelize includes
- Proper database indexing on foreign keys
- Connection pooling for PostgreSQL

## Security Measures

### Authentication
- JWT tokens with expiration
- Role-based route protection
- Automatic logout on token expiry

### Data Protection
- Input validation on all forms
- Sanitized database queries
- File upload restrictions
- CORS configuration

## Testing Strategy

### Unit Testing
- Component rendering with React Testing Library
- API service method testing
- Utility function validation

### Integration Testing
- Auth flow testing
- Order creation and status update flows
- Admin management operations

### E2E Testing
- Complete user journeys for each role
- QR code scanning simulation
- Cross-browser compatibility

---

This documentation reflects the current clean state of the frontend application, ready for backend implementation according to the PRD specifications.


# PrintEasy Frontend Documentation

## Overview
PrintEasy is a React-based web application built with TypeScript, Vite, and Tailwind CSS. It serves as a digital platform connecting customers with local print shops.

## Technology Stack
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system
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
│   ├── layout/         # Layout components
│   ├── shop/           # Shop-specific components
│   ├── admin/          # Admin-specific components
│   ├── customer/       # Customer-specific components
│   ├── qr/             # QR code components
│   └── order/          # Order-related components
├── pages/              # Page components
│   ├── admin/          # Admin dashboard pages
│   ├── shop/           # Shop owner pages
│   ├── customer/       # Customer pages
│   └── *.tsx           # General pages
├── contexts/           # React contexts
├── services/           # API services
├── hooks/              # Custom hooks
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── lib/                # Library configurations
```

## Core Features

### 1. Authentication System
- **Phone-based authentication** for customers
- **Email/password authentication** for shop owners and admins
- **Role-based access control** (customer, shop_owner, admin)
- **Context-based user state management**

### 2. User Roles & Dashboards

#### Customer Dashboard
- Browse nearby print shops
- Place orders (upload files or walk-in bookings)
- Track order status
- View order history

#### Shop Owner Dashboard
- **4-Column Layout**:
  - Upload Orders - New
  - Upload Orders - In Progress
  - Walk-in Orders - New
  - Walk-in Orders - In Progress
- Order management with status updates
- Customer communication tools
- QR code generation for shop access
- Order history tab for completed orders

#### Admin Dashboard
- User management (CRUD operations)
- Shop management with settings control
- Real-time analytics
- System monitoring

### 3. Order Management System
- **Order Types**: Upload files, Walk-in bookings
- **Order Status**: received → started → completed
- **Priority System**: Urgent order flagging
- **File Upload**: Multiple file support with preview
- **Order Specifications**: Pages, copies, paper type, binding, color options

## API Integration

### Base Configuration
```typescript
const API_BASE_URL = 'http://localhost:3001/api'
```

### Key Endpoints
- `POST /auth/phone-login` - Customer authentication
- `POST /auth/email-login` - Shop owner/admin authentication
- `GET /orders/shop` - Shop orders
- `GET /orders/customer` - Customer orders
- `PATCH /orders/:id/status` - Update order status
- `GET /admin/stats` - Admin statistics
- `GET /admin/users` - User management
- `GET /admin/shops` - Shop management

## Data Models

### User
```typescript
interface User {
  id: number;
  name: string;
  email?: string;
  phone: string;
  role: 'customer' | 'shop_owner' | 'admin';
  is_active: boolean;
  created_at: string;
}
```

### Shop
```typescript
interface Shop {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  is_active: boolean;
  allows_offline_orders: boolean;
  shop_timings: string;
  owner: User;
  created_at: string;
}
```

### Order
```typescript
interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  order_type: 'uploaded-files' | 'walk-in';
  description: string;
  status: 'received' | 'started' | 'completed';
  is_urgent: boolean;
  created_at: string;
  files?: OrderFile[];
  pages?: number;
  copies?: number;
  paperType?: string;
  binding?: string;
  color?: boolean;
}
```

### OrderFile
```typescript
interface OrderFile {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  original_name?: string;
}
```

## Backend API Requirements

Based on the frontend implementation, the backend should provide:

### Database Schema (Sequelize ORM)

#### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(20) UNIQUE NOT NULL,
  role ENUM('customer', 'shop_owner', 'admin') DEFAULT 'customer',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Shops Table
```sql
CREATE TABLE shops (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  owner_id INTEGER REFERENCES users(id),
  is_active BOOLEAN DEFAULT true,
  allows_offline_orders BOOLEAN DEFAULT false,
  shop_timings VARCHAR(255),
  slug VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Orders Table
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id INTEGER REFERENCES users(id),
  shop_id INTEGER REFERENCES shops(id),
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  customer_email VARCHAR(255),
  order_type ENUM('uploaded-files', 'walk-in') NOT NULL,
  description TEXT NOT NULL,
  status ENUM('received', 'started', 'completed') DEFAULT 'received',
  is_urgent BOOLEAN DEFAULT false,
  instructions TEXT,
  pages INTEGER,
  copies INTEGER DEFAULT 1,
  paper_type VARCHAR(100),
  binding VARCHAR(100),
  color BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Files Table
```sql
CREATE TABLE files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id),
  name VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  type VARCHAR(100) NOT NULL,
  size INTEGER NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Required API Endpoints

#### Authentication
- `POST /api/auth/phone-login` - Phone OTP login
- `POST /api/auth/email-login` - Email/password login
- `GET /api/auth/me` - Get current user
- `PATCH /api/auth/profile` - Update user profile

#### Shop Management
- `GET /api/shops` - List all shops
- `GET /api/shops/:slug` - Get shop by slug
- `GET /api/shops/qr-code` - Generate shop QR code
- `GET /api/orders/shop` - Get shop orders
- `PATCH /api/orders/:id/status` - Update order status
- `PATCH /api/orders/:id/urgency` - Toggle order urgency

#### Customer Operations
- `GET /api/orders/customer` - Get customer orders
- `POST /api/orders` - Create new order
- `GET /api/orders/customer/history` - Order history

#### File Management
- `POST /api/files/upload` - Upload files
- `GET /api/files/:id/download` - Download file

#### Admin Operations
- `GET /api/admin/stats` - System statistics
- `GET /api/admin/users` - List users with search
- `GET /api/admin/shops` - List all shops
- `PATCH /api/admin/shops/:id` - Update shop settings
- `POST /api/admin/shops` - Create new shop

## Design System

### Colors
- **Primary**: Golden (#D4AF37 variants)
- **Neutral**: Gray scale (#F5F5F5 to #1F1F1F)
- **Success**: Green (#10B981)
- **Warning**: Orange (#F59E0B)
- **Error**: Red (#EF4444)

### Typography
- **Headings**: Inter font family
- **Body**: System font stack
- **Code**: Monospace

### Spacing
- **Base unit**: 4px (0.25rem)
- **Components**: Consistent padding and margins
- **Grid**: 12-column responsive grid

## State Management

### Context Providers
1. **AuthContext**: User authentication state
2. **SocketContext**: Real-time updates (WebSocket)

### TanStack Query
- **Cache management** for API calls
- **Automatic refetching** with intervals
- **Error handling** and retry logic
- **Query invalidation** on mutations

## Routing Structure

```
/                           # Home page
/login                      # Authentication
/shop/:slug                 # Shop upload page
/shop/:slug/upload          # Shop upload page (alias)
/customer/dashboard         # Customer dashboard
/customer/order/new         # New order creation
/shop/dashboard             # Shop owner dashboard
/admin/dashboard            # Admin dashboard
/admin/add-shop             # Add new shop
/notifications              # User notifications
/profile                    # User profile
```

## Component Guidelines

### File Organization
- **One component per file**
- **Co-locate related components**
- **Index files for barrel exports**
- **TypeScript interfaces in same file**

### Props Interface
```typescript
interface ComponentProps {
  // Required props first
  title: string;
  onAction: () => void;
  
  // Optional props with defaults
  variant?: 'primary' | 'secondary';
  className?: string;
  children?: React.ReactNode;
}
```

### Error Handling
- **User-friendly error messages**
- **Toast notifications** for feedback
- **Fallback UI** for failed states
- **Retry mechanisms** where appropriate

## Build & Deployment

### Development
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

### Environment Variables
```env
VITE_API_URL=http://localhost:3001/api
```

## Performance Considerations

### Code Splitting
- **Lazy loading** for routes
- **Dynamic imports** for heavy components
- **Bundle analysis** for optimization

### Caching Strategy
- **TanStack Query** for API responses
- **Browser caching** for static assets
- **Service worker** for offline functionality

### Image Optimization
- **WebP format** support
- **Responsive images** with srcset
- **Lazy loading** for images

## Security Measures

### Authentication
- **JWT tokens** in localStorage
- **Automatic logout** on token expiry
- **Role-based route protection**

### API Security
- **Request interceptors** for auth headers
- **Response interceptors** for error handling
- **CSRF protection** (backend requirement)

### Data Validation
- **Frontend validation** for UX
- **Backend validation** for security
- **TypeScript** for type safety

## Testing Strategy

### Unit Testing
- **Component testing** with React Testing Library
- **Hook testing** for custom hooks
- **Utility function testing**

### Integration Testing
- **API integration** tests
- **User flow** testing
- **Cross-browser** compatibility

### E2E Testing
- **Critical user journeys**
- **Order placement flow**
- **Dashboard functionality**

## Accessibility

### WCAG Compliance
- **Semantic HTML** structure
- **ARIA labels** for screen readers
- **Keyboard navigation** support
- **Color contrast** compliance

### Responsive Design
- **Mobile-first** approach
- **Touch-friendly** interactions
- **Flexible layouts** with CSS Grid/Flexbox

## Future Enhancements

### Planned Features
- **Real-time chat** between customers and shops
- **Payment integration** with Stripe
- **Push notifications** via service workers
- **Progressive Web App** capabilities
- **Advanced analytics** dashboard
- **Multi-language support**

### Technical Improvements
- **State management** with Redux Toolkit
- **Server-side rendering** with Next.js migration
- **GraphQL** API integration
- **Advanced caching** strategies

---

## Backend Implementation Notes

The backend should implement all the API endpoints listed above using Node.js, Express, and Sequelize ORM with PostgreSQL. Key implementation requirements:

1. **Authentication middleware** for protected routes
2. **File upload handling** with multer
3. **Role-based access control** middleware
4. **Input validation** with express-validator
5. **Error handling** middleware
6. **Rate limiting** for security
7. **CORS configuration** for frontend integration
8. **Database migrations** for schema management
9. **Seed data** for development environment
10. **API documentation** with Swagger/OpenAPI

This documentation serves as a comprehensive guide for both frontend maintenance and backend API development.


# PrintEasy Backend Integration Documentation

## Overview
This document describes the complete backend integration for PrintEasy, transitioning from a localStorage-based frontend to a full-stack application with Node.js API and PostgreSQL database.

## Architecture

### Backend Stack
- **Runtime**: Node.js with Express.js
- **Database**: PostgreSQL with proper schemas and relationships
- **Authentication**: JWT-based with phone verification for customers, email/password for business users
- **Security**: Helmet, CORS, rate limiting, input validation
- **File Handling**: Multer for file uploads (ready for implementation)

### Frontend Integration
- **API Service Layer**: Centralized HTTP client with interceptors
- **Authentication Context**: Updated to use real API calls
- **Custom Hooks**: API query and mutation hooks for data fetching
- **Error Handling**: Proper error boundaries and user feedback

## Database Schema

### Users Table
Unified user management for all user types:
```sql
- id (SERIAL PRIMARY KEY)
- phone (VARCHAR, UNIQUE) - For customers
- email (VARCHAR, UNIQUE) - For shop owners/admins  
- password_hash (VARCHAR) - Hashed passwords for business users
- name (VARCHAR)
- role (ENUM: customer, shop_owner, admin)
- is_active (BOOLEAN)
- created_at, updated_at (TIMESTAMP)
```

### Shops Table
Print shop information:
```sql
- id (SERIAL PRIMARY KEY)
- owner_id (FK to users.id)
- name, slug, address, phone, email
- opening_time, closing_time
- rating, total_reviews
- is_active (BOOLEAN)
- created_at, updated_at (TIMESTAMP)
```

### Orders Table
Order management with proper relationships:
```sql
- id (VARCHAR) - Custom format: UF001, WI001
- shop_id (FK to shops.id)
- customer_id (FK to users.id)
- order_type (ENUM: walk-in, uploaded-files)
- description, instructions
- services (JSONB)
- status (ENUM: new, confirmed, processing, ready, completed, cancelled)
- is_urgent (BOOLEAN)
- pages, copies, paper_type, binding, color
- total_amount (DECIMAL)
- created_at, updated_at (TIMESTAMP)
```

## API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /phone-login` - Customer login with phone number
- `POST /email-login` - Shop owner/admin login with email/password
- `PATCH /update-profile` - Update user profile information
- `GET /profile` - Get current user profile

### Order Routes (`/api/orders`)
- `GET /shop` - Get orders for shop owner
- `GET /customer` - Get orders for customer
- `POST /` - Create new order
- `PATCH /:orderId/status` - Update order status
- `PATCH /:orderId/urgency` - Toggle order urgency

### Shop Routes (`/api/shops`)
- `GET /` - Get all active shops
- `GET /:identifier` - Get shop by ID or slug
- `PUT /:shopId` - Update shop details (owner only)

## Frontend Integration

### API Service Layer (`src/services/api.ts`)
Centralized HTTP client with:
- Automatic token injection
- Response/request interceptors
- Error handling
- Type-safe method definitions

### Custom Hooks (`src/hooks/useApi.ts`)
- `useApiQuery<T>` - For data fetching with loading/error states
- `useApiMutation<T>` - For data mutations
- `useOrders()` - Specific hook for order management
- `useShops()` - Specific hook for shop data

### Updated Authentication Context
- Real API integration replacing localStorage mock
- JWT token management
- Automatic token validation
- Role-based access control

## Security Features

### Backend Security
- JWT authentication with expiration
- Password hashing with bcrypt
- Input validation with express-validator
- Rate limiting (100 requests per 15 minutes)
- CORS configuration
- Helmet security headers
- SQL injection protection with parameterized queries

### Frontend Security
- Automatic token removal on 401 responses
- Protected routes with real authentication
- Secure token storage
- Input validation on forms

## Environment Configuration

### Backend Environment Variables
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=printeasy_shop
DB_USER=postgres
DB_PASSWORD=password
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Frontend Environment Variables
```env
VITE_API_URL=http://localhost:3001
```

## Setup Instructions

### 1. Database Setup
```bash
# Create PostgreSQL database
createdb printeasy_shop

# Run schema creation
psql -d printeasy_shop -f backend/updated-schema.sql
```

### 2. Backend Setup
```bash
cd backend
npm install
npm install jsonwebtoken bcrypt express-validator dotenv
cp .env.example .env
# Edit .env with your database credentials
node app.js
```

### 3. Frontend Updates
The frontend has been updated to use the new API service layer. No additional setup required.

## Default Users

### Admin User
- Email: admin@printeasy.com
- Password: admin123
- Role: admin

### Shop Owner
- Email: shop@example.com  
- Password: password
- Role: shop_owner
- Shop: Quick Print Solutions

### Customer
- Phone: 9876543210
- Name: Rajesh Kumar
- Role: customer

## Development Workflow

### Adding New API Endpoints
1. Create route in appropriate routes file
2. Add authentication/authorization middleware
3. Implement input validation
4. Add method to API service layer
5. Create custom hook if needed
6. Update frontend components

### Database Migrations
1. Create migration script in `backend/migrations/`
2. Test migration on development database
3. Update schema documentation
4. Deploy to production with proper backup

## Error Handling

### Backend Errors
- Validation errors return 400 with detailed messages
- Authentication errors return 401
- Authorization errors return 403
- Not found errors return 404
- Server errors return 500 with sanitized messages

### Frontend Error Handling
- API errors displayed to users via toast notifications
- Loading states during API calls
- Retry mechanisms for failed requests
- Offline scenario handling

## Performance Considerations

### Database
- Proper indexing on frequently queried columns
- Connection pooling for database connections
- Query optimization with EXPLAIN ANALYZE

### API
- Response compression with gzip
- Request/response size limits
- Efficient pagination for large datasets

### Frontend
- React Query for server state management
- Optimistic updates for better UX
- Debounced search inputs
- Lazy loading for large lists

## Testing Strategy

### Backend Testing
- Unit tests for individual functions
- Integration tests for API endpoints
- Database transaction tests
- Authentication/authorization tests

### Frontend Testing
- Component unit tests with React Testing Library
- Integration tests for user flows
- API mocking for isolated testing
- E2E tests with Cypress

## Deployment Considerations

### Backend Deployment
- Environment-specific configuration
- Database connection pooling
- Process management with PM2
- Logging with Winston
- Health check endpoints

### Frontend Deployment
- Environment variable configuration
- API URL configuration for different environments
- Build optimization
- CDN for static assets

## Next Steps

1. **File Upload System** - Implement multer file upload endpoints
2. **Real-time Features** - Add WebSocket support for live order updates
3. **Email Notifications** - Integrate email service for order updates
4. **Payment Integration** - Add payment gateway for order processing
5. **Analytics** - Implement order analytics and reporting
6. **Mobile API** - Extend API for mobile app support

This backend integration provides a solid foundation for scaling PrintEasy into a production-ready application with proper data persistence, security, and real-time capabilities.

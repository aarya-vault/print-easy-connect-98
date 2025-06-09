
# PrintEasy Backend API

A comprehensive Node.js backend for the PrintEasy platform - connecting customers with local print shops through digital file uploads and walk-in order management.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database running
- Git installed

### Installation

1. **Clone and setup**
   ```bash
   cd backend
   npm install
   ```

2. **Database setup**
   ```bash
   # Create database
   createdb printeasy_dev
   
   # Update .env file with your database credentials
   cp .env.example .env
   ```

3. **Start the server**
   ```bash
   npm run dev
   ```

4. **Seed test data (optional)**
   ```bash
   npm run db:seed
   ```

The API will be running at `http://localhost:3001`

## 📋 API Testing

### Postman Collection
Import `postman-collection.json` into Postman for complete API testing with:
- Pre-configured requests for all endpoints
- Environment variables for easy testing
- Auto-authentication token handling
- Response examples and documentation

### Health Check
Visit `http://localhost:3001/health` to verify the server is running.

## 🔐 Authentication

### Customer Login (Phone-based)
```bash
POST /api/auth/phone-login
Content-Type: application/json

{
  "phone": "9876543210"
}
```

### Shop Owner Login (Email-based)
```bash
POST /api/auth/email-login
Content-Type: application/json

{
  "email": "shop@example.com",
  "password": "password"
}
```

## 📊 API Endpoints

### Core Features
- **Authentication**: Phone login for customers, email login for shop owners
- **Order Management**: Create, track, and manage printing orders
- **File Handling**: Upload, download, and manage documents
- **Shop Discovery**: Browse and select print shops
- **Real-time Chat**: Communication between customers and shop owners
- **Status Tracking**: Three-stage order lifecycle (received → started → completed)

### Endpoint Categories

| Category | Endpoints | Description |
|----------|-----------|-------------|
| **Auth** | `/api/auth/*` | User authentication and profile management |
| **Orders** | `/api/orders/*` | Order creation, tracking, and management |
| **Shops** | `/api/shops/*` | Shop discovery and information |
| **Files** | `/api/files/*` | File upload, download, and management |
| **Chat** | `/api/chat/*` | Real-time messaging system |
| **System** | `/health`, `/` | Health checks and API information |

## 🗄️ Database Schema

### Core Tables
- **users**: Customer and shop owner accounts
- **shops**: Print shop information and settings
- **orders**: Print orders with status tracking
- **order_files**: Uploaded documents and files
- **messages**: Chat system for order communication

### Order Types
- **uploaded-files**: Digital documents for printing (ID: UF######)
- **walk-in**: Physical document services (ID: WI######)

### Order Status Flow
1. **received**: Initial order placement
2. **started**: Work has begun
3. **completed**: Ready for pickup/delivery

## 🛠️ Development

### Available Scripts
```bash
npm start          # Production server
npm run dev        # Development server with auto-reload
npm run db:seed    # Seed database with test data
npm run db:reset   # Reset database (caution: deletes all data)
```

### Environment Variables
```env
NODE_ENV=development
PORT=3001
HOST=0.0.0.0

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=printeasy_dev
DB_USER=your_username
DB_PASSWORD=your_password

# Security
JWT_SECRET=your-secret-key
```

### File Uploads
- **Location**: `uploads/` directory
- **Size Limit**: Unlimited (development)
- **Types**: All file types accepted
- **Organization**: Files organized by order ID

## 🔧 Features

### Phone-based Authentication
- Auto-registration for new customers
- No password required for customers
- JWT token-based session management

### Dual Order System
- **Upload Orders**: Customers upload files digitally
- **Walk-in Orders**: Customers describe services needed

### Real-time Communication
- Order-based chat system
- Message read status tracking
- Unread message counters

### File Management
- Multiple file uploads per order
- Secure file access with authentication
- File download and deletion capabilities

## 🧪 Testing Credentials

### Default Test Data
After running `npm run db:seed`:

**Customer Login:**
- Phone: `9876543210`

**Shop Owner Login:**
- Email: `shop@example.com`
- Password: `password`

### Test Orders
Sample orders are created with different statuses for testing the dashboard views.

## 🚀 Production Deployment

### Requirements
- Node.js 18+ runtime
- PostgreSQL database
- SSL certificates for HTTPS
- Process manager (PM2 recommended)

### Production Setup
1. Set `NODE_ENV=production`
2. Configure production database
3. Set secure JWT secret
4. Enable SSL/HTTPS
5. Configure rate limiting
6. Set up monitoring

## 📈 Performance

### Current Optimizations
- Gzip compression enabled
- Static file serving optimized
- Database connection pooling
- Request rate limiting
- Memory usage monitoring

### Monitoring
Health check endpoint provides:
- Server uptime
- Memory usage
- Database connection status
- Environment information

## 🔒 Security

### Implemented Features
- Helmet.js security headers
- CORS configuration
- Rate limiting
- JWT authentication
- Input validation
- File upload restrictions

### Development Mode
- Permissive CORS for testing
- Detailed error messages
- Unlimited file uploads
- High rate limits

## 🤝 Contributing

1. Follow existing code style and conventions
2. Add tests for new features
3. Update API documentation
4. Test with Postman collection
5. Ensure database migrations work

## 📚 Additional Resources

- **Postman Collection**: Complete API testing suite
- **Database Schema**: SQL files in `database/` directory
- **Middleware**: Authentication and upload handling
- **Models**: Sequelize ORM definitions

---

**PrintEasy Backend v1.0.0** - Built with Node.js, Express, PostgreSQL, and Sequelize

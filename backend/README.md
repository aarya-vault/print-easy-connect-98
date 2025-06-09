
# PrintEasy Backend - Sequelize ORM Version

## Overview
This is the backend API for PrintEasy, a platform that connects customers with local print shops. Built with Node.js, Express, and Sequelize ORM with PostgreSQL.

## Features
- **Simple Authentication**: Phone-based login for customers, email/password for shop owners
- **Auto-registration**: Customers are automatically registered on first login
- **Unlimited File Uploads**: No restrictions on file size, type, or count
- **Simplified Orders**: Clean order structure with just essential information
- **Real-time Order Tracking**: Three simple statuses (received, started, completed)

## Tech Stack
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL with Sequelize ORM
- **Authentication**: JWT tokens
- **File Upload**: Multer (unlimited)
- **Security**: Helmet, CORS, Rate limiting

## Quick Start

### 1. Prerequisites
```bash
# Install Node.js 18+ and PostgreSQL 14+
# Make sure PostgreSQL is running
```

### 2. Database Setup
```bash
# Create database
createdb printeasy_dev

# Or using PostgreSQL command line
psql -U postgres
CREATE DATABASE printeasy_dev;
\q
```

### 3. Install Dependencies
```bash
cd backend
npm install
```

### 4. Environment Configuration
```bash
# Copy the example environment file
cp .env.example .env

# Update the database credentials in .env file
DB_HOST=localhost
DB_PORT=5432
DB_NAME=printeasy_dev
DB_USER=postgres
DB_PASSWORD=your_password
```

### 5. Start the Server
```bash
# Development mode (auto-restart on changes)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3001`

### 6. Seed Test Data (Optional)
```bash
# This will create test users, shops, and orders
npm run db:seed
```

## API Endpoints

### Authentication
- `POST /api/auth/phone-login` - Customer login (auto-registration)
- `POST /api/auth/email-login` - Shop owner/admin login
- `PATCH /api/auth/update-profile` - Update user profile
- `GET /api/auth/me` - Get current user

### Shops
- `GET /api/shops` - Get all active shops
- `GET /api/shops/:shopId` - Get shop details

### Orders
- `POST /api/orders` - Create new order (with file upload)
- `GET /api/orders/customer` - Get customer orders
- `GET /api/orders/shop` - Get shop orders
- `PATCH /api/orders/:orderId/status` - Update order status
- `PATCH /api/orders/:orderId/urgency` - Toggle order urgency

### Files
- `POST /api/files/upload/:orderId` - Upload files to order
- `GET /api/files/order/:orderId` - Get order files
- `GET /api/files/download/:fileId` - Download file
- `DELETE /api/files/:fileId` - Delete file

## Database Schema

### Users
- `id` (Primary Key, Auto-increment)
- `phone` (Optional, Unique)
- `email` (Optional, Unique)
- `name` (Optional)
- `password` (Optional, hashed)
- `role` (customer/shop_owner/admin)
- `is_active` (Boolean)

### Shops
- `id` (Primary Key, Auto-increment)
- `owner_id` (Foreign Key to Users)
- `name` (Optional)
- `address` (Optional)
- `phone` (Optional)
- `email` (Optional)
- `is_active` (Boolean)
- `rating` (Decimal)

### Orders
- `id` (Primary Key, Custom format: UF000001, WI000001)
- `shop_id` (Foreign Key to Shops)
- `customer_id` (Foreign Key to Users)
- `customer_name` (Optional)
- `customer_phone` (Optional)
- `order_type` (uploaded-files/walk-in)
- `description` (Optional)
- `status` (received/started/completed)
- `is_urgent` (Boolean)

### Files
- `id` (Primary Key, Auto-increment)
- `order_id` (Foreign Key to Orders)
- `filename` (Optional)
- `original_name` (Optional)
- `file_path` (Optional)
- `file_size` (Optional)
- `mime_type` (Optional)

## Test Credentials

After running the seed script, you can use these credentials:

### Customer
- **Phone**: 9876543210
- **Method**: Use `/api/auth/phone-login` endpoint

### Shop Owner
- **Email**: shop@printeasy.com
- **Password**: password
- **Method**: Use `/api/auth/email-login` endpoint

### Admin
- **Email**: admin@printeasy.com
- **Password**: password
- **Method**: Use `/api/auth/email-login` endpoint

## File Upload Details

### No Restrictions
- **File Size**: Unlimited
- **File Count**: Unlimited per order
- **File Types**: All types accepted (.pdf, .doc, .jpg, .png, .zip, etc.)
- **Upload Path**: `uploads/orders/`

### API Usage
```javascript
// Frontend file upload example
const formData = new FormData();
formData.append('shopId', '1');
formData.append('orderType', 'uploaded-files');
formData.append('description', 'Print my documents');
formData.append('customerName', 'John Doe');
formData.append('customerPhone', '9876543210');

// Add multiple files
for (let i = 0; i < files.length; i++) {
  formData.append('files', files[i]);
}

// Send to API
fetch('/api/orders', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + token
  },
  body: formData
});
```

## Order Flow

### Customer Journey
1. **Login**: Enter phone number → auto-registration if new
2. **Browse Shops**: View available print shops
3. **Create Order**: Select shop, add description, upload files (optional)
4. **Track**: Monitor order status (received → started → completed)

### Shop Owner Journey
1. **Login**: Email + password authentication
2. **View Orders**: See all orders for their shop
3. **Process**: Update order status as work progresses
4. **Complete**: Mark orders as completed when ready

## Development

### Project Structure
```
backend/
├── config/          # Database configuration
├── models/          # Sequelize models
├── routes/          # API route handlers
├── middleware/      # Auth, upload, etc.
├── seeders/         # Database seed files
├── uploads/         # File storage directory
├── server.js        # Main application file
└── package.json     # Dependencies and scripts
```

### Available Scripts
```bash
npm run dev          # Start development server
npm start            # Start production server
npm run db:create    # Create database
npm run db:migrate   # Run migrations
npm run db:seed      # Seed test data
npm run db:drop      # Drop database
```

### Adding New Features
1. Create/modify Sequelize models in `models/`
2. Add API routes in `routes/`
3. Update authentication/authorization as needed
4. Test with provided test credentials

## Production Deployment

### Environment Variables
```bash
NODE_ENV=production
PORT=3001
DB_HOST=your-production-db-host
DB_NAME=printeasy_production
DB_USER=your-db-user
DB_PASSWORD=your-db-password
JWT_SECRET=your-super-secure-jwt-secret
FRONTEND_URL=https://yourdomain.com
```

### Steps
1. Set up PostgreSQL database on your server
2. Clone repository and install dependencies
3. Configure environment variables
4. Run database migrations and seeds
5. Start the server with PM2 or similar process manager
6. Set up nginx reverse proxy (optional)
7. Configure SSL certificates

### Health Check
Visit `http://your-server:3001/health` to verify the server is running.

## Troubleshooting

### Common Issues

**Database Connection Failed**
- Check PostgreSQL is running: `sudo service postgresql status`
- Verify database credentials in `.env`
- Ensure database exists: `createdb printeasy_dev`

**Port Already in Use**
- Check what's using port 3001: `lsof -i :3001`
- Kill the process or change PORT in `.env`

**File Upload Issues**
- Check `uploads/` directory permissions: `chmod 755 uploads/`
- Verify disk space is available

**CORS Errors**
- Update `FRONTEND_URL` in `.env` to match your frontend URL
- Check frontend is making requests to correct backend URL

### Logs
Server logs will show detailed error messages. Check:
- Database connection status
- Authentication errors
- File upload errors
- API request/response details

## Next Steps

### Required Actions
1. **Setup Database**: Create PostgreSQL database and update credentials
2. **Install Dependencies**: Run `npm install` in backend directory  
3. **Start Server**: Run `npm run dev` for development
4. **Test API**: Use provided test credentials to verify functionality
5. **Frontend Integration**: Update frontend API calls to match new endpoints

### Optional Enhancements
- Add WebSocket support for real-time updates
- Implement email notifications
- Add payment integration
- Create admin dashboard
- Add file preprocessing (image compression, PDF optimization)
- Implement caching layer (Redis)

The backend is now fully functional with Sequelize ORM and ready for integration with your frontend!

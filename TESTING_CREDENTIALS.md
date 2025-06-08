
# PrintEasy Testing Credentials & Guide 🧪

## Quick Start Testing

### 1. Customer Flow Test
**Phone**: `9876543210` (No password needed)
- Login will auto-create account if doesn't exist
- Upload files and create orders
- Track order status in real-time
- Test walk-in order booking

### 2. Shop Owner Test
**Phone**: `9123456789`
**Password**: `shopowner123`
- Manage incoming orders
- Update order status (New → Processing → Completed)
- Chat with customers
- View shop analytics

### 3. Admin Test
**Phone**: `9000000000` 
**Password**: `admin123`
- Manage all users and shops
- View system-wide analytics
- Add/remove shop owners
- Monitor platform performance

## Test Scenarios

### Customer Journey Testing
1. **New Customer Registration**:
   - Use any 10-digit phone number
   - System auto-creates account
   - No password required for customers

2. **Upload Order Flow**:
   - Login as customer → Upload files → Select shop → Track progress

3. **Walk-in Order Flow**:
   - Login as customer → Book appointment → Visit shop

### Shop Owner Testing
1. **Order Management**:
   - Login as shop owner
   - View orders in 4-column layout
   - Update status and communicate with customers

2. **Shop Configuration**:
   - Toggle offline module on/off
   - Generate QR codes for shop
   - Update shop details

### Admin Testing
1. **User Management**:
   - View all users and shops
   - Create/edit/delete users
   - Monitor system activity

## Test Data Available

### Sample Customers
- `9876543210` - Auto-created customer
- `9876543211` - Regular customer
- `9876543212` - Premium customer

### Sample Shops
- Quick Print Shop (Owner: 9123456789)
- Digital Copy Center (Owner: 9123456788)
- Express Printing (Owner: 9123456787)

### Sample Orders
- Multiple test orders with different statuses
- Various file types and print requirements
- Chat messages between customers and shops

## Backend Testing

### API Endpoints
- **Authentication**: `/api/auth/login`, `/api/auth/register`
- **Orders**: `/api/orders` (GET, POST, PUT)
- **Shops**: `/api/shops` (GET, POST, PUT)
- **Files**: `/api/files/upload`

### Database Tables
- `users` - All user accounts
- `shops` - Print shop details
- `orders` - Order information
- `order_files` - Uploaded documents
- `order_status_history` - Status tracking

## Troubleshooting

### Login Issues
1. **Customer can't login**: Phone number auto-creates account
2. **Shop owner access denied**: Use correct phone + password
3. **Admin panel not accessible**: Verify admin credentials

### Order Issues
1. **File upload fails**: Check backend server running
2. **Status not updating**: Verify WebSocket connection
3. **Orders not showing**: Check database connection

### Backend Issues
1. **Server won't start**: Run `node verify-setup.js`
2. **Database errors**: Check PostgreSQL installation
3. **CORS errors**: Verify frontend URL in .env

## Performance Testing

### Load Testing
- Test with 100+ concurrent users
- Upload large files (removed size limits)
- Multiple order processing

### Mobile Testing
- Test on various screen sizes
- Touch interactions work properly
- Slider functionality on mobile

## Security Testing

### Authentication
- JWT tokens properly validated
- Password hashing working correctly
- Role-based access control

### File Upload
- All file types accepted (no restrictions)
- Secure file storage
- Auto-cleanup after printing

Ready to test! 🚀
</tml>

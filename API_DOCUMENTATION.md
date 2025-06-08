
# PrintEasy API Documentation

## Base URL
```
Development: http://localhost:3001/api
Production: https://api.printeasy.com/api
```

## Authentication

### Phone Login
```http
POST /auth/phone-login
Content-Type: application/json

{
  "phone": "9876543210"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "1",
    "phone": "9876543210",
    "name": "John Doe",
    "role": "customer",
    "needsNameUpdate": false
  }
}
```

### Email Login (Shop Owners/Admins)
```http
POST /auth/email-login
Content-Type: application/json

{
  "email": "shop@printeasy.com",
  "password": "ShopOwner123!"
}
```

### Update Profile
```http
PATCH /auth/update-profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Updated Name"
}
```

## Orders API

### Create Order
```http
POST /orders
Authorization: Bearer {token}
Content-Type: application/json

{
  "shopId": 1,
  "orderType": "uploaded-files",
  "description": "Business presentation printing",
  "instructions": "Please use high-quality paper",
  "services": ["printing", "binding"],
  "pages": 25,
  "copies": 3,
  "paperType": "A4",
  "binding": "spiral",
  "color": true
}
```

### Get Customer Orders
```http
GET /orders/customer
Authorization: Bearer {token}
```

### Get Shop Orders
```http
GET /orders/shop
Authorization: Bearer {token}
Query Parameters:
  - status: new,confirmed,processing,ready,completed,cancelled
  - orderType: uploaded-files,walk-in
  - urgent: true,false
  - page: 1
  - limit: 20
```

### Update Order Status
```http
PATCH /orders/:orderId/status
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "processing"
}
```

### Toggle Order Urgency
```http
PATCH /orders/:orderId/urgency
Authorization: Bearer {token}
```

## File Upload API

### Upload Files
```http
POST /files/upload/:orderId
Authorization: Bearer {token}
Content-Type: multipart/form-data

files: [File1, File2, File3, ...]
```

**Response:**
```json
{
  "success": true,
  "message": "Files uploaded successfully",
  "files": [
    {
      "id": 1,
      "filename": "document-123456789.pdf",
      "originalName": "business-plan.pdf",
      "fileSize": 2048576,
      "mimeType": "application/pdf"
    }
  ]
}
```

### Get Order Files
```http
GET /files/order/:orderId
Authorization: Bearer {token}
```

### Download File
```http
GET /files/download/:fileId
Authorization: Bearer {token}
```

### Delete File
```http
DELETE /files/:fileId
Authorization: Bearer {token}
```

## Chat API

### Send Message
```http
POST /chat/send
Authorization: Bearer {token}
Content-Type: application/json

{
  "orderId": "UF123456",
  "message": "Hello, when will my order be ready?",
  "recipientId": 2
}
```

### Get Order Messages
```http
GET /chat/order/:orderId
Authorization: Bearer {token}
```

### Get Unread Message Count
```http
GET /chat/unread-count
Authorization: Bearer {token}
```

## Shops API

### Get All Shops
```http
GET /shops
Query Parameters:
  - city: delhi
  - services: printing,binding
  - rating: 4.0
  - sort: rating,distance,name
```

### Get Shop Details
```http
GET /shops/:shopId
```

### Update Shop (Shop Owner)
```http
PUT /shops/:shopId
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Updated Shop Name",
  "address": "New Address",
  "phone": "9876543210",
  "services": ["printing", "binding", "lamination"],
  "opening_time": "09:00",
  "closing_time": "18:00"
}
```

## Admin API

### User Management
```http
GET /admin/users
Authorization: Bearer {admin_token}
Query Parameters:
  - role: customer,shop_owner,admin
  - status: active,inactive
  - search: john
  - page: 1
  - limit: 50

POST /admin/users
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "name": "New User",
  "email": "user@example.com",
  "phone": "9876543210",
  "role": "customer",
  "password": "TempPassword123!"
}

PATCH /admin/users/:userId
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "name": "Updated Name",
  "is_active": false
}

DELETE /admin/users/:userId
Authorization: Bearer {admin_token}
```

### Shop Management
```http
GET /admin/shops
Authorization: Bearer {admin_token}

POST /admin/shops
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "name": "New Print Shop",
  "address": "Shop Address",
  "phone": "9876543210",
  "email": "shop@newprint.com",
  "ownerId": 5
}
```

### Analytics
```http
GET /admin/analytics/dashboard
Authorization: Bearer {admin_token}

GET /admin/analytics/orders
Authorization: Bearer {admin_token}
Query Parameters:
  - startDate: 2024-01-01
  - endDate: 2024-12-31
  - shopId: 1
```

## WebSocket Events

### Connection
```javascript
const socket = io('http://localhost:3001', {
  auth: {
    token: jwt_token
  }
});
```

### Events

**Join Order Room**
```javascript
socket.emit('join_order', { orderId: 'UF123456' });
```

**Send Message**
```javascript
socket.emit('send_message', {
  orderId: 'UF123456',
  message: 'Hello!',
  recipientId: 2
});
```

**Receive Message**
```javascript
socket.on('new_message', (data) => {
  console.log('New message:', data.message);
});
```

**Order Status Update**
```javascript
socket.on('order_status_updated', (data) => {
  console.log('Order status changed:', data.status);
});
```

## Error Responses

### Standard Error Format
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {
    "field": "validation error details"
  }
}
```

### Common Error Codes
- `VALIDATION_ERROR` (400)
- `UNAUTHORIZED` (401)
- `FORBIDDEN` (403)
- `NOT_FOUND` (404)
- `RATE_LIMITED` (429)
- `INTERNAL_ERROR` (500)

## Rate Limits
- General API: 100 requests per 15 minutes
- Authentication: 5 requests per 15 minutes
- File Upload: 20 requests per 15 minutes

## Pagination
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8,
    "hasNext": true,
    "hasPrev": false
  }
}
```

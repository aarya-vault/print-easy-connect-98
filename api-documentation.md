
# PrintEasy API Documentation

This document provides comprehensive documentation for the PrintEasy platform's backend API. This API is designed to support the various features and workflows of the PrintEasy application, including user management, order processing, shop management, and administrative functions.

## Base URL

```
https://api.printeasy.com/v1
```

## Authentication

All API requests require authentication using JSON Web Tokens (JWT), except for the login and signup endpoints.

**Authentication Header:**
```
Authorization: Bearer <token>
```

## Error Handling

All errors follow this standard format:

```json
{
  "status": 400,
  "error": "Bad Request",
  "message": "Invalid email format",
  "details": {}
}
```

## API Endpoints

### Authentication

#### Register Customer

```
POST /auth/register/customer
```

**Request Body:**
```json
{
  "phone": "9876543210",
  "name": "John Doe",
  "email": "john@example.com" // optional
}
```

**Response (201):**
```json
{
  "message": "OTP sent for verification",
  "verificationId": "ver_123456789"
}
```

#### Register Shop Owner

```
POST /auth/register/shop
```

**Request Body:**
```json
{
  "email": "shop@example.com",
  "password": "SecurePassword123",
  "phone": "9876543210",
  "name": "Shop Owner Name"
}
```

**Response (201):**
```json
{
  "message": "Shop owner registered successfully",
  "userId": "usr_123456789"
}
```

#### Login with Phone (Customer)

```
POST /auth/login/phone
```

**Request Body:**
```json
{
  "phone": "9876543210"
}
```

**Response (200):**
```json
{
  "message": "OTP sent for verification",
  "verificationId": "ver_123456789"
}
```

#### Verify OTP

```
POST /auth/verify-otp
```

**Request Body:**
```json
{
  "verificationId": "ver_123456789",
  "otp": "123456"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "usr_123456789",
    "name": "John Doe",
    "phone": "9876543210",
    "role": "customer"
  }
}
```

#### Login with Email (Shop/Admin)

```
POST /auth/login/email
```

**Request Body:**
```json
{
  "email": "shop@example.com",
  "password": "SecurePassword123"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "usr_123456789",
    "name": "Shop Owner Name",
    "email": "shop@example.com",
    "role": "shop_owner"
  }
}
```

### User Management

#### Get User Profile

```
GET /users/profile
```

**Response (200):**
```json
{
  "id": "usr_123456789",
  "name": "John Doe",
  "phone": "9876543210",
  "email": "john@example.com",
  "role": "customer",
  "createdAt": "2023-01-15T10:30:00Z",
  "lastLogin": "2023-02-20T14:45:00Z"
}
```

#### Update User Profile

```
PUT /users/profile
```

**Request Body:**
```json
{
  "name": "John Doe Updated",
  "email": "johnnew@example.com"
}
```

**Response (200):**
```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": "usr_123456789",
    "name": "John Doe Updated",
    "email": "johnnew@example.com",
    "phone": "9876543210"
  }
}
```

### Shop Management

#### Submit Shop Application

```
POST /shops/apply
```

**Request Body:**
```json
{
  "businessName": "Digital Print Hub",
  "ownerName": "Rajesh Kumar",
  "email": "rajesh@digitalprintshub.com",
  "phone": "9876543210",
  "address": "Shop 15, Commercial Complex, MG Road, Bangalore",
  "gstNumber": "29ABCDE1234F1Z5",
  "services": ["Color Printing", "Black & White", "Binding", "Lamination"],
  "equipment": ["HP LaserJet Pro", "Canon Scanner", "Binding Machine"]
}
```

**Response (201):**
```json
{
  "message": "Shop application submitted successfully",
  "applicationId": "app_123456789",
  "uploadUrl": "https://api.printeasy.com/v1/uploads/documents/app_123456789"
}
```

#### Upload Shop Documents

```
POST /uploads/documents/{applicationId}
```

**Request Body (Form Data):**
```
documents[]: (file) gst_certificate.pdf
documents[]: (file) business_license.pdf
documents[]: (file) id_proof.pdf
```

**Response (200):**
```json
{
  "message": "Documents uploaded successfully",
  "documentIds": ["doc_123", "doc_456", "doc_789"]
}
```

#### Get Shop Details

```
GET /shops/{shopId}
```

**Response (200):**
```json
{
  "id": "shop_123456789",
  "name": "Digital Print Hub",
  "address": "Shop 15, Commercial Complex, MG Road, Bangalore",
  "phone": "9876543210",
  "email": "rajesh@digitalprintshub.com",
  "rating": 4.8,
  "totalReviews": 245,
  "services": ["Color Printing", "Black & White", "Binding", "Lamination"],
  "equipment": ["HP LaserJet Pro", "Canon Scanner", "Binding Machine"],
  "operatingHours": {
    "monday": {"open": "09:00", "close": "18:00", "isOpen": true},
    "tuesday": {"open": "09:00", "close": "18:00", "isOpen": true},
    "wednesday": {"open": "09:00", "close": "18:00", "isOpen": true},
    "thursday": {"open": "09:00", "close": "18:00", "isOpen": true},
    "friday": {"open": "09:00", "close": "18:00", "isOpen": true},
    "saturday": {"open": "10:00", "close": "16:00", "isOpen": true},
    "sunday": {"open": "10:00", "close": "16:00", "isOpen": false}
  },
  "images": [],
  "verified": true,
  "averageCompletionTime": "15-20 mins",
  "pricing": {
    "blackWhite": 2,
    "color": 8,
    "binding": 25,
    "scanning": 5
  }
}
```

#### Get Visited Shops (Customer)

```
GET /shops/visited
```

**Response (200):**
```json
{
  "shops": [
    {
      "id": "shop_123456789",
      "name": "Digital Print Hub",
      "address": "Shop 15, Commercial Complex, MG Road, Bangalore",
      "phone": "9876543210",
      "email": "rajesh@digitalprintshub.com",
      "rating": 4.8,
      "totalReviews": 245,
      "services": ["Color Printing", "Black & White", "Binding", "Lamination"],
      "lastVisited": "2023-03-15T14:30:00Z",
      "visitCount": 8,
      "averageCompletionTime": "15-20 mins"
    },
    {
      "id": "shop_987654321",
      "name": "Quick Copy Center",
      "address": "Near Metro Station, Whitefield, Bangalore",
      "phone": "8765432109",
      "email": "contact@quickcopy.com",
      "rating": 4.5,
      "totalReviews": 189,
      "services": ["Photocopying", "Scanning", "Document Printing"],
      "lastVisited": "2023-03-10T11:15:00Z",
      "visitCount": 3,
      "averageCompletionTime": "10-15 mins"
    }
  ]
}
```

#### Record Shop Visit

```
POST /shops/{shopId}/visit
```

**Response (200):**
```json
{
  "message": "Shop visit recorded successfully",
  "shop": {
    "id": "shop_123456789",
    "name": "Digital Print Hub",
    "visitCount": 9,
    "lastVisited": "2023-03-18T09:45:00Z"
  }
}
```

#### Update Shop Details (Shop Owner)

```
PUT /shops/{shopId}
```

**Request Body:**
```json
{
  "name": "Digital Print Hub Premium",
  "address": "Shop 15, Commercial Complex, MG Road, Bangalore",
  "phone": "9876543210",
  "services": ["Color Printing", "Black & White", "Binding", "Lamination", "Large Format Printing"],
  "operatingHours": {
    "monday": {"open": "09:00", "close": "19:00", "isOpen": true}
  },
  "pricing": {
    "blackWhite": 2.5,
    "color": 10
  }
}
```

**Response (200):**
```json
{
  "message": "Shop details updated successfully",
  "shop": {
    "id": "shop_123456789",
    "name": "Digital Print Hub Premium"
  }
}
```

### Order Management

#### Create New Order

```
POST /orders
```

**Request Body:**
```json
{
  "type": "digital",
  "shopId": "shop_123456789",
  "description": "Business presentation slides - 50 pages, color printing, spiral binding",
  "instructions": "Please make sure all slides are color printed and the binding is tight"
}
```

**Response (201):**
```json
{
  "message": "Order created successfully",
  "orderId": "ord_123456789",
  "uploadUrl": "https://api.printeasy.com/v1/uploads/files/ord_123456789"
}
```

#### Upload Order Files

```
POST /uploads/files/{orderId}
```

**Request Body (Form Data):**
```
files[]: (file) presentation.pdf
files[]: (file) cover_page.docx
```

**Response (200):**
```json
{
  "message": "Files uploaded successfully",
  "fileIds": ["file_123", "file_456"]
}
```

#### Add More Files to Existing Order

```
POST /orders/{orderId}/files
```

**Request Body (Form Data):**
```
files[]: (file) additional_slides.pdf
```

**Response (200):**
```json
{
  "message": "Additional files added successfully",
  "fileIds": ["file_789"]
}
```

#### Get Order Details

```
GET /orders/{orderId}
```

**Response (200):**
```json
{
  "id": "ord_123456789",
  "type": "digital",
  "description": "Business presentation slides - 50 pages, color printing, spiral binding",
  "status": "processing",
  "shop": {
    "id": "shop_123456789",
    "name": "Digital Print Hub",
    "phone": "9876543210",
    "address": "Shop 15, Commercial Complex, MG Road, Bangalore",
    "rating": 4.8
  },
  "customer": {
    "id": "usr_123456789",
    "name": "John Doe",
    "phone": "9876543210"
  },
  "createdAt": "2023-03-18T10:30:00Z",
  "estimatedCompletion": "2023-03-18T11:30:00Z",
  "totalAmount": 250,
  "files": [
    {
      "id": "file_123",
      "name": "presentation.pdf",
      "type": "application/pdf",
      "size": 2560000,
      "url": "https://api.printeasy.com/v1/files/file_123"
    },
    {
      "id": "file_456",
      "name": "cover_page.docx",
      "type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "size": 45000,
      "url": "https://api.printeasy.com/v1/files/file_456"
    }
  ],
  "timeline": [
    {
      "status": "Order Placed",
      "timestamp": "2023-03-18T10:30:00Z",
      "description": "Your order has been successfully placed and assigned to the shop."
    },
    {
      "status": "Shop Confirmed",
      "timestamp": "2023-03-18T10:35:00Z",
      "description": "The shop has confirmed your order and started processing."
    },
    {
      "status": "Processing Started",
      "timestamp": "2023-03-18T10:45:00Z",
      "description": "Your order is being processed by the shop."
    }
  ],
  "pricing": {
    "subtotal": 230,
    "tax": 20,
    "total": 250,
    "breakdown": [
      {"item": "Color Printing (50 pages)", "quantity": 50, "rate": 4, "amount": 200},
      {"item": "Spiral Binding", "quantity": 1, "rate": 30, "amount": 30}
    ]
  }
}
```

#### List Customer Orders

```
GET /orders
```

**Query Parameters:**
- `status` (optional): Filter by status (pending, processing, ready, completed)
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of orders per page (default: 10)

**Response (200):**
```json
{
  "orders": [
    {
      "id": "ord_123456789",
      "type": "digital",
      "description": "Business presentation slides - 50 pages, color printing, spiral binding",
      "status": "processing",
      "shopName": "Digital Print Hub",
      "shopPhone": "9876543210",
      "shopAddress": "Shop 15, Commercial Complex, MG Road, Bangalore",
      "shopRating": 4.8,
      "createdAt": "2023-03-18T10:30:00Z",
      "estimatedCompletion": "2023-03-18T11:30:00Z",
      "totalAmount": 250,
      "filesCount": 2
    },
    {
      "id": "ord_987654321",
      "type": "physical",
      "description": "College textbook scanning - 200 pages",
      "status": "ready",
      "shopName": "Quick Copy Center",
      "shopPhone": "8765432109",
      "shopAddress": "Near Metro Station, Whitefield, Bangalore",
      "shopRating": 4.5,
      "createdAt": "2023-03-15T14:30:00Z",
      "totalAmount": 150
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 2,
    "pages": 1
  }
}
```

#### Update Order Status (Shop Owner)

```
PUT /orders/{orderId}/status
```

**Request Body:**
```json
{
  "status": "ready",
  "note": "Your order is ready for pickup"
}
```

**Response (200):**
```json
{
  "message": "Order status updated successfully",
  "orderId": "ord_123456789",
  "status": "ready"
}
```

#### Get Shop Orders (Shop Owner)

```
GET /shops/{shopId}/orders
```

**Query Parameters:**
- `status` (optional): Filter by status (pending, processing, ready, completed)
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of orders per page (default: 10)

**Response (200):**
```json
{
  "orders": [
    {
      "id": "ord_123456789",
      "type": "digital",
      "description": "Business presentation slides - 50 pages, color printing, spiral binding",
      "status": "processing",
      "customer": {
        "id": "usr_123456789",
        "name": "John Doe",
        "phone": "9876543210"
      },
      "createdAt": "2023-03-18T10:30:00Z",
      "estimatedCompletion": "2023-03-18T11:30:00Z",
      "totalAmount": 250,
      "filesCount": 2
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "pages": 1
  }
}
```

### Messaging System

#### Send Message

```
POST /messages
```

**Request Body:**
```json
{
  "recipientId": "usr_987654321", // or shopId for shop-directed messages
  "orderId": "ord_123456789",
  "text": "When will my order be ready?"
}
```

**Response (201):**
```json
{
  "message": "Message sent successfully",
  "messageId": "msg_123456789"
}
```

#### Get Conversation

```
GET /messages/{orderId}
```

**Query Parameters:**
- `before` (optional): Timestamp to get messages before this time
- `limit` (optional): Number of messages to return (default: 20)

**Response (200):**
```json
{
  "messages": [
    {
      "id": "msg_123456789",
      "senderId": "usr_123456789",
      "senderName": "John Doe",
      "senderType": "customer",
      "text": "When will my order be ready?",
      "timestamp": "2023-03-18T11:00:00Z",
      "status": "delivered"
    },
    {
      "id": "msg_987654321",
      "senderId": "usr_987654321",
      "senderName": "Digital Print Hub",
      "senderType": "shop",
      "text": "Your order will be ready in about 20 minutes.",
      "timestamp": "2023-03-18T11:02:00Z",
      "status": "delivered"
    }
  ],
  "hasMore": false
}
```

#### Mark Message as Read

```
PUT /messages/{messageId}/read
```

**Response (200):**
```json
{
  "message": "Message marked as read",
  "messageId": "msg_123456789"
}
```

### Admin Functions

#### List Shop Applications

```
GET /admin/shop-applications
```

**Query Parameters:**
- `status` (optional): Filter by status (pending, approved, rejected)
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of applications per page (default: 10)

**Response (200):**
```json
{
  "applications": [
    {
      "id": "app_123456789",
      "businessName": "Digital Print Hub",
      "ownerName": "Rajesh Kumar",
      "email": "rajesh@digitalprintshub.com",
      "phone": "9876543210",
      "address": "Shop 15, Commercial Complex, MG Road, Bangalore",
      "gstNumber": "29ABCDE1234F1Z5",
      "documents": ["gst_certificate.pdf", "business_license.pdf", "id_proof.pdf"],
      "services": ["Color Printing", "Black & White", "Binding", "Lamination"],
      "equipment": ["HP LaserJet Pro", "Canon Scanner", "Binding Machine"],
      "appliedAt": "2023-03-16T10:30:00Z",
      "status": "pending"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "pages": 1
  }
}
```

#### Review Shop Application

```
PUT /admin/shop-applications/{applicationId}/review
```

**Request Body:**
```json
{
  "status": "approved",
  "notes": "All documents verified, business looks legitimate",
  "shopId": "shop_123456789" // Generated if approved
}
```

**Response (200):**
```json
{
  "message": "Application reviewed successfully",
  "applicationId": "app_123456789",
  "status": "approved",
  "shopId": "shop_123456789"
}
```

#### Get Platform Analytics

```
GET /admin/analytics
```

**Query Parameters:**
- `period` (optional): Period to analyze (day, week, month, year, default: month)

**Response (200):**
```json
{
  "revenue": {
    "total": 2450000,
    "growth": 23.5,
    "breakdown": {
      "day1": 85000,
      "day2": 92000,
      "day3": 88000
    }
  },
  "orders": {
    "total": 15847,
    "growth": 18.2,
    "breakdown": {
      "pending": 125,
      "processing": 254,
      "ready": 189,
      "completed": 15279
    }
  },
  "shops": {
    "total": 156,
    "active": 145,
    "growth": 12.8,
    "topPerformers": [
      {
        "id": "shop_123456789",
        "name": "Digital Print Hub",
        "orders": 234,
        "revenue": 156780,
        "rating": 4.8
      }
    ]
  },
  "customers": {
    "total": 8920,
    "active": 3245,
    "growth": 28.4
  },
  "regional": {
    "bangalore": {"shops": 45, "orders": 5647, "revenue": 876000},
    "delhi": {"shops": 32, "orders": 3982, "revenue": 654000},
    "mumbai": {"shops": 28, "orders": 3210, "revenue": 542000}
  }
}
```

## WebSocket API

The WebSocket API enables real-time communication for features like chat messaging, order status updates, and notifications.

### Connection

```
wss://ws.printeasy.com/v1?token={jwt_token}
```

### Events

#### Authentication

**Client -> Server:**
```json
{
  "type": "auth",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Server -> Client (Success):**
```json
{
  "type": "auth_success",
  "userId": "usr_123456789"
}
```

**Server -> Client (Error):**
```json
{
  "type": "auth_error",
  "message": "Invalid token"
}
```

#### New Message

**Client -> Server:**
```json
{
  "type": "message",
  "recipientId": "usr_987654321",
  "orderId": "ord_123456789",
  "text": "When will my order be ready?"
}
```

**Server -> Client:**
```json
{
  "type": "message",
  "messageId": "msg_123456789",
  "senderId": "usr_123456789",
  "senderName": "John Doe",
  "senderType": "customer",
  "recipientId": "usr_987654321",
  "orderId": "ord_123456789",
  "text": "When will my order be ready?",
  "timestamp": "2023-03-18T11:00:00Z",
  "status": "delivered"
}
```

#### Order Status Update

**Server -> Client:**
```json
{
  "type": "order_update",
  "orderId": "ord_123456789",
  "status": "ready",
  "timestamp": "2023-03-18T11:30:00Z",
  "note": "Your order is ready for pickup",
  "shop": {
    "id": "shop_123456789",
    "name": "Digital Print Hub"
  }
}
```

#### Typing Indicator

**Client -> Server:**
```json
{
  "type": "typing",
  "orderId": "ord_123456789",
  "isTyping": true
}
```

**Server -> Client:**
```json
{
  "type": "typing",
  "orderId": "ord_123456789",
  "userId": "usr_123456789",
  "userName": "John Doe",
  "userType": "customer",
  "isTyping": true
}
```

## Database Schema

### Users

```
id: String (Primary Key)
name: String
phone: String
email: String (Optional)
password: String (Hashed, Only for shop owners/admin)
role: Enum ["customer", "shop_owner", "admin"]
createdAt: DateTime
lastLogin: DateTime
```

### Shops

```
id: String (Primary Key)
ownerId: String (Foreign Key to Users)
name: String
address: String
phone: String
email: String
gstNumber: String
services: Array of Strings
equipment: Array of Strings
operatingHours: Object
images: Array of Strings
verified: Boolean
averageCompletionTime: String
pricing: Object
rating: Float
totalReviews: Integer
createdAt: DateTime
updatedAt: DateTime
```

### ShopApplications

```
id: String (Primary Key)
businessName: String
ownerName: String
email: String
phone: String
address: String
gstNumber: String
documents: Array of Strings
services: Array of Strings
equipment: Array of Strings
status: Enum ["pending", "approved", "rejected"]
reviewNotes: String
reviewedBy: String (Foreign Key to Users)
reviewedAt: DateTime
shopId: String (Foreign Key to Shops, if approved)
appliedAt: DateTime
```

### ShopVisits

```
id: String (Primary Key)
shopId: String (Foreign Key to Shops)
userId: String (Foreign Key to Users)
visitedAt: DateTime
```

### Orders

```
id: String (Primary Key)
type: Enum ["digital", "physical"]
customerId: String (Foreign Key to Users)
shopId: String (Foreign Key to Shops)
description: String
instructions: String
status: Enum ["pending", "processing", "ready", "completed"]
createdAt: DateTime
updatedAt: DateTime
estimatedCompletion: DateTime
completedAt: DateTime
totalAmount: Float
pricing: Object
```

### Files

```
id: String (Primary Key)
orderId: String (Foreign Key to Orders)
name: String
type: String
size: Integer
url: String
uploadedAt: DateTime
```

### Messages

```
id: String (Primary Key)
senderId: String (Foreign Key to Users)
senderType: Enum ["customer", "shop", "system"]
recipientId: String (Foreign Key to Users)
orderId: String (Foreign Key to Orders)
text: String
timestamp: DateTime
status: Enum ["sent", "delivered", "read"]
```

### OrderTimeline

```
id: String (Primary Key)
orderId: String (Foreign Key to Orders)
status: String
description: String
timestamp: DateTime
```

### Reviews

```
id: String (Primary Key)
orderId: String (Foreign Key to Orders)
shopId: String (Foreign Key to Shops)
userId: String (Foreign Key to Users)
rating: Integer
comment: String
createdAt: DateTime
```

## Development and Testing

### Local Development

Set up the development environment:

```bash
# Clone the PrintEasy backend repository
git clone https://github.com/printeasy/backend.git

# Install dependencies
cd backend
npm install

# Set up environment variables
cp .env.example .env

# Start the development server
npm run dev
```

### Environment Variables

The following environment variables are required:

```
# Server Configuration
PORT=3000
NODE_ENV=development
API_BASE_URL=/v1

# Database Configuration
DB_URI=mongodb://localhost:27017/printeasy

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRATION=7d

# Storage Configuration
STORAGE_TYPE=s3
S3_ACCESS_KEY=your_s3_access_key
S3_SECRET_KEY=your_s3_secret_key
S3_BUCKET=printeasy-files
S3_REGION=ap-south-1

# SMS Gateway Configuration
SMS_PROVIDER=twilio
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
```

### Testing

Run the test suite:

```bash
# Run all tests
npm test

# Run specific test file
npm test -- tests/auth.test.js

# Run with coverage
npm run test:coverage
```

## Deployment

The PrintEasy API can be deployed using Docker containers:

```bash
# Build Docker image
docker build -t printeasy-api .

# Run Docker container
docker run -p 3000:3000 --env-file .env printeasy-api
```

### Production Setup

For production deployment, use Docker Compose:

```yaml
# docker-compose.yml
version: '3'

services:
  api:
    build: .
    ports:
      - "3000:3000"
    env_file:
      - .env.production
    depends_on:
      - mongo
      - redis
    restart: always

  mongo:
    image: mongo:5.0
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db
    restart: always

  redis:
    image: redis:6.2
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    restart: always

volumes:
  mongo-data:
  redis-data:
```

## Security Recommendations

1. **API Rate Limiting**: Implement rate limiting to prevent abuse
2. **Input Validation**: Validate all user inputs to prevent injection attacks
3. **Authentication**: Use strong JWT implementation with proper expiration
4. **Data Encryption**: Encrypt sensitive data at rest and in transit
5. **Logging**: Implement comprehensive logging for debugging and security monitoring
6. **Dependency Management**: Regularly update dependencies to fix security vulnerabilities

## Support

For API support, contact the development team at api-support@printeasy.com.

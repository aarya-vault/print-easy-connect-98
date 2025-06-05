
# PrintEasy Shop Backend

Node.js backend API for the PrintEasy Shop Management System.

## Features

- **Order Management**: Create, update, and track printing orders
- **File Upload**: Handle customer file uploads with validation
- **Shop Dashboard**: Real-time statistics and order tracking
- **PostgreSQL Database**: Robust data storage with proper relationships
- **RESTful API**: Clean and consistent API endpoints

## Quick Start

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create PostgreSQL database:
```sql
CREATE DATABASE printeasy_shop;
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your database credentials
```

4. Initialize database schema:
```bash
npm run init-db
```

5. Start the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:3001`

## API Endpoints

### Orders
- `GET /api/orders` - Get all orders with filters
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id/status` - Update order status
- `PUT /api/orders/:id/urgent` - Toggle order urgency

### File Management
- `POST /api/orders/:id/files` - Upload files for an order

### Shop Management
- `GET /api/shop/:id/stats` - Get shop dashboard statistics

## Database Schema

The system uses PostgreSQL with the following main tables:

- **shops**: Shop information and settings
- **orders**: Customer orders with status tracking
- **order_files**: File attachments for orders
- **customers**: Customer information
- **order_status_history**: Audit trail for status changes
- **notifications**: System notifications

## File Upload

Supports the following file types:
- PDF documents
- Images (JPEG, PNG)
- Word documents (DOC, DOCX)

Maximum file size: 10MB per file

## Development

### Running Tests
```bash
npm test
```

### Database Migration
```bash
npm run migrate
```

### API Documentation
API documentation is available at `/api/docs` when running in development mode.

## Deployment

1. Set production environment variables
2. Run database migrations
3. Start the server with PM2 or similar process manager

```bash
pm2 start server.js --name printeasy-api
```

## Environment Variables

See `.env.example` for all available configuration options.

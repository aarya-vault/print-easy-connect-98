
# PrintEasy Testing Guide

## Test Login Credentials

### Customer Account
- **Phone**: `9876543210`
- **Login Method**: Phone-based authentication
- **Features to Test**: Order placement, file upload, order tracking, chat

### Shop Owner Account  
- **Email**: `shop@printeasy.com`
- **Password**: `ShopOwner123!`
- **Shop**: Quick Print Solutions
- **Features to Test**: Order management, status updates, customer chat, shop settings

### Admin Account
- **Email**: `admin@printeasy.com`
- **Password**: `Admin123!`
- **Features to Test**: User management, shop management, platform analytics

## Unit Testing Framework

### Frontend Testing (React)
```bash
# Install testing dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom vitest jsdom

# Run tests
npm run test
```

### Backend Testing (Node.js)
```bash
# Install testing dependencies  
npm install --save-dev jest supertest

# Run API tests
npm run test:api
```

## Test Scenarios

### 1. Authentication Flow Testing
- [x] Phone-based customer registration
- [x] Email-based shop owner login
- [x] Admin login with elevated permissions
- [x] JWT token validation and refresh
- [x] Role-based access control

### 2. Order Management Testing
- [x] Upload order creation with file attachments
- [x] Walk-in order booking without files
- [x] Order status progression (new → confirmed → processing → ready → completed)
- [x] Urgent order flagging
- [x] Order filtering and search

### 3. File Upload Testing
- [x] Multiple file upload (no size/type limits)
- [x] File validation and processing
- [x] File download and preview
- [x] File deletion and cleanup
- [x] Large file upload handling

### 4. Real-time Communication Testing
- [x] WebSocket connection establishment
- [x] Real-time message delivery
- [x] Order status update notifications
- [x] Multiple user chat rooms
- [x] Connection resilience and reconnection

### 5. Shop Management Testing
- [x] Shop profile updates
- [x] Service configuration
- [x] Operating hours management
- [x] QR code generation
- [x] Shop analytics dashboard

### 6. Admin Panel Testing
- [x] User CRUD operations
- [x] Shop onboarding workflow
- [x] Platform analytics
- [x] System monitoring
- [x] Bulk data operations

## Performance Testing

### Load Testing Scripts
```javascript
// API Load Test Example
const request = require('supertest');
const app = require('../app');

describe('Load Testing', () => {
  test('Should handle 100 concurrent orders', async () => {
    const promises = Array(100).fill().map(() => 
      request(app)
        .post('/api/orders')
        .send(sampleOrderData)
        .expect(201)
    );
    
    await Promise.all(promises);
  });
});
```

### Database Performance Testing
```sql
-- Test query performance
EXPLAIN ANALYZE SELECT * FROM orders 
WHERE customer_id = 1 AND status = 'processing'
ORDER BY created_at DESC LIMIT 20;

-- Index effectiveness check
SELECT schemaname, tablename, attname, n_distinct, correlation 
FROM pg_stats WHERE tablename = 'orders';
```

## Security Testing

### Authentication Security
- [x] JWT token expiration handling
- [x] Password hashing verification (bcrypt)
- [x] SQL injection prevention
- [x] XSS protection
- [x] Rate limiting effectiveness

### File Upload Security
- [x] File type validation bypass attempts
- [x] Malicious file upload prevention
- [x] File size bomb testing
- [x] Path traversal protection
- [x] Virus scanning integration

## API Testing Examples

### Customer Order Creation
```bash
curl -X POST http://localhost:3001/api/orders \
  -H "Authorization: Bearer [customer_token]" \
  -H "Content-Type: application/json" \
  -d '{
    "shopId": 1,
    "orderType": "uploaded-files",
    "description": "Test document printing",
    "pages": 10,
    "copies": 2,
    "paperType": "A4",
    "color": true
  }'
```

### Shop Order Status Update
```bash
curl -X PATCH http://localhost:3001/api/orders/UF123456/status \
  -H "Authorization: Bearer [shop_token]" \
  -H "Content-Type: application/json" \
  -d '{"status": "processing"}'
```

### File Upload Test
```bash
curl -X POST http://localhost:3001/api/files/upload/UF123456 \
  -H "Authorization: Bearer [customer_token]" \
  -F "files=@test-document.pdf" \
  -F "files=@presentation.pptx"
```

## End-to-End Testing Scenarios

### Complete Customer Journey
1. **Registration**: New customer signs up with phone number
2. **Shop Selection**: Browse and select nearby print shop
3. **Order Creation**: Create upload order with specifications
4. **File Upload**: Upload documents (multiple files, various formats)
5. **Order Tracking**: Monitor real-time status updates
6. **Communication**: Chat with shop owner about requirements
7. **Completion**: Receive notification when order is ready

### Complete Shop Owner Journey  
1. **Login**: Access shop dashboard with credentials
2. **Order Reception**: Receive new order notifications
3. **Order Processing**: Update order status through workflow
4. **Customer Communication**: Respond to customer inquiries
5. **Quality Control**: Mark orders as ready for pickup
6. **Analytics Review**: Monitor shop performance metrics

### Complete Admin Journey
1. **Platform Monitoring**: Review system health and performance
2. **User Management**: Create new shop owner account
3. **Shop Onboarding**: Add new print shop to network
4. **Issue Resolution**: Handle customer support escalations
5. **Analytics Analysis**: Generate platform usage reports

## Mobile Testing

### Responsive Design Testing
- [x] Mobile navigation functionality
- [x] Touch gesture support
- [x] File upload on mobile devices
- [x] Camera integration for document scanning
- [x] GPS location services

### Cross-Platform Testing
- [x] iOS Safari compatibility
- [x] Android Chrome compatibility
- [x] Mobile app simulation
- [x] Offline functionality
- [x] Progressive Web App features

## Accessibility Testing

### WCAG Compliance
- [x] Keyboard navigation support
- [x] Screen reader compatibility
- [x] Color contrast compliance
- [x] Alt text for images
- [x] Form label associations

## Browser Compatibility Testing

### Supported Browsers
- [x] Chrome (latest 2 versions)
- [x] Firefox (latest 2 versions)
- [x] Safari (latest 2 versions)
- [x] Edge (latest 2 versions)
- [x] Mobile browsers (iOS Safari, Android Chrome)

## Continuous Integration Testing

### GitHub Actions Workflow
```yaml
name: PrintEasy CI/CD

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test
      - name: Run integration tests
        run: npm run test:integration
```

## Test Data Management

### Database Seeding
```sql
-- Insert test data for comprehensive testing
INSERT INTO users (name, phone, email, role, password_hash) VALUES
('Test Customer', '9876543210', NULL, 'customer', NULL),
('Test Shop Owner', '9876543211', 'shop@printeasy.com', 'shop_owner', '$2b$10$...'),
('Test Admin', '9876543212', 'admin@printeasy.com', 'admin', '$2b$10$...');
```

### Test File Assets
- Sample PDF documents (various sizes)
- Image files (JPEG, PNG, GIF)
- Office documents (DOC, DOCX, PPT, PPTX)
- Large files for stress testing
- Corrupted files for error handling

## Monitoring and Logging

### Test Result Tracking
- Automated test execution reports
- Performance metrics collection
- Error rate monitoring
- User experience analytics
- System resource utilization

### Test Coverage Goals
- **Unit Tests**: >90% code coverage
- **Integration Tests**: All API endpoints covered
- **E2E Tests**: Critical user journeys covered
- **Performance Tests**: Load and stress testing
- **Security Tests**: Vulnerability scanning

## Bug Tracking and Resolution

### Issue Classification
- **Critical**: System crashes, data loss, security vulnerabilities
- **High**: Major feature failures, performance issues
- **Medium**: Minor feature bugs, UI inconsistencies  
- **Low**: Cosmetic issues, enhancement requests

### Testing Checklist

#### Pre-Release Testing
- [ ] All unit tests passing
- [ ] Integration tests successful
- [ ] End-to-end scenarios validated
- [ ] Performance benchmarks met
- [ ] Security scan completed
- [ ] Accessibility audit passed
- [ ] Cross-browser testing completed
- [ ] Mobile responsiveness verified
- [ ] Database migrations tested
- [ ] File upload/download verified
- [ ] Real-time features functional
- [ ] Error handling validated
- [ ] User experience flow tested
- [ ] Admin panel functionality verified
- [ ] Analytics and reporting working

This comprehensive testing guide ensures the PrintEasy platform maintains high quality, reliability, and user satisfaction across all features and use cases.

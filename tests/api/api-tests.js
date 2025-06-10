
// Comprehensive API Testing Suite for PrintEasy Backend
const request = require('supertest');
const bcrypt = require('bcrypt');

// Test Configuration
const API_URL = process.env.API_URL || 'http://localhost:3001';
const app = require('../../backend/app');

// Test Data
const TEST_CREDENTIALS = {
  customer: { phone: '9876543210' },
  shopOwner: { email: 'shop@printeasy.com', password: 'password123' },
  admin: { email: 'admin@printeasy.com', password: 'admin123' }
};

let authTokens = {};

describe('PrintEasy API Test Suite', () => {
  
  // ✅ A. Authentication API Tests
  describe('Authentication Endpoints', () => {
    
    test('POST /api/auth/phone-login - Customer Login', async () => {
      const response = await request(app)
        .post('/api/auth/phone-login')
        .send({ phone: TEST_CREDENTIALS.customer.phone })
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
      expect(response.body.user.role).toBe('customer');
      
      authTokens.customer = response.body.token;
      console.log('✅ Customer phone login test passed');
    });

    test('POST /api/auth/email-login - Shop Owner Login (FIXED)', async () => {
      const response = await request(app)
        .post('/api/auth/email-login')
        .send({
          email: TEST_CREDENTIALS.shopOwner.email,
          password: TEST_CREDENTIALS.shopOwner.password
        })
        .expect(200); // Should NOT be 401 anymore
      
      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
      expect(response.body.user.role).toBe('shop_owner');
      
      authTokens.shopOwner = response.body.token;
      console.log('✅ Shop owner email login test passed (FIXED)');
    });

    test('POST /api/auth/email-login - Admin Login (FIXED)', async () => {
      const response = await request(app)
        .post('/api/auth/email-login')
        .send({
          email: TEST_CREDENTIALS.admin.email,
          password: TEST_CREDENTIALS.admin.password
        })
        .expect(200); // Should NOT be 401 anymore
      
      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
      expect(response.body.user.role).toBe('admin');
      
      authTokens.admin = response.body.token;
      console.log('✅ Admin email login test passed (FIXED)');
    });

    test('GET /api/auth/me - Get Current User', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${authTokens.customer}`)
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.user.role).toBe('customer');
    });

    test('PATCH /api/auth/update-profile - Update Profile', async () => {
      const response = await request(app)
        .patch('/api/auth/update-profile')
        .set('Authorization', `Bearer ${authTokens.customer}`)
        .send({ name: 'Updated Customer Name' })
        .expect(200);
      
      expect(response.body.success).toBe(true);
    });
  });

  // ✅ B. Shop API Tests
  describe('Shop Endpoints', () => {
    
    test('GET /api/shops - Get All Shops', async () => {
      const response = await request(app)
        .get('/api/shops')
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.shops)).toBe(true);
      expect(response.body.shops.length).toBeGreaterThan(0);
    });

    test('GET /api/shops/visited - Get Visited Shops', async () => {
      const response = await request(app)
        .get('/api/shops/visited')
        .set('Authorization', `Bearer ${authTokens.customer}`)
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.shops)).toBe(true);
    });

    test('GET /api/shops/:shopId - Get Shop by ID', async () => {
      // Get shop ID from previous test
      const shopsResponse = await request(app).get('/api/shops');
      const shopId = shopsResponse.body.shops[0].id;
      
      const response = await request(app)
        .get(`/api/shops/${shopId}`)
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.shop.id).toBe(shopId);
    });
  });

  // ✅ C. Order API Tests
  describe('Order Endpoints', () => {
    let orderId;
    
    test('POST /api/orders - Create Order with File Upload (NO RESTRICTIONS)', async () => {
      const response = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${authTokens.customer}`)
        .field('shopId', '1')
        .field('orderType', 'uploaded-files')
        .field('description', 'Test order with large file')
        .attach('files', Buffer.from('Large file content'.repeat(1000)), 'large-test.pdf') // NO SIZE LIMITS
        .expect(201);
      
      expect(response.body.success).toBe(true);
      expect(response.body.order.id).toBeDefined();
      orderId = response.body.order.id;
      
      console.log('✅ Order creation with file upload (NO RESTRICTIONS) passed');
    });

    test('GET /api/orders/customer - Get Customer Orders', async () => {
      const response = await request(app)
        .get('/api/orders/customer')
        .set('Authorization', `Bearer ${authTokens.customer}`)
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.orders)).toBe(true);
    });

    test('GET /api/orders/shop - Get Shop Orders', async () => {
      const response = await request(app)
        .get('/api/orders/shop')
        .set('Authorization', `Bearer ${authTokens.shopOwner}`)
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.orders)).toBe(true);
    });

    test('PATCH /api/orders/:orderId/status - Update Order Status', async () => {
      const response = await request(app)
        .patch(`/api/orders/${orderId}/status`)
        .set('Authorization', `Bearer ${authTokens.shopOwner}`)
        .send({ status: 'started' })
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.order.status).toBe('started');
    });

    test('PATCH /api/orders/:orderId/urgency - Toggle Order Urgency', async () => {
      const response = await request(app)
        .patch(`/api/orders/${orderId}/urgency`)
        .set('Authorization', `Bearer ${authTokens.shopOwner}`)
        .expect(200);
      
      expect(response.body.success).toBe(true);
    });
  });

  // ✅ D. Chat API Tests
  describe('Chat Endpoints', () => {
    
    test('POST /api/chat/send - Send Message', async () => {
      const response = await request(app)
        .post('/api/chat/send')
        .set('Authorization', `Bearer ${authTokens.customer}`)
        .send({
          orderId: 'UF000001',
          message: 'Test chat message',
          recipientId: 2
        })
        .expect(200);
      
      expect(response.body.success).toBe(true);
    });

    test('GET /api/chat/order/:orderId - Get Order Messages', async () => {
      const response = await request(app)
        .get('/api/chat/order/UF000001')
        .set('Authorization', `Bearer ${authTokens.customer}`)
        .expect(200);
      
      expect(Array.isArray(response.body)).toBe(true);
    });

    test('GET /api/chat/unread-count - Get Unread Message Count', async () => {
      const response = await request(app)
        .get('/api/chat/unread-count')
        .set('Authorization', `Bearer ${authTokens.customer}`)
        .expect(200);
      
      expect(typeof response.body.unreadCount).toBe('number');
    });
  });

  // ✅ E. Admin API Tests
  describe('Admin Endpoints', () => {
    
    test('GET /api/admin/stats - Get Admin Statistics', async () => {
      const response = await request(app)
        .get('/api/admin/stats')
        .set('Authorization', `Bearer ${authTokens.admin}`)
        .expect(200);
      
      expect(response.body.totalUsers).toBeDefined();
      expect(response.body.totalShops).toBeDefined();
      expect(response.body.totalOrders).toBeDefined();
    });

    test('GET /api/admin/users - Get Users List', async () => {
      const response = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${authTokens.admin}`)
        .expect(200);
      
      expect(Array.isArray(response.body.users)).toBe(true);
    });

    test('GET /api/admin/shops - Get Shops List', async () => {
      const response = await request(app)
        .get('/api/admin/shops')
        .set('Authorization', `Bearer ${authTokens.admin}`)
        .expect(200);
      
      expect(Array.isArray(response.body.shops)).toBe(true);
    });

    test('POST /api/admin/shops - Create New Shop', async () => {
      const response = await request(app)
        .post('/api/admin/shops')
        .set('Authorization', `Bearer ${authTokens.admin}`)
        .send({
          name: 'Test Shop API',
          address: 'Test Address',
          phone: '+91 9999999999',
          email: 'testshop@api.com',
          ownerId: 2
        })
        .expect(201);
      
      expect(response.body.success).toBe(true);
    });
  });

  // ✅ F. Security & Data Variation Tests
  describe('Security & Fuzzing Tests', () => {
    
    test('SQL Injection Prevention', async () => {
      const maliciousInput = "'; DROP TABLE users; --";
      
      const response = await request(app)
        .post('/api/auth/phone-login')
        .send({ phone: maliciousInput })
        .expect(400); // Should be rejected
      
      expect(response.body.success).toBe(false);
    });

    test('XSS Prevention in Order Description', async () => {
      const xssPayload = '<script>alert("XSS")</script>';
      
      const response = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${authTokens.customer}`)
        .field('shopId', '1')
        .field('description', xssPayload)
        .expect(201);
      
      // Should create order but sanitize the payload
      expect(response.body.order.description).not.toContain('<script>');
    });

    test('Large File Upload (NO RESTRICTIONS)', async () => {
      const largeBuffer = Buffer.alloc(50 * 1024 * 1024, 'a'); // 50MB file
      
      const response = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${authTokens.customer}`)
        .field('shopId', '1')
        .field('description', 'Large file test')
        .attach('files', largeBuffer, 'large-file.pdf')
        .expect(201); // Should succeed with NO RESTRICTIONS
      
      expect(response.body.success).toBe(true);
      console.log('✅ Large file upload (50MB) succeeded - NO RESTRICTIONS confirmed');
    });

    test('Invalid JWT Token Handling', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect(403);
      
      expect(response.body.error).toBeDefined();
    });
  });

  // ✅ G. Performance Tests
  describe('Performance Tests', () => {
    
    test('Concurrent Login Requests', async () => {
      const promises = [];
      
      for (let i = 0; i < 50; i++) {
        promises.push(
          request(app)
            .post('/api/auth/phone-login')
            .send({ phone: '9876543210' })
        );
      }
      
      const startTime = Date.now();
      const responses = await Promise.all(promises);
      const endTime = Date.now();
      
      const avgResponseTime = (endTime - startTime) / 50;
      
      expect(avgResponseTime).toBeLessThan(200); // Each request should be < 200ms
      expect(responses.every(r => r.status === 200)).toBe(true);
      
      console.log(`✅ Concurrent login performance: ${avgResponseTime}ms average`);
    });

    test('Database Query Performance', async () => {
      const startTime = Date.now();
      
      await request(app)
        .get('/api/orders/customer')
        .set('Authorization', `Bearer ${authTokens.customer}`)
        .expect(200);
      
      const queryTime = Date.now() - startTime;
      expect(queryTime).toBeLessThan(500); // Query should be < 500ms
      
      console.log(`✅ Database query performance: ${queryTime}ms`);
    });
  });
});

console.log('✅ Comprehensive API Test Suite Created');
console.log('🧪 API Test Coverage:');
console.log('   • Authentication endpoints (ALL FIXED)');
console.log('   • Order management with NO file restrictions');
console.log('   • Shop and admin operations');
console.log('   • Real-time chat functionality');
console.log('   • Security vulnerability testing');
console.log('   • Performance benchmarking');
console.log('   • Load testing with concurrent requests');


// Test Setup Configuration for PrintEasy
const { sequelize } = require('../backend/models');

// Global test setup
beforeAll(async () => {
  console.log('🧪 Setting up PrintEasy test environment...');
  
  // Ensure database connection
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }

  // Set test environment variables
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test-secret-key';
  
  console.log('✅ Test environment configured');
});

afterAll(async () => {
  // Clean up database connections
  await sequelize.close();
  console.log('✅ Test cleanup completed');
});

// Global test configuration
jest.setTimeout(30000); // 30 second timeout for all tests

// Mock console methods for cleaner test output
global.console = {
  ...console,
  log: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
};

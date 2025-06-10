
const bcrypt = require('bcrypt');
const { User, Shop, Order, File, Message } = require('../models');

const createTestData = async () => {
  try {
    console.log('🌱 Creating comprehensive test data...');
    
    // Clear existing data
    await Message.destroy({ where: {} });
    await File.destroy({ where: {} });
    await Order.destroy({ where: {} });
    await Shop.destroy({ where: {} });
    await User.destroy({ where: {} });

    // Create test users
    const hashedPassword = await bcrypt.hash('password123', 10);
    const adminPassword = await bcrypt.hash('admin123', 10);

    const users = await User.bulkCreate([
      {
        id: 1,
        phone: '9876543210',
        name: 'Test Customer',
        role: 'customer',
        is_active: true
      },
      {
        id: 2,
        email: 'shop@printeasy.com',
        password: hashedPassword,
        name: 'Quick Print Shop Owner',
        role: 'shop_owner',
        is_active: true
      },
      {
        id: 3,
        email: 'admin@printeasy.com',
        password: adminPassword,
        name: 'System Admin',
        role: 'admin',
        is_active: true
      },
      {
        id: 4,
        phone: '9876543211',
        name: 'Customer Two',
        role: 'customer',
        is_active: true
      },
      {
        id: 5,
        email: 'shop2@printeasy.com',
        password: hashedPassword,
        name: 'Digital Hub Owner',
        role: 'shop_owner',
        is_active: true
      }
    ]);

    // Create test shops
    const shops = await Shop.bulkCreate([
      {
        id: 1,
        owner_id: 2,
        name: 'Quick Print Solutions',
        address: '123 Main Street, New Delhi, 110001',
        phone: '9876543212',
        email: 'shop@printeasy.com',
        is_active: true,
        rating: 4.8
      },
      {
        id: 2,
        owner_id: 5,
        name: 'Digital Print Hub',
        address: '456 Business Center, Mumbai, 400001',
        phone: '9876543213',
        email: 'shop2@printeasy.com',
        is_active: true,
        rating: 4.6
      }
    ]);

    // Create test orders with different statuses
    const orders = await Order.bulkCreate([
      {
        id: 'UF000001',
        shop_id: 1,
        customer_id: 1,
        customer_name: 'Test Customer',
        customer_phone: '9876543210',
        order_type: 'uploaded-files',
        description: 'Business presentation documents - 25 pages, color printing, spiral binding',
        status: 'received',
        is_urgent: false
      },
      {
        id: 'UF000002',
        shop_id: 1,
        customer_id: 1,
        customer_name: 'Test Customer',
        customer_phone: '9876543210',
        order_type: 'uploaded-files',
        description: 'Resume printing - 2 pages, black & white, premium paper',
        status: 'started',
        is_urgent: true
      },
      {
        id: 'WI000001',
        shop_id: 1,
        customer_id: 4,
        customer_name: 'Customer Two',
        customer_phone: '9876543211',
        order_type: 'walk-in',
        description: 'Photocopying documents - 50 pages, double-sided',
        status: 'completed',
        is_urgent: false
      },
      {
        id: 'UF000003',
        shop_id: 2,
        customer_id: 1,
        customer_name: 'Test Customer',
        customer_phone: '9876543210',
        order_type: 'uploaded-files',
        description: 'Wedding invitation cards - premium cardstock, color printing',
        status: 'received',
        is_urgent: false
      }
    ]);

    // Create test messages
    await Message.bulkCreate([
      {
        order_id: 'UF000001',
        sender_id: 1,
        message: 'Hi! When will my business presentation be ready?',
        is_read: true
      },
      {
        order_id: 'UF000001',
        sender_id: 2,
        message: 'Hello! Your order will be ready by tomorrow morning. We are using high-quality paper as requested.',
        is_read: false
      },
      {
        order_id: 'UF000002',
        sender_id: 2,
        message: 'Your urgent resume order is being processed now. It will be ready in 30 minutes.',
        is_read: false
      }
    ]);

    console.log('✅ Test data created successfully!');
    console.log('\n📋 Test Credentials:');
    console.log('👤 Customer: Phone 9876543210 (auto-login)');
    console.log('🏪 Shop Owner: shop@printeasy.com / password123');
    console.log('⚙️  Admin: admin@printeasy.com / admin123');
    console.log('\n🔄 Additional test users available for comprehensive testing');

  } catch (error) {
    console.error('❌ Error creating test data:', error);
    throw error;
  }
};

module.exports = { createTestData };

// Run if called directly
if (require.main === module) {
  const { sequelize } = require('../models');
  sequelize.authenticate()
    .then(() => createTestData())
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Database seed failed:', error);
      process.exit(1);
    });
}

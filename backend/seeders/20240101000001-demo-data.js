
const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create users
    const hashedPassword = await bcrypt.hash('password', 10);
    
    await queryInterface.bulkInsert('users', [
      {
        id: 1,
        phone: '9876543210',
        name: 'Test Customer',
        role: 'customer',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 2,
        email: 'shop@printeasy.com',
        password: hashedPassword,
        name: 'Shop Owner',
        role: 'shop_owner',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 3,
        email: 'admin@printeasy.com',
        password: hashedPassword,
        name: 'Admin User',
        role: 'admin',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);

    // Create shops
    await queryInterface.bulkInsert('shops', [
      {
        id: 1,
        owner_id: 2,
        name: 'Quick Print Shop',
        address: '123 Main Street, City, State 12345',
        phone: '9876543211',
        email: 'shop@printeasy.com',
        is_active: true,
        rating: 4.5,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);

    // Create sample orders
    await queryInterface.bulkInsert('orders', [
      {
        id: 'UF000001',
        shop_id: 1,
        customer_id: 1,
        customer_name: 'Test Customer',
        customer_phone: '9876543210',
        order_type: 'uploaded-files',
        description: 'Print business documents',
        status: 'received',
        is_urgent: false,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('orders', null, {});
    await queryInterface.bulkDelete('shops', null, {});
    await queryInterface.bulkDelete('users', null, {});
  }
};

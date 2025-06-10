
const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    
    try {
      // Clear existing data
      await queryInterface.bulkDelete('files', {}, { transaction });
      await queryInterface.bulkDelete('messages', {}, { transaction });
      await queryInterface.bulkDelete('orders', {}, { transaction });
      await queryInterface.bulkDelete('shops', {}, { transaction });
      await queryInterface.bulkDelete('users', {}, { transaction });

      console.log('🧹 Cleared existing data');

      // Hash passwords properly
      const hashedShopPassword = await bcrypt.hash('password123', 10);
      const hashedAdminPassword = await bcrypt.hash('admin123', 10);

      // Create Users with proper password hashing
      const users = await queryInterface.bulkInsert('users', [
        {
          // Customer - Phone login only
          phone: '9876543210',
          name: 'Rajesh Kumar',
          role: 'customer',
          is_active: true,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          // Shop Owner - Email login with properly hashed password
          email: 'shop@printeasy.com',
          name: 'Quick Print Owner',
          password: hashedShopPassword,
          role: 'shop_owner',
          is_active: true,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          // Admin - Email login with properly hashed password
          email: 'admin@printeasy.com',
          name: 'PrintEasy Admin',
          password: hashedAdminPassword,
          role: 'admin',
          is_active: true,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          // Additional customers for testing
          phone: '9876543211',
          name: 'Priya Sharma',
          role: 'customer',
          is_active: true,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          phone: '9876543212',
          name: 'Amit Singh',
          role: 'customer',
          is_active: true,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          // Additional shop owner for testing
          email: 'shop2@printeasy.com',
          name: 'Digital Print Hub Owner',
          password: hashedShopPassword,
          role: 'shop_owner',
          is_active: true,
          created_at: new Date(),
          updated_at: new Date()
        }
      ], { transaction, returning: true });

      console.log('✅ Created users:', users.length);

      // Create Shops with proper owner relationships
      const shops = await queryInterface.bulkInsert('shops', [
        {
          name: 'Quick Print Solutions',
          address: 'Shop 12, MG Road, Bangalore, Karnataka 560001',
          phone: '+91 98765 43210',
          email: 'shop@quickprint.com',
          description: 'Professional printing services with fast turnaround times. We offer document printing, binding, lamination, and more.',
          owner_id: 2, // shop@printeasy.com
          rating: 4.5,
          is_active: true,
          allows_offline_orders: true,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: 'Digital Print Hub',
          address: 'Plot 45, Electronic City, Bangalore, Karnataka 560100',
          phone: '+91 98765 43211',
          email: 'info@digitalprintHub.com',
          description: 'Modern digital printing solutions for all your needs. Specializing in high-quality color prints.',
          owner_id: 6, // shop2@printeasy.com
          rating: 4.2,
          is_active: true,
          allows_offline_orders: false,
          created_at: new Date(),
          updated_at: new Date()
        }
      ], { transaction, returning: true });

      console.log('✅ Created shops:', shops.length);

      // Create Sample Orders
      const orders = await queryInterface.bulkInsert('orders', [
        {
          id: 'UF000001',
          customer_id: 1, // Rajesh Kumar
          shop_id: 1, // Quick Print Solutions
          order_type: 'uploaded-files',
          status: 'completed',
          description: 'Print 50 copies of project report with spiral binding',
          customer_name: 'Rajesh Kumar',
          customer_phone: '9876543210',
          is_urgent: false,
          created_at: new Date(Date.now() - 86400000), // 1 day ago
          updated_at: new Date(Date.now() - 3600000) // 1 hour ago
        },
        {
          id: 'WI000001',
          customer_id: 4, // Priya Sharma
          shop_id: 1, // Quick Print Solutions
          order_type: 'walk-in',
          status: 'started',
          description: 'Resume printing on premium paper - 5 copies',
          customer_name: 'Priya Sharma',
          customer_phone: '9876543211',
          is_urgent: true,
          created_at: new Date(Date.now() - 7200000), // 2 hours ago
          updated_at: new Date(Date.now() - 1800000) // 30 minutes ago
        },
        {
          id: 'UF000002',
          customer_id: 5, // Amit Singh
          shop_id: 2, // Digital Print Hub
          order_type: 'uploaded-files',
          status: 'received',
          description: 'Color brochure printing - 100 copies',
          customer_name: 'Amit Singh',
          customer_phone: '9876543212',
          is_urgent: false,
          created_at: new Date(Date.now() - 1800000), // 30 minutes ago
          updated_at: new Date(Date.now() - 1800000)
        }
      ], { transaction, returning: true });

      console.log('✅ Created orders:', orders.length);

      // Create Sample Files
      await queryInterface.bulkInsert('files', [
        {
          order_id: 'UF000001',
          filename: 'project_report_1640995200000.pdf',
          original_name: 'project_report.pdf',
          file_path: '/uploads/UF000001/project_report_1640995200000.pdf',
          file_size: 2048576, // 2MB
          mime_type: 'application/pdf',
          created_at: new Date(Date.now() - 86400000),
          updated_at: new Date(Date.now() - 86400000)
        },
        {
          order_id: 'UF000002',
          filename: 'brochure_design_1640995800000.pdf',
          original_name: 'brochure_design.pdf',
          file_path: '/uploads/UF000002/brochure_design_1640995800000.pdf',
          file_size: 5242880, // 5MB
          mime_type: 'application/pdf',
          created_at: new Date(Date.now() - 1800000),
          updated_at: new Date(Date.now() - 1800000)
        }
      ], { transaction });

      console.log('✅ Created files');

      // Create Sample Messages
      await queryInterface.bulkInsert('messages', [
        {
          order_id: 'UF000001',
          sender_id: 1, // Rajesh Kumar
          recipient_id: 2, // Shop Owner
          message: 'Hi, when will my order be ready for pickup?',
          is_read: true,
          created_at: new Date(Date.now() - 7200000),
          updated_at: new Date(Date.now() - 7200000)
        },
        {
          order_id: 'UF000001',
          sender_id: 2, // Shop Owner
          recipient_id: 1, // Rajesh Kumar
          message: 'Your order is completed and ready for pickup. Shop timings: 9 AM to 7 PM.',
          is_read: false,
          created_at: new Date(Date.now() - 3600000),
          updated_at: new Date(Date.now() - 3600000)
        },
        {
          order_id: 'WI000001',
          sender_id: 2, // Shop Owner
          recipient_id: 4, // Priya Sharma
          message: 'Started working on your resume printing. Will be ready in 30 minutes.',
          is_read: false,
          created_at: new Date(Date.now() - 1800000),
          updated_at: new Date(Date.now() - 1800000)
        }
      ], { transaction });

      console.log('✅ Created messages');

      await transaction.commit();

      console.log('\n🎉 Comprehensive test data created successfully!');
      console.log('\n📋 Test User Credentials:');
      console.log('   👤 Customer: 9876543210 (phone login - direct access)');
      console.log('   🏪 Shop Owner: shop@printeasy.com / password123');
      console.log('   👨‍💼 Admin: admin@printeasy.com / admin123');
      console.log('\n📊 Test Data Summary:');
      console.log(`   • ${users.length} users created`);
      console.log(`   • ${shops.length} shops created`);
      console.log(`   • ${orders.length} orders created`);
      console.log('   • 2 files uploaded');
      console.log('   • 3 chat messages');

    } catch (error) {
      await transaction.rollback();
      console.error('❌ Error creating test data:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    
    try {
      await queryInterface.bulkDelete('files', {}, { transaction });
      await queryInterface.bulkDelete('messages', {}, { transaction });
      await queryInterface.bulkDelete('orders', {}, { transaction });
      await queryInterface.bulkDelete('shops', {}, { transaction });
      await queryInterface.bulkDelete('users', {}, { transaction });
      
      await transaction.commit();
      console.log('🧹 Test data removed successfully');
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};

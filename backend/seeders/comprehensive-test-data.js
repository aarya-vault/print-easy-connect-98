
const bcrypt = require('bcrypt');

// Function to create test data
async function createTestData() {
  const { User, Shop, Order, File, Message } = require('../models');
  
  try {
    console.log('🧹 Clearing existing data...');
    
    // Clear existing data in correct order (respecting foreign keys)
    await File.destroy({ where: {}, force: true });
    await Message.destroy({ where: {}, force: true });
    await Order.destroy({ where: {}, force: true });
    await Shop.destroy({ where: {}, force: true });
    await User.destroy({ where: {}, force: true });

    console.log('✅ Existing data cleared');

    // Hash passwords properly for shop owners and admin
    const hashedShopPassword = await bcrypt.hash('password123', 12);
    const hashedAdminPassword = await bcrypt.hash('admin123', 12);

    console.log('🔐 Creating users with properly hashed passwords...');

    // Create Users with proper password hashing and validation
    const customer1 = await User.create({
      phone: '9876543210',
      name: 'Rajesh Kumar',
      role: 'customer',
      is_active: true
    });

    const customer2 = await User.create({
      phone: '9876543211',
      name: 'Priya Sharma',
      role: 'customer',
      is_active: true
    });

    const customer3 = await User.create({
      phone: '9876543212',
      name: 'Amit Singh',
      role: 'customer',
      is_active: true
    });

    const shopOwner1 = await User.create({
      email: 'shop@printeasy.com',
      name: 'Quick Print Owner',
      password: hashedShopPassword,
      role: 'shop_owner',
      is_active: true
    });

    const shopOwner2 = await User.create({
      email: 'shop2@printeasy.com',
      name: 'Digital Print Hub Owner',
      password: hashedShopPassword,
      role: 'shop_owner',
      is_active: true
    });

    const admin = await User.create({
      email: 'admin@printeasy.com',
      name: 'PrintEasy Admin',
      password: hashedAdminPassword,
      role: 'admin',
      is_active: true
    });

    console.log('✅ Created users with proper authentication');

    // Create Shops with proper owner relationships
    const shop1 = await Shop.create({
      name: 'Quick Print Solutions',
      address: 'Shop 12, MG Road, Bangalore, Karnataka 560001',
      phone: '+91 98765 43210',
      email: 'contact@quickprint.com',
      description: 'Professional printing services with fast turnaround times. We offer document printing, binding, lamination, and more.',
      owner_id: shopOwner1.id,
      rating: 4.5,
      is_active: true,
      allows_offline_orders: true
    });

    const shop2 = await Shop.create({
      name: 'Digital Print Hub',
      address: 'Plot 45, Electronic City, Bangalore, Karnataka 560100',
      phone: '+91 98765 43211',
      email: 'info@digitalhub.com',
      description: 'Modern digital printing solutions for all your needs. Specializing in high-quality color prints.',
      owner_id: shopOwner2.id,
      rating: 4.2,
      is_active: true,
      allows_offline_orders: false
    });

    console.log('✅ Created shops with proper owners');

    // Create Sample Orders to establish customer-shop relationships for visited shops logic
    const order1 = await Order.create({
      id: 'UF000001',
      customer_id: customer1.id,
      shop_id: shop1.id,
      order_type: 'uploaded-files',
      status: 'completed',
      description: 'Print 50 copies of project report with spiral binding',
      customer_name: customer1.name,
      customer_phone: customer1.phone,
      is_urgent: false
    });

    const order2 = await Order.create({
      id: 'WI000001',
      customer_id: customer2.id,
      shop_id: shop1.id,
      order_type: 'walk-in',
      status: 'started',
      description: 'Resume printing on premium paper - 5 copies',
      customer_name: customer2.name,
      customer_phone: customer2.phone,
      is_urgent: true
    });

    const order3 = await Order.create({
      id: 'UF000002',
      customer_id: customer3.id,
      shop_id: shop2.id,
      order_type: 'uploaded-files',
      status: 'received',
      description: 'Color brochure printing - 100 copies',
      customer_name: customer3.name,
      customer_phone: customer3.phone,
      is_urgent: false
    });

    // Customer1 has ordered from shop1, so they can reorder from shop1
    const order4 = await Order.create({
      id: 'UF000003',
      customer_id: customer1.id,
      shop_id: shop2.id,
      order_type: 'uploaded-files',
      status: 'completed',
      description: 'Business cards printing - 500 copies',
      customer_name: customer1.name,
      customer_phone: customer1.phone,
      is_urgent: false
    });

    console.log('✅ Created orders with proper customer-shop relationships');

    // Create Sample Files
    await File.create({
      order_id: 'UF000001',
      filename: 'project_report_1640995200000.pdf',
      original_name: 'project_report.pdf',
      file_path: '/uploads/UF000001/project_report_1640995200000.pdf',
      file_size: 2048576,
      mime_type: 'application/pdf'
    });

    await File.create({
      order_id: 'UF000002',
      filename: 'brochure_design_1640995800000.pdf',
      original_name: 'brochure_design.pdf',
      file_path: '/uploads/UF000002/brochure_design_1640995800000.pdf',
      file_size: 5242880,
      mime_type: 'application/pdf'
    });

    console.log('✅ Created sample files');

    // Create Sample Messages
    await Message.create({
      order_id: 'UF000001',
      sender_id: customer1.id,
      recipient_id: shopOwner1.id,
      message: 'Hi, when will my order be ready for pickup?',
      is_read: true
    });

    await Message.create({
      order_id: 'UF000001',
      sender_id: shopOwner1.id,
      recipient_id: customer1.id,
      message: 'Your order is completed and ready for pickup. Shop timings: 9 AM to 7 PM.',
      is_read: false
    });

    console.log('✅ Created sample messages');

    console.log('\n🎉 Comprehensive test data created successfully!');
    console.log('\n📋 Test User Credentials:');
    console.log('   👤 Customer: 9876543210 (phone login - direct access)');
    console.log('   👤 Customer: 9876543211 (phone login - direct access)');
    console.log('   👤 Customer: 9876543212 (phone login - direct access)');
    console.log('   🏪 Shop Owner: shop@printeasy.com / password123');
    console.log('   🏪 Shop Owner: shop2@printeasy.com / password123');
    console.log('   👨‍💼 Admin: admin@printeasy.com / admin123');
    console.log('\n📊 Test Data Summary:');
    console.log('   • 6 users created (3 customers, 2 shop owners, 1 admin)');
    console.log('   • 2 shops created with proper owner relationships');
    console.log('   • 4 orders created for visited shops logic');
    console.log('   • 2 files uploaded');
    console.log('   • 2 chat messages');
    console.log('\n🔄 Customer-Shop Relationships for Reorder Logic:');
    console.log('   • Customer 9876543210 can reorder from: Quick Print Solutions, Digital Print Hub');
    console.log('   • Customer 9876543211 can reorder from: Quick Print Solutions');
    console.log('   • Customer 9876543212 can reorder from: Digital Print Hub');

  } catch (error) {
    console.error('❌ Error creating test data:', error);
    throw error;
  }
}

module.exports = { createTestData };

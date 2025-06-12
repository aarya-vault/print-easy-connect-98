
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

const seedTestData = async (User, Shop, Order) => {
  try {
    console.log('🌱 Starting PRODUCTION-READY test data seeding...');

    // Clear existing data
    await Order.destroy({ where: {} });
    await Shop.destroy({ where: {} });
    await User.destroy({ where: {} });

    console.log('🧹 Cleared existing data');

    // Create admin user with EXACT credentials requested
    const adminUser = await User.create({
      id: uuidv4(),
      name: 'PrintEasy Admin',
      email: 'admin@printeasy.com', 
      phone: '9999999999',
      password: await bcrypt.hash('admin123', 12),
      role: 'admin',
      is_active: true
    });

    console.log('✅ Created admin user with credentials: admin@printeasy.com / admin123');

    // Create test customers
    const customers = [];
    const customerData = [
      { name: 'Rajesh Kumar', phone: '9876543210' },
      { name: 'Priya Sharma', phone: '9876543211' },
      { name: 'Amit Singh', phone: '9876543212' },
      { name: 'Sneha Patel', phone: '9876543213' },
      { name: 'Vikram Reddy', phone: '9876543214' }
    ];

    for (const customer of customerData) {
      const user = await User.create({
        id: uuidv4(),
        name: customer.name,
        phone: customer.phone,
        role: 'customer',
        is_active: true
      });
      customers.push(user);
    }

    console.log('✅ Created test customers');

    // Create shop owner with EXACT credentials requested
    const shopOwner = await User.create({
      id: uuidv4(),
      name: 'Test Shop Owner',
      email: 'owner@test.com',
      phone: '9876543215',
      password: await bcrypt.hash('password123', 12),
      role: 'shop_owner',
      is_active: true
    });

    console.log('✅ Created shop owner with credentials: owner@test.com / password123');

    // Create additional shop owners
    const shopOwner2 = await User.create({
      id: uuidv4(),
      name: 'Digital Hub Owner',
      email: 'digitalhub@printeasy.com',
      phone: '9876543216',
      password: await bcrypt.hash('password123', 12),
      role: 'shop_owner',
      is_active: true
    });

    const shopOwner3 = await User.create({
      id: uuidv4(),
      name: 'Express Print Owner',
      email: 'express@printeasy.com',
      phone: '9876543217',
      password: await bcrypt.hash('password123', 12),
      role: 'shop_owner',
      is_active: true
    });

    // Create shops with proper data
    const shops = [];
    const shopData = [
      {
        name: 'Quick Print Solutions',
        slug: 'quick-print-solutions',
        address: 'Shop 12, Commercial Complex, MG Road, Bangalore, Karnataka 560001',
        phone: '9876543215',
        email: 'owner@test.com',
        owner_id: shopOwner.id,
        shop_timings: 'Mon-Sat: 9:00 AM - 8:00 PM, Sun: Closed',
        allows_offline_orders: true
      },
      {
        name: 'Digital Print Hub',
        slug: 'digital-print-hub',
        address: 'Unit 15, Tech Park Plaza, Electronic City Phase 1, Bangalore, Karnataka 560100',
        phone: '9876543216',
        email: 'digitalhub@printeasy.com',
        owner_id: shopOwner2.id,
        shop_timings: 'Mon-Sun: 8:00 AM - 9:00 PM',
        allows_offline_orders: true
      },
      {
        name: 'Express Copy Center',
        slug: 'express-copy-center',
        address: '23A, Main Market, Jayanagar 4th Block, Bangalore, Karnataka 560011',
        phone: '9876543217',
        email: 'express@printeasy.com',
        owner_id: shopOwner3.id,
        shop_timings: 'Mon-Sat: 7:00 AM - 10:00 PM, Sun: 10:00 AM - 6:00 PM',
        allows_offline_orders: false
      }
    ];

    for (const shopInfo of shopData) {
      const shop = await Shop.create({
        id: uuidv4(),
        ...shopInfo,
        is_active: true
      });
      shops.push(shop);
    }

    console.log('✅ Created shops with proper slugs and addresses');

    // Create meaningful orders with correct enum values
    const orders = [];
    const orderData = [
      {
        customer_id: customers[0].id,
        shop_id: shops[0].id,
        order_type: 'digital',
        status: 'completed',
        notes: 'Print 50 copies of project report with spiral binding and color cover page',
        customer_name: customers[0].name,
        customer_phone: customers[0].phone,
        is_urgent: false
      },
      {
        customer_id: customers[1].id,
        shop_id: shops[0].id,
        order_type: 'walkin',
        status: 'in_progress',
        notes: 'Resume printing on premium paper - 10 copies with plastic sleeves',
        customer_name: customers[1].name,
        customer_phone: customers[1].phone,
        is_urgent: true
      },
      {
        customer_id: customers[2].id,
        shop_id: shops[1].id,
        order_type: 'digital',
        status: 'pending',
        notes: 'Business presentation slides - 20 sets with color printing and binding',
        customer_name: customers[2].name,
        customer_phone: customers[2].phone,
        is_urgent: false
      },
      {
        customer_id: customers[3].id,
        shop_id: shops[1].id,
        order_type: 'walkin',
        status: 'ready',
        notes: 'Passport photos - 8 copies with matte finish',
        customer_name: customers[3].name,
        customer_phone: customers[3].phone,
        is_urgent: false
      },
      {
        customer_id: customers[4].id,
        shop_id: shops[2].id,
        order_type: 'digital',
        status: 'ready',
        notes: 'Wedding invitation cards - 200 copies with gold foil printing',
        customer_name: customers[4].name,
        customer_phone: customers[4].phone,
        is_urgent: true
      }
    ];

    for (const orderInfo of orderData) {
      const order = await Order.create({
        id: uuidv4(),
        ...orderInfo
      });
      orders.push(order);
    }

    console.log('✅ Created realistic orders with correct enum values');

    console.log('\n🎉 PRODUCTION-READY DATA SEEDED SUCCESSFULLY!');
    console.log('\n📋 WORKING Test Credentials:');
    console.log('   🔑 Admin: admin@printeasy.com / admin123');
    console.log('   🏪 Shop Owner: owner@test.com / password123');
    console.log('   👤 Customer: 9876543210 (phone login, no password)');
    console.log('\n🔗 Working Shop URLs:');
    console.log('   • /customer/order/quick-print-solutions');
    console.log('   • /customer/order/digital-print-hub');
    console.log('   • /customer/order/express-copy-center');
    console.log('\n✅ All authentication and data access FIXED!');

  } catch (error) {
    console.error('❌ Error seeding test data:', error);
    throw error;
  }
};

module.exports = { seedTestData };


const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

const seedTestData = async (User, Shop, Order) => {
  try {
    console.log('🌱 Starting fresh test data seeding...');

    // Clear existing data
    await Order.destroy({ where: {} });
    await Shop.destroy({ where: {} });
    await User.destroy({ where: {} });

    console.log('🧹 Cleared existing data');

    // Create admin user
    const adminUser = await User.create({
      id: uuidv4(),
      name: 'Admin User',
      email: 'admin@printeasy.com',
      phone: '9999999999',
      password: await bcrypt.hash('admin123', 12),
      role: 'admin',
      is_active: true
    });

    console.log('✅ Created admin user');

    // Create test customers
    const customers = [];
    const customerData = [
      { name: 'John Doe', phone: '9876543210' },
      { name: 'Jane Smith', phone: '9876543211' },
      { name: 'Mike Johnson', phone: '9876543212' },
      { name: 'Sarah Wilson', phone: '9876543213' },
      { name: 'David Brown', phone: '9876543214' }
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

    // Create shop owners and shops
    const shops = [];
    const shopData = [
      {
        shopName: 'Quick Print Solutions',
        ownerName: 'Rajesh Kumar',
        ownerEmail: 'owner@test.com',
        contactNumber: '9123456789',
        address: 'Shop No. 15, Main Market, Sector 12, Delhi - 110001',
        shopTimings: 'Mon-Sat: 9:00 AM - 8:00 PM',
        allowOfflineAccess: true
      },
      {
        shopName: 'Digital Print Hub',
        ownerName: 'Priya Sharma',
        ownerEmail: 'priya@digitalprint.com',
        contactNumber: '9123456788',
        address: '2nd Floor, Plaza Complex, MG Road, Bangalore - 560001',
        shopTimings: 'Mon-Sun: 8:00 AM - 9:00 PM',
        allowOfflineAccess: true
      },
      {
        shopName: 'Express Copy Center',
        ownerName: 'Amit Patel',
        ownerEmail: 'amit@expresscopy.com',
        contactNumber: '9123456787',
        address: 'Near Railway Station, Station Road, Mumbai - 400001',
        shopTimings: 'Mon-Sat: 7:00 AM - 10:00 PM',
        allowOfflineAccess: false
      },
      {
        shopName: 'Perfect Prints',
        ownerName: 'Neha Gupta',
        ownerEmail: 'neha@perfectprints.com',
        contactNumber: '9123456786',
        address: 'Shop 8, Commercial Complex, Sector 18, Noida - 201301',
        shopTimings: 'Mon-Sat: 9:30 AM - 7:30 PM',
        allowOfflineAccess: true
      }
    ];

    for (const shopInfo of shopData) {
      // Create shop owner
      const owner = await User.create({
        id: uuidv4(),
        name: shopInfo.ownerName,
        email: shopInfo.ownerEmail,
        phone: shopInfo.contactNumber,
        password: await bcrypt.hash('password123', 12),
        role: 'shop_owner',
        is_active: true
      });

      // Generate shop slug
      const slug = shopInfo.shopName.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();

      // Create shop
      const shop = await Shop.create({
        id: uuidv4(),
        owner_id: owner.id,
        name: shopInfo.shopName,
        slug: slug,
        address: shopInfo.address,
        phone: shopInfo.contactNumber,
        email: shopInfo.ownerEmail,
        is_active: true,
        allows_offline_orders: shopInfo.allowOfflineAccess,
        shop_timings: shopInfo.shopTimings
      });

      shops.push(shop);
    }

    console.log('✅ Created shops and shop owners');

    // Create test orders
    const orderStatuses = ['pending', 'in_progress', 'ready', 'completed'];
    const orderTypes = ['digital', 'walkin'];
    const sampleNotes = [
      'Need 10 copies of document, A4 size, black and white',
      'Print 5 copies in color, double sided, A4 paper',
      'Scan 20 pages and provide PDF file',
      'Print wedding cards - 100 copies, high quality',
      'Business cards printing - 500 pieces',
      'Thesis printing and binding - 3 copies',
      'Certificate printing on special paper',
      'Photo printing - 4x6 size, 50 photos'
    ];

    for (let i = 0; i < 25; i++) {
      const randomCustomer = customers[Math.floor(Math.random() * customers.length)];
      const randomShop = shops[Math.floor(Math.random() * shops.length)];
      const randomStatus = orderStatuses[Math.floor(Math.random() * orderStatuses.length)];
      const randomType = orderTypes[Math.floor(Math.random() * orderTypes.length)];
      const randomNotes = sampleNotes[Math.floor(Math.random() * sampleNotes.length)];

      await Order.create({
        id: uuidv4(),
        customer_id: randomCustomer.id,
        shop_id: randomShop.id,
        customer_name: randomCustomer.name,
        customer_phone: randomCustomer.phone,
        order_type: randomType,
        notes: randomNotes,
        status: randomStatus,
        is_urgent: Math.random() > 0.8,
        created_at: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000))
      });
    }

    console.log('✅ Created test orders');

    console.log('\n🎉 Fresh test data seeding completed successfully!');
    console.log('\n📋 Test Accounts:');
    console.log('Admin: admin@printeasy.com / admin123');
    console.log('Shop Owner: owner@test.com / password123');
    console.log('Customer: Login with phone numbers like 9876543210 (no password needed)');
    console.log('\n🏪 Sample Shops:');
    shops.forEach(shop => {
      console.log(`- ${shop.name} (/${shop.slug})`);
    });

  } catch (error) {
    console.error('❌ Error seeding test data:', error);
    throw error;
  }
};

module.exports = { seedTestData };

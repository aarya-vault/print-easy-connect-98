
import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@printeasy.com' },
    update: {},
    create: {
      email: 'admin@printeasy.com',
      phone: '9000000000',
      name: 'PrintEasy Admin',
      role: Role.ADMIN,
      passwordHash: adminPassword,
      isActive: true,
      emailVerified: true,
      phoneVerified: true,
    },
  });

  // Create shop owner
  const shopOwnerPassword = await bcrypt.hash('shopowner123', 10);
  const shopOwner = await prisma.user.upsert({
    where: { email: 'shop@printeasy.com' },
    update: {},
    create: {
      email: 'shop@printeasy.com',
      phone: '9123456789',
      name: 'Shop Owner',
      role: Role.SHOP_OWNER,
      passwordHash: shopOwnerPassword,
      isActive: true,
      emailVerified: true,
      phoneVerified: true,
    },
  });

  // Create test customer
  const customer = await prisma.user.upsert({
    where: { phone: '9876543210' },
    update: {},
    create: {
      phone: '9876543210',
      name: 'Test Customer',
      role: Role.CUSTOMER,
      isActive: true,
      phoneVerified: true,
    },
  });

  // Create shop
  const shop = await prisma.shop.upsert({
    where: { slug: 'quick-print-solutions' },
    update: {},
    create: {
      ownerId: shopOwner.id,
      name: 'Quick Print Solutions',
      slug: 'quick-print-solutions',
      address: 'Shop 12, MG Road, Bangalore, Karnataka 560001',
      phone: '+91 98765 43210',
      email: 'shop@printeasy.com',
      openingTime: '09:00:00',
      closingTime: '18:00:00',
      rating: new Decimal('4.5'),
      totalReviews: 25,
      isActive: true,
      offlineModuleEnabled: true,
    },
  });

  console.log('✅ Database seeded successfully!');
  console.log(`👤 Admin: ${admin.email}`);
  console.log(`🏪 Shop Owner: ${shopOwner.email}`);
  console.log(`👥 Customer: ${customer.phone}`);
  console.log(`🏬 Shop: ${shop.name}`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

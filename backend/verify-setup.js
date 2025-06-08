
const { Pool } = require('pg');
require('dotenv').config();

async function verifySetup() {
  console.log('🔍 Verifying PrintEasy Setup...\n');

  // Check environment variables
  console.log('📋 Environment Check:');
  console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'not set'}`);
  console.log(`   PORT: ${process.env.PORT || '3001'}`);
  console.log(`   DB_HOST: ${process.env.DB_HOST || 'localhost'}`);
  console.log(`   DB_NAME: ${process.env.DB_NAME || 'printeasy_shop'}`);
  console.log(`   JWT_SECRET: ${process.env.JWT_SECRET ? '✅ Set' : '❌ Not set'}\n`);

  // Test database connection
  console.log('🗄️ Testing Database Connection...');
  
  const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'printeasy_shop',
    password: process.env.DB_PASSWORD || 'password',
    port: process.env.DB_PORT || 5432,
  });

  try {
    const client = await pool.connect();
    console.log('✅ Database connection successful!');

    // Check if tables exist
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    const tables = tablesResult.rows.map(row => row.table_name);
    console.log(`📊 Found ${tables.length} tables:`, tables.join(', '));

    // Check test users
    const usersResult = await client.query('SELECT COUNT(*) as count FROM users');
    console.log(`👤 Users in database: ${usersResult.rows[0].count}`);

    // Check test shops
    const shopsResult = await client.query('SELECT COUNT(*) as count FROM shops');
    console.log(`🏪 Shops in database: ${shopsResult.rows[0].count}`);

    client.release();
    console.log('\n🎉 Setup verification complete!');
    console.log('\n🚀 Ready to start the server with: node start-server.js');

  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.log('\n💡 To fix database issues:');
    console.log('1. Install PostgreSQL: https://www.postgresql.org/download/');
    console.log('2. Create database: createdb printeasy_shop');
    console.log('3. Run schema: psql printeasy_shop < database/schema.sql');
    console.log('4. Add test data: psql printeasy_shop < database/test-data.sql');
  } finally {
    await pool.end();
  }
}

verifySetup();


const { Sequelize } = require('sequelize');
const config = require('../config/database')[process.env.NODE_ENV || 'development'];

// Create Sequelize instance with enhanced configuration
const sequelize = new Sequelize(config.database, config.username, config.password, {
  ...config,
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Import models
const User = require('./User')(sequelize);
const Shop = require('./Shop')(sequelize);
const Order = require('./Order')(sequelize);
const File = require('./File')(sequelize);
const Message = require('./Message')(sequelize);

// Define associations
User.hasMany(Order, { foreignKey: 'customer_id', as: 'orders' });
User.hasMany(Shop, { foreignKey: 'owner_id', as: 'ownedShops' });
User.hasMany(Message, { foreignKey: 'sender_id', as: 'sentMessages' });

Shop.belongsTo(User, { foreignKey: 'owner_id', as: 'owner' });
Shop.hasMany(Order, { foreignKey: 'shop_id', as: 'orders' });

Order.belongsTo(User, { foreignKey: 'customer_id', as: 'customer' });
Order.belongsTo(Shop, { foreignKey: 'shop_id', as: 'shop' });
Order.hasMany(File, { foreignKey: 'order_id', as: 'files' });
Order.hasMany(Message, { foreignKey: 'order_id', as: 'messages' });

File.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });

Message.belongsTo(User, { foreignKey: 'sender_id', as: 'sender' });
Message.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });

// Test database connection
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✓ Database connection has been established successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    throw error;
  }
}

// Sync database with error handling
async function syncDatabase() {
  try {
    await sequelize.sync({ alter: true });
    console.log('✓ Database synchronized successfully.');
  } catch (error) {
    console.error('❌ Database sync error:', error);
    throw error;
  }
}

// Initialize database (called from app.js)
async function initializeDatabase() {
  await testConnection();
  await syncDatabase();
}

module.exports = {
  sequelize,
  User,
  Shop,
  Order,
  File,
  Message,
  initializeDatabase
};

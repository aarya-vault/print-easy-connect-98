
const { Sequelize } = require('sequelize');
const config = require('../config/database');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
    pool: dbConfig.pool
  }
);

// Import models
const User = require('./User')(sequelize);
const Shop = require('./Shop')(sequelize);
const Order = require('./Order')(sequelize);
const File = require('./File')(sequelize);
const Message = require('./Message')(sequelize);

// Define associations
User.hasMany(Shop, { foreignKey: 'owner_id', as: 'ownedShops' });
Shop.belongsTo(User, { foreignKey: 'owner_id', as: 'owner' });

User.hasMany(Order, { foreignKey: 'customer_id', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'customer_id', as: 'customer' });

Shop.hasMany(Order, { foreignKey: 'shop_id', as: 'orders' });
Order.belongsTo(Shop, { foreignKey: 'shop_id', as: 'shop' });

Order.hasMany(File, { foreignKey: 'order_id', as: 'files' });
File.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });

Order.hasMany(Message, { foreignKey: 'order_id', as: 'messages' });
Message.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });

User.hasMany(Message, { foreignKey: 'sender_id', as: 'sentMessages' });
Message.belongsTo(User, { foreignKey: 'sender_id', as: 'sender' });

module.exports = {
  sequelize,
  User,
  Shop,
  Order,
  File,
  Message
};

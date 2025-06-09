
const { Sequelize } = require('sequelize');
const config = require('../config/database')[process.env.NODE_ENV || 'development'];

const sequelize = new Sequelize(config.database, config.username, config.password, config);

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

// Sync database
sequelize.sync({ alter: true }).then(() => {
  console.log('Database & tables synced!');
}).catch(err => {
  console.error('Database sync error:', err);
});

module.exports = {
  sequelize,
  User,
  Shop,
  Order,
  File,
  Message
};

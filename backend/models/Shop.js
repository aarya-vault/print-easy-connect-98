
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Shop = sequelize.define('Shop', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    owner_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 255]
      }
    },
    slug: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: true,
      validate: {
        isSlug(value) {
          if (value && !/^[a-z0-9-]+$/.test(value)) {
            throw new Error('Slug must contain only lowercase letters, numbers, and hyphens');
          }
        }
      }
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        isEmail: true,
        notEmpty: true
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    rating: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: false,
      defaultValue: 0.00,
      validate: {
        min: 0,
        max: 5
      }
    },
    allows_offline_orders: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    shop_timings: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: 'Mon-Sat: 9:00 AM - 7:00 PM'
    },
    qr_code_url: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'shops',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        fields: ['owner_id']
      },
      {
        fields: ['is_active']
      },
      {
        unique: true,
        fields: ['slug'],
        where: {
          slug: {
            [sequelize.Sequelize.Op.ne]: null
          }
        }
      }
    ]
  });

  return Shop;
};

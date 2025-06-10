
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
      unique: {
        name: 'unique_phone',
        msg: 'Phone number already exists'
      },
      validate: {
        isValidPhone(value) {
          if (value && !/^\d{10,15}$/.test(value)) {
            throw new Error('Phone number must be 10-15 digits');
          }
        }
      }
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: {
        name: 'unique_email',
        msg: 'Email address already exists'
      },
      validate: {
        isEmail: {
          msg: 'Must be a valid email address'
        }
      }
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Name cannot be empty'
        },
        len: {
          args: [2, 255],
          msg: 'Name must be between 2 and 255 characters'
        }
      }
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        isRequiredForNonCustomers(value) {
          if (this.role !== 'customer' && !value) {
            throw new Error('Password is required for shop owners and admins');
          }
        }
      }
    },
    role: {
      type: DataTypes.ENUM('customer', 'shop_owner', 'admin'),
      allowNull: false,
      defaultValue: 'customer',
      validate: {
        isIn: {
          args: [['customer', 'shop_owner', 'admin']],
          msg: 'Role must be customer, shop_owner, or admin'
        }
      }
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        unique: true,
        fields: ['phone'],
        where: {
          phone: {
            [sequelize.Sequelize.Op.ne]: null
          }
        }
      },
      {
        unique: true,
        fields: ['email'],
        where: {
          email: {
            [sequelize.Sequelize.Op.ne]: null
          }
        }
      },
      {
        fields: ['role']
      },
      {
        fields: ['is_active']
      }
    ],
    validate: {
      validateAuthMethod() {
        if (this.role === 'customer' && !this.phone) {
          throw new Error('Customers must have a phone number');
        }
        if ((this.role === 'shop_owner' || this.role === 'admin') && !this.email) {
          throw new Error('Shop owners and admins must have an email');
        }
      }
    }
  });

  return User;
};

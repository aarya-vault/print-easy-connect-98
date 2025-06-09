
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const File = sequelize.define('File', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    order_id: {
      type: DataTypes.STRING(20),
      allowNull: true,
      references: {
        model: 'orders',
        key: 'id'
      }
    },
    filename: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    original_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    file_path: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    file_size: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    mime_type: {
      type: DataTypes.STRING(100),
      allowNull: true
    }
  }, {
    tableName: 'order_files',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return File;
};

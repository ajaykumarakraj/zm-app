const sequelize = require('sequelize')

module.exports = function (sequelize, DataTypes) {

  return sequelize.define('Users', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    is_active: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1 
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    deviceID: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    }
  },
    {
      timestamps: true,
      tableName: 'users'
    })
};

'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.belongsTo(models.Role, {
        foreignKey: 'role_id',
        as: 'role'
      });
      User.hasMany(models.Order, {
        foreignKey: 'user_id',
        as: 'orders' 
      });
    }
  }
  User.init({
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    name: DataTypes.STRING,       
    address: DataTypes.STRING,    
    age: DataTypes.INTEGER,       
    picture: DataTypes.STRING,    
    role_id: DataTypes.INTEGER    
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};

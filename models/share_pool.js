'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Pool extends Model {
    static associate(models) {
      // define association here
    }
  }
  Pool.init({
    userId: DataTypes.INTEGER,
    definitionId: DataTypes.INTEGER,
    stock: DataTypes.INTEGER,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Pool',
  });
  return Pool;
};
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ShareDefinition extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ShareDefinition.init({
    name: DataTypes.STRING,
    price: DataTypes.DECIMAL(10, 2),
    stock: DataTypes.INTEGER,
    creator: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ShareDefinition',
  });
  return ShareDefinition;
};
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
  
      Cart.belongsTo(models.Product, {
        foreignKey: 'id_product',
        
      })
    }
  }
  Cart.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    id_product: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    status: DataTypes.INTEGER,

   
  }, {
    sequelize,
    modelName: 'Cart',
  });
  return Cart;
};
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Product.hasMany(models.Cart,{
        foreignKey: 'id_product',
      })
      
    }
  }
  Product.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    slug: DataTypes.STRING,
    name: DataTypes.STRING,
    price: DataTypes.STRING,

    quantity: DataTypes.STRING,
    catelogy: DataTypes.STRING,
    img: DataTypes.STRING,
    sold: DataTypes.INTEGER,
    sale: DataTypes.INTEGER,

  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};
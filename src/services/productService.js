const { Product, Category } = require('../models');

exports.createProduct = async ({ product_name, description, price, category_id }) => {
  const newProduct = await Product.create({ 
    product_name, description, price, category_id 
  });
  return newProduct;
};

exports.getAllProducts = async () => {
  const products = await Product.findAll({
    include: [{
      model: Category,
      as: 'category',
      attributes: ['category_name']
    }]
  });
  return products;
};

exports.getProductById = async (id) => {
  return Product.findByPk(id, {
    include: [{
      model: Category,
      as: 'category',
      attributes: ['id', 'category_name']
    }]
  });
};

exports.updateProduct = async (id, { product_name, description, price, category_id }) => {
  const product = await Product.findByPk(id);
  if (!product) return null;
  product.product_name = product_name || product.product_name;
  product.description = description || product.description;
  product.price = price || product.price;
  product.category_id = category_id || product.category_id;
  await product.save();
  return product;
};

exports.deleteProduct = async (id) => {
  const product = await Product.findByPk(id);
  if (!product) return null;
  await product.destroy();
  return product;
};

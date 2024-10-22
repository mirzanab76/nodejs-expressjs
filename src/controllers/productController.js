const productService = require('../services/productService');

exports.createProduct = [
  async (req, res, next) => {
    try {
      const { product_name, description, price, category_id } = req.body;
      const newProduct = await productService.createProduct({ 
        product_name, description, price, category_id 
      });

      res.status(201).json({
        statusCode: 201,
        message: 'Product created successfully',
        success: true,
        data: newProduct
      });
    } catch (error) {
      next({
        statusCode: 500,
        message: 'Failed to create product',
        success: false,
        error: error.message
      });
    }
  }
];

exports.getAllProducts = async (req, res, next) => {
  try {
    const products = await productService.getAllProducts();

    res.status(200).json({
      statusCode: 200,
      message: 'Products fetched successfully',
      success: true,
      data: products
    });
  } catch (error) {
    next({
      statusCode: 500,
      message: 'Failed to fetch products',
      success: false,
      error: error.message
    });
  }
};

exports.getProductById = async (req, res, next) => {
  try {
    const product = await productService.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({
        statusCode: 404,
        message: 'Product not found',
        success: false
      });
    }

    res.status(200).json({
      statusCode: 200,
      message: 'Product fetched successfully',
      success: true,
      data: product
    });
  } catch (error) {
    next({
      statusCode: 500,
      message: 'Failed to fetch product',
      success: false,
      error: error.message
    });
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const { product_name, description, price, category_id } = req.body;
    const updatedProduct = await productService.updateProduct(req.params.id, { product_name, description, price, category_id });
    if (!updatedProduct) {
      return res.status(404).json({
        statusCode: 404,
        message: 'Product not found',
        success: false
      });
    }

    res.status(200).json({
      statusCode: 200,
      message: 'Product updated successfully',
      success: true,
      data: updatedProduct
    });
  } catch (error) {
    next({
      statusCode: 500,
      message: 'Failed to update product',
      success: false,
      error: error.message
    });
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const deletedProduct = await productService.deleteProduct(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({
        statusCode: 404,
        message: 'Product not found',
        success: false
      });
    }

    res.status(200).json({
      statusCode: 200,
      message: 'Product deleted successfully',
      success: true
    });
  } catch (error) {
    next({
      statusCode: 500,
      message: 'Failed to delete product',
      success: false,
      error: error.message
    });
  }
};

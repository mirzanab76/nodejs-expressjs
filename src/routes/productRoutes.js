const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Create Product
router.post('/create', productController.createProduct);

// Get All Products
router.get('/', productController.getAllProducts);

// Get Product by ID
router.get('/:id', productController.getProductById);

// Update Product
router.put('/update/:id', productController.updateProduct);

// Delete Product
router.delete('/:id', productController.deleteProduct);

module.exports = router;

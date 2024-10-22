const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// Create Category
router.post('/create', categoryController.createCategory);

// Get All Categories
router.get('/', categoryController.getAllCategories);

// Get Category by ID
router.get('/:id', categoryController.getCategoryById);

// Update Category
router.put('/:id', categoryController.updateCategory);

// Delete Category
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;

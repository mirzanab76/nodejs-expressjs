const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// Create User
router.post('/create', categoryController.createCategory);

// Get All Users
router.get('/', categoryController.getAllCategories);

// Get User by ID
router.get('/:id', categoryController.getCategoryById);

// Update User
router.put('/:id', categoryController.updateCategory);

// Delete User
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;

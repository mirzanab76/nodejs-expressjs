const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');

// Create User
router.post('/create', roleController.createRole);

// Get All Users
router.get('/', roleController.getAllRoles);

// Get User by ID
router.get('/:id', roleController.getRoleById);

// Update User
router.put('/:id', roleController.updateRole);

// Delete User
router.delete('/:id', roleController.deleteRole);

module.exports = router;

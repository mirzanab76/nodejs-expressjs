const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');

// Create Role
router.post('/create', roleController.createRole);

// Get All Roles
router.get('/', roleController.getAllRoles);

// Get Role by ID
router.get('/:id', roleController.getRoleById);

// Update Role
router.put('/:id', roleController.updateRole);

// Delete Role
router.delete('/:id', roleController.deleteRole);

module.exports = router;

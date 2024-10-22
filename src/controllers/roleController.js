const roleService = require('../services/roleService');

exports.createRole = async (req, res, next) => {
  try {
    const { role_name } = req.body;
    const newRole = await roleService.createRole({ role_name });

    res.status(201).json({
      statusCode: 201,
      message: 'Role created successfully',
      success: true,
      data: newRole
    });
  } catch (error) {
    next({
      statusCode: 500,
      message: 'Failed to create role',
      success: false,
      error: error.message
    });
  }
};

exports.getAllRoles = async (req, res, next) => {
  try {
    const roles = await roleService.getAllRoles();

    res.status(200).json({
      statusCode: 200,
      message: 'Roles fetched successfully',
      success: true,
      data: roles
    });
  } catch (error) {
    next({
      statusCode: 500,
      message: 'Failed to fetch roles',
      success: false,
      error: error.message
    });
  }
};

exports.getRoleById = async (req, res, next) => {
  try {
    const role = await roleService.getRoleById(req.params.id);
    if (!role) {
      return res.status(404).json({
        statusCode: 404,
        message: 'Role not found',
        success: false
      });
    }

    res.status(200).json({
      statusCode: 200,
      message: 'Role fetched successfully',
      success: true,
      data: role
    });
  } catch (error) {
    next({
      statusCode: 500,
      message: 'Failed to fetch role',
      success: false,
      error: error.message
    });
  }
};

exports.updateRole = async (req, res, next) => {
  try {
    const { role_name } = req.body;
    const updatedRole = await roleService.updateRole(req.params.id, { role_name });
    if (!updatedRole) {
      return res.status(404).json({
        statusCode: 404,
        message: 'Role not found',
        success: false
      });
    }

    res.status(200).json({
      statusCode: 200,
      message: 'Role updated successfully',
      success: true,
      data: updatedRole
    });
  } catch (error) {
    next({
      statusCode: 500,
      message: 'Failed to update role',
      success: false,
      error: error.message
    });
  }
};

exports.deleteRole = async (req, res, next) => {
  try {
    const deleteRole = await roleService.deleteRole(req.params.id);
    if (!deleteRole) {
      return res.status(404).json({
        statusCode: 404,
        message: 'Role not found',
        success: false
      });
    }

    res.status(200).json({
      statusCode: 200,
      message: 'Role deleted successfully',
      success: true
    });
  } catch (error) {
    next({
      statusCode: 500,
      message: 'Failed to delete role',
      success: false,
      error: error.message
    });
  }
};

const roleService = require('../services/roleService');
const asyncHandler = require('../middleware/asyncHandler');

exports.createRole = asyncHandler(async (req, res) => {
    const result = await roleService.createRole(req.body);
    res.status(result.statusCode).json(result);
});

exports.getAllRoles = asyncHandler(async (req, res) => {
    const result = await roleService.getAllRoles();
    res.status(result.statusCode).json(result);
});

exports.getRoleById = asyncHandler(async (req, res) => {
    const result = await roleService.getRoleById(req.params.id);
    res.status(result.statusCode).json(result);
});

exports.updateRole = asyncHandler(async (req, res) => {
    const result = await roleService.updateRole(req.params.id, req.body);
    res.status(result.statusCode).json(result);
});

exports.deleteRole = asyncHandler(async (req, res) => {
    const result = await roleService.deleteRole(req.params.id);
    res.status(result.statusCode).json(result);
});
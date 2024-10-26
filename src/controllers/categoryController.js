const categoryService = require('../services/categoryService');
const asyncHandler = require('../middleware/asyncHandler');

exports.createCategory = asyncHandler(async (req, res) => {
    const result = await categoryService.createCategory(req.body);
    res.status(result.statusCode).json(result);
});

exports.getAllCategories = asyncHandler(async (req, res) => {
    const result = await categoryService.getAllCategories(req.query);
    res.status(result.statusCode).json(result);
});

exports.getCategoryById = asyncHandler(async (req, res) => {
    const result = await categoryService.getCategoryById(req.params.id);
    res.status(result.statusCode).json(result);
});

exports.updateCategory = asyncHandler(async (req, res) => {
    const result = await categoryService.updateCategory(req.params.id, req.body);
    res.status(result.statusCode).json(result);
});

exports.deleteCategory = asyncHandler(async (req, res) => {
    const result = await categoryService.deleteCategory(req.params.id);
    res.status(result.statusCode).json(result);
});
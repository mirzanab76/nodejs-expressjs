const productService = require('../services/productService');
const asyncHandler = require('../middleware/asyncHandler');

exports.createProduct = asyncHandler(async (req, res) => {
    const result = await productService.createProduct(req.body);
    res.status(result.statusCode).json(result);
});

exports.getAllProducts = asyncHandler(async (req, res) => {
    const result = await productService.getAllProducts(req.query);
    res.status(result.statusCode).json(result);
});

exports.getProductById = asyncHandler(async (req, res) => {
    const result = await productService.getProductById(req.params.id);
    res.status(result.statusCode).json(result);
});

exports.updateProduct = asyncHandler(async (req, res) => {
    const result = await productService.updateProduct(req.params.id, req.body);
    res.status(result.statusCode).json(result);
});

exports.deleteProduct = asyncHandler(async (req, res) => {
    const result = await productService.deleteProduct(req.params.id);
    res.status(result.statusCode).json(result);
});
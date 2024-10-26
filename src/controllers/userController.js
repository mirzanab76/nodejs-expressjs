const userService = require('../services/userService');
const asyncHandler = require('../middleware/asyncHandler');
const { upload } = require('../config/cloudinary');
const ResponseHelper = require('../utils/responseHelper');

exports.createUser = [
    upload.single('picture'),
    async (req, res) => {
        try {
            const userData = {
                ...req.body,
                picture: req.file?.path || null // Cloudinary akan memberikan URL lengkap
            };

            const result = await userService.createUser(userData);
            return res.status(result.statusCode).json(result);
        } catch (error) {
            if (error.message === 'Not an image! Please upload an image.') {
                const response = ResponseHelper.badRequest('Please upload a valid image file');
                return res.status(response.statusCode).json(response);
            }

            console.error('Registration error:', error);
            const response = ResponseHelper.serverError(
                'Registration failed',
                process.env.NODE_ENV === 'development' ? error.message : undefined
            );
            return res.status(response.statusCode).json(response);
        }
    }
];

exports.getAllUsers = asyncHandler(async (req, res) => {
    const result = await userService.getAllUsers(req.query);
    res.status(result.statusCode).json(result);
});

exports.getUserById = asyncHandler(async (req, res) => {
    const result = await userService.getUserById(req.params.id);
    res.status(result.statusCode).json(result);
});

exports.updateUser = asyncHandler(async (req, res) => {
    const result = await userService.updateUser(req.params.id, req.body);
    res.status(result.statusCode).json(result);
});

exports.deleteUser = asyncHandler(async (req, res) => {
    const result = await userService.deleteUser(req.params.id);
    res.status(result.statusCode).json(result);
});
const authService = require('../services/authService');
const asyncHandler = require('../middleware/asyncHandler');
const { upload } = require('../config/cloudinary');
const ResponseHelper = require('../utils/responseHelper');

exports.register = [
    upload.single('picture'),
    async (req, res) => {
        try {
            const userData = {
                ...req.body,
                picture: req.file?.path || null // Cloudinary akan memberikan URL lengkap
            };

            const result = await authService.registerUser(userData);
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
exports.login = asyncHandler(async (req, res) => {
    try {
        const { email, password } = req.body;
        
        console.log('Login request received for:', email);
        
        const result = await authService.loginUser({ email, password });
        
        return res.status(result.statusCode).json(result);
    } catch (error) {
        console.error('Controller error during login:', error);
        
        const response = ResponseHelper.serverError(
            'Login failed',
            process.env.NODE_ENV === 'development' ? error.message : undefined
        );
        
        return res.status(response.statusCode).json(response);
    }
});

exports.verifyToken = asyncHandler(async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    const result = await authService.verifyToken(token);
    res.status(result.statusCode).json(result);
});

exports.refreshToken = asyncHandler(async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    const result = await authService.refreshToken(token);
    res.status(result.statusCode).json(result);
});
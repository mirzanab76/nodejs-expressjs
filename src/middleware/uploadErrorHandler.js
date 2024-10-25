const ResponseHelper = require('../utils/responseHelper');

const uploadErrorHandler = (error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            const response = ResponseHelper.badRequest('File too large. Maximum size is 2MB');
            return res.status(response.statusCode).json(response);
        }
    }
    
    if (error.message === 'Not an image! Please upload an image.') {
        const response = ResponseHelper.badRequest('Please upload a valid image file');
        return res.status(response.statusCode).json(response);
    }

    next(error);
};

module.exports = uploadErrorHandler;
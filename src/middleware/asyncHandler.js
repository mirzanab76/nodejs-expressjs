const ResponseHelper = require('../utils/responseHelper');

const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next))
        .catch((error) => {
            const response = ResponseHelper.serverError(
                'Internal server error',
                error
            );
            res.status(response.statusCode).json(response);
        });
};

module.exports = asyncHandler;
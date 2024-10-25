const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/config.json')[process.env.NODE_ENV || 'development'];
const ResponseHelper = require('../utils/responseHelper');

exports.verifyToken = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            const response = ResponseHelper.unauthorized('Access token is required');
            return res.status(response.statusCode).json(response);
        }

        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                const response = ResponseHelper.unauthorized('Invalid or expired token');
                return res.status(response.statusCode).json(response);
            }

            req.user = decoded;
            next();
        });
    } catch (error) {
        const response = ResponseHelper.serverError('Authentication error');
        return res.status(response.statusCode).json(response);
    }
};
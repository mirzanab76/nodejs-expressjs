const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/config.json')[process.env.NODE_ENV || 'development'];

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        statusCode: 401,
        message: 'Authorization header missing or invalid',
        success: false
      });
    }

    const token = authHeader.split(' ')[1];
    const decodedToken = jwt.verify(token, JWT_SECRET); 

    req.user = { userId: decodedToken.userId };
    
    next(); 
  } catch (error) {
    return res.status(403).json({
      statusCode: 403,
      message: 'Authentication failed',
      success: false,
      error: error.message 
    });
  }
};

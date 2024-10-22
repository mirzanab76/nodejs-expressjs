const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/config.json')[process.env.NODE_ENV || 'development'];

module.exports = (req, res, next) => {
  try {
    // Cek apakah header Authorization ada dan mengikuti format 'Bearer <token>'
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        statusCode: 401,
        message: 'Authorization header missing or invalid',
        success: false
      });
    }

    const token = authHeader.split(' ')[1];
    const decodedToken = jwt.verify(token, JWT_SECRET); // Verifikasi token

    // Simpan informasi user ke req.user
    req.user = { userId: decodedToken.userId };
    
    next(); // Lanjutkan ke middleware atau route berikutnya
  } catch (error) {
    return res.status(403).json({
      statusCode: 403,
      message: 'Authentication failed',
      success: false,
      error: error.message // Tambahkan informasi error jika ada
    });
  }
};

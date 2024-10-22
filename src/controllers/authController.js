const authService = require('../services/authService');

exports.register = async (req, res, next) => {
  try {
    const { username, email, password, name, address, age, picture, role_id } = req.body;
    const user = await authService.registerUser(username, email, password,name, address, age, picture, role_id);
    res.status(201).json({ 
      statusCode: 201,
      message: 'User created successfully', 
      success: true,
      userId: user
    });
  } catch (error) {
    next({
      statusCode: 500,
      message: 'Failed to register user',
      success: false,
      error: error.message
    });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const token = await authService.loginUser(email, password);
    res.json({
      statusCode: 201,
      message: 'User successfully login!', 
      success: true,
      token : token
    });
  } catch (error) {
    next({
      statusCode: 500,
      message: 'Failed to fetch user',
      success: false,
      error: error.message
    });
  }
};

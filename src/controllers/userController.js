const userService = require('../services/userService');
const upload = require('../config/multerConfig');

exports.createUser = [
  upload.single('picture'), 
  async (req, res, next) => {
    try {
      const { username, email, password, name, address, age, role_id } = req.body;
      const picture = req.file ? req.file.path : null; 

      const newUser = await userService.createUser({ 
        username, 
        email, 
        password, 
        name, 
        address, 
        age, 
        picture, 
        role_id 
      });

      res.status(201).json({
        statusCode: 201,
        message: 'User created successfully',
        success: true,
        data: newUser
      });
    } catch (error) {
      next({
        statusCode: 500,
        message: 'Failed to create user',
        success: false,
        error: error.message
      });
    }
  }
];

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();

    res.status(200).json({
      statusCode: 200,
      message: 'Users fetched successfully',
      success: true,
      data: users
    });
  } catch (error) {
    next({
      statusCode: 500,
      message: 'Failed to fetch users',
      success: false,
      error: error.message
    });
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({
        statusCode: 404,
        message: 'User not found',
        success: false
      });
    }

    res.status(200).json({
      statusCode: 200,
      message: 'User fetched successfully',
      success: true,
      data: user
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

exports.updateUser = async (req, res, next) => {
  try {
    const { username, email, password, name, address, age, picture, role_id } = req.body;
    const updatedUser = await userService.updateUser(req.params.id, { username, email, password, name, address, age, picture, role_id });
    if (!updatedUser) {
      return res.status(404).json({
        statusCode: 404,
        message: 'User not found',
        success: false
      });
    }

    res.status(200).json({
      statusCode: 200,
      message: 'User updated successfully',
      success: true,
      data: updatedUser
    });
  } catch (error) {
    next({
      statusCode: 500,
      message: 'Failed to update user',
      success: false,
      error: error.message
    });
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const deletedUser = await userService.deleteUser(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({
        statusCode: 404,
        message: 'User not found',
        success: false
      });
    }

    res.status(200).json({
      statusCode: 200,
      message: 'User deleted successfully',
      success: true
    });
  } catch (error) {
    next({
      statusCode: 500,
      message: 'Failed to delete user',
      success: false,
      error: error.message
    });
  }
};

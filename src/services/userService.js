const bcrypt = require('bcryptjs');
const userRepository = require('../repositories/userRepository');
const ResponseHelper = require('../utils/responseHelper');
const CustomError = require('../utils/customError');
const  UserValidator  = require('../validators/userValidator');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/config.json')[process.env.NODE_ENV || 'development'];

class UserService {
    async createUser(userData) {
        try {
            console.log('Starting user registration process');
    
            // Validate input
            let validatedData;
            try {
                validatedData = await UserValidator.validateCreate(userData);
            } catch (error) {
                console.log('Validation failed:', error);
                return ResponseHelper.badRequest(
                    'Validation failed',
                    error.details || error.message
                );
            }
    
            // Check existing email
            const existingUser = await userRepository.findByEmail(validatedData.email);
            if (existingUser) {
                return ResponseHelper.badRequest('Email already registered');
            }
    
            // Hash password
            const hashedPassword = await bcrypt.hash(validatedData.password, 10);
    
            // Create user
            const newUser = await userRepository.createUser({
                ...validatedData,
                password: hashedPassword
            });
    
            const { password: _, ...userWithoutPassword } = newUser.toJSON();
    
            console.log('User registration successful');
            return ResponseHelper.success(
                201,
                'User registered successfully',
                userWithoutPassword
            );
        } catch (error) {
            console.error('Registration error:', error);
            
            if (error.statusCode === 400) {
                return ResponseHelper.badRequest(error.message, error.details);
            }
            
            return ResponseHelper.serverError(
                'Failed to register user',
                process.env.NODE_ENV === 'development' ? error.message : undefined
            );
        }
    }

    async getAllUsers(query = {}) {
        try {
            const options = this.buildQueryOptions(query);
            const users = await userRepository.findAll(options);
            
            const sanitizedUsers = users.map(user => this.sanitizeUser(user));
            
            return ResponseHelper.success(
                200,
                'Users fetched successfully',
                sanitizedUsers
            );
        } catch (error) {
            throw new CustomError('Failed to fetch users', 500);
        }
    }

    async getUserById(id) {
        try {
            const user = await userRepository.findById(id);
            return ResponseHelper.success(
                200,
                'User fetched successfully',
                this.sanitizeUser(user)
            );
        } catch (error) {
            if (error.statusCode === 404) {
                return ResponseHelper.notFound('User not found');
            }
            throw error;
        }
    }

    async updateUser(id, updateData) {
        try {
            // Validate update data
            const validatedData = await validateUser(updateData, true);
            
            if (validatedData.password) {
                validatedData.password = await bcrypt.hash(validatedData.password, 10);
            }

            const updatedUser = await userRepository.update(id, validatedData);
            
            return ResponseHelper.success(
                200,
                'User updated successfully',
                this.sanitizeUser(updatedUser)
            );
        } catch (error) {
            if (error.statusCode === 404) {
                return ResponseHelper.notFound('User not found');
            }
            if (error.name === 'ValidationError') {
                return ResponseHelper.badRequest('Validation error', error.details);
            }
            throw error;
        }
    }

    async deleteUser(id) {
        try {
            await userRepository.delete(id);
            return ResponseHelper.success(200, 'User deleted successfully');
        } catch (error) {
            if (error.statusCode === 404) {
                return ResponseHelper.notFound('User not found');
            }
            throw error;
        }
    }

    // Private helper methods
    buildQueryOptions(query) {
        const options = {};
        
        // Add pagination
        if (query.page && query.limit) {
            options.limit = parseInt(query.limit);
            options.offset = (parseInt(query.page) - 1) * options.limit;
        }

        // Add sorting
        if (query.sortBy) {
            options.order = [[query.sortBy, query.sortOrder || 'ASC']];
        }

        // Add filtering
        if (query.search) {
            options.where = {
                [Op.or]: [
                    { username: { [Op.iLike]: `%${query.search}%` } },
                    { email: { [Op.iLike]: `%${query.search}%` } },
                    { name: { [Op.iLike]: `%${query.search}%` } }
                ]
            };
        }

        return options;
    }

    sanitizeUser(user) {
        const sanitized = user.toJSON();
        delete sanitized.password;
        return sanitized;
    }
}

module.exports = new UserService();
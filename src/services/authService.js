const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/config.json')[process.env.NODE_ENV || 'development'];
const authRepository = require('../repositories/authRepository');
const  AuthValidator  = require('../validators/authValidator');
const ResponseHelper = require('../utils/responseHelper');
const { cloudinary } = require('../config/cloudinary');

class AuthService {
    async registerUser(userData) {
        try {
            console.log('Starting user registration process');
    
            // Validate input
            let validatedData;
            try {
                validatedData = await AuthValidator.validateRegister(userData);
            } catch (error) {
                console.log('Validation failed:', error);
                return ResponseHelper.badRequest(
                    'Validation failed',
                    error.details || error.message
                );
            }
            // Check existing email
            const existingUser = await authRepository.findUserByEmail(validatedData.email);
            if (existingUser) {
                return ResponseHelper.badRequest('Email already registered');
            }
    
            // Hash password
            const hashedPassword = await bcrypt.hash(validatedData.password, 10);
    
            // Create user
            const newUser = await authRepository.createUser({
                ...validatedData,
                password: hashedPassword,
                picture: userData.picture
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
            if (userData.picture) {
                await this.deleteImage(userData.picture);
            }            
            return ResponseHelper.serverError(
                'Failed to register user',
                process.env.NODE_ENV === 'development' ? error.message : undefined
            );
        }
    }

    async loginUser(credentials) {
        try {
            console.log('Login attempt for email:', credentials.email);

            // Validate login credentials
            if (!credentials.email || !credentials.password) {
                return ResponseHelper.badRequest('Email and password are required');
            }

            // Find user
            const user = await authRepository.findUserByEmail(credentials.email);
            if (!user) {
                console.log('User not found with email:', credentials.email);
                return ResponseHelper.unauthorized('Invalid email or password');
            }

            // Verify password
            const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
            if (!isPasswordValid) {
                console.log('Invalid password for user:', credentials.email);
                return ResponseHelper.unauthorized('Invalid email or password');
            }

            // Generate token
            const token = jwt.sign(
                { 
                    userId: user.id,
                    email: user.email,
                    role: user.role?.role_name 
                },
                JWT_SECRET,
                { expiresIn: '1h' }
            );

            // Remove sensitive data
            const { password, ...userWithoutPassword } = user.toJSON();

            return ResponseHelper.success(200, 'Login successful', {
                user: userWithoutPassword,
                token
            });

        } catch (error) {
            console.error('Login error:', error);
            return ResponseHelper.serverError('Login failed', 
                process.env.NODE_ENV === 'development' ? error.message : undefined
            );
        }
    }

    generateToken(user) {
        return jwt.sign(
            { 
                userId: user.id,
                role: user.role?.role_name 
            },
            JWT_SECRET,
            { 
                expiresIn: '1h' 
            }
        );
    }

    async verifyToken(token) {
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            const user = await authRepository.findUserByEmail(decoded.userId);
            
            if (!user) {
                return ResponseHelper.unauthorized('Invalid token');
            }

            return ResponseHelper.success(
                200,
                'Token verified',
                { userId: user.id }
            );
        } catch (error) {
            return ResponseHelper.unauthorized('Invalid or expired token');
        }
    }

    // Method untuk refresh token jika diperlukan
    async refreshToken(oldToken) {
        try {
            const decoded = jwt.verify(oldToken, JWT_SECRET);
            const user = await authRepository.findUserByEmail(decoded.userId);

            if (!user) {
                return ResponseHelper.unauthorized('Invalid token');
            }

            const newToken = this.generateToken(user);

            return ResponseHelper.success(
                200,
                'Token refreshed successfully',
                { token: newToken }
            );
        } catch (error) {
            return ResponseHelper.unauthorized('Invalid or expired token');
        }
    }
}

module.exports = new AuthService();
const { User, Role } = require('../models');  // Pastikan Role di-import dari models/index.js
const CustomError = require('../utils/customError');

class AuthRepository {
    async createUser(userData) {
        try {
            // Verifikasi role exists
            const role = await Role.findByPk(userData.role_id);
            if (!role) {
                throw new CustomError('Invalid role_id', 400);
            }

            return await User.create(userData);
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            if (error.name === 'SequelizeUniqueConstraintError') {
                if (error.fields.email) {
                    throw new CustomError('Email already registered', 400);
                }
                if (error.fields.username) {
                    throw new CustomError('Username already taken', 400);
                }
            }
            console.error('Database Error:', error);
            throw new CustomError('Failed to create user', 500);
        }
    }

    async findUserByEmail(email) {
        try {
            const user = await User.findOne({
                where: { email },
                include: [{
                    model: Role,
                    as: 'role',
                    attributes: ['id', 'role_name']
                }]
            });

            return user;
        } catch (error) {
            console.error('Error finding user:', error);
            throw new CustomError('Database error', 500);
        }
    }
}

module.exports = new AuthRepository();
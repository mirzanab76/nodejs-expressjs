const { User, Role } = require('../models');
const CustomError = require('../utils/customError');

class UserRepository {
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

    async findAll(options = {}) {
        const defaultOptions = {
            include: [{
                model: Role,
                as: 'role',
                attributes: ['role_name']
            }],
            ...options
        };
        
        return await User.findAll(defaultOptions);
    }

    async findById(id) {
        const user = await User.findByPk(id, {
            include: [{
                model: Role,
                as: 'role',
                attributes: ['id', 'role_name']
            }]
        });

        if (!user) {
            throw new CustomError('User not found', 404);
        }

        return user;
    }

    async findByEmail(email) {
        return await User.findOne({ where: { email } });
    }

    async update(id, userData) {
        const user = await this.findById(id);
        
        try {
            Object.assign(user, userData);
            await user.save();
            return user;
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw new CustomError('Username or email already exists', 400);
            }
            throw error;
        }
    }

    async delete(id) {
        const user = await this.findById(id);
        await user.destroy();
        return user;
    }
}

module.exports = new UserRepository();
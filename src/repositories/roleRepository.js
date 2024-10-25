const { Role, User } = require('../models');
const CustomError = require('../utils/customError');

class RoleRepository {
    async create(roleData) {
        try {
            return await Role.create(roleData);
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw new CustomError('Role name already exists', 400);
            }
            throw error;
        }
    }

    async findAll() {
        return await Role.findAll();
    }

    async findById(id) {
        return await Role.findByPk(id);
    }

    async update(id, roleData) {
        try {
            const role = await this.findById(id);
            if (!role) return null;

            Object.assign(role, roleData);
            await role.save();
            return role;
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw new CustomError('Role name already exists', 400);
            }
            throw error;
        }
    }

    async delete(id) {
        const role = await this.findById(id);
        if (!role) return null;

        // Check if role has users
        const usersCount = await User.count({ where: { role_id: id }});
        if (usersCount > 0) {
            throw new CustomError('Cannot delete role with associated users', 400);
        }

        await role.destroy();
        return role;
    }
}

module.exports = new RoleRepository();
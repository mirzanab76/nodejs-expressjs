const roleRepository = require('../repositories/roleRepository');
const { validateRole } = require('../validators/roleValidator');
const ResponseHelper = require('../utils/responseHelper');
const CustomError = require('../utils/customError');

class RoleService {
    async createRole(roleData) {
        try {
            // Validate role data
            const validatedData = await validateRole(roleData);

            // Create role
            const newRole = await roleRepository.create(validatedData);

            return ResponseHelper.success(
                201,
                'Role created successfully',
                newRole
            );
        } catch (error) {
            if (error.name === 'ValidationError') {
                return ResponseHelper.badRequest('Validation error', error.details);
            }
            if (error.statusCode === 400) {
                return ResponseHelper.badRequest(error.message);
            }
            throw new CustomError('Failed to create role', 500);
        }
    }

    async getAllRoles() {
        try {
            const roles = await roleRepository.findAll();
            return ResponseHelper.success(
                200,
                'Roles fetched successfully',
                roles
            );
        } catch (error) {
            throw new CustomError('Failed to fetch roles', 500);
        }
    }

    async getRoleById(id) {
        try {
            const role = await roleRepository.findById(id);
            if (!role) {
                return ResponseHelper.notFound('Role not found');
            }

            return ResponseHelper.success(
                200,
                'Role fetched successfully',
                role
            );
        } catch (error) {
            throw new CustomError('Failed to fetch role', 500);
        }
    }

    async updateRole(id, roleData) {
        try {
            // Validate role data
            const validatedData = await validateRole(roleData);

            // Update role
            const updatedRole = await roleRepository.update(id, validatedData);
            if (!updatedRole) {
                return ResponseHelper.notFound('Role not found');
            }

            return ResponseHelper.success(
                200,
                'Role updated successfully',
                updatedRole
            );
        } catch (error) {
            if (error.name === 'ValidationError') {
                return ResponseHelper.badRequest('Validation error', error.details);
            }
            if (error.statusCode === 400) {
                return ResponseHelper.badRequest(error.message);
            }
            throw new CustomError('Failed to update role', 500);
        }
    }

    async deleteRole(id) {
        try {
            const result = await roleRepository.delete(id);
            if (!result) {
                return ResponseHelper.notFound('Role not found');
            }

            return ResponseHelper.success(
                200,
                'Role deleted successfully'
            );
        } catch (error) {
            if (error.statusCode === 400) {
                return ResponseHelper.badRequest(error.message);
            }
            throw new CustomError('Failed to delete role', 500);
        }
    }
}

module.exports = new RoleService();
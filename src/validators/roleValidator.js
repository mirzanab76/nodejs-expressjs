const Joi = require('joi');
const CustomError = require('../utils/customError');

const roleSchema = Joi.object({
    role_name: Joi.string()
        .min(3)
        .max(50)
        .required()
        .pattern(/^[a-zA-Z0-9_]+$/)
        .messages({
            'string.empty': 'Role name tidak boleh kosong',
            'string.min': 'Role name minimal 3 karakter',
            'string.max': 'Role name maksimal 50 karakter',
            'string.pattern.base': 'Role name hanya boleh mengandung huruf, angka, dan underscore',
            'any.required': 'Role name wajib diisi'
        })
});

const validateRole = async (data) => {
    try {
        return await roleSchema.validateAsync(data, { abortEarly: false });
    } catch (error) {
        throw new CustomError('Validation Error', 400, error.details);
    }
};

module.exports = {
    validateRole
};
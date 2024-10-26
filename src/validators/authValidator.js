const Joi = require('joi');
const CustomError = require('../utils/customError');

class AuthValidator {
    static registerSchema = Joi.object({
        username: Joi.string()
            .min(3)
            .max(30)
            .pattern(/^[a-zA-Z0-9_]+$/)
            .required()
            .messages({
                'string.empty': 'Username tidak boleh kosong',
                'string.min': 'Username minimal 3 karakter',
                'string.max': 'Username maksimal 30 karakter',
                'string.pattern.base': 'Username hanya boleh mengandung huruf, angka, dan underscore',
                'any.required': 'Username wajib diisi'
            }),

        email: Joi.string()
            .email()
            .required()
            .messages({
                'string.empty': 'Email tidak boleh kosong',
                'string.email': 'Format email tidak valid',
                'any.required': 'Email wajib diisi'
            }),

        password: Joi.string()
            .min(8)
            .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&#]/)
            .required()
            .messages({
                'string.empty': 'Password tidak boleh kosong',
                'string.min': 'Password minimal 8 karakter',
                'string.pattern.base': 'Password harus mengandung minimal 1 huruf besar, 1 huruf kecil, dan 1 angka',
                'any.required': 'Password wajib diisi'
            }),

        name: Joi.string()
            .min(2)
            .max(100)
            .required()
            .messages({
                'string.empty': 'Nama tidak boleh kosong',
                'string.min': 'Nama minimal 2 karakter',
                'string.max': 'Nama maksimal 100 karakter',
                'any.required': 'Nama wajib diisi'
            }),

        address: Joi.string()
            .allow('', null)
            .optional(),

        age: Joi.number()
            .integer()
            .min(1)
            .max(150)
            .optional()
            .messages({
                'number.base': 'Umur harus berupa angka',
                'number.integer': 'Umur harus berupa bilangan bulat',
                'number.min': 'Umur minimal 1 tahun',
                'number.max': 'Umur maksimal 150 tahun'
            }),

        picture: Joi.string()
            .allow(null, '')
            .optional(),

        role_id: Joi.number()
            .integer()
            .required()
            .messages({
                'number.base': 'Role ID harus berupa angka',
                'any.required': 'Role ID wajib diisi'
            })
    });

    static async validateRegister(data) {
        try {
            // Log data yang akan divalidasi (kecuali password)
            const { password, ...logData } = data;
            console.log('Validating register data:', logData);

            const value = await this.registerSchema.validateAsync(data, {
                abortEarly: false
            });
            return value;
        } catch (error) {
            console.log('Validation errors:', error.details);
            
            const errors = error.details.map(detail => ({
                field: detail.context.key,
                message: detail.message
            }));

            throw new CustomError('Validation Error', 400, errors);
        }
    }
}

module.exports = AuthValidator;
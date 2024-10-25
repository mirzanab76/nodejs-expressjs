const Joi = require('joi');
const CustomError = require('../utils/customError');



class UserValidator {
    static createSchema = Joi.object({
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

    static async validateUser(userData, isUpdate = false) {
        try {
            const validatedData = await userSchema.validateAsync(userData, {
                context: { isUpdate }
            });
            return validatedData;
        } catch (error) {
            const errorDetails = error.details.map(detail => ({
                field: detail.context.key,
                message: detail.message
            }));
            
            throw new CustomError('Validation Error', 400, errorDetails);
        }
    }

    static async validateCreate(data) {
        try {
            // Log data yang akan divalidasi (kecuali password)
            const { password, ...logData } = data;
            console.log('Validating create data:', logData);

            const value = await this.createSchema.validateAsync(data, {
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

    static async validatePartialUpdate(updateData) {
        const partialSchema = Joi.object(
            Object.keys(updateData).reduce((acc, key) => {
                if (userSchema.extract(key)) {
                    acc[key] = userSchema.extract(key);
                }
                return acc;
            }, {})
        );

        try {
            const validatedData = await partialSchema.validateAsync(updateData, {
                context: { isUpdate: true }
            });
            return validatedData;
        } catch (error) {
            const errorDetails = error.details.map(detail => ({
                field: detail.context.key,
                message: detail.message
            }));
            
            throw new CustomError('Validation Error', 400, errorDetails);
        }
    }

    static async validateQueryParams(query) {
        const querySchema = Joi.object({
            page: Joi.number()
                .integer()
                .min(1)
                .optional()
                .messages({
                    'number.base': 'Page harus berupa angka',
                    'number.integer': 'Page harus berupa bilangan bulat',
                    'number.min': 'Page minimal 1'
                }),

            limit: Joi.number()
                .integer()
                .min(1)
                .max(100)
                .optional()
                .messages({
                    'number.base': 'Limit harus berupa angka',
                    'number.integer': 'Limit harus berupa bilangan bulat',
                    'number.min': 'Limit minimal 1',
                    'number.max': 'Limit maksimal 100'
                }),

            sortBy: Joi.string()
                .valid('username', 'email', 'name', 'age', 'createdAt')
                .optional()
                .messages({
                    'any.only': 'SortBy hanya bisa berdasarkan: username, email, name, age, createdAt'
                }),

            sortOrder: Joi.string()
                .valid('ASC', 'DESC')
                .optional()
                .messages({
                    'any.only': 'SortOrder hanya bisa ASC atau DESC'
                }),

            search: Joi.string()
                .min(1)
                .max(100)
                .optional()
                .messages({
                    'string.base': 'Search harus berupa text',
                    'string.min': 'Search minimal {#limit} karakter',
                    'string.max': 'Search maksimal {#limit} karakter'
                })
        });

        try {
            return await querySchema.validateAsync(query);
        } catch (error) {
            const errorDetails = error.details.map(detail => ({
                field: detail.context.key,
                message: detail.message
            }));
            
            throw new CustomError('Invalid Query Parameters', 400, errorDetails);
        }
    }

    static passwordStrengthTest(password) {
        const strengthTests = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /\d/.test(password),
            special: /[@$!%*?&]/.test(password)
        };

        const strength = Object.values(strengthTests).filter(Boolean).length;
        const feedback = {
            score: strength,
            isStrong: strength === 5,
            improvements: []
        };

        if (!strengthTests.length) {
            feedback.improvements.push('Password harus minimal 8 karakter');
        }
        if (!strengthTests.uppercase) {
            feedback.improvements.push('Tambahkan huruf besar');
        }
        if (!strengthTests.lowercase) {
            feedback.improvements.push('Tambahkan huruf kecil');
        }
        if (!strengthTests.number) {
            feedback.improvements.push('Tambahkan angka');
        }
        if (!strengthTests.special) {
            feedback.improvements.push('Tambahkan karakter spesial (@$!%*?&)');
        }

        return feedback;
    }
}

module.exports = UserValidator;
const Joi = require('joi');
const CustomError = require('../utils/customError');

const categorySchema = Joi.object({
    category_name: Joi.string()
        .min(2)
        .max(50)
        .required()
        .pattern(/^[a-zA-Z0-9\s-]+$/)
        .messages({
            'string.empty': 'Nama kategori tidak boleh kosong',
            'string.min': 'Nama kategori minimal 2 karakter',
            'string.max': 'Nama kategori maksimal 50 karakter',
            'string.pattern.base': 'Nama kategori hanya boleh mengandung huruf, angka, spasi, dan tanda hubung',
            'any.required': 'Nama kategori wajib diisi'
        })
});

const validateCategory = async (data) => {
    try {
        return await categorySchema.validateAsync(data, { abortEarly: false });
    } catch (error) {
        throw new CustomError('Validation Error', 400, error.details);
    }
};

module.exports = {
    validateCategory
};
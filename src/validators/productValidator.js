const Joi = require('joi');
const CustomError = require('../utils/customError');

const productSchema = Joi.object({
    product_name: Joi.string()
        .min(3)
        .max(100)
        .required()
        .messages({
            'string.empty': 'Nama produk tidak boleh kosong',
            'string.min': 'Nama produk minimal 3 karakter',
            'string.max': 'Nama produk maksimal 100 karakter',
            'any.required': 'Nama produk wajib diisi'
        }),

    description: Joi.string()
        .max(1000)
        .allow('', null)
        .messages({
            'string.max': 'Deskripsi maksimal 1000 karakter'
        }),

    price: Joi.number()
        .precision(2)
        .positive()
        .required()
        .messages({
            'number.base': 'Harga harus berupa angka',
            'number.positive': 'Harga harus lebih dari 0',
            'number.precision': 'Harga maksimal 2 angka di belakang koma',
            'any.required': 'Harga wajib diisi'
        }),

    category_id: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            'number.base': 'Category ID harus berupa angka',
            'number.integer': 'Category ID harus berupa bilangan bulat',
            'number.positive': 'Category ID tidak valid',
            'any.required': 'Category ID wajib diisi'
        })
});

const validateProduct = async (data, isUpdate = false) => {
    try {
        const schema = isUpdate ? 
            productSchema.fork(Object.keys(data), (field) => field.optional()) : 
            productSchema;

        return await schema.validateAsync(data, { abortEarly: false });
    } catch (error) {
        throw new CustomError('Validation Error', 400, error.details);
    }
};

module.exports = {
    validateProduct
};
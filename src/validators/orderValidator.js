const Joi = require('joi');

const orderCreateSchema = Joi.object({
  user_id: Joi.number()
    .required()
    .messages({
      'any.required': 'User ID is required',
      'number.base': 'User ID must be a number'
    }),
  order_details: Joi.array()
    .items(
      Joi.object({
        product_id: Joi.number().required(),
        quantity: Joi.number().min(1).required()
      })
    )
    .min(1)
    .required()
    .messages({
      'any.required': 'Order details are required',
      'array.min': 'At least one product is required'
    })
});

const orderUpdateSchema = Joi.object({
  user_id: Joi.number()
    .messages({
      'number.base': 'User ID must be a number'
    }),
  status: Joi.string()
    .valid('pending', 'processing', 'completed', 'cancelled')
    .messages({
      'any.only': 'Status must be one of: pending, processing, completed, cancelled'
    }),
  payment_status: Joi.string()
    .valid('unpaid', 'paid', 'refunded')
    .messages({
      'any.only': 'Payment status must be one of: unpaid, paid, refunded'
    }),
  order_details: Joi.array()
    .items(
      Joi.object({
        product_id: Joi.number().required(),
        quantity: Joi.number().min(1).required()
      })
    )
    .min(1)
    .messages({
      'array.min': 'At least one product is required'
    })
}).min(1); // Memastikan setidaknya ada 1 field yang diupdate

const validateCreateOrder = async (data) => {
  try {
    return await orderCreateSchema.validateAsync(data);
  } catch (error) {
    throw new Error(error.details[0].message);
  }
};

const validateUpdateOrder = async (data) => {
  try {
    return await orderUpdateSchema.validateAsync(data);
  } catch (error) {
    throw new Error(error.details[0].message);
  }
};

module.exports = { validateCreateOrder, validateUpdateOrder };
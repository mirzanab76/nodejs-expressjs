const { Product, Category } = require('../models');
const CustomError = require('../utils/customError');

class ProductRepository {
    async create(productData) {
        try {
            // Verify category exists
            const category = await Category.findByPk(productData.category_id);
            if (!category) {
                throw new CustomError('Category not found', 400);
            }

            return await Product.create(productData);
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw new CustomError('Product name already exists', 400);
            }
            throw error;
        }
    }

    async findAll(options = {}) {
        const defaultOptions = {
            include: [{
                model: Category,
                as: 'category',
                attributes: ['id', 'category_name']
            }],
            ...options
        };

        return await Product.findAll(defaultOptions);
    }

    async findById(id) {
        return await Product.findByPk(id, {
            include: [{
                model: Category,
                as: 'category',
                attributes: ['id', 'category_name']
            }]
        });
    }

    async update(id, productData) {
        const product = await this.findById(id);
        if (!product) return null;

        if (productData.category_id) {
            const category = await Category.findByPk(productData.category_id);
            if (!category) {
                throw new CustomError('Category not found', 400);
            }
        }

        Object.assign(product, productData);
        await product.save();
        return product;
    }

    async delete(id) {
        const product = await this.findById(id);
        if (!product) return null;

        await product.destroy();
        return product;
    }

    // Additional methods for advanced queries
    async findByCategory(categoryId) {
        return await Product.findAll({
            where: { category_id: categoryId },
            include: [{
                model: Category,
                as: 'category',
                attributes: ['id', 'category_name']
            }]
        });
    }

    async searchProducts(query) {
        const { Op } = require('sequelize');
        return await Product.findAll({
            where: {
                [Op.or]: [
                    { product_name: { [Op.iLike]: `%${query}%` } },
                    { description: { [Op.iLike]: `%${query}%` } }
                ]
            },
            include: [{
                model: Category,
                as: 'category',
                attributes: ['id', 'category_name']
            }]
        });
    }
}

module.exports = new ProductRepository();
const { Category, Product } = require('../models');
const CustomError = require('../utils/customError');

class CategoryRepository {
    async create(categoryData) {
        try {
            return await Category.create(categoryData);
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw new CustomError('Category name already exists', 400);
            }
            throw error;
        }
    }

    async findAll(options = {}) {
        return await Category.findAll({
            include: [{
                model: Product,
                as: 'products',
                attributes: ['id', 'product_name']
            }],
            ...options
        });
    }

    async findById(id) {
        return await Category.findByPk(id, {
            include: [{
                model: Product,
                as: 'products',
                attributes: ['id', 'product_name', 'price']
            }]
        });
    }

    async update(id, categoryData) {
        try {
            const category = await this.findById(id);
            if (!category) return null;

            Object.assign(category, categoryData);
            await category.save();
            return category;
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw new CustomError('Category name already exists', 400);
            }
            throw error;
        }
    }

    async delete(id) {
        const category = await this.findById(id);
        if (!category) return null;

        // Check if category has products
        const productsCount = await Product.count({ where: { category_id: id }});
        if (productsCount > 0) {
            throw new CustomError('Cannot delete category with associated products', 400);
        }

        await category.destroy();
        return category;
    }

    async searchCategories(query) {
        const { Op } = require('sequelize');
        return await Category.findAll({
            where: {
                category_name: { [Op.iLike]: `%${query}%` }
            },
            include: [{
                model: Product,
                as: 'products',
                attributes: ['id', 'product_name']
            }]
        });
    }
}

module.exports = new CategoryRepository();
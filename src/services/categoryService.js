const categoryRepository = require('../repositories/categoryRepository');
const { validateCategory } = require('../validators/categoryValidator');
const ResponseHelper = require('../utils/responseHelper');
const CustomError = require('../utils/customError');

class CategoryService {
    async createCategory(categoryData) {
        try {
            // Validate category data
            const validatedData = await validateCategory(categoryData);

            // Create category
            const newCategory = await categoryRepository.create(validatedData);

            return ResponseHelper.success(
                201,
                'Category created successfully',
                newCategory
            );
        } catch (error) {
            if (error.name === 'ValidationError') {
                return ResponseHelper.badRequest('Validation error', error.details);
            }
            if (error.statusCode === 400) {
                return ResponseHelper.badRequest(error.message);
            }
            throw new CustomError('Failed to create category', 500);
        }
    }

    async getAllCategories(query = {}) {
        try {
            let categories;
            if (query.search) {
                categories = await categoryRepository.searchCategories(query.search);
            } else {
                const options = this.buildQueryOptions(query);
                categories = await categoryRepository.findAll(options);
            }

            return ResponseHelper.success(
                200,
                'Categories fetched successfully',
                categories
            );
        } catch (error) {
            throw new CustomError('Failed to fetch categories', 500);
        }
    }

    async getCategoryById(id) {
        try {
            const category = await categoryRepository.findById(id);
            if (!category) {
                return ResponseHelper.notFound('Category not found');
            }

            return ResponseHelper.success(
                200,
                'Category fetched successfully',
                category
            );
        } catch (error) {
            throw new CustomError('Failed to fetch category', 500);
        }
    }

    async updateCategory(id, categoryData) {
        try {
            // Validate category data
            const validatedData = await validateCategory(categoryData);

            const updatedCategory = await categoryRepository.update(id, validatedData);
            if (!updatedCategory) {
                return ResponseHelper.notFound('Category not found');
            }

            return ResponseHelper.success(
                200,
                'Category updated successfully',
                updatedCategory
            );
        } catch (error) {
            if (error.name === 'ValidationError') {
                return ResponseHelper.badRequest('Validation error', error.details);
            }
            if (error.statusCode === 400) {
                return ResponseHelper.badRequest(error.message);
            }
            throw new CustomError('Failed to update category', 500);
        }
    }

    async deleteCategory(id) {
        try {
            const result = await categoryRepository.delete(id);
            if (!result) {
                return ResponseHelper.notFound('Category not found');
            }

            return ResponseHelper.success(
                200,
                'Category deleted successfully'
            );
        } catch (error) {
            if (error.statusCode === 400) {
                return ResponseHelper.badRequest(error.message);
            }
            throw new CustomError('Failed to delete category', 500);
        }
    }

    // Helper method untuk membangun query options
    buildQueryOptions(query) {
        const options = {};
        
        // Add sorting
        if (query.sortBy) {
            options.order = [[query.sortBy, query.sortOrder || 'ASC']];
        }

        // Add pagination
        if (query.page && query.limit) {
            options.limit = parseInt(query.limit);
            options.offset = (parseInt(query.page) - 1) * options.limit;
        }

        return options;
    }
}

module.exports = new CategoryService();
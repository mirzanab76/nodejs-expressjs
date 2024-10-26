const productRepository = require('../repositories/productRepository');
const { validateProduct } = require('../validators/productValidator');
const ResponseHelper = require('../utils/responseHelper');
const CustomError = require('../utils/customError');

class ProductService {
    async createProduct(productData) {
        try {
            // Validate product data
            const validatedData = await validateProduct(productData);

            // Format price to ensure it's a number with 2 decimal places
            validatedData.price = parseFloat(validatedData.price).toFixed(2);

            // Create product
            const newProduct = await productRepository.create(validatedData);

            return ResponseHelper.success(
                201,
                'Product created successfully',
                newProduct
            );
        } catch (error) {
            if (error.name === 'ValidationError') {
                return ResponseHelper.badRequest('Validation error', error.details);
            }
            if (error.statusCode === 400) {
                return ResponseHelper.badRequest(error.message);
            }
            throw new CustomError('Failed to create product', 500);
        }
    }

    async getAllProducts(query = {}) {
        try {
            const options = this.buildQueryOptions(query);
            const products = await productRepository.findAll(options);

            return ResponseHelper.success(
                200,
                'Products fetched successfully',
                products
            );
        } catch (error) {
            throw new CustomError('Failed to fetch products', 500);
        }
    }

    async getProductById(id) {
        try {
            const product = await productRepository.findById(id);
            if (!product) {
                return ResponseHelper.notFound('Product not found');
            }

            return ResponseHelper.success(
                200,
                'Product fetched successfully',
                product
            );
        } catch (error) {
            throw new CustomError('Failed to fetch product', 500);
        }
    }

    async updateProduct(id, productData) {
        try {
            // Validate product data
            const validatedData = await validateProduct(productData, true);

            if (validatedData.price) {
                validatedData.price = parseFloat(validatedData.price).toFixed(2);
            }

            const updatedProduct = await productRepository.update(id, validatedData);
            if (!updatedProduct) {
                return ResponseHelper.notFound('Product not found');
            }

            return ResponseHelper.success(
                200,
                'Product updated successfully',
                updatedProduct
            );
        } catch (error) {
            if (error.name === 'ValidationError') {
                return ResponseHelper.badRequest('Validation error', error.details);
            }
            if (error.statusCode === 400) {
                return ResponseHelper.badRequest(error.message);
            }
            throw new CustomError('Failed to update product', 500);
        }
    }

    async deleteProduct(id) {
        try {
            const result = await productRepository.delete(id);
            if (!result) {
                return ResponseHelper.notFound('Product not found');
            }

            return ResponseHelper.success(
                200,
                'Product deleted successfully'
            );
        } catch (error) {
            throw new CustomError('Failed to delete product', 500);
        }
    }

    // Helper method untuk membangun query options
    buildQueryOptions(query) {
        const options = {};
        
        // Add search
        if (query.search) {
            return productRepository.searchProducts(query.search);
        }

        // Add category filter
        if (query.category_id) {
            return productRepository.findByCategory(query.category_id);
        }

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

module.exports = new ProductService();
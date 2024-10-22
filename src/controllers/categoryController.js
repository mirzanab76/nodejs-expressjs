const categoryService = require('../services/categoryService');

exports.createCategory = async (req, res, next) => {
  try {
    const { category_name } = req.body;
    const newCategory = await categoryService.createCategory({ category_name });

    res.status(201).json({
      statusCode: 201,
      message: 'Category created successfully',
      success: true,
      data: newCategory
    });
  } catch (error) {
    next({
      statusCode: 500,
      message: 'Failed to create category',
      success: false,
      error: error.message
    });
  }
};

exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await categoryService.getAllCategories();

    res.status(200).json({
      statusCode: 200,
      message: 'Categories fetched successfully',
      success: true,
      data: categories
    });
  } catch (error) {
    next({
      statusCode: 500,
      message: 'Failed to fetch categories',
      success: false,
      error: error.message
    });
  }
};

exports.getCategoryById = async (req, res, next) => {
  try {
    const category = await categoryService.getCategoryById(req.params.id);
    if (!category) {
      return res.status(404).json({
        statusCode: 404,
        message: 'Category not found',
        success: false
      });
    }

    res.status(200).json({
      statusCode: 200,
      message: 'Category fetched successfully',
      success: true,
      data: category
    });
  } catch (error) {
    next({
      statusCode: 500,
      message: 'Failed to fetch category',
      success: false,
      error: error.message
    });
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const { category_name } = req.body;
    const updatedCategory = await categoryService.updateCategory(req.params.id, { category_name });
    if (!updatedCategory) {
      return res.status(404).json({
        statusCode: 404,
        message: 'Category not found',
        success: false
      });
    }

    res.status(200).json({
      statusCode: 200,
      message: 'Category updated successfully',
      success: true,
      data: updatedCategory
    });
  } catch (error) {
    next({
      statusCode: 500,
      message: 'Failed to update category',
      success: false,
      error: error.message
    });
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const deleteCategory = await categoryService.deleteCategory(req.params.id);
    if (!deleteCategory) {
      return res.status(404).json({
        statusCode: 404,
        message: 'Category not found',
        success: false
      });
    }

    res.status(200).json({
      statusCode: 200,
      message: 'Category deleted successfully',
      success: true
    });
  } catch (error) {
    next({
      statusCode: 500,
      message: 'Failed to delete category',
      success: false,
      error: error.message
    });
  }
};

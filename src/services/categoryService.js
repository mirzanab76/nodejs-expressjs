const {  Category } = require('../models');

exports.createCategory = async ({ category_name }) => {
  const newCategory = await Category.create({ category_name });
  return newCategory;
};

exports.getAllCategorys = async () => {
  const categories = await Category.findAll();
  return categories;
};

exports.getCategoryById = async (id) => {
    const category = await Category.findOne({ where: { id } }); 
    return category;

};

exports.updateCategory = async (id, { category_name }) => {
  const category = await Category.findByPk(id);
  if (!category) return null;
  category.category_name = category_name || category.category_name;
  await category.save();
  return category;
};

exports.deleteCategory = async (id) => {
  const category = await Category.findByPk(id);
  if (!category) return null;
  await category.destroy();
  return category;
};

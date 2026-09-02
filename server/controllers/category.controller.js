const Category = require('../models/Category');

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.json(categories);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const createCategory = async (req, res) => {
  try {
    const category = new Category({ name: req.body.name, description: req.body.description });
    const created = await category.save();
    res.status(201).json(created);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: 'Category removed' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

module.exports = { getCategories, createCategory, deleteCategory };

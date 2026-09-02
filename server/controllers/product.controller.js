const Product = require('../models/Product');

const getProducts = async (req, res) => {
  try {
    const { keyword, gender, category } = req.query;
    let query = {};
    
    if (keyword) {
      query.name = { $regex: keyword, $options: 'i' };
    }
    if (gender) {
      query.gender = gender;
    }
    
    // We will find category by name first if category query is provided
    if (category) {
      const Category = require('../models/Category');
      const cat = await Category.findOne({ name: category });
      if (cat) query.category = cat._id;
    }

    const products = await Product.find(query).populate('category collectionRef');
    res.json(products);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category collectionRef');
    if (product) res.json(product);
    else res.status(404).json({ message: 'Product not found' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    const created = await product.save();
    res.status(201).json(created);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(product);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product removed' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };

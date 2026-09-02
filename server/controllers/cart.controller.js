const Cart = require('../models/Cart');
const Product = require('../models/Product');

const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }
    res.json(cart);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const addToCart = async (req, res) => {
  try {
    const { productId, size, color, quantity, price } = req.body;
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });

    const itemIndex = cart.items.findIndex(p => p.product.toString() === productId && p.size === size && p.color === color);
    
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ product: productId, size, color, quantity, price });
    }
    
    await cart.save();
    cart = await Cart.findById(cart._id).populate('items.product');
    res.json(cart);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const removeFromCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    cart.items = cart.items.filter(item => item._id.toString() !== req.params.itemId);
    await cart.save();
    cart = await Cart.findById(cart._id).populate('items.product');
    res.json(cart);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const clearCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if(cart) {
      cart.items = [];
      await cart.save();
    }
    res.json(cart);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

module.exports = { getCart, addToCart, removeFromCart, clearCart };

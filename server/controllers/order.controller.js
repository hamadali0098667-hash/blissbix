const Order = require('../models/Order');
const Product = require('../models/Product');

const addOrderItems = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, itemsPrice, shippingFee, total } = req.body;
    
    if (orderItems && orderItems.length === 0) {
      res.status(400).json({ message: 'No order items' });
      return;
    }
    
    // Reduce stock for each item
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (product) {
        const variant = product.variants.find(v => v.size === item.size && v.color === item.color);
        if (variant) {
          if (variant.stock < item.quantity) {
             return res.status(400).json({ message: `Insufficient stock for ${product.name} (${item.size}, ${item.color})` });
          }
          variant.stock -= item.quantity;
        }
        await product.save();
      }
    }
    
    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      subtotal: itemsPrice,
      shippingFee,
      total
    });
    
    const createdOrder = await order.save();
    
    // Clear user cart after order
    const Cart = require('../models/Cart');
    let cart = await Cart.findOne({ user: req.user._id });
    if(cart) {
      cart.items = [];
      await cart.save();
    }
    
    res.status(201).json(createdOrder);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (order) res.json(order);
    else res.status(404).json({ message: 'Order not found' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'id name').sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.orderStatus = req.body.status;
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const deleteOrder = async (req, res) => {
  try {
    const Order = require('../models/Order');
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: 'Order removed' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

module.exports = { addOrderItems, getOrderById, getMyOrders, getOrders, updateOrderStatus, deleteOrder };

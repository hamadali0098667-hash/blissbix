const fs = require('fs');
const path = require('path');

const write = (p, content) => {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content);
};

write('controllers/product.controller.js', `const Product = require('../models/Product');

const getProducts = async (req, res) => {
  try {
    const products = await Product.find({}).populate('category collectionRef');
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
`);

write('routes/product.routes.js', `const express = require('express');
const router = express.Router();
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../controllers/product.controller');
const { protect, admin } = require('../middleware/auth');

router.route('/').get(getProducts).post(protect, admin, createProduct);
router.route('/:id').get(getProductById).put(protect, admin, updateProduct).delete(protect, admin, deleteProduct);

module.exports = router;
`);

write('controllers/cart.controller.js', `const Cart = require('../models/Cart');
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
    res.json(cart);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const removeFromCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    cart.items = cart.items.filter(item => item._id.toString() !== req.params.itemId);
    await cart.save();
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
`);

write('routes/cart.routes.js', `const express = require('express');
const router = express.Router();
const { getCart, addToCart, removeFromCart, clearCart } = require('../controllers/cart.controller');
const { protect } = require('../middleware/auth');

router.route('/').get(protect, getCart).post(protect, addToCart).delete(protect, clearCart);
router.route('/:itemId').delete(protect, removeFromCart);

module.exports = router;
`);

write('controllers/order.controller.js', `const Order = require('../models/Order');

const addOrderItems = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, itemsPrice, shippingFee, total } = req.body;
    
    if (orderItems && orderItems.length === 0) {
      res.status(400).json({ message: 'No order items' });
      return;
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

module.exports = { addOrderItems, getOrderById, getMyOrders, getOrders, updateOrderStatus };
`);

write('routes/order.routes.js', `const express = require('express');
const router = express.Router();
const { addOrderItems, getOrderById, getMyOrders, getOrders, updateOrderStatus } = require('../controllers/order.controller');
const { protect, admin } = require('../middleware/auth');

router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders);
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/status').put(protect, admin, updateOrderStatus);

module.exports = router;
`);

write('controllers/wishlist.controller.js', `const Wishlist = require('../models/Wishlist');

const getWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate('products');
    if (!wishlist) wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    res.json(wishlist);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    
    if (!wishlist.products.includes(productId)) {
      wishlist.products.push(productId);
      await wishlist.save();
    }
    res.json(wishlist);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const removeFromWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (wishlist) {
      wishlist.products = wishlist.products.filter(id => id.toString() !== req.params.productId);
      await wishlist.save();
    }
    res.json(wishlist);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

module.exports = { getWishlist, addToWishlist, removeFromWishlist };
`);

write('routes/wishlist.routes.js', `const express = require('express');
const router = express.Router();
const { getWishlist, addToWishlist, removeFromWishlist } = require('../controllers/wishlist.controller');
const { protect } = require('../middleware/auth');

router.route('/').get(protect, getWishlist).post(protect, addToWishlist);
router.route('/:productId').delete(protect, removeFromWishlist);

module.exports = router;
`);

// Overwrite server.js to include all routes
write('server.js', `const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/error');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/categories', require('./routes/category.routes'));
app.use('/api/collections', require('./routes/collection.routes'));
app.use('/api/products', require('./routes/product.routes'));
app.use('/api/cart', require('./routes/cart.routes'));
app.use('/api/wishlist', require('./routes/wishlist.routes'));
app.use('/api/orders', require('./routes/order.routes'));

// Upload route for Admin
const upload = require('./middleware/upload');
app.post('/api/upload', upload.single('image'), (req, res) => {
  res.send(\`/\${req.file.path.replace(/\\\\/g, '/')}\`);
});

app.get('/', (req, res) => res.send('API is running...'));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(\`Server running on port \${PORT}\`));
`);

console.log('Part 3 generated!');

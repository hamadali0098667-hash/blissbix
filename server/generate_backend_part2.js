const fs = require('fs');
const path = require('path');

const write = (p, content) => {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content);
};

write('controllers/auth.controller.js', `const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });
    const user = await User.create({ name, email, password, phone });
    if (user) {
      res.status(201).json({
        _id: user._id, name: user.name, email: user.email, role: user.role, token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id, name: user.name, email: user.email, role: user.role, token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      res.json({ _id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { registerUser, loginUser, getUserProfile, getAllUsers };
`);

write('routes/auth.routes.js', `const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile, getAllUsers } = require('../controllers/auth.controller');
const { protect, admin } = require('../middleware/auth');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getUserProfile);
router.get('/users', protect, admin, getAllUsers);

module.exports = router;
`);

write('controllers/category.controller.js', `const Category = require('../models/Category');

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
`);

write('routes/category.routes.js', `const express = require('express');
const router = express.Router();
const { getCategories, createCategory, deleteCategory } = require('../controllers/category.controller');
const { protect, admin } = require('../middleware/auth');

router.route('/').get(getCategories).post(protect, admin, createCategory);
router.route('/:id').delete(protect, admin, deleteCategory);

module.exports = router;
`);

write('controllers/collection.controller.js', `const Collection = require('../models/Collection');

const getCollections = async (req, res) => {
  try {
    const collections = await Collection.find({});
    res.json(collections);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const createCollection = async (req, res) => {
  try {
    const collection = new Collection({ name: req.body.name, description: req.body.description });
    const created = await collection.save();
    res.status(201).json(created);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const deleteCollection = async (req, res) => {
  try {
    await Collection.findByIdAndDelete(req.params.id);
    res.json({ message: 'Collection removed' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

module.exports = { getCollections, createCollection, deleteCollection };
`);

write('routes/collection.routes.js', `const express = require('express');
const router = express.Router();
const { getCollections, createCollection, deleteCollection } = require('../controllers/collection.controller');
const { protect, admin } = require('../middleware/auth');

router.route('/').get(getCollections).post(protect, admin, createCollection);
router.route('/:id').delete(protect, admin, deleteCollection);

module.exports = router;
`);

write('.env', `NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/blissbix
JWT_SECRET=blissbix_secret_123
`);

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
// We will add products, cart, wishlist, orders later

app.get('/', (req, res) => res.send('API is running...'));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(\`Server running on port \${PORT}\`));
`);

console.log('Part 2 generated!');

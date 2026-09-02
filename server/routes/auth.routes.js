const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile, getAllUsers, updateUserProfile, updatePassword, deleteUser } = require('../controllers/auth.controller');
const { protect, admin } = require('../middleware/auth');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.route('/me').get(protect, getUserProfile).put(protect, updateUserProfile);
router.put('/password', protect, updatePassword);
router.route('/users').get(protect, admin, getAllUsers);
router.route('/users/:id').delete(protect, admin, deleteUser);

module.exports = router;

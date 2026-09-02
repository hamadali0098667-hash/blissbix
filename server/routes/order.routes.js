const express = require('express');
const router = express.Router();
const { addOrderItems, getOrderById, getMyOrders, getOrders, updateOrderStatus, deleteOrder } = require('../controllers/order.controller');
const { protect, admin } = require('../middleware/auth');

router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders);
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id').get(protect, getOrderById).delete(protect, admin, deleteOrder);
router.route('/:id/status').put(protect, admin, updateOrderStatus);

module.exports = router;

const express = require('express');
const router = express.Router();
const { getCollections, createCollection, deleteCollection } = require('../controllers/collection.controller');
const { protect, admin } = require('../middleware/auth');

router.route('/').get(getCollections).post(protect, admin, createCollection);
router.route('/:id').delete(protect, admin, deleteCollection);

module.exports = router;

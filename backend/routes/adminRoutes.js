const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');


// GET /api/users
router.get('/users', adminController.getAllUsers);

// GET /api/orders
router.get('/orders', adminController.getAllOrders);

module.exports = router;

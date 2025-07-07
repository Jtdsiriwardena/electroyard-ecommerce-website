const express = require('express');
const router = express.Router();
const { createPaymentIntent, getPaymentDetails, handleStripeWebhook } = require('../controllers/paymentController');
const auth = require('../middleware/auth');

// Create payment intent for Stripe
router.post('/create-payment-intent', auth, createPaymentIntent);

// Get payment details for a specific order
router.get('/:order_id', auth, getPaymentDetails);

module.exports = router;
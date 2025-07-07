const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Payment = require('../models/Payment');
const Order = require('../models/Order');


// Create a Payment Intent
exports.createPaymentIntent = async (req, res) => {
  try {

    const { order_id } = req.body;

    // Check if order exists
    const order = await Order.findById(order_id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: order.total_amount * 100,
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never'
      }
    });

    // Save payment to DB
    const payment = new Payment({
      order: order._id,
      payment_method: 'stripe',
      payment_status: paymentIntent.status,
      transaction_id: paymentIntent.id
    });

    await payment.save();

    // Return client secret so the frontend can complete the payment.
    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating payment intent', error: error.message });
  }
};





// Get payment details by order ID
exports.getPaymentDetails = async (req, res) => {
  try {
    const { order_id } = req.params;

    // Find payment for this order
    const payment = await Payment.findOne({ order: order_id });

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.status(200).json(payment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching payment details', error: error.message });
  }
};


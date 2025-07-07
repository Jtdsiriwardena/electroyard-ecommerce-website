const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Cart = require('../models/Cart');
const CartItem = require('../models/CartItem');
const Product = require('../models/Product');
const { updateOrderPaymentStatus } = require('../controllers/orderController');
const sendEmail = require('../utils/sendEmail');




// Create Order from Cart (POST /api/orders)
router.post('/', auth, async (req, res) => {
  try {
    const { 
      first_name, 
      last_name, 
      email, 
      phone_number, 
      shipping_address: { address, city, postal_code, country } = {} 
    } = req.body;

    if (!first_name || !last_name || !email || !phone_number) {
      return res.status(400).json({ message: "Please provide all required customer details." });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(400).json({ message: 'Cart not found' });

    const cartItems = await CartItem.find({ cart: cart._id }).populate('product');
    if (!cartItems.length) return res.status(400).json({ message: 'Cart is empty' });

    const total_amount = cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    const newOrder = new Order({
      user: req.user._id,
      first_name,
      last_name,
      email,
      phone_number,
      total_amount,
      shipping_address: { address, city, postal_code, country },
    });

    const savedOrder = await newOrder.save();

    const orderItems = cartItems.map(item => ({
      order: savedOrder._id,
      product: item.product._id,
      quantity: item.quantity,
      price: item.product.price
    }));

    await OrderItem.insertMany(orderItems);

    // Clear the cart after order
    await CartItem.deleteMany({ cart: cart._id });

    res.status(201).json({ order: savedOrder, items: orderItems });
  } catch (err) {
    console.error("Order creation failed:", err);
    res.status(500).json({ message: err.message });
  }
});


// Get all orders for current user (GET /api/orders)
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ created_at: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get specific order details (GET /api/orders/:id)
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user');
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const items = await OrderItem.find({ order: order._id }).populate('product');
    res.json({ order, items });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Update order status (PUT /api/orders/:id/status)
router.put('/:id/status', async (req, res) => {
  try {
    const { order_status } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { order_status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

  
        // Send status-specific emails
        const statusMessages = {
          shipped: `
        Dear Customer,
        
        We are pleased to inform you that your order has been **shipped** and is now on its way to your provided address.
        
        You will receive another update once your order is out for delivery.
        
        Thank you for choosing ElectroYard.
        
        Best regards,  
        Team ElectroYard
        `,
        
          delivered: `
        Dear Customer,
        
        We are delighted to inform you that your order has been **successfully delivered**.
        
        We hope you are satisfied with your purchase. Should you have any feedback or questions, feel free to reach out to us.
        
        Thank you for shopping at ElectroYard.
        
        Warm regards,  
        Team ElectroYard
        `,
        
          cancelled: `
        Dear Customer,
        
        We regret to inform you that your order has been **cancelled**.
        
        If this was unexpected or you have any concerns, please don’t hesitate to contact our support team. We're here to help.
        
        Thank you for your understanding and continued trust in ElectroYard.
        
        Sincerely,  
        Team ElectroYard
        `
        };

    if (['shipped', 'delivered', 'cancelled'].includes(order_status)) {
      try {
        await sendEmail({
          to: updatedOrder.email,
          subject: `Order ${order_status.charAt(0).toUpperCase() + order_status.slice(1)}`,
          text: statusMessages[order_status]
        });
        console.log(`Status email sent for order ${updatedOrder._id}`);
      } catch (emailError) {
        console.error(`Failed to send status email for order ${updatedOrder._id}:`, emailError);
        // Don't fail the whole request if email fails
      }
    }

    res.json(updatedOrder);
  } catch (err) {
    console.error('Error updating order status:', err);
    res.status(500).json({ message: err.message });
  }
});




// PUT /api/orders/:orderId/payment
router.put('/:orderId/payment', auth, updateOrderPaymentStatus);




module.exports = router;









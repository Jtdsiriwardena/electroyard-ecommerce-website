const Order = require('../models/Order');

const updateOrderPaymentStatus = async (req, res) => {
  const { orderId } = req.params;
  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    order.status = 'paid';
    order.paidAt = new Date();
    await order.save();

    res.status(200).json({ message: 'Payment confirmed and order updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to confirm payment' });
  }
};

module.exports = {
  updateOrderPaymentStatus,
};

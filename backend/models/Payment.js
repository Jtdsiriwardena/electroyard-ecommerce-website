const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  order: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Order', 
    required: true 
  },
  payment_method: { 
    type: String, 
    required: true 
  },
  payment_status: {
    type: String,
    enum: [
      'pending',
      'completed',
      'failed',
      'refunded',
      'requires_payment_method',
      'requires_confirmation',
      'requires_action',
      'processing',
      'succeeded',
      'canceled'
    ],
    default: 'pending'
  },
  transaction_id: { 
    type: String 
  },
  paid_at: { 
    type: Date 
  },
  created_at: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Payment', PaymentSchema);

const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  product_code: { 
    type: String, 
    required: true, 
    unique: true 
  },  
  name: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true,
    min: 0 
  },
  category: { 
    type: String, 
    required: true 
  },
  stock_quantity: { 
    type: Number, 
    required: true, 
    default: 0,
    min: 0 
  },
  brand: { 
    type: String, 
    required: false 
  },
  country: { 
    type: String, 
    required: false 
  },
  weight: { 
    type: Number, 
    required: false, 
    min: 0 
  },
  discount_percentage: { 
    type: Number, 
    required: false, 
    min: 0, 
    max: 100 
  },
  image: { 
    type: String, 
    required: false 
  },
  ratings: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviews: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    comment: { type: String },
    rating: { type: Number, min: 0, max: 5 },
    created_at: { type: Date, default: Date.now }
  }],
  availability: { 
    type: String, 
    enum: ['in_stock', 'out_of_stock'], 
    default: 'in_stock' 
  },
});

module.exports = mongoose.model('Product', ProductSchema);
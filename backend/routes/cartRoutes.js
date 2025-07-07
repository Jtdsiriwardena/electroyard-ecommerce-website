const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Cart = require('../models/Cart');
const CartItem = require('../models/CartItem');
const Product = require('../models/Product');

// GET cart
router.get('/', auth, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({ user: req.user._id });
      await cart.save();
      return res.json({ _id: cart._id, items: [], total: 0, item_count: 0 });
    }

    const cartItems = await CartItem.find({ cart: cart._id }).populate('product');

    let total = 0;
    let item_count = 0;

    const items = cartItems.map(item => {
      const productPrice = item.product.discount_percentage
        ? item.product.price * (1 - item.product.discount_percentage / 100)
        : item.product.price;

      const itemTotal = Number((item.quantity * productPrice).toFixed(2));
      total += itemTotal;
      item_count += item.quantity;

      return {
        _id: item._id,
        product: {
          product_id: item.product.product_id,
          name: item.product.name,
          price: item.product.price,
          discount_percentage: item.product.discount_percentage,
          discounted_price: productPrice,
          image: item.product.image,
          category: item.product.category,
          availability: item.product.availability
        },
        quantity: item.quantity,
        item_total: itemTotal
      };
    });

    res.json({ _id: cart._id, items, total: Number(total.toFixed(2)), item_count });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ error: 'Server error fetching cart' });
  }
});

// POST add item to cart
router.post('/items', auth, async (req, res) => {
  try {
    const { product_id, quantity } = req.body;

    if (!product_id || !quantity) {
      return res.status(400).json({ error: 'Product ID and quantity are required' });
    }

    const qty = parseInt(quantity);
    if (isNaN(qty) || qty < 1) {
      return res.status(400).json({ error: 'Quantity must be a positive number' });
    }

    const product = await Product.findById(product_id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (product.availability === 'out_of_stock' || product.stock_quantity < qty) {
      return res.status(400).json({ error: 'Not enough product in stock', available: product.stock_quantity });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id });
      await cart.save();
    }

    let cartItem = await CartItem.findOne({ cart: cart._id, product: product._id });

    if (cartItem) {
      if (cartItem.quantity + qty > product.stock_quantity) {
        return res.status(400).json({
          error: 'Cannot add more of this item - exceeds available stock',
          available: product.stock_quantity,
          in_cart: cartItem.quantity
        });
      }

      cartItem.quantity += qty;
      await cartItem.save();
    } else {
      cartItem = new CartItem({ cart: cart._id, product: product._id, quantity: qty });
      await cartItem.save();
    }

    const cartItems = await CartItem.find({ cart: cart._id }).populate('product');

    let total = 0;
    let item_count = 0;

    const items = cartItems.map(item => {
      const productPrice = item.product.discount_percentage
        ? item.product.price * (1 - item.product.discount_percentage / 100)
        : item.product.price;

      const itemTotal = Number((item.quantity * productPrice).toFixed(2));
      total += itemTotal;
      item_count += item.quantity;

      return {
        _id: item._id,
        product: {
          product_id: item.product.product_id,
          name: item.product.name,
          product_code: item.product.product_code,
          price: item.product.price,
          discount_percentage: item.product.discount_percentage,
          discounted_price: productPrice,
          image: item.product.image,
          category: item.product.category,
          availability: item.product.availability
        },
        quantity: item.quantity,
        item_total: itemTotal
      };
    });

    res.status(201).json({
      message: 'Item added to cart successfully',
      cart: {
        _id: cart._id,
        items,
        total: Number(total.toFixed(2)),
        item_count
      }
    });
  } catch (error) {
    console.error('Error adding item to cart:', error);
    res.status(500).json({ error: 'Server error adding item to cart' });
  }
});

// PUT update cart item
router.put('/items/:item_id', auth, async (req, res) => {
  try {
    const { item_id } = req.params;
    const { quantity } = req.body;

    const qty = parseInt(quantity);
    if (isNaN(qty) || qty < 1) {
      return res.status(400).json({ error: 'Quantity must be a positive number' });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const cartItem = await CartItem.findOne({ _id: item_id, cart: cart._id }).populate('product');
    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    const product = cartItem.product;
    if (!product || product.stock_quantity < qty) {
      return res.status(400).json({ error: 'Not enough product in stock', available: product?.stock_quantity });
    }

    cartItem.quantity = qty;
    await cartItem.save();

    const cartItems = await CartItem.find({ cart: cart._id }).populate('product');

    let total = 0;
    let item_count = 0;

    const items = cartItems.map(item => {
      const productPrice = item.product.discount_percentage
        ? item.product.price * (1 - item.product.discount_percentage / 100)
        : item.product.price;

      const itemTotal = Number((item.quantity * productPrice).toFixed(2));
      total += itemTotal;
      item_count += item.quantity;

      return {
        _id: item._id,
        product: {
          product_id: item.product.product_id,
          name: item.product.name,
          sku: item.product.sku,
          price: item.product.price,
          discount_percentage: item.product.discount_percentage,
          discounted_price: productPrice,
          image: item.product.image,
          category: item.product.category,
          availability: item.product.availability
        },
        quantity: item.quantity,
        item_total: itemTotal
      };
    });

    res.json({
      message: 'Cart item updated successfully',
      cart: {
        _id: cart._id,
        items,
        total: Number(total.toFixed(2)),
        item_count
      }
    });
  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(500).json({ error: 'Server error updating cart item' });
  }
});

// DELETE cart item
router.delete('/items/:item_id', auth, async (req, res) => {
  try {
    const { item_id } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const cartItem = await CartItem.findOneAndDelete({ _id: item_id, cart: cart._id });
    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    const cartItems = await CartItem.find({ cart: cart._id }).populate('product');

    let total = 0;
    let item_count = 0;

    const items = cartItems.map(item => {
      const productPrice = item.product.discount_percentage
        ? item.product.price * (1 - item.product.discount_percentage / 100)
        : item.product.price;

      const itemTotal = Number((item.quantity * productPrice).toFixed(2));
      total += itemTotal;
      item_count += item.quantity;

      return {
        _id: item._id,
        product: {
          product_id: item.product.product_id,
          name: item.product.name,
          sku: item.product.sku,
          price: item.product.price,
          discount_percentage: item.product.discount_percentage,
          discounted_price: productPrice,
          image: item.product.image,
          category: item.product.category,
          availability: item.product.availability
        },
        quantity: item.quantity,
        item_total: itemTotal
      };
    });

    res.json({
      message: 'Item removed from cart successfully',
      cart: {
        _id: cart._id,
        items,
        total: Number(total.toFixed(2)),
        item_count
      }
    });
  } catch (error) {
    console.error('Error removing item from cart:', error);
    res.status(500).json({ error: 'Server error removing item from cart' });
  }
});

// DELETE clear cart
router.delete('/clear', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    await CartItem.deleteMany({ cart: cart._id });

    res.json({
      message: 'Cart cleared successfully',
      cart: {
        _id: cart._id,
        items: [],
        total: 0,
        item_count: 0
      }
    });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ error: 'Server error clearing cart' });
  }
});

module.exports = router;

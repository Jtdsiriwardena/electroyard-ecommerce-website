const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController.js'); 

// Create a new product 
router.post('/', productController.createProduct);

// Get all products
router.get('/', productController.getAllProducts);

// Get latest products
router.get('/latest', productController.getLatestProducts);

// Get discounted products
router.get('/discounted', productController.getDiscountedProducts);

// Get a single product by ID
router.get('/:id', productController.getProductById);

// Update a product by ID 
router.put('/:id', productController.updateProduct);

// Delete a product by ID
router.delete('/:id', productController.deleteProduct);

module.exports = router;
const Product = require('../models/Product');
const multer = require('multer');

// storage for uploaded images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// File filter to accept only images
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

// Initialize multer configuration
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5 // 5MB limit for image
    }
});

// Create a new product
exports.createProduct = [
    upload.single('image'),
    async (req, res) => {
        try {
            const { product_code, name, description, price, category, stock_quantity, brand, country, weight, discount_percentage, availability } = req.body;

            const newProduct = new Product({
                product_code,
                name,
                description,
                price,
                category,
                stock_quantity,
                brand,
                country,
                weight,
                discount_percentage,
                availability,
                image: req.file ? req.file.path : null
            });

            const savedProduct = await newProduct.save();
            res.status(201).json(savedProduct);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }
];

// Update a product
exports.updateProduct = [
    upload.single('image'),
    async (req, res) => {
        try {
            const updateData = { ...req.body };
            if (req.file) {
                updateData.image = req.file.path;
            }

            const updatedProduct = await Product.findByIdAndUpdate(
                req.params.id,
                updateData,
                { new: true }
            );

            if (!updatedProduct) {
                return res.status(404).json({ message: 'Product not found' });
            }

            res.json(updatedProduct);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }
];

// Get all products
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Get a product by ID
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.status(200).json(product);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};


// Delete a product by ID
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};


exports.getLatestProducts = async (req, res) => {
    try {
      const products = await Product.find()
        .sort({ createdAt: -1 }) // Sort by newest first
        .limit(8); // Limit to 8 products
      res.status(200).json(products);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };


  exports.getDiscountedProducts = async (req, res) => {
    try {
      const products = await Product.find({ 
        discount_percentage: { $gt: 0 } // Find products with discount greater than 0
      })
        .sort({ discount_percentage: -1 }) // Sort by highest discount first
        .limit(8); // Limit to 8 products
      res.status(200).json(products);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };
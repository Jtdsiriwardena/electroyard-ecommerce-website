const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

// Helper function to generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
};

// Register a new user
exports.register = async (req, res) => {
  try {
    const { email, password, first_name, last_name, role } = req.body;

    // Check if user already exists using Email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // if not, Create new user
    const user = new User({
      email,
      password,
      first_name,
      last_name,
      role
    });

    await user.save();

    // Generate JWT token
    const token = generateToken(user);

    // Validate JWT_SECRET is set in .env file
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    const generateToken = (user) => {
      return jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
    };

    res.status(201).json({
      message: 'User register successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password is matching
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = generateToken(user);

    res.json({
      _id: user._id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get current user profile
exports.getMe = async (req, res) => {
  try {
    // req.user is set by the auth middleware to find the user 
    // Returns user info without the password
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Update current user profile
exports.updateMe = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      phone_number,
      shipping_address,
      current_password,
      new_password
    } = req.body;

    if (!first_name || !last_name || !email) {
      return res.status(400).json({ message: 'First name, last name, and email are required' });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Update profile fields
    user.first_name = first_name;
    user.last_name = last_name;
    user.email = email;
    user.phone_number = phone_number;

    if (shipping_address) {
      user.shipping_address = {
        address: shipping_address.address,
        city: shipping_address.city,
        postal_code: shipping_address.postal_code,
        country: shipping_address.country
      };
    }

    // Handle password update
    //If changing the password, checks the current one first before updating to the new one
    if (current_password && new_password) {
      const isMatch = await user.comparePassword(current_password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }
      user.password = new_password; // will be hashed by pre-save middleware
    }

    await user.save();

    res.json({
      id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone_number: user.phone_number,
      shipping_address: user.shipping_address
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user shipping address
exports.updateAddress = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id, // assuming the user is authenticated via JWT and `req.user` is set
      { shipping_address: req.body.shipping_address },
      { new: true } // return the updated user
    );
    res.status(200).json(user);
  } catch (error) {
    console.error("Error updating address:", error);
    res.status(500).json({ message: "Error updating address" });
  }
};



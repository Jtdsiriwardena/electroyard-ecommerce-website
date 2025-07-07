const Category = require('../models/Category');

// Create a new category
exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const image = req.file ? req.file.path.replace(/\\/g, '/') : null;  //optional

    const newCategory = new Category({ name, image });
    const savedCategory = await newCategory.save();

    res.status(201).json(savedCategory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.status(200).json(category);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


// Update category by ID
exports.updateCategory = async (req, res) => {
  try {
    const updateFields = {};

    if (req.body.name) {
      updateFields.name = req.body.name; //Checks if there's a new name
    }

    if (req.file) {
      updateFields.image = req.file.path.replace(/\\/g, '/'); //Checks if there's a new image
    }

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ message: 'No data provided for update' });
    }


    //Prepares to update only the fields that were provided
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json(updatedCategory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


// Delete category by ID
exports.deleteCategory = async (req, res) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);
    if (!deletedCategory) return res.status(404).json({ message: 'Category not found' });
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

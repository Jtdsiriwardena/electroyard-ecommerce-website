import axios from 'axios';

// Create an axios instance with the base URL
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

const getAllCategories = () => {
  return api.get('/categories');
};

const getCategoryById = (id) => {
  return api.get(`/categories/${id}`);
};

const createCategory = (categoryData) => {
  return api.post('/categories', categoryData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

const updateCategory = (id, categoryData) => {
  return api.put(`/categories/${id}`, categoryData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

const deleteCategory = (id) => {
  return api.delete(`/categories/${id}`);
};

const categoryService = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};

export default categoryService;
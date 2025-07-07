import axios from 'axios';

const API_URL = 'http://localhost:5000/api/products';

const getProducts = () => {
  return axios.get(API_URL);
};

const getProductById = (id) => {
  return axios.get(`${API_URL}/${id}`);
};

const getAllProducts = async () => {
  return await axios.get(API_URL);
};

const createProduct = (productData) => {
  return axios.post(API_URL, productData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

const updateProduct = (id, productData) => {
  return axios.put(`${API_URL}/${id}`, productData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

const deleteProduct = (id) => {
  return axios.delete(`${API_URL}/${id}`);
};

const getLatestProducts = () => {
  return axios.get(`${API_URL}/latest`);
};

const getDiscountedProducts = () => {
  return axios.get(`${API_URL}/discounted`);
};

const productService = {
  getProducts,
  getProductById,
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getLatestProducts,
  getDiscountedProducts
};

export default productService;
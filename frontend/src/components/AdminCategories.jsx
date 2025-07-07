import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryImage, setNewCategoryImage] = useState(null);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editingCategoryName, setEditingCategoryName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await api.get('/categories');

      const categoriesData = Array.isArray(res?.data) ? res.data : [];
      setCategories(categoriesData);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
      setError('Failed to load categories. Please try again.');
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      if (!newCategoryName.trim()) {
        setError('Category name cannot be empty');
        return;
      }

      const formData = new FormData();
      formData.append('name', newCategoryName);
      if (newCategoryImage) formData.append('image', newCategoryImage);

      await api.post('/categories', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Show success alert
      Swal.fire({
        title: 'Category Created',
        text: 'The category was successfully created.',
        icon: 'success',
        confirmButtonText: 'OK',
      });

      setNewCategoryName('');
      setNewCategoryImage(null);
      setError(null);
      await fetchCategories();
    } catch (err) {
      console.error('Failed to create category:', err);
      // Show error alert
      Swal.fire({
        title: 'Error',
        text: err.response?.data?.message || 'Failed to create category',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      setError(err.response?.data?.message || 'Failed to create category');
    }
  };



  const handleDeleteCategory = async (id) => {
    try {
      // Show confirmation SweetAlert
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'This will permanently delete the category.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel',
      });

      if (result.isConfirmed) {
        // Proceed with category deletion if confirmed
        await api.delete(`/categories/${id}`);

        // Show success alert
        Swal.fire({
          title: 'Deleted!',
          text: 'The category has been deleted.',
          icon: 'success',
          confirmButtonText: 'OK',
        });

        await fetchCategories();
      }
    } catch (err) {
      console.error('Failed to delete category:', err);
      // Show error alert
      Swal.fire({
        title: 'Error',
        text: err.response?.data?.message || 'Failed to delete category',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      setError(err.response?.data?.message || 'Failed to delete category');
    }
  };


  const handleEditCategory = (category) => {
    setEditingCategoryId(category._id);
    setEditingCategoryName(category.name);
    setError(null);
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    try {
      if (!editingCategoryName.trim()) {
        setError('Category name cannot be empty');
        return;
      }

      await api.put(`/categories/${editingCategoryId}`, {
        name: editingCategoryName
      });

      // Show success SweetAlert
      Swal.fire({
        title: 'Updated!',
        text: 'The category has been updated successfully.',
        icon: 'success',
        confirmButtonText: 'OK',
      });

      // Reset state after successful update
      setEditingCategoryId(null);
      setEditingCategoryName('');
      setError(null);
      await fetchCategories();
    } catch (err) {
      console.error('Failed to update category:', err);
      // Show error SweetAlert
      Swal.fire({
        title: 'Error',
        text: err.response?.data?.message || 'Failed to update category',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      setError(err.response?.data?.message || 'Failed to update category');
    }
  };



  const handleCancelEdit = () => {
    setEditingCategoryId(null);
    setEditingCategoryName('');
    setError(null);
  };

  if (isLoading) {
    return <div className="p-6">Loading categories...</div>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-10 tracking-wide text-gray-800 text-center">Categories</h1>

      {/* Display error message */}
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Category Form */}
      <form
        onSubmit={editingCategoryId ? handleUpdateCategory : handleCreateCategory}
        className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 max-w-4xl mx-auto"
      >
        {/* Form Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            {editingCategoryId ? 'Edit Category' : 'Add New Category'}
          </h2>
          <p className="text-gray-500">Fill in the category details below</p>
        </div>

        {/* Category Name */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">Category Name *</label>
          <input
            type="text"
            value={editingCategoryId ? editingCategoryName : newCategoryName}
            onChange={(e) =>
              editingCategoryId ? setEditingCategoryName(e.target.value) : setNewCategoryName(e.target.value)
            }
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition"
            placeholder="Enter category name"
          />
        </div>

        <label className="block text-sm font-medium text-gray-700 mt-4">Image (optional)</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setNewCategoryImage(e.target.files[0])}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />


        {/* Form Actions */}
        <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end gap-4">
          {editingCategoryId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="px-6 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium text-white transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {editingCategoryId ? 'Update Category' : 'Add Category'}
          </button>
        </div>
      </form>

      {/* Divider */}
      <hr className="my-12 border-gray-300" />

      {/* Category List Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Category Inventory</h2>
          <p className="text-gray-500 mt-1">{categories.length} categories available</p>
        </div>
      </div>

      {/* Category Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {categories.map((category) => (
          <div key={category._id} className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md bg-white transition-all duration-300 flex flex-col">
            {/* Category Image */}
            <div className="relative h-48 bg-gray-100 group overflow-hidden">
              {category.image ? (
                <img
                  src={`http://localhost:5000/${category.image}`}
                  alt={category.name}
                  className="object-cover h-full w-full transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>

            {/* Category Details */}
            <div className="p-4 flex flex-col flex-grow">
              <h3 className="text-xl font-semibold text-gray-800">{category.name}</h3>
              <p className="text-gray-500 text-sm mt-2">{category.description}</p>
            </div>

            {/* Edit/Delete Buttons */}
            <div className="mt-auto flex gap-2">

              <button
                onClick={() => handleEditCategory(category)}
                className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium py-2 px-3 rounded-lg flex items-center justify-center gap-1 transition text-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </button>
              <button
                onClick={() => handleDeleteCategory(category._id)}
                className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 font-medium py-2 px-3 rounded-lg flex items-center justify-center gap-1 transition text-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCategories;

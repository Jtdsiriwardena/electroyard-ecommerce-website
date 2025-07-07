import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import productService from '../services/productService';
import axios from "axios";
import Navbar from "../components/Navbar"; 
import Swal from 'sweetalert2';


function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await productService.getProductById(id);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem("token");
  
      const response = await axios.post(
        "http://localhost:5000/api/cart/items",
        {
          product_id: product._id,
          quantity: 1
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      console.log("Added to cart:", response.data);
      
      Swal.fire({
        icon: 'success',
        title: 'Added to Cart',
        text: 'Product has been added to your cart!',
        timer: 2000,
        showConfirmButton: false
      });
  
    } catch (error) {
      console.error("Error adding to cart:", error.response?.data?.error || error.message);
      
      Swal.fire({
        icon: 'error',
        title: 'Failed to Add',
        text: error.response?.data?.error || "Something went wrong!",
      });
    }
  };
  

  const handleBuyNow = async () => {
    await handleAddToCart(); // First add to cart
    window.location.href = "/cart"; // Redirect to checkout
  };

  return (
    
    <div className="min-h-screen bg-gray-50 text-gray-800 pt-24 px-4">
      <Navbar />
  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
    {/* Product Image */}
    <div className="space-y-4">
      <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-md hover:shadow-lg transition-shadow">
        <img
          src={`http://localhost:5000/${product.image}`}
          alt={product.name}
          className="w-full h-[500px] object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
    </div>

    {/* Product Details */}
    <div className="space-y-6 text-gray-800">
      <h1 className="text-4xl font-bold">{product.name}</h1>

      {/* Rating */}
      <div className="flex items-center gap-2 text-yellow-500 text-lg">
        <span>⭐ {product.ratings} / 5</span>
        <span className="text-sm text-gray-500">({product.reviews?.length || 0} reviews)</span>
      </div>

      {/* Pricing */}
      <div className="flex items-center gap-4">
        <p className="text-3xl font-bold text-green-600">
          $
          {product.discount_percentage > 0
            ? (product.price * (1 - product.discount_percentage / 100)).toFixed(2)
            : product.price}
        </p>
        {product.discount_percentage > 0 && (
          <>
            <p className="text-lg text-gray-400 line-through">${product.price}</p>
            <span className="bg-black text-white px-3 py-1 rounded-full text-sm font-medium">
              {product.discount_percentage}% OFF
            </span>
          </>
        )}
      </div>

      {/* Availability */}
      <p className="text-lg">
        <span className="font-semibold">Availability: </span>
        <span className={`${product.availability === 'in_stock' ? 'text-green-600' : 'text-red-500'} font-medium`}>
          {product.availability.replace('_', ' ')}
        </span>
      </p>

      {/* Description */}
      <p className="text-gray-700 text-base leading-relaxed">{product.description}</p>

      {/* Action Buttons */}
      <div className="flex gap-4 mt-6">
        <button
          onClick={handleAddToCart}
          className="px-4 py-1 rounded-full border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all"
          >
          Add to Cart
        </button>
        <button
          onClick={handleBuyNow}
          className="px-4 py-1 rounded-full border border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition-all"

        >
          Buy Now
        </button>
      </div>

      {/* Extra Details */}
      <div className="grid grid-cols-2 gap-6 mt-8 text-sm">
        <div className="space-y-1">
          <p><span className="font-semibold">Brand:</span> {product.brand || 'N/A'}</p>
          <p><span className="font-semibold">Country:</span> {product.country || 'N/A'}</p>
          <p><span className="font-semibold">Weight:</span> {product.weight ? `${product.weight} kg` : 'N/A'}</p>
        </div>
        <div className="space-y-1">
          <p><span className="font-semibold">Category:</span> {product.category}</p>
          <p><span className="font-semibold">Stock Quantity:</span> {product.stock_quantity} Available</p>
        </div>
      </div>
    </div>
  </div>

  {/* Reviews Section */}
  <div className="mt-16">
    <h2 className="text-3xl font-semibold mb-6 text-gray-800">Customer Reviews</h2>
    {product.reviews && product.reviews.length > 0 ? (
      <div className="space-y-6">
        {product.reviews.map((review, index) => (
          <div
            key={index}
            className="border border-gray-200 p-4 rounded-xl shadow-sm bg-white hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-center mb-2">
              <p className="font-semibold text-gray-700">{review.user || 'Anonymous'}</p>
              <p className="text-sm text-gray-400">{new Date(review.created_at).toLocaleDateString()}</p>
            </div>
            <p className="text-gray-800 mb-1"><span className="font-medium">Comment:</span> {review.comment}</p>
            <p className="text-yellow-500">⭐ {review.rating} / 5</p>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-gray-500 italic">No reviews yet.</p>
    )}
  </div>
</div>

  

  );
}

export default ProductDetails;

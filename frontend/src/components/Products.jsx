import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import productService from '../services/productService';
import Navbar from "../components/Navbar";
import { FiHeart, FiStar, FiFilter, FiChevronDown, FiChevronUp, FiShoppingCart, FiX } from 'react-icons/fi';
import { MdCompareArrows, MdLocalShipping } from 'react-icons/md';

function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState('featured');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [showFilters, setShowFilters] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productService.getAllProducts();
        setProducts(response.data);
        setFilteredProducts(response.data);

        // Extract unique categories and brands
        const uniqueCategories = [...new Set(response.data.map(p => p.category))];
        const uniqueBrands = [...new Set(response.data.map(p => p.brand))];
        
        setCategories(uniqueCategories);
        setBrands(uniqueBrands);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    // Apply filters and sorting
    let result = [...products];

    // Category filter
    if (selectedCategories.length > 0) {
      result = result.filter(p => selectedCategories.includes(p.category));
    }

    // Brand filter
    if (selectedBrands.length > 0) {
      result = result.filter(p => selectedBrands.includes(p.brand));
    }

    // Price range filter
    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Sorting
    switch (sortOption) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      default: // 'featured'
        result.sort((a, b) => b.featured - a.featured);
    }

    setFilteredProducts(result);
  }, [products, sortOption, priceRange, selectedCategories, selectedBrands]);

  const toggleCategory = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const toggleBrand = (brand) => {
    setSelectedBrands(prev =>
      prev.includes(brand)
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceRange([0, 1000]);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 pb-12 pt-16">
        {/* Mobile Filter Button */}
        <div className="md:hidden flex justify-end mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 bg-white border px-4 py-2 rounded-lg hover:bg-gray-50"
          >
            <FiFilter />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar - Desktop */}
          <div className={`hidden md:block w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden'}`}>
            <div className="bg-white p-6 rounded-lg shadow-sm sticky top-24">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium">Filters</h2>
                <button 
                  onClick={clearAllFilters}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Clear all
                </button>
              </div>

              {/* Categories Filter */}
              <div className="mb-8">
                <h3 className="font-medium mb-4 flex justify-between items-center">
                  <span>Categories</span>
                  <FiChevronDown className="text-gray-400" />
                </h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {categories.map(category => (
                    <label key={category} className="flex items-center gap-2 hover:bg-gray-50 p-1 rounded">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={() => toggleCategory(category)}
                        className="rounded text-blue-600"
                      />
                      <span className="text-gray-700">{category}</span>
                      <span className="text-xs text-gray-500 ml-auto">
                        ({products.filter(p => p.category === category).length})
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Brands Filter */}
              <div className="mb-8">
                <h3 className="font-medium mb-4 flex justify-between items-center">
                  <span>Brands</span>
                  <FiChevronDown className="text-gray-400" />
                </h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {brands.map(brand => (
                    <label key={brand} className="flex items-center gap-2 hover:bg-gray-50 p-1 rounded">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => toggleBrand(brand)}
                        className="rounded text-blue-600"
                      />
                      <span className="text-gray-700">{brand}</span>
                      <span className="text-xs text-gray-500 ml-auto">
                        ({products.filter(p => p.brand === brand).length})
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="mb-8">
                <h3 className="font-medium mb-4">Price Range</h3>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                  <div className="px-2">
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full h-1.5 bg-blue-100 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="0"
                      max={priceRange[1]}
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                      className="w-full border px-2 py-1 rounded text-sm"
                      placeholder="Min"
                    />
                    <input
                      type="number"
                      min={priceRange[0]}
                      max="1000"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full border px-2 py-1 rounded text-sm"
                      placeholder="Max"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Filters Sidebar */}
          {showFilters && (
            <div className="md:hidden fixed inset-0 z-50 overflow-y-auto bg-gray-500 bg-opacity-75">
              <div className="bg-white h-full w-4/5 max-w-sm p-6 overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-medium">Filters</h2>
                  <button onClick={() => setShowFilters(false)} className="text-gray-500 hover:text-gray-700">
                    <FiX size={24} />
                  </button>
                </div>

                {/* Mobile filter content - same as desktop but with close button */}
                <div className="mb-8">
                  <h3 className="font-medium mb-4">Categories</h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {categories.map(category => (
                      <label key={category} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category)}
                          onChange={() => toggleCategory(category)}
                          className="rounded text-blue-600"
                        />
                        <span>{category}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="font-medium mb-4">Brands</h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {brands.map(brand => (
                      <label key={brand} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(brand)}
                          onChange={() => toggleBrand(brand)}
                          className="rounded text-blue-600"
                        />
                        <span>{brand}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="font-medium mb-4">Price Range</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full"
                    />
                  </div>
                </div>

                <button
                  onClick={clearAllFilters}
                  className="w-full py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 mb-4"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div className="text-gray-600">
                Showing <span className="font-medium">{filteredProducts.length}</span> products
                {(selectedCategories.length > 0 || selectedBrands.length > 0 || priceRange[1] < 1000) && (
                  <span className="text-sm ml-2">
                    (filtered from {products.length})
                  </span>
                )}
              </div>

              <div className="w-full md:w-auto">
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="w-full md:w-auto bg-white border px-4 py-2 rounded-lg hover:bg-gray-50"
                >
                  <option value="featured">Sort by: Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest Arrivals</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>

            {/* Active Filters */}
            {(selectedCategories.length > 0 || selectedBrands.length > 0 || priceRange[1] < 1000) && (
              <div className="mb-6 flex flex-wrap gap-2">
                {selectedCategories.map(category => (
                  <span 
                    key={category} 
                    className="flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm"
                  >
                    {category}
                    <button 
                      onClick={() => toggleCategory(category)}
                      className="ml-1 text-gray-500 hover:text-gray-700"
                    >
                      <FiX size={14} />
                    </button>
                  </span>
                ))}
                {selectedBrands.map(brand => (
                  <span 
                    key={brand} 
                    className="flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm"
                  >
                    {brand}
                    <button 
                      onClick={() => toggleBrand(brand)}
                      className="ml-1 text-gray-500 hover:text-gray-700"
                    >
                      <FiX size={14} />
                    </button>
                  </span>
                ))}
                {priceRange[1] < 1000 && (
                  <span className="flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm">
                    ${priceRange[0]} - ${priceRange[1]}
                    <button 
                      onClick={() => setPriceRange([0, 1000])}
                      className="ml-1 text-gray-500 hover:text-gray-700"
                    >
                      <FiX size={14} />
                    </button>
                  </span>
                )}
                <button 
                  onClick={clearAllFilters}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
                    <div className="bg-gray-200 h-48 w-full"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Products Grid */}
            {!loading && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filteredProducts.map((product) => (
                    <div
                      key={product._id}
                      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col cursor-pointer group"
                      onClick={() => navigate(`/products/${product._id}`)}
                    >
                      {/* Product Image */}
                      <div className="relative h-56 bg-gray-100 overflow-hidden">
                        {product.image ? (
                          <img
                            src={`http://localhost:5000/${product.image}`}
                            alt={product.name}
                            className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-110"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
                            </svg>
                          </div>
                        )}

                        {/* Badges */}
                        <div className="absolute top-3 left-3 space-y-2">
                          {product.discount_percentage > 0 && (
                            <span className="px-2 py-1 bg-green-600 text-white text-xs font-medium rounded-full shadow-sm">
                              {product.discount_percentage}% OFF
                            </span>
                          )}
                          {product.featured && (
                            <span className="px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded-full shadow-sm">
                              Featured
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="p-4 flex flex-col flex-1">
                        <div className="mb-2">
                          <span className="text-sm text-gray-500">{product.category}</span>
                          <h3 className="font-medium text-gray-900 line-clamp-2">{product.name}</h3>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center mb-3">
                          <div className="flex text-amber-400">
                            {[...Array(5)].map((_, i) => (
                              <FiStar
                                key={i}
                                className={i < Math.floor(product.rating) ? 'fill-current' : ''}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500 ml-1">({product.reviewCount})</span>
                        </div>

                        {/* Price */}
                        <div className="mt-auto">
                          {product.discount_percentage > 0 ? (
                            <div>
                              <span className="text-lg font-bold text-gray-900">
                                ${(product.price * (1 - product.discount_percentage / 100)).toFixed(2)}
                              </span>
                              <span className="text-sm text-gray-500 line-through ml-2">
                                ${product.price}
                              </span>
                            </div>
                          ) : (
                            <span className="text-lg font-bold text-gray-900">${product.price}</span>
                          )}

                          {product.freeShipping && (
                            <div className="flex items-center text-sm text-green-600 mt-1">
                              <MdLocalShipping className="mr-1" />
                              <span>Free Shipping</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Empty State */}
                {filteredProducts.length === 0 && !loading && (
                  <div className="text-center py-12">
                    <h3 className="text-xl font-medium text-gray-900 mb-2">No products found</h3>
                    <p className="text-gray-500 mb-4">Try adjusting your filters to find what you're looking for</p>
                    <button
                      onClick={clearAllFilters}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Reset Filters
                    </button>
                  </div>
                )}

                {/* Pagination */}
                {filteredProducts.length > 0 && (
                <div className="flex justify-center mt-12">

                  </div> 
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Products;
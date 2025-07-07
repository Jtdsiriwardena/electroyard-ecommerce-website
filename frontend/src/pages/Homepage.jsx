import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar"; 
import { Link, useNavigate } from 'react-router-dom';
import productService from "../services/productService";
import axios from 'axios';
import { ChevronRight, ChevronLeft, ShoppingCart, Heart, Eye } from 'lucide-react';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';

import image1 from '../assets/images/1.jpg';
import image2 from '../assets/images/2.jpg';
import image3 from '../assets/images/3.jpg';
import image4 from '../assets/images/4.jpg';

const ModernFAQSection = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeIndices, setActiveIndices] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  // FAQ data with categories
  const faqData = [
    {
      category: 'shipping',
      question: 'How long does shipping take?',
      answer: 'Standard shipping typically takes 3-5 business days within the continental US. Express shipping options are available at checkout for 1-2 day delivery. International shipping can take 7-14 business days depending on the destination.'
    },
    {
      category: 'shipping',
      question: 'Do you ship internationally?',
      answer: 'Yes, we ship to most countries worldwide. International shipping rates and delivery times vary by location. You can see the exact shipping costs during checkout after entering your address.'
    },
    {
      category: 'payment',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, Mastercard, American Express, Discover), PayPal, Apple Pay, Google Pay, and Shop Pay. For certain regions, we also offer installment payment options through Klarna and Afterpay.'
    },
    {
      category: 'payment',
      question: 'Is my payment information secure?',
      answer: 'Absolutely. We use industry-standard SSL encryption to protect your payment information. We are PCI DSS compliant and never store your full credit card details on our servers.'
    },
    {
      category: 'orders',
      question: 'How can I track my order?',
      answer: 'Once your order ships, you will receive a confirmation email with tracking information. You can also log into your account and check the status of your order in the "Order History" section.'
    },
    {
      category: 'orders',
      question: 'Can I modify or cancel my order?',
      answer: 'Orders can be modified or canceled within 1 hour of placement. After that, our fulfillment process begins and changes may not be possible. Please contact customer support immediately if you need to make changes.'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Questions' },
    { id: 'shipping', name: 'Shipping' },
    { id: 'payment', name: 'Payment' },
    { id: 'orders', name: 'Orders' }
  ];

  const toggleQuestion = (index) => {
    setActiveIndices(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const filteredFAQs = faqData.filter(faq => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch = searchTerm === '' || 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-white to-blue-50">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 relative inline-block">
            <span className="relative z-10">Frequently Asked Questions</span>
            <span className="absolute -bottom-2 left-0 right-0 h-3 bg-blue-200 opacity-70 z-0"></span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about our products, shipping, returns, and more.
          </p>
        </div>

        {/* Search bar */}
        <div className="mb-10 relative max-w-xl mx-auto">
          <div className="relative">
            <input 
              type="text"
              placeholder="Search for answers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-4 pl-12 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
        </div>

        {/* Category filter */}
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === category.id 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {filteredFAQs.length > 0 ? (
            filteredFAQs.map((faq, index) => (
              <div 
                key={index}
                className={`border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm transition-all duration-300 ${
                  activeIndices[index] ? 'shadow-md' : ''
                }`}
              >
                <button
                  onClick={() => toggleQuestion(index)}
                  className="flex justify-between items-center w-full p-5 text-left focus:outline-none"
                >
                  <h3 className="text-lg font-medium">{faq.question}</h3>
                  <span className="text-blue-600 ml-4">
                    {activeIndices[index] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </span>
                </button>
                
                <div 
                  className={`overflow-hidden transition-all duration-300 ${
                    activeIndices[index] ? 'max-h-96' : 'max-h-0'
                  }`}
                >
                  <div className="p-5 pt-0 text-gray-600 border-t border-gray-100">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
              <div className="text-gray-400 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-700 mb-1">No results found</h3>
              <p className="text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
            </div>
          )}
        </div>

      </div>
    </section>
  );
};

const Homepage = () => {
  const [products, setProducts] = useState([]);
  const [discountedProducts, setDiscountedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [lastScrollY, setLastScrollY] = useState(0);

  const slides = [
    { image: image1, title: "Next-Gen Tech", subtitle: "Experience innovation like never before" },
    { image: image2, title: "Premium Quality", subtitle: "Crafted with precision and care" },
    { image: image3, title: "Exclusive Deals", subtitle: "Limited time offers you can't resist" },
    { image: image4, title: "Smart Living", subtitle: "Upgrade your lifestyle with our tech" }
  ];

  const api = axios.create({
    baseURL: 'http://localhost:5000/api',
  });

  // Auto-slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  // Header scroll effect
  useEffect(() => {
    const controlHeader = () => {
      if (window.scrollY > 100) {
        if (window.scrollY > lastScrollY) {
          document.querySelector('header')?.classList.add('-translate-y-full');
        } else {
          document.querySelector('header')?.classList.remove('-translate-y-full');
        }
        setLastScrollY(window.scrollY);
      }
    };

    window.addEventListener('scroll', controlHeader);
    return () => window.removeEventListener('scroll', controlHeader);
  }, [lastScrollY]);


  

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [latestResponse, discountedResponse] = await Promise.all([
          productService.getLatestProducts(),
          productService.getDiscountedProducts()
        ]);
        setProducts(latestResponse.data);
        setDiscountedProducts(discountedResponse.data);

        const categoriesResponse = await api.get('/categories');
        const categoriesData = Array.isArray(categoriesResponse?.data) 
          ? categoriesResponse.data 
          : [];
        setCategories(categoriesData);
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const nextSlide = () => setCurrentSlide(prev => (prev === slides.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrentSlide(prev => (prev === 0 ? slides.length - 1 : prev - 1));

  const ProductCard = ({ product }) => (
    <div 
      className="border rounded-2xl shadow-lg p-4 hover:shadow-xl transition-all duration-300 cursor-pointer group bg-white bg-opacity-70 backdrop-blur-sm"
      onClick={() => navigate(`/products/${product._id}`)}
    >
      <div className="relative h-64 overflow-hidden mb-4 rounded-xl">
        {product.image ? (
          <img
            src={`http://localhost:5000/${product.image}`}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-gray-100 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
            </svg>
          </div>
        )}
      
        
        {product.discount_percentage > 0 && (
          <span className="absolute top-3 left-3 px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full shadow">
            {product.discount_percentage}% OFF
          </span>
        )}
      </div>
      
      <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
      {product.discount_percentage > 0 ? (
        <div className="flex items-center gap-2">
          <span className="text-blue-600 font-bold">
            ${(product.price * (1 - product.discount_percentage / 100)).toFixed(2)}
          </span>
          <span className="text-gray-500 text-sm line-through">${product.price}</span>
        </div>
      ) : (
        <p className="text-blue-600 font-bold">${product.price}</p>
      )}
      
    </div>
  );

  const CategoryCard = ({ category }) => (
    <div 
      className="group relative rounded-2xl overflow-hidden cursor-pointer h-64 shadow-lg transition-all duration-500 hover:shadow-xl hover:scale-[1.02]"
      onClick={() => navigate(`/products?category=${category._id}`)}
    >
      {category.image ? (
        <img
          src={`http://localhost:5000/${category.image}`}
          alt={category.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "";
            e.target.parentNode.classList.add("bg-blue-500");
          }}
        />
      ) : (
        <div className="h-full w-full flex items-center justify-center bg-blue-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
      <div className="absolute inset-0 flex flex-col justify-end p-6">
        <h3 className="text-2xl font-bold text-white mb-2">{category.name}</h3>
        <div className="overflow-hidden h-8">
          <div className="transform translate-y-8 transition-transform duration-300 group-hover:translate-y-0 flex items-center gap-2">
            <span className="text-white">Explore</span>
            <ChevronRight size={16} className="text-white" />
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white text-gray-800 min-h-screen">
        <Navbar />
        <div className="text-center py-32">
          <h2 className="text-2xl text-red-500 mb-6">{error}</h2>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full transition transform hover:scale-105"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <header className="fixed w-full z-50 transition-transform duration-300 bg-white bg-opacity-90 backdrop-blur-md shadow-sm">
        <Navbar />
      </header>

      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden pt-16">
        <div className="absolute inset-0 flex transition-transform duration-1000 ease-in-out"
             style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
          {slides.map((slide, index) => (
            <div key={index} className="w-full flex-shrink-0 h-full relative">
              <img 
                src={slide.image} 
                alt={`Slide ${index + 1}`} 
                className="w-full h-full object-cover"
                style={{ transform: `translateY(${lastScrollY * 0.2}px)` }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent"></div>
            </div>
          ))}
        </div>
        
        {/* Content overlay */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-white px-8 text-center">
          <div className="overflow-hidden mb-4">
            <h1 className="text-4xl md:text-6xl font-bold animate-slide-up">
              {slides[currentSlide].title}
            </h1>
          </div>
          <div className="overflow-hidden mb-8">
            <p className="text-xl md:text-2xl animate-slide-up">
              {slides[currentSlide].subtitle}
            </p>
          </div>
          <div className="overflow-hidden">
            <Link to="/products">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full flex items-center gap-2 transition transform hover:scale-105 animate-slide-up">
                Shop Now
                <ChevronRight size={20} />
              </button>
            </Link>
          </div>
        </div>
        
        {/* Slider controls */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-3 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-12 h-1 transition-all duration-300 ${currentSlide === index ? 'bg-white w-16' : 'bg-white/50'}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        
        <button 
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition"
        >
          <ChevronLeft size={28} />
        </button>
        
        <button 
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition"
        >
          <ChevronRight size={28} />
        </button>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col items-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-2 relative">
                <span className="relative z-10">Browse Categories</span>
                <span className="absolute -bottom-2 left-0 right-0 h-3 bg-blue-200 opacity-70 z-0"></span>
              </h2>
              <p className="text-gray-600 text-center max-w-xl">
                Discover our wide selection of cutting-edge products
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {categories.map((category) => (
                <CategoryCard key={category._id} category={category} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Discounted Products */}
      {discountedProducts.length > 0 && (
        <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col items-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-2 relative">
                <span className="relative z-10">Hot Deals</span>
                <span className="absolute -bottom-2 left-0 right-0 h-3 bg-blue-200 opacity-70 z-0"></span>
              </h2>
              <p className="text-gray-600 text-center max-w-xl">
                Limited-time offers you can't resist
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {discountedProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Link 
                to="/products" 
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium text-lg"
              >
                View All Deals <ChevronRight size={18} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-2 relative">
              <span className="relative z-10">Featured Products</span>
              <span className="absolute -bottom-2 left-0 right-0 h-3 bg-blue-200 opacity-70 z-0"></span>
            </h2>
            <p className="text-gray-600 text-center max-w-xl">
              Our most popular tech items
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <ModernFAQSection />

     {/* Footer */}
<footer className="bg-gray-900 text-white pt-16 pb-8 px-4">
  <div className="max-w-7xl mx-auto">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
      {/* Company Info */}
      <div>
        <h3 className="text-2xl font-bold mb-4">ElectroYard</h3>
        <p className="text-gray-400 mb-4">
          Your one-stop shop for the latest tech gadgets and accessories.
        </p>
        <div className="flex space-x-4">
          <a href="#" className="text-gray-400 hover:text-white transition">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
            </svg>
          </a>
          <a href="#" className="text-gray-400 hover:text-white transition">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
            </svg>
          </a>
          <a href="#" className="text-gray-400 hover:text-white transition">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
            </svg>
          </a>
        </div>
      </div>

      {/* Quick Links */}
      <div>
        <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
        <ul className="space-y-2">
          <li><a href="#" className="text-gray-400 hover:text-white transition">Home</a></li>
          <li><a href="#" className="text-gray-400 hover:text-white transition">Products</a></li>
          <li><a href="#" className="text-gray-400 hover:text-white transition">Categories</a></li>
          <li><a href="#" className="text-gray-400 hover:text-white transition">New Arrivals</a></li>
          <li><a href="#" className="text-gray-400 hover:text-white transition">Deals & Offers</a></li>
        </ul>
      </div>

      {/* Customer Service */}
      <div>
        <h4 className="text-lg font-semibold mb-4">Customer Service</h4>
        <ul className="space-y-2">
          <li><a href="#" className="text-gray-400 hover:text-white transition">Contact Us</a></li>
          <li><a href="#" className="text-gray-400 hover:text-white transition">FAQs</a></li>
          <li><a href="#" className="text-gray-400 hover:text-white transition">Shipping Policy</a></li>
          <li><a href="#" className="text-gray-400 hover:text-white transition">Returns & Refunds</a></li>
          <li><a href="#" className="text-gray-400 hover:text-white transition">Privacy Policy</a></li>
        </ul>
      </div>

      
    </div>

    {/* Copyright */}
    <div className="border-t border-gray-800 pt-8 text-center text-gray-500">
      <p>© {new Date().getFullYear()} ElectroYard. All rights reserved.</p>
    </div>
  </div>
</footer>


      <style jsx>{`
        @keyframes slideUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up {
          animation: slideUp 0.8s ease forwards;
        }
      `}</style>
    </div>
  );
};

export default Homepage;
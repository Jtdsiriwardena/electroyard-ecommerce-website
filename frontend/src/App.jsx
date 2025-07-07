// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// Admin Pages
import AdminLayout from "./components/AdminLayout"; 
import AdminProducts from './components/AdminProducts';
import AdminCategories from './components/AdminCategories';
import AdminOrders from './components/AdminOrders';
import AdminUsers from './components/AdminUsers';

// User Pages
import Products from './components/Products';
import ProductDetails from './components/ProductDetails';
import Homepage from './pages/Homepage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Cart from './pages/Cart';
import UserOrders from './pages/UserOrders';
import OrderDetails from './pages/OrderDetails';
import UserProfile from './pages/UserProfile';
import OrderConfirmation from './pages/OrderConfirmation';

// Load Stripe's public key
const stripePromise = loadStripe("pk_test_51RJWcKHFfpEmE7GE7sxqTt8ohc8qKmffz1WCnHB7cdyN6yjaiLteK5Gm2xBefnypWptX4Wk15VCgcKz6KAdCrIL500hKEV1RkB");

function App() {
  return (
    <Router>
      <div>
        <Routes>

          {/* Admin Routes with Admin Layout */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="products" element={<AdminProducts />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="users" element={<AdminUsers />} />

          </Route>

          {/* User Routes */}
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/homepage" element={<Homepage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/userOrders" element={<UserOrders />} />
          <Route path="/orders/:orderId" element={<OrderDetails />} />
          <Route path="/userProfile" element={<UserProfile />} />
          <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
          
          {/* Cart Route wrapped in Stripe Elements */}
          <Route 
            path="/cart" 
            element={
              <Elements stripe={stripePromise}>
                <Cart />
              </Elements>
            } 
          />

        </Routes>
      </div>
    </Router>
  );
}

export default App;

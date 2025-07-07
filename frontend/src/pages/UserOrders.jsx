import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from "../components/Navbar";

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/orders', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setOrders(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching orders:', err);
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
        } else {
          setError('Failed to fetch your orders. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const getStatusStyle = (status) => {
    const statusStyles = {
      pending: {
        color: 'text-amber-600',
        bg: 'bg-amber-50',
        icon: '⏳'
      },
      processing: {
        color: 'text-blue-600',
        bg: 'bg-blue-50',
        icon: '🔄'
      },
      shipped: {
        color: 'text-indigo-600',
        bg: 'bg-indigo-50',
        icon: '🚚'
      },
      delivered: {
        color: 'text-green-600',
        bg: 'bg-green-50',
        icon: '✅'
      },
      cancelled: {
        color: 'text-red-600',
        bg: 'bg-red-50',
        icon: '❌'
      },
      default: {
        color: 'text-gray-600',
        bg: 'bg-gray-50',
        icon: '❓'
      }
    };

    if (!status) return statusStyles.default;
    
    const lowerStatus = status.toLowerCase();
    return statusStyles[lowerStatus] || statusStyles.default;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Order History</h1>
            <p className="mt-2 text-gray-600">View and manage your recent purchases</p>
          </div>
          <Link 
            to="/products" 
            className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
          >
            Continue Shopping
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No orders yet</h3>
            <p className="mt-1 text-gray-500">Get started by placing your first order.</p>
            <div className="mt-6">
              <Link
                to="/products"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Browse Products
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div 
                key={order._id} 
                className="bg-white overflow-hidden rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 ease-in-out"
              >
                <div className="p-6 sm:flex sm:items-center sm:justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-500 mr-3">
                        Order #{order._id.slice(-6).toUpperCase()}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyle(order.order_status).bg} ${getStatusStyle(order.order_status).color}`}>
                        {getStatusStyle(order.order_status).icon} {order.order_status || 'Unknown'}
                      </span>
                    </div>
                    <h4 className="mt-1 text-lg font-medium text-gray-900">
                      {formatPrice(order.total_amount || order.totalAmount)}
                    </h4>
                    <p className="mt-1 text-sm text-gray-500">
                      Placed on {formatDate(order.created_at || order.createdAt)}
                    </p>
                  </div>
                  <div className="mt-4 flex sm:mt-0 sm:ml-4">
                    <Link
                      to={`/orders/${order._id}`}
                      className="ml-3 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
                    >
                      View Details
                    </Link>
                  </div>
                </div>

                <div className="border-t border-gray-200">
                  <div className="px-6 py-4 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="text-sm font-medium text-gray-700">Payment Method</h5>
                        <p className="mt-1 text-sm text-gray-500">
                          {order.payment_method || order.paymentMethod || 'Not specified'}
                        </p>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-gray-700">Shipping Address</h5>
                        <p className="mt-1 text-sm text-gray-500">
                          {order.shipping_address?.city && order.shipping_address?.country 
                            ? `${order.shipping_address.city}, ${order.shipping_address.country}` 
                            : 'Not specified'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserOrders;
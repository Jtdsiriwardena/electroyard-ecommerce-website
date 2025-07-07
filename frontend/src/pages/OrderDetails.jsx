import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from "../components/Navbar";
import { FiPrinter, FiPackage, FiArrowLeft, FiClock, FiCreditCard, FiTruck, FiMapPin, FiMail, FiPhone } from 'react-icons/fi';

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setOrder(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching order:', err);
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        } else {
          setError('Failed to fetch order details. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, navigate]);

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
        icon: <FiClock className="mr-1" />
      },
      processing: {
        color: 'text-blue-600',
        bg: 'bg-blue-50',
        icon: <FiClock className="mr-1" />
      },
      shipped: {
        color: 'text-indigo-600',
        bg: 'bg-indigo-50',
        icon: <FiTruck className="mr-1" />
      },
      delivered: {
        color: 'text-green-600',
        bg: 'bg-green-50',
        icon: '✓'
      },
      cancelled: {
        color: 'text-red-600',
        bg: 'bg-red-50',
        icon: '✕'
      },
      default: {
        color: 'text-gray-600',
        bg: 'bg-gray-50',
        icon: '?'
      }
    };

    if (!status) return statusStyles.default;
    
    const lowerStatus = status.toLowerCase();
    return statusStyles[lowerStatus] || statusStyles.default;
  };

  const renderStatusBadge = (status) => {
    const style = getStatusStyle(status);
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${style.bg} ${style.color}`}>
        {style.icon} {status || 'Unknown'}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
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
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
            <h3 className="mt-2 text-lg font-medium text-gray-900">Order not found</h3>
            <div className="mt-6">
              <Link
                to="/orders"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Back to Orders
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const orderData = order.order || order;
  const items = order.items || orderData.items || [];

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors mb-6"
          >
            <FiArrowLeft className="mr-2" /> Back to Orders
          </button>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">Order Details</h1>
              <p className="mt-2 text-gray-600">Order #{orderData._id.slice(-6).toUpperCase()}</p>
            </div>
            <div className="mt-4 md:mt-0 flex gap-3">
              <button
                onClick={() => window.print()}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
              >
                <FiPrinter className="mr-2" /> Print
              </button>
              {orderData.order_status?.toLowerCase() === 'shipped' && (
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all">
                  <FiPackage className="mr-2" /> Track Package
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-200">
          {/* Order Header */}
          <div className="px-6 py-5 bg-gray-50 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center">
                <div className="mr-4">
                  <p className="text-sm text-gray-500">Order placed</p>
                  <p className="text-sm font-medium text-gray-900">{formatDate(orderData.created_at || orderData.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <div className="mt-1">
                    {renderStatusBadge(orderData.order_status)}
                  </div>
                </div>
              </div>
              {orderData.tracking_number && (
                <div className="mt-4 sm:mt-0">
                  <p className="text-sm text-gray-500">Tracking number</p>
                  <p className="text-sm font-medium text-gray-900">{orderData.tracking_number}</p>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Payment method</p>
                  <div className="flex items-center mt-1">
                    <FiCreditCard className="text-gray-400 mr-2" />
                    <p className="text-sm font-medium text-gray-900">{orderData.payment_method || 'N/A'}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Subtotal</p>
                  <p className="text-sm font-medium text-gray-900">{formatPrice(orderData.subtotal || orderData.total_amount)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Shipping</p>
                  <p className="text-sm font-medium text-gray-900">{formatPrice(orderData.shipping_cost || 0)}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Tax</p>
                  <p className="text-sm font-medium text-gray-900">{formatPrice(orderData.tax || 0)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="text-lg font-semibold text-gray-900">{formatPrice(orderData.total_amount)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Information */}
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Shipping Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-start">
                  <FiMapPin className="text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500">Shipping address</p>
                    <div className="text-sm text-gray-900 mt-1">
                      {orderData.shipping_address?.address && <div>{orderData.shipping_address.address}</div>}
                      {orderData.shipping_address?.city && orderData.shipping_address?.country && (
                        <div>{orderData.shipping_address.city}, {orderData.shipping_address.country}</div>
                      )}
                      {orderData.shipping_address?.postal_code && <div>{orderData.shipping_address.postal_code}</div>}
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex items-start">
                  <div>
                    <p className="text-sm text-gray-500">Contact information</p>
                    <div className="text-sm text-gray-900 mt-1 space-y-1">
                      {orderData.user?.email && (
                        <div className="flex items-center">
                          <FiMail className="text-gray-400 mr-2" />
                          {orderData.user.email}
                        </div>
                      )}
                      {orderData.user?.phone_number && (
                        <div className="flex items-center">
                          <FiPhone className="text-gray-400 mr-2" />
                          {orderData.user.phone_number}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="px-6 py-5">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Order Items ({items.length})</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {items.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {item.product?.image && (
                            <div className="flex-shrink-0 h-16 w-16">
                              <img
                                className="h-16 w-16 rounded-md object-cover"
                                src={`http://localhost:5000/${item.product.image}`}
                                alt={item.product.name}
                              />
                            </div>
                          )}
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{item.product?.name || item.product_name || 'Product'}</div>
                            {item.product?.sku && (
                              <div className="text-xs text-gray-500">SKU: {item.product.sku}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatPrice(item.price)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatPrice(item.price * item.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiPackage, FiTruck, FiCheckCircle, FiClock, FiXCircle, FiFilter, FiRefreshCw } from 'react-icons/fi';

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const token = localStorage.getItem('token');

  const statusIcons = {
    pending: <FiClock className="text-amber-500" />,
    processing: <FiRefreshCw className="text-blue-500" />,
    shipped: <FiTruck className="text-indigo-500" />,
    delivered: <FiCheckCircle className="text-green-500" />,
    cancelled: <FiXCircle className="text-red-500" />
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/admin/orders', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setUpdatingOrderId(orderId);
      await axios.put(
        `http://localhost:5000/api/orders/${orderId}/status`,
        { order_status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(order => {
    const matchesStatus = selectedStatus === 'all' || order.order_status === selectedStatus;
    const matchesSearch = order._id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         order.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         `${order.first_name} ${order.last_name}`.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Order Management</h2>
          <p className="mt-2 text-gray-600">View and manage customer orders</p>
        </div>
        <button 
          onClick={fetchOrders}
          className="mt-4 md:mt-0 flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <FiRefreshCw className="mr-2" /> Refresh Orders
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
            <div className="flex flex-wrap gap-2">
              {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`flex items-center px-3 py-1.5 rounded-lg text-sm font-medium ${
                    selectedStatus === status
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } transition`}
                >
                  {status !== 'all' && <span className="mr-1">{statusIcons[status]}</span>}
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search Orders</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by ID, name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Count */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-blue-500">
          <div className="text-sm font-medium text-gray-500">Total Orders</div>
          <div className="text-2xl font-bold text-gray-900">{orders.length}</div>
        </div>
        {Object.entries(statusIcons).map(([status, icon]) => (
          <div key={status} className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-gray-200">
            <div className="flex items-center text-sm font-medium text-gray-500">
              {React.cloneElement(icon, { className: 'mr-2' })}
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {orders.filter(o => o.order_status === status).length}
            </div>
          </div>
        ))}
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <FiPackage className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No orders found</h3>
          <p className="mt-1 text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div key={order._id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition">
              <div className="p-5">
                <div className="flex flex-col lg:flex-row justify-between gap-6">
                  {/* Order Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">Order #{order._id.slice(-8).toUpperCase()}</h3>
                        <p className="text-sm text-gray-500">{formatDate(order.created_at)}</p>
                      </div>
                      <div className="flex items-center">
                        {statusIcons[order.order_status]}
                        <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${
                          order.order_status === 'pending' ? 'bg-amber-100 text-amber-800' :
                          order.order_status === 'processing' ? 'bg-blue-100 text-blue-800' :
                          order.order_status === 'shipped' ? 'bg-indigo-100 text-indigo-800' :
                          order.order_status === 'delivered' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1)}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Customer</p>
                        <p className="font-medium text-gray-900">{order.first_name} {order.last_name}</p>
                        <p className="text-gray-500">{order.email}</p>
                        <p className="text-gray-500">{order.phone_number}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Shipping Address</p>
                        <p className="font-medium text-gray-900">
                          {order.shipping_address.address}, {order.shipping_address.city}
                        </p>
                        <p className="text-gray-500">
                          {order.shipping_address.postal_code}, {order.shipping_address.country}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="lg:w-64">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Subtotal</span>
                        <span className="font-medium">${order.total_amount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Shipping</span>
                        <span className="font-medium">$0.00</span>
                      </div>
                      <div className="flex justify-between border-t border-gray-200 pt-2">
                        <span className="text-gray-900 font-medium">Total</span>
                        <span className="text-gray-900 font-bold">${order.total_amount.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Status Update */}
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Update Status</label>
                      <select
                        value={order.order_status}
                        onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                        disabled={updatingOrderId === order._id}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      {updatingOrderId === order._id && (
                        <p className="mt-1 text-xs text-gray-500">Updating status...</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminOrders;
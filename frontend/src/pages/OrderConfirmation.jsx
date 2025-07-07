import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from "../components/Navbar";

const OrderConfirmation = () => {
  const [orderDetails, setOrderDetails] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // order ID from URL params
  const { orderId } = useParams();
  // Or from location state (passed from Cart component)
  const location = useLocation();
  const orderIdFromState = location.state?.orderId;
  const paymentDetailsFromState = location.state?.paymentDetails;

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');

        if (!token) {
          setError('Authentication required');
          setLoading(false);
          return;
        }

        if (paymentDetailsFromState) {
          setPaymentDetails(paymentDetailsFromState);
        }

        const id = orderId || orderIdFromState;

        if (!id) {
          setError('Order ID not found');
          setLoading(false);
          return;
        }

        // Fetch order details
        const orderResponse = await axios.get(`http://localhost:5000/api/orders/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        setOrderDetails(orderResponse.data);

        if (!paymentDetailsFromState) {
          const paymentResponse = await axios.get(
            `http://localhost:5000/api/payments/${id}`,
            { headers: { 'Authorization': `Bearer ${token}` } }
          );

          setPaymentDetails(paymentResponse.data);
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching order details:', err);
        setError('Failed to load order details. Please try again later.');
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, orderIdFromState, paymentDetailsFromState]);

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
      <div className="mt-6">
        <Link to="/" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
          Return to Home
        </Link>
      </div>
    </div>
  );

  return (
    <div className="pt-16 pb-16">


      <div className="p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen px-4 rounded-lg"> {/* Adjusted pt-24 to pt-20 */}


        {/* Success Alert */}
        <div className="bg-green-100 border border-green-300 text-green-800 px-6 py-4 rounded-md mb-8 shadow">
          <p className="font-bold text-2xl mb-1">Order Confirmed!</p>
          <p>Thank you for your purchase. Your order has been placed successfully.</p>
        </div>

        {/* Main Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Payment Details */}
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
            {paymentDetails && (
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-gray-500">Transaction ID</p>
                  <p className="font-medium">{paymentDetails.transaction_id}</p>
                </div>
                <div>
                  <p className="text-gray-500">Payment Method</p>
                  <p className="font-medium">{paymentDetails.payment_method || 'Credit Card'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Payment Status</p>
                  <span className="inline-block px-2 py-1 rounded-full text-xs font-semibold bg-green-200 text-green-800">
                    {paymentDetails.status || 'Paid'}
                  </span>
                </div>
                <div>
                  <p className="text-gray-500">Payment Date</p>
                  <p className="font-medium">
                    {paymentDetails.createdAt
                      ? new Date(paymentDetails.createdAt).toLocaleString()
                      : new Date().toLocaleString()}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Shipping Details */}
          {orderDetails?.shipping_address && (
            <div className="bg-white p-6 rounded-xl border shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Shipping Details</h2>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-gray-500">Name</p>
                  <p className="font-medium">{orderDetails.first_name} {orderDetails.last_name}</p>
                </div>
                <div>
                  <p className="text-gray-500">Email</p>
                  <p className="font-medium">{orderDetails.email}</p>
                </div>
                <div>
                  <p className="text-gray-500">Phone</p>
                  <p className="font-medium">{orderDetails.phone_number}</p>
                </div>
                <div>
                  <p className="text-gray-500">Address</p>
                  <p className="font-medium">
                    {orderDetails.shipping_address.address}, {orderDetails.shipping_address.city},<br />
                    {orderDetails.shipping_address.postal_code}, {orderDetails.shipping_address.country}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Order Items */}
        {orderDetails?.items?.length > 0 && (
          <div className="mt-10 bg-white p-6 rounded-xl border shadow-sm">
            <h2 className="text-xl font-semibold mb-6">Order Items</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="px-4 py-2">Product</th>
                    <th className="px-4 py-2 text-center">Quantity</th>
                    <th className="px-4 py-2 text-right">Price</th>
                    <th className="px-4 py-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orderDetails.items.map((item, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-4 py-2">{item.product?.name || 'Product'}</td>
                      <td className="px-4 py-2 text-center">{item.quantity}</td>
                      <td className="px-4 py-2 text-right">${item.price?.toFixed(2)}</td>
                      <td className="px-4 py-2 text-right">
                        ${(item.price * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                  <tr className="border-t bg-gray-50 font-bold">
                    <td colSpan="3" className="px-4 py-2 text-right">Total:</td>
                    <td className="px-4 py-2 text-right">
                      ${orderDetails.total_amount?.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Footer Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row justify-between gap-4">
          <Link
            to="/homepage"
            className="px-4 py-1 rounded-full border border-black hover:bg-black hover:text-white transition-all"
          >
            Return to Home
          </Link>
          <button
            onClick={() => window.print()}
            className="px-4 py-1 rounded-full border border-black hover:bg-black hover:text-white transition-all"
          >
            Print Receipt
          </button>
        </div>
      </div>
    </div>

  );
};

export default OrderConfirmation;
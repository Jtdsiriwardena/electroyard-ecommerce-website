import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Navbar from '../components/Navbar';
import axios from 'axios';
import {
  fetchCart,
  updateCartItem,
  removeCartItem,
  clearCart
} from '../redux/cartSlice';

function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const token = localStorage.getItem('token');

  const { items: cartItems, loading } = useSelector((state) => state.cart);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone_number, setPhone] = useState('');
  const [showSummary, setShowSummary] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    postal_code: '',
    country: ''
  });

  useEffect(() => {
    dispatch(fetchCart());
    fetchUserProfile();
  }, [dispatch]);

  const fetchUserProfile = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const user = res.data;
      setFirstName(user.first_name || '');
      setLastName(user.last_name || '');
      setEmail(user.email || '');
      setPhone(user.phone_number || '');
      if (user.shipping_address) {
        setShippingAddress(user.shipping_address);
      }
    } catch (err) {
      console.error('User fetch error', err);
    }
  };

  const updatePhoneNumber = async (number) => {
    try {
      await axios.put(
        'http://localhost:5000/api/auth/phone',
        { phone_number: number },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error('Phone update error', err);
    }
  };

  const saveShippingDetails = async () => {
    try {
      await updatePhoneNumber(phone_number);
      await axios.put(
        'http://localhost:5000/api/auth/address',
        { shipping_address: shippingAddress },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Swal.fire('Success', 'Shipping details saved.', 'success');
    } catch {
      Swal.fire('Error', 'Failed to save address.', 'error');
    }
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleQuantity = (id, qty) => {
    if (qty >= 1) {
      dispatch(updateCartItem({ itemId: id, quantity: qty }));
    }
  };

  const handleRemove = (id) => {
    Swal.fire({
      title: 'Remove Item?',
      text: 'Are you sure?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, remove it!'
    }).then((res) => {
      if (res.isConfirmed) {
        dispatch(removeCartItem(id));
        Swal.fire('Removed!', 'Item removed.', 'success');
      }
    });
  };

  const handleClearCart = () => {
    Swal.fire({
      title: 'Clear cart?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes'
    }).then((res) => {
      if (res.isConfirmed) {
        dispatch(clearCart());
        Swal.fire('Cleared', 'Cart is empty now.', 'success');
      }
    });
  };

  const handleCheckout = async () => {
    try {
      if (!stripe || !elements) return;

      await updatePhoneNumber(phone_number);

      const orderRes = await axios.post(
        'http://localhost:5000/api/orders',
        {
          first_name: firstName,
          last_name: lastName,
          email,
          phone_number,
          shipping_address: shippingAddress
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const order = orderRes.data.order;

      const paymentIntentRes = await axios.post(
        'http://localhost:5000/api/payments/create-payment-intent',
        { order_id: order._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const clientSecret = paymentIntentRes.data.clientSecret;
      const cardElement = elements.getElement(CardElement);

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: `${firstName} ${lastName}`
          }
        }
      });

      if (result.error) {
        alert(result.error.message);
        return;
      }

      if (result.paymentIntent.status === 'succeeded') {
        await axios.put(
          `http://localhost:5000/api/orders/${order._id}/payment`,
          { status: 'paid' },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const paymentDetailsRes = await axios.get(
          `http://localhost:5000/api/payments/${order._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setPaymentDetails(paymentDetailsRes.data);
        dispatch(clearCart());
        navigate(`/order-confirmation/${order._id}`, {
          state: {
            orderId: order._id,
            paymentDetails: paymentDetailsRes.data
          }
        });
      }
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Checkout failed.');
    }
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const total = cartItems.reduce((acc, item) => {
    const discount = item.product.discount_percentage || 0;
    const discountedPrice = item.product.price * (1 - discount / 100);
    return acc + discountedPrice * item.quantity;
  }, 0);

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-4 sm:px-8 text-gray-800">
      <Navbar />
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">Your Cart</h2>

        {cartItems.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-500">Your cart is empty.</p>
            <button onClick={() => navigate('/products')} className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-full">
              Shop Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart List */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div key={item._id} className="flex items-center bg-white p-4 rounded-xl shadow-sm">
                  <img src={`http://localhost:5000/${item.product.image}`} alt="" className="w-20 h-20 object-cover rounded-lg mr-4" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{item.product.name}</h3>
                    <p className="text-sm text-gray-500">${item.product.price.toFixed(2)}</p>
                    <div className="flex items-center mt-2 space-x-2">
                      <button onClick={() => handleQuantity(item._id, item.quantity - 1)} disabled={item.quantity <= 1}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => handleQuantity(item._id, item.quantity + 1)}>+</button>
                      <button className="text-red-500 ml-4" onClick={() => handleRemove(item._id)}>Remove</button>
                    </div>
                  </div>
                </div>
              ))}
              <button onClick={handleClearCart} className="mt-4 px-6 py-2 bg-red-600 text-white rounded-full">Clear Cart</button>
            </div>

            {/* Checkout */}
            <div className="bg-white p-6 rounded-xl shadow-md sticky top-24">
              <h3 className="text-xl font-bold mb-4">Order Summary</h3>
              <p className="flex justify-between"><span>Subtotal</span> <span>${subtotal.toFixed(2)}</span></p>
              <p className="flex justify-between font-semibold"><span>Total</span> <span>${total.toFixed(2)}</span></p>

              <h4 className="mt-6 font-bold">Shipping Info</h4>
              <input placeholder="Address" name="address" value={shippingAddress.address} onChange={handleAddressChange} className="w-full mt-2 mb-2 p-2 border rounded" />
              <input placeholder="City" name="city" value={shippingAddress.city} onChange={handleAddressChange} className="w-full mb-2 p-2 border rounded" />
              <input placeholder="Postal Code" name="postal_code" value={shippingAddress.postal_code} onChange={handleAddressChange} className="w-full mb-2 p-2 border rounded" />
              <input placeholder="Country" name="country" value={shippingAddress.country} onChange={handleAddressChange} className="w-full mb-4 p-2 border rounded" />

              <button onClick={saveShippingDetails} className="mb-4 w-full py-2 bg-gray-200 rounded">Save Shipping</button>

              <h4 className="font-bold">Payment</h4>
              <div className="border p-3 rounded mb-4"><CardElement /></div>

              <button onClick={() => setShowSummary(true)} className="w-full py-2 bg-blue-600 text-white rounded">Review Order</button>

              {showSummary && (
                <div className="mt-4 border-t pt-4">
                  <p>Name: {firstName} {lastName}</p>
                  <p>Email: {email}</p>
                  <p>Phone: {phone_number}</p>
                  <p>Address: {shippingAddress.address}, {shippingAddress.city}, {shippingAddress.postal_code}, {shippingAddress.country}</p>
                  <p>Total: ${total.toFixed(2)}</p>

                  <button onClick={handleCheckout} className="mt-4 w-full py-2 bg-green-600 text-white rounded">Confirm & Pay</button>
                  <button onClick={() => setShowSummary(false)} className="mt-2 w-full py-2 bg-gray-300 text-gray-800 rounded">Cancel</button>

                  {paymentDetails && (
                    <div className="mt-6 p-4 rounded-xl bg-green-100 text-green-800 text-sm space-y-2">
                      <p><strong>Payment ID:</strong> {paymentDetails._id}</p>
                      <p><strong>Order ID:</strong> {paymentDetails.order}</p>
                      <p><strong>Amount:</strong> ${(paymentDetails.amount / 100).toFixed(2)}</p>
                      <p><strong>Status:</strong> {paymentDetails.status}</p>
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
  });
  const [submitting, setSubmitting] = useState(false);

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-4xl font-bold text-pudding-800 mb-6">
          No Items to Checkout
        </h1>
        <button
          onClick={() => navigate('/products')}
          className="bg-pudding-600 text-white px-8 py-4 rounded-lg text-xl font-semibold hover:bg-pudding-700 transition"
        >
          Browse Products
        </button>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const orderData = {
        customer_name: formData.customer_name,
        customer_email: formData.customer_email,
        total: getCartTotal(),
        items: cartItems.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
      };

      const response = await axios.post('/api/orders', orderData);
      
      alert(`Order placed successfully! Order ID: ${response.data.orderId}`);
      clearCart();
      navigate('/');
    } catch (error) {
      alert('Failed to place order. Please try again.');
      console.error('Order error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-5xl font-bold text-pudding-800 mb-8">
        Checkout
      </h1>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Checkout Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-pudding-800 mb-6">
            Customer Information
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="customer_name"
                value={formData.customer_name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pudding-600"
                placeholder="John Doe"
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">
                Email Address *
              </label>
              <input
                type="email"
                name="customer_email"
                value={formData.customer_email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pudding-600"
                placeholder="john@example.com"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-pudding-600 text-white px-6 py-4 rounded-lg text-xl font-semibold hover:bg-pudding-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {submitting ? 'Placing Order...' : 'Place Order'}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-pudding-800 mb-6">
            Order Summary
          </h2>

          <div className="space-y-4 mb-6">
            {cartItems.map(item => (
              <div key={item.id} className="flex justify-between items-center border-b pb-4">
                <div className="flex-grow">
                  <h4 className="font-semibold text-pudding-800">{item.name}</h4>
                  <p className="text-gray-600 text-sm">Quantity: {item.quantity}</p>
                </div>
                <span className="font-semibold text-pudding-600">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>${getCartTotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="border-t pt-3 flex justify-between text-2xl font-bold text-pudding-800">
              <span>Total</span>
              <span>${getCartTotal().toFixed(2)}</span>
            </div>
          </div>

          <div className="bg-pudding-50 p-4 rounded-lg">
            <p className="text-sm text-pudding-800">
              🎉 Free shipping on all orders! Your puddings will arrive fresh within 2-3 business days.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-4xl font-bold text-pudding-800 mb-6">
          Your Cart is Empty
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Start shopping for delicious puddings!
        </p>
        <Link
          to="/products"
          className="bg-pudding-600 text-white px-8 py-4 rounded-lg text-xl font-semibold hover:bg-pudding-700 transition inline-block"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-5xl font-bold text-pudding-800 mb-8">
        Shopping Cart
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          {cartItems.map(item => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-lg p-6 mb-4 flex items-center gap-6"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-pudding-200 to-pudding-400 rounded-lg flex items-center justify-center text-4xl">
                🍮
              </div>

              <div className="flex-grow">
                <h3 className="text-2xl font-bold text-pudding-800 mb-2">
                  {item.name}
                </h3>
                <p className="text-gray-600 mb-2">{item.description}</p>
                <p className="text-xl font-semibold text-pudding-600">
                  ${item.price.toFixed(2)}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-gray-100 rounded-lg">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="px-3 py-2 text-xl font-bold text-pudding-600 hover:bg-gray-200 rounded-l-lg"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="px-3 py-2 text-xl font-bold text-pudding-600 hover:bg-gray-200 rounded-r-lg"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-600 hover:text-red-800 font-semibold"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
            <h2 className="text-2xl font-bold text-pudding-800 mb-6">
              Order Summary
            </h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="border-t pt-3 flex justify-between text-xl font-bold text-pudding-800">
                <span>Total</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>
            </div>

            <Link
              to="/checkout"
              className="block w-full bg-pudding-600 text-white text-center px-6 py-4 rounded-lg text-xl font-semibold hover:bg-pudding-700 transition"
            >
              Proceed to Checkout
            </Link>

            <Link
              to="/products"
              className="block w-full text-center text-pudding-600 mt-4 hover:text-pudding-800 font-semibold"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

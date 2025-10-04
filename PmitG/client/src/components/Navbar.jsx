import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { getCartCount } = useCart();

  return (
    <nav className="bg-pudding-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold hover:text-pudding-100 transition">
            🍮 PuddingmitGabel
          </Link>
          
          <div className="flex gap-6 items-center">
            <Link to="/" className="hover:text-pudding-200 transition">
              Home
            </Link>
            <Link to="/products" className="hover:text-pudding-200 transition">
              Products
            </Link>
            <Link to="/cart" className="relative hover:text-pudding-200 transition">
              Cart
              {getCartCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getCartCount()}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

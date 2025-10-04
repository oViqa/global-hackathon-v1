import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-6xl font-bold text-pudding-800 mb-6">
          Welcome to PuddingmitGabel
        </h1>
        <p className="text-2xl text-pudding-600 mb-8">
          Premium Puddings Crafted with Love Since 1892
        </p>
        <Link
          to="/products"
          className="bg-pudding-600 text-white px-8 py-4 rounded-lg text-xl font-semibold hover:bg-pudding-700 transition inline-block"
        >
          Explore Our Collection
        </Link>
      </div>

      {/* About Section */}
      <div className="bg-white rounded-lg shadow-xl p-8 mb-12">
        <h2 className="text-4xl font-bold text-pudding-800 mb-6">
          Our Story
        </h2>
        <p className="text-lg text-gray-700 mb-4">
          For over 130 years, PuddingmitGabel has been crafting the finest puddings in Europe. 
          What started as a small family business in a quaint German village has grown into 
          a beloved brand known for its commitment to quality and tradition.
        </p>
        <p className="text-lg text-gray-700 mb-4">
          Each pudding is made using time-honored recipes passed down through generations, 
          combined with the finest ingredients sourced from local farms. We believe that 
          great pudding should be simple: pure ingredients, expert craftsmanship, and love.
        </p>
        <p className="text-lg text-gray-700">
          Today, we continue this tradition while embracing innovation, offering both 
          classic flavors and exciting new creations that delight pudding lovers worldwide.
        </p>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="text-5xl mb-4">🌾</div>
          <h3 className="text-2xl font-bold text-pudding-800 mb-3">
            Premium Ingredients
          </h3>
          <p className="text-gray-600">
            Only the finest, locally-sourced ingredients make it into our puddings.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="text-5xl mb-4">👨‍🍳</div>
          <h3 className="text-2xl font-bold text-pudding-800 mb-3">
            Traditional Craftsmanship
          </h3>
          <p className="text-gray-600">
            Made using recipes perfected over 130 years of pudding excellence.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="text-5xl mb-4">💚</div>
          <h3 className="text-2xl font-bold text-pudding-800 mb-3">
            Sustainable & Natural
          </h3>
          <p className="text-gray-600">
            No artificial preservatives, just pure pudding perfection.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-pudding-600 to-pudding-800 rounded-lg shadow-xl p-12 text-center text-white">
        <h2 className="text-4xl font-bold mb-4">
          Ready to Experience True Pudding?
        </h2>
        <p className="text-xl mb-6">
          Browse our collection and find your perfect flavor today.
        </p>
        <Link
          to="/products"
          className="bg-white text-pudding-800 px-8 py-4 rounded-lg text-xl font-semibold hover:bg-pudding-100 transition inline-block"
        >
          Shop Now
        </Link>
      </div>
    </div>
  );
};

export default Home;

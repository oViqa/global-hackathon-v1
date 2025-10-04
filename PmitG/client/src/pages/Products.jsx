import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products');
      setProducts(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load products');
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    alert(`${product.name} added to cart!`);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="text-2xl text-pudding-600">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="text-2xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-5xl font-bold text-pudding-800 mb-8 text-center">
        Our Premium Pudding Collection
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map(product => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition"
          >
            <div className="h-48 bg-gradient-to-br from-pudding-200 to-pudding-400 flex items-center justify-center">
              <span className="text-6xl">🍮</span>
            </div>
            
            <div className="p-6">
              <div className="mb-2">
                <span className="inline-block bg-pudding-100 text-pudding-800 text-xs px-3 py-1 rounded-full uppercase font-semibold">
                  {product.category}
                </span>
              </div>
              
              <h3 className="text-2xl font-bold text-pudding-800 mb-2">
                {product.name}
              </h3>
              
              <p className="text-gray-600 mb-4">
                {product.description}
              </p>
              
              <div className="flex justify-between items-center">
                <span className="text-3xl font-bold text-pudding-600">
                  ${product.price.toFixed(2)}
                </span>
                
                <button
                  onClick={() => handleAddToCart(product)}
                  className="bg-pudding-600 text-white px-6 py-2 rounded-lg hover:bg-pudding-700 transition font-semibold"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;

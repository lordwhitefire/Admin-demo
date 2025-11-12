// src/components/NewArrivalProducts.js
import { useState } from 'react';
import { useProducts } from '../context/ProductsContext';
import { useNewArrivals } from '../context/NewArrivalsContext';
import { useNavigate } from 'react-router-dom';

const NewArrivalProducts = () => {
  const { products, loading: productsLoading } = useProducts();
  const { newArrivals, loading: naLoading, addNewArrival, removeNewArrival } = useNewArrivals();

  const [searchTerm, setSearchTerm] = useState('');
  const [showSelector, setShowSelector] = useState(false);
  const navigate = useNavigate();

  // Filter products that are NOT already in new arrivals
  const availableProducts = products.filter(p => 
    !newArrivals.some(na => na.id === p.id) &&
    (p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     p.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAdd = async (product) => {
    const result = await addNewArrival(product);
    if (!result.success) {
      alert(result.error || 'Failed to add. Try again.');
    } else {
      setShowSelector(false);
      setSearchTerm(''); // Clear search
    }
  };

  const handleRemove = async (id) => {
    if (window.confirm('Remove this product from New Arrivals?')) {
      const result = await removeNewArrival(id);
      if (!result.success) {
        alert('Failed to remove. Try again.');
      }
    }
  };

  const loading = productsLoading || naLoading;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">New Arrivals</h1>
              <p className="text-sm text-gray-600 mt-1">
                Feature up to <span className="font-bold text-pink-600">6 products</span> as new
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowSelector(true)}
                disabled={newArrivals.length >= 6 || loading}
                className="px-5 py-2.5 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-medium rounded-lg hover:from-pink-700 hover:to-purple-700 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                + Add New Arrival
              </button>
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                ← Dashboard
              </button>
            </div>
          </div>
        </div>

        {/* Current New Arrivals */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Current New Arrivals ({newArrivals.length}/6)
          </h2>

          {loading ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
              <p className="text-gray-500 animate-pulse">Loading new arrivals...</p>
            </div>
          ) : newArrivals.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
              <p className="text-gray-500">No new arrivals yet. Add up to 6 products.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {newArrivals.map(product => (
                <div
                  key={product._id}
                  className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-xl transition group"
                >
                  <div className="relative">
                    <img
                      src={product.imageUrl || 'https://via.placeholder.com/300'}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                      NEW
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>
                    <p className="text-xs text-gray-600 mt-1">{product.category}</p>
                    <button
                      onClick={() => handleRemove(product._id)}
                      className="mt-3 w-full bg-red-500 text-white text-sm font-medium py-2 rounded-lg hover:bg-red-600 transition opacity-0 group-hover:opacity-100"
                    >
                      Remove from New
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Selector Modal */}
        {showSelector && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-screen overflow-y-auto">
              <div className="p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-900">Select Product to Feature</h2>
                  <button
                    onClick={() => setShowSelector(false)}
                    className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className="p-6">
                <input
                  type="text"
                  placeholder="Search by name or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent mb-6 text-base"
                  autoFocus
                />

                {loading ? (
                  <p className="text-center text-gray-500 py-8">Loading products...</p>
                ) : availableProducts.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">
                    {searchTerm ? 'No products match your search.' : 'All products are already featured or no products exist.'}
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                    {availableProducts.map(product => (
                      <button
                        key={product._id}
                        onClick={() => handleAdd(product)}
                        className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition text-left group"
                      >
                        <img
                          src={product.imageUrl || 'https://via.placeholder.com/60'}
                          alt={product.name}
                          className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate group-hover:text-purple-700">
                            {product.name}
                          </p>
                          <p className="text-xs text-gray-600">{product.category}</p>
                        </div>
                        <span className="text-purple-600 text-xs font-bold opacity-0 group-hover:opacity-100 transition">
                          Add →
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewArrivalProducts;
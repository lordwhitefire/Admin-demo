// src/components/Dashboard.js
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductsContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { products, loading } = useProducts();
  const navigate = useNavigate();

  const newArrivals = products.filter(p => p.isNew).length;
  const totalProducts = products.length;

  const lastLogin = new Date().toLocaleString('en-NG', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });

  const navCards = [
    {
      title: 'Manage Products',
      count: totalProducts,
      desc: 'Add, edit, delete all shop items',
      path: '/admin/products',
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'New Arrivals',
      count: newArrivals + '/6',
      desc: 'Feature up to 6 new products',
      path: '/admin/new-arrivals',
      color: 'from-pink-500 to-rose-600'
    },
    {
      title: 'Home Settings',
      count: '',
      desc: 'Hero, CTA, featured products',
      path: '/admin/settings/home',
      color: 'from-indigo-500 to-blue-600'
    },
    {
      title: 'About Page',
      count: '',
      desc: 'Founder story, paragraphs, image',
      path: '/admin/settings/about',
      color: 'from-emerald-500 to-teal-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Eliphany Admin</h1>
            <p className="text-sm text-gray-600">Welcome back, <span className="font-medium">{user?.name}</span></p>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Stats */}
      <div className="p-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <p className="text-sm text-gray-600">Total Products</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{loading ? '...' : totalProducts}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <p className="text-sm text-gray-600">New Arrivals</p>
            <p className="text-3xl font-bold text-pink-600 mt-1">{loading ? '...' : newArrivals}/6</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <p className="text-sm text-gray-600">Last Login</p>
            <p className="text-lg font-medium text-gray-900 mt-1">{lastLogin}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {navCards.map((card) => (
            <button
              key={card.title}
              onClick={() => navigate(card.path)}
              className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-90 group-hover:opacity-100 transition`}></div>
              <div className="relative p-6 text-white text-left">
                <h3 className="text-lg font-bold">{card.title}</h3>
                {card.count && <p className="text-3xl font-bold mt-1">{card.count}</p>}
                <p className="text-sm mt-2 opacity-90">{card.desc}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>@RunebladeX12 — Nigeria</p>
          <p className="mt-1">Eliphany Admin Portal © 2025</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
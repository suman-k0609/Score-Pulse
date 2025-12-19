import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-slate-800 bg-opacity-50 backdrop-blur-xl border-b border-slate-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold gradient-text">Sports Adda</h1>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/dashboard" className="text-slate-300 hover:text-white transition">
              🏠 Home
            </Link>
            <Link to="/search" className="text-slate-300 hover:text-white transition">
              🔍 Search
            </Link>
            <Link to="/standings" className="text-slate-300 hover:text-white transition">
              🏆 Standings
            </Link>
          </div>

          {/* User Info & Logout */}
          <div className="hidden md:flex items-center space-x-4">
            <span className="text-slate-300 text-sm">
              Welcome, <span className="text-blue-400 font-semibold">{user?.email}</span>
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
            >
              <FiLogOut size={18} />
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link
              to="/dashboard"
              className="block text-slate-300 hover:text-white py-2 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              🏠 Home
            </Link>
            <Link
              to="/search"
              className="block text-slate-300 hover:text-white py-2 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              🔍 Search
            </Link>
            <Link
              to="/standings"
              className="block text-slate-300 hover:text-white py-2 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              🏆 Standings
            </Link>
            <div className="border-t border-slate-700 pt-4">
              <p className="text-slate-400 text-sm mb-2">{user?.email}</p>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
              >
                <FiLogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

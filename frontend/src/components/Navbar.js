import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiLogOut, FiMenu, FiX, FiHome, FiSearch, FiAward, FiZap } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: FiHome },
    { path: '/search', label: 'Search Sports', icon: FiSearch },
    { path: '/standings', label: 'Standings', icon: FiAward },
  ];

  // Display username instead of full email
  const displayName = user?.userName || (user?.email ? user.email.split('@')[0] : 'User');
  const userInitial = displayName.charAt(0).toUpperCase();

  return (
    <nav className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800/80 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Brand */}
          <Link to="/dashboard" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition duration-300">
              <FiZap className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                Score<span className="bg-gradient-to-r from-cyan-400 to-sky-400 bg-clip-text text-transparent">Pulse</span>
              </span>
              <span className="text-[10px] tracking-wider text-cyan-400 font-semibold uppercase -mt-1">
                Live Sports Hub
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-2 bg-gray-900/60 p-1.5 rounded-full border border-gray-800/80">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center space-x-2 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500 to-sky-500 text-white shadow-md shadow-cyan-500/25'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* User Profile & Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-3 bg-gray-900/80 border border-gray-800 px-3.5 py-1.5 rounded-full">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                {userInitial}
              </div>
              <span className="text-xs text-gray-300 font-bold max-w-[150px] truncate capitalize">
                {displayName}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-gray-900/80 hover:bg-rose-500/10 text-gray-300 hover:text-rose-400 border border-gray-800 hover:border-rose-500/30 px-4 py-2 rounded-full text-xs font-semibold transition duration-200"
            >
              <FiLogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800/60 focus:outline-none"
            >
              {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-800/80 space-y-2 animate-in fade-in slide-in-from-top-4 duration-200">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
                    isActive
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                      : 'text-gray-400 hover:text-white hover:bg-gray-900'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
            <div className="pt-4 border-t border-gray-800 flex items-center justify-between px-2">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center text-xs font-bold text-white">
                  {userInitial}
                </div>
                <span className="text-xs text-gray-300 font-bold capitalize truncate max-w-[180px]">
                  {displayName}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-1.5 rounded-lg"
              >
                <FiLogOut className="w-3.5 h-3.5" />
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

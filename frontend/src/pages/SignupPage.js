import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiZap } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';

const SignupPage = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userName || !email || !password || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (userName.length < 3) {
      toast.error('Username must be at least 3 characters');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error('Please enter a valid email');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.register({ userName, email, password });
      const { token, userId, userName: regUserName } = response.data;

      login({ userId, email, userName: regUserName }, token);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Signup failed';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center p-4 bg-ambient-glow relative overflow-hidden">
      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 via-sky-500 to-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-cyan-500/20">
            <FiZap className="w-8 h-8 text-white animate-pulse" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Score<span className="text-cyan-400">Pulse</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-semibold">
            Live Sports Scoreboard & Analytics
          </p>
        </div>

        {/* Card */}
        <div className="glass-card rounded-3xl p-8 border border-gray-800 shadow-2xl">
          <h2 className="text-xl font-bold text-white mb-2">Create Account</h2>
          <p className="text-xs text-gray-400 mb-6">Join ScorePulse to follow live events and track real-time scores.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                Username
              </label>
              <div className="relative">
                <FiUser className="absolute left-3.5 top-3.5 text-gray-500" size={18} />
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="johndoe"
                  className="w-full bg-gray-900/90 border border-gray-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-3.5 text-gray-500" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full bg-gray-900/90 border border-gray-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-3.5 text-gray-500" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-gray-900/90 border border-gray-800 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-gray-500 hover:text-gray-300"
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-3.5 text-gray-500" size={18} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-gray-900/90 border border-gray-800 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-3.5 text-gray-500 hover:text-gray-300"
                >
                  {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-cyan-500/25 transition duration-200 mt-6 disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating Account...</span>
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-cyan-400 hover:underline font-bold">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;

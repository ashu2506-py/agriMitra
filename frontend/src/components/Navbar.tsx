import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sprout, ShoppingBag, TrendingUp, Bot, Truck, Users, Shield, LogOut, User as UserIcon } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-700 to-green-600 bg-clip-text text-transparent">
              AGRI MITRA
            </span>
            <span className="block text-[10px] font-semibold tracking-wider text-emerald-800 uppercase">
              Farm-to-Market Marketplace
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link to="/marketplace" className="text-sm font-medium text-slate-600 hover:text-emerald-700 flex items-center gap-1.5 transition">
            <ShoppingBag className="w-4 h-4" /> Marketplace
          </Link>
          <Link to="/market-intelligence" className="text-sm font-medium text-slate-600 hover:text-emerald-700 flex items-center gap-1.5 transition">
            <TrendingUp className="w-4 h-4" /> Intelligence
          </Link>
          <Link to="/assistant" className="text-sm font-medium text-slate-600 hover:text-emerald-700 flex items-center gap-1.5 transition">
            <Bot className="w-4 h-4" /> AI Assistant
          </Link>
          {user?.role === 'FARMER' && (
            <Link to="/farmer-dashboard" className="text-sm font-medium text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5">
              <Sprout className="w-4 h-4" /> My Crops
            </Link>
          )}
          {user?.role === 'FPO' && (
            <Link to="/fpo-dashboard" className="text-sm font-medium text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5">
              <Users className="w-4 h-4" /> FPO Hub
            </Link>
          )}
          {user?.role === 'DRIVER' && (
            <Link to="/driver-dashboard" className="text-sm font-medium text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5">
              <Truck className="w-4 h-4" /> Shipments
            </Link>
          )}
          {user?.role === 'ADMIN' && (
            <Link to="/admin-dashboard" className="text-sm font-medium text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5">
              <Shield className="w-4 h-4" /> Admin Panel
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
                {user.role}
              </span>
              <button
                onClick={handleLogout}
                className="p-2 text-slate-500 hover:text-red-600 hover:bg-slate-100 rounded-lg transition"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-emerald-700 transition"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

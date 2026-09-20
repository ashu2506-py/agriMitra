import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sprout, Lock, Mail } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || 'Invalid email or password'
        );
      }

      const user = data?.data?.user || data?.user;

      if (!user) {
        throw new Error(
          'Login succeeded but user information was not returned.'
        );
      }

      setUser({
        ...user,
        createdAt: user.createdAt || new Date().toISOString(),
      });

      switch (user.role) {
        case 'FARMER':
          navigate('/farmer-dashboard');
          break;

        case 'BUYER':
          navigate('/marketplace');
          break;

        case 'FPO':
          navigate('/fpo-dashboard');
          break;

        case 'DRIVER':
          navigate('/driver-dashboard');
          break;

        case 'ADMIN':
          navigate('/admin-dashboard');
          break;

        default:
          navigate('/');
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong during login.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-140px)] overflow-hidden flex items-center justify-center px-4 py-12">

      {/* Agricultural Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=2200&q=85')",
        }}
      />

      {/* Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/45 via-emerald-900/20 to-slate-950/30" />

      {/* Login Card */}
      <div className="relative w-full max-w-md bg-white/95 backdrop-blur-md p-8 rounded-3xl border border-white/70 shadow-2xl">

        {/* Logo / Heading */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-700 mx-auto mb-4 shadow-sm">
            <Sprout className="w-7 h-7" />
          </div>

          <h2 className="text-2xl font-bold text-slate-900">
            Sign in to AGRI MITRA
          </h2>

          <p className="text-xs text-slate-500 mt-2">
            Access your agricultural marketplace account
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Email Address
            </label>

            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />

              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50/90 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
                placeholder="user@agrimitra.org"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Password
            </label>

            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />

              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50/90 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-semibold rounded-xl transition shadow-md hover:shadow-lg"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Register */}
        <div className="mt-7 text-center text-xs text-slate-500">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
          >
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};
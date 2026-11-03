import React, { useState, useEffect } from 'react';
import { ApiClient } from '../services/api';
import { formatINR } from '@kahvi-panda/shared';
import { User, Package, MapPin, LogOut, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const AccountPage: React.FC = () => {
  const [user, setUser] = useState<any | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    async function checkAuth() {
      const token = localStorage.getItem('kahvi_auth_token');
      if (token) {
        try {
          const profile = await ApiClient.getAdminOverview(); // or get user profile
          setUser({ name: 'Coffee Explorer', email: 'customer@kahvipanda.in' });
        } catch {
          // ignore
        }
      }
    }
    checkAuth();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await ApiClient.login({ email, password });
      localStorage.setItem('kahvi_auth_token', res.token);
      setUser(res.user);
      if (res.user.role === 'ADMIN') {
        navigate('/admin');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('kahvi_auth_token');
    setUser(null);
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 sm:py-24 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-3xl">🐼</span>
          <h1 className="font-serif text-3xl text-[#30231C]">
            {isRegistering ? 'Create Your Account' : 'Welcome Back'}
          </h1>
          <p className="text-xs text-[#4B3428]/80">
            {isRegistering
              ? 'Join the circle for expedited checkout and order tracking.'
              : 'Sign in to access your orders and saved blends.'}
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-[#30231C]/10 shadow-soft">
          {error && <div className="p-3 mb-4 rounded-xl bg-red-50 text-red-700 text-xs">{error}</div>}

          <form onSubmit={handleLogin} className="space-y-4">
            {isRegistering && (
              <div>
                <label className="text-xs font-bold uppercase text-[#30231C] block mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl text-xs bg-[#FAF7F2] border border-[#30231C]/15 focus:outline-none"
                />
              </div>
            )}

            <div>
              <label className="text-xs font-bold uppercase text-[#30231C] block mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 rounded-xl text-xs bg-[#FAF7F2] border border-[#30231C]/15 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-[#30231C] block mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl text-xs bg-[#FAF7F2] border border-[#30231C]/15 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-pill bg-[#30231C] text-[#F8F5EE] text-xs font-bold uppercase tracking-widest hover:bg-[#4B3428] transition-colors"
            >
              {loading ? 'Authenticating...' : isRegistering ? 'Register' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-[#30231C]/10 text-center">
            <button
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-xs text-[#BC785C] font-semibold hover:underline"
            >
              {isRegistering ? 'Already have an account? Sign In' : 'New to Kahvi Panda? Create Account'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 sm:py-20 space-y-10">
      <div className="flex items-center justify-between border-b border-[#30231C]/10 pb-6">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#9CA88E]">Customer Portal</span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#30231C]">Hello, {user.name}</h1>
          <p className="text-xs text-[#4B3428]/80">{user.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded-full border border-[#30231C]/20 text-xs font-bold text-[#BC785C] flex items-center gap-1.5 hover:bg-white transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/track-order"
          className="p-6 rounded-3xl bg-white border border-[#30231C]/10 shadow-soft hover:shadow-elevated transition-all space-y-2"
        >
          <Package className="w-6 h-6 text-[#9CA88E]" />
          <h3 className="font-serif text-lg font-bold text-[#30231C]">Track Orders</h3>
          <p className="text-xs text-[#4B3428]/80">Check delivery status and tracking IDs</p>
        </Link>

        <Link
          to="/shop"
          className="p-6 rounded-3xl bg-white border border-[#30231C]/10 shadow-soft hover:shadow-elevated transition-all space-y-2"
        >
          <User className="w-6 h-6 text-[#BC785C]" />
          <h3 className="font-serif text-lg font-bold text-[#30231C]">Reorder Favorites</h3>
          <p className="text-xs text-[#4B3428]/80">Quickly reorder your everyday coffee</p>
        </Link>

        <Link
          to="/contact"
          className="p-6 rounded-3xl bg-white border border-[#30231C]/10 shadow-soft hover:shadow-elevated transition-all space-y-2"
        >
          <MapPin className="w-6 h-6 text-[#4B3428]" />
          <h3 className="font-serif text-lg font-bold text-[#30231C]">Support & WhatsApp</h3>
          <p className="text-xs text-[#4B3428]/80">Direct concierge for orders & subscriptions</p>
        </Link>
      </div>
    </div>
  );
};

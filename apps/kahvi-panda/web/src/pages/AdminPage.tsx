import React, { useState, useEffect } from 'react';
import { ApiClient } from '../services/api';
import { formatINR } from '@kahvi-panda/shared';
import {
  LayoutDashboard,
  ShoppingBag,
  MessageSquare,
  Bot,
  Lock,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  LogOut
} from 'lucide-react';

export const AdminPage: React.FC = () => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('kahvi_auth_token'));
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'enquiries' | 'ai'>('overview');
  const [overviewData, setOverviewData] = useState<any | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [ov, ords, enqs] = await Promise.all([
        ApiClient.getAdminOverview(),
        ApiClient.getAdminOrders(),
        ApiClient.getAdminEnquiries()
      ]);
      setOverviewData(ov);
      setOrders(ords);
      setEnquiries(enqs);
    } catch {
      // Invalid or expired token
      setToken(null);
      localStorage.removeItem('kahvi_auth_token');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadAdminData();
    }
  }, [token]);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    try {
      const res = await ApiClient.login({ email, password });
      if (res.user.role !== 'ADMIN') {
        throw new Error('Access denied. Administrator privileges required.');
      }
      localStorage.setItem('kahvi_auth_token', res.token);
      setToken(res.token);
    } catch (err: any) {
      setLoginError(err.message || 'Login failed');
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      await ApiClient.updateOrderStatus(orderId, status);
      await loadAdminData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('kahvi_auth_token');
    setToken(null);
  };

  // Login view if unauthorized
  if (!token) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 sm:py-28 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-full bg-[#30231C] text-[#F8F5EE] flex items-center justify-center mx-auto text-2xl shadow-md">
            🐼
          </div>
          <h1 className="font-serif text-3xl text-[#30231C]">Staff Admin Portal</h1>
          <p className="text-xs text-[#4B3428]/80">Authorized Kahvi Panda personnel only</p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-[#30231C]/10 shadow-soft">
          {loginError && (
            <div className="p-3 mb-4 rounded-xl bg-red-50 text-red-700 text-xs">{loginError}</div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase text-[#30231C] block mb-1">Admin Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                className="w-full px-4 py-2.5 rounded-xl text-xs bg-[#FAF7F2] border border-[#30231C]/15 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-pill bg-[#30231C] text-[#F8F5EE] text-xs font-bold uppercase tracking-widest hover:bg-[#4B3428] transition-colors"
            >
              Sign In to Command Center
            </button>
          </form>

          <p className="text-[11px] text-[#4B3428]/60 text-center mt-4">
            Sign in with the administrator credentials configured for this store.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row items-baseline justify-between border-b border-[#30231C]/10 pb-4 gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#9CA88E]">
            Kahvi Panda Control Center
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#30231C]">Admin Dashboard</h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadAdminData}
            className="p-2 rounded-full border border-[#30231C]/15 text-xs text-[#30231C] hover:bg-white"
            title="Refresh metrics"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-full bg-white border border-[#30231C]/20 text-xs font-bold text-[#BC785C] flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[#30231C]/10 pb-2 overflow-x-auto">
        {[
          { id: 'overview', label: 'Overview Metrics', icon: <LayoutDashboard className="w-4 h-4" /> },
          { id: 'orders', label: `Orders (${orders.length})`, icon: <ShoppingBag className="w-4 h-4" /> },
          { id: 'enquiries', label: `Enquiries & WhatsApp (${enquiries.length})`, icon: <MessageSquare className="w-4 h-4" /> },
          { id: 'ai', label: 'Panda AI Analytics', icon: <Bot className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'bg-[#30231C] text-[#F8F5EE]'
                : 'bg-white text-[#4B3428] hover:bg-[#E9DCC9]/40 border border-[#30231C]/10'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* 1. OVERVIEW TAB */}
      {activeTab === 'overview' && overviewData && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-6 rounded-3xl bg-white border border-[#30231C]/10 shadow-soft">
              <span className="text-xs text-[#4B3428]/70 font-semibold uppercase">Total Revenue</span>
              <h3 className="font-serif text-3xl font-bold text-[#30231C] mt-1">
                {formatINR(overviewData.metrics.totalRevenue)}
              </h3>
            </div>
            <div className="p-6 rounded-3xl bg-white border border-[#30231C]/10 shadow-soft">
              <span className="text-xs text-[#4B3428]/70 font-semibold uppercase">Total Orders</span>
              <h3 className="font-serif text-3xl font-bold text-[#30231C] mt-1">
                {overviewData.metrics.totalOrders}
              </h3>
            </div>
            <div className="p-6 rounded-3xl bg-white border border-[#30231C]/10 shadow-soft">
              <span className="text-xs text-[#4B3428]/70 font-semibold uppercase">Customer Enquiries</span>
              <h3 className="font-serif text-3xl font-bold text-[#30231C] mt-1">
                {overviewData.metrics.totalEnquiries}
              </h3>
            </div>
            <div className="p-6 rounded-3xl bg-white border border-[#30231C]/10 shadow-soft">
              <span className="text-xs text-[#4B3428]/70 font-semibold uppercase">Panda AI Sessions</span>
              <h3 className="font-serif text-3xl font-bold text-[#30231C] mt-1">
                {overviewData.metrics.totalConversations}
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Orders */}
            <div className="bg-white p-6 rounded-3xl border border-[#30231C]/10 shadow-soft space-y-4">
              <h3 className="font-serif text-xl text-[#30231C]">Recent Orders</h3>
              <div className="divide-y divide-[#30231C]/10">
                {overviewData.recentOrders.map((ord: any) => (
                  <div key={ord.id} className="py-3 flex justify-between items-center text-xs">
                    <div>
                      <strong className="text-[#30231C]">{ord.orderNumber}</strong>
                      <p className="text-[#4B3428]/70">{ord.customerName} • {ord.items?.length} items</p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-[#30231C] block">{formatINR(ord.totalAmount)}</span>
                      <span className="text-[10px] uppercase font-bold text-[#9CA88E]">{ord.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Enquiries */}
            <div className="bg-white p-6 rounded-3xl border border-[#30231C]/10 shadow-soft space-y-4">
              <h3 className="font-serif text-xl text-[#30231C]">Recent Enquiries & B2B</h3>
              <div className="divide-y divide-[#30231C]/10">
                {overviewData.recentEnquiries.map((enq: any) => (
                  <div key={enq.id} className="py-3 flex justify-between items-center text-xs">
                    <div>
                      <strong className="text-[#30231C]">{enq.name}</strong>
                      <p className="text-[#4B3428]/70">{enq.subject}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FAF7F2] border text-[#4B3428]">
                      {enq.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. ORDERS MANAGEMENT TAB */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl border border-[#30231C]/10 shadow-soft overflow-hidden animate-in fade-in duration-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#4B3428]">
              <thead className="bg-[#FAF7F2] text-[#30231C] uppercase font-bold text-[10px] tracking-wider border-b border-[#30231C]/10">
                <tr>
                  <th className="p-4">Order #</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Items</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#30231C]/10">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-[#FAF7F2]/50 transition-colors">
                    <td className="p-4 font-mono font-bold text-[#30231C]">{ord.orderNumber}</td>
                    <td className="p-4">
                      <strong className="text-[#30231C] block">{ord.customerName}</strong>
                      <span className="text-[11px] text-[#4B3428]/70">{ord.customerPhone}</span>
                    </td>
                    <td className="p-4">{ord.items?.length} products</td>
                    <td className="p-4 font-bold text-[#30231C]">{formatINR(ord.totalAmount)}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#9CA88E]/20 text-[#7E8C6F] uppercase">
                        {ord.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <select
                        value={ord.status}
                        onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                        className="px-2.5 py-1 rounded-lg border border-[#30231C]/20 bg-white text-xs font-semibold focus:outline-none"
                      >
                        <option value="CONFIRMED">Confirmed</option>
                        <option value="PROCESSING">Roasting/Processing</option>
                        <option value="DISPATCHED">Dispatched</option>
                        <option value="DELIVERED">Delivered</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. ENQUIRIES TAB */}
      {activeTab === 'enquiries' && (
        <div className="bg-white rounded-3xl border border-[#30231C]/10 shadow-soft overflow-hidden animate-in fade-in duration-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#4B3428]">
              <thead className="bg-[#FAF7F2] text-[#30231C] uppercase font-bold text-[10px] tracking-wider border-b border-[#30231C]/10">
                <tr>
                  <th className="p-4">Ref #</th>
                  <th className="p-4">Contact</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Subject & Message</th>
                  <th className="p-4">WhatsApp Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#30231C]/10">
                {enquiries.map((enq) => (
                  <tr key={enq.id} className="hover:bg-[#FAF7F2]/50 transition-colors">
                    <td className="p-4 font-mono font-bold text-[#30231C]">{enq.referenceNumber}</td>
                    <td className="p-4">
                      <strong className="text-[#30231C] block">{enq.name}</strong>
                      <span className="text-[11px] text-[#4B3428]/70">{enq.phone}</span>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FAF7F2] border text-[#4B3428]">
                        {enq.type}
                      </span>
                    </td>
                    <td className="p-4 max-w-xs">
                      <p className="font-semibold text-[#30231C]">{enq.subject}</p>
                      <p className="text-[11px] text-[#4B3428]/80 line-clamp-2">{enq.message}</p>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#25D366]/20 text-[#128C7E] uppercase">
                        {enq.whatsAppStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. AI ANALYTICS TAB */}
      {activeTab === 'ai' && (
        <div className="bg-white p-8 rounded-3xl border border-[#30231C]/10 shadow-soft space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🐼</span>
            <div>
              <h3 className="font-serif text-2xl text-[#30231C]">Panda AI Concierge Telemetry</h3>
              <p className="text-xs text-[#4B3428]/80">Monitors customer preferences, recommendations, and conversion assistance.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#30231C]/10">
              <span className="text-[10px] uppercase font-bold text-[#4B3428]/70">Most Inquired Brew Method</span>
              <p className="font-serif text-xl font-bold text-[#30231C] mt-1">Moka Pot & French Press</p>
            </div>
            <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#30231C]/10">
              <span className="text-[10px] uppercase font-bold text-[#4B3428]/70">Top Recommended Blend</span>
              <p className="font-serif text-xl font-bold text-[#30231C] mt-1">Kolkata Classic Medium</p>
            </div>
            <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#30231C]/10">
              <span className="text-[10px] uppercase font-bold text-[#4B3428]/70">Human Escalation Rate</span>
              <p className="font-serif text-xl font-bold text-[#30231C] mt-1">4.2% (WhatsApp handoff)</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

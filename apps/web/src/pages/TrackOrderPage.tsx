import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ApiClient } from '../services/api';
import { Order } from '../types';
import { formatINR } from '@kahvi-panda/shared';
import { Search, Package, CheckCircle2, Clock, Truck, MapPin } from 'lucide-react';

export const TrackOrderPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialId = searchParams.get('id') || '';

  const [orderQuery, setOrderQuery] = useState(initialId);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = async (id: string) => {
    if (!id.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await ApiClient.getOrder(id.trim());
      setOrder(data);
    } catch {
      setError('No order found with reference number. Please verify your ID.');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialId) {
      fetchOrder(initialId);
    }
  }, [initialId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrder(orderQuery);
  };

  const steps = [
    { title: 'Order Placed', desc: 'Received & verified', status: 'CONFIRMED' },
    { title: 'Fresh Roasting', desc: 'In our Kolkata lab', status: 'PROCESSING' },
    { title: 'Dispatched', desc: 'With courier partner', status: 'DISPATCHED' },
    { title: 'Delivered', desc: 'At your doorstep', status: 'DELIVERED' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:py-20 space-y-10">
      
      <div className="text-center space-y-3">
        <span className="text-[11px] uppercase tracking-widest font-extrabold text-[#9CA88E]">
          Real-Time Fulfillment
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl text-[#30231C]">
          Track Your Coffee Order
        </h1>
        <p className="text-sm text-[#4B3428]/80 max-w-md mx-auto">
          Enter your Kahvi Panda order reference number (e.g. KP-26-XXXXX) to check roasting and dispatch status.
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto pt-4">
          <input
            type="text"
            required
            value={orderQuery}
            onChange={(e) => setOrderQuery(e.target.value)}
            placeholder="Enter Order # (e.g. KP-26-XXXXX)"
            className="flex-1 px-4 py-3 rounded-full text-xs font-mono bg-white border border-[#30231C]/20 focus:outline-none uppercase"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-full bg-[#30231C] text-[#F8F5EE] text-xs font-bold uppercase tracking-wider hover:bg-[#4B3428] transition-colors"
          >
            {loading ? 'Searching...' : 'Track'}
          </button>
        </form>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs text-center">
          {error}
        </div>
      )}

      {/* Order Status Timeline Card */}
      {order && (
        <div className="bg-white rounded-3xl border border-[#30231C]/10 shadow-soft p-6 sm:p-10 space-y-8 animate-in fade-in duration-300">
          
          <div className="flex flex-col sm:flex-row items-baseline justify-between border-b border-[#30231C]/10 pb-4 gap-2">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#9CA88E]">
                Reference #{order.orderNumber}
              </span>
              <h2 className="font-serif text-2xl text-[#30231C]">Order Details</h2>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#9CA88E]/20 text-[#7E8C6F] uppercase">
              Current Status: {order.status}
            </span>
          </div>

          {/* Visual Step Tracker */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4">
            {steps.map((st, idx) => (
              <div key={st.title} className="text-center space-y-2">
                <div className="w-10 h-10 rounded-full mx-auto flex items-center justify-center bg-[#9CA88E] text-[#F8F5EE] shadow-sm">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold text-[#30231C]">{st.title}</h4>
                <p className="text-[10px] text-[#4B3428]/70">{st.desc}</p>
              </div>
            ))}
          </div>

          {/* Items in Order */}
          <div className="border-t border-[#30231C]/10 pt-6">
            <h3 className="font-serif text-lg text-[#30231C] mb-3">Items in this shipment</h3>
            <div className="divide-y divide-[#30231C]/10">
              {order.items.map((i) => (
                <div key={i.id} className="py-2.5 flex justify-between text-xs">
                  <div>
                    <span className="font-bold text-[#30231C]">{i.name}</span>
                    <p className="text-[11px] text-[#4B3428]/70">{i.weight} • {i.grindType} (Qty: {i.quantity})</p>
                  </div>
                  <span className="font-bold text-[#30231C]">{formatINR(i.totalPrice)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

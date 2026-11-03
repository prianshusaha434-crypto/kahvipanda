import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../features/cart/CartContext';
import { ApiClient } from '../services/api';
import { formatINR, BRAND } from '@kahvi-panda/shared';
import { ShieldCheck, ArrowRight, Lock, CheckCircle2, AlertCircle } from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const { items, subtotal, isFreeShipping, clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    street: '',
    apartment: '',
    city: 'Kolkata',
    state: 'West Bengal',
    postalCode: '700091',
    country: 'India' as const
  });

  const [paymentMode, setPaymentMode] = useState<'TEST_MODE' | 'RAZORPAY'>('TEST_MODE');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-24 text-center space-y-4">
        <h2 className="font-serif text-3xl text-[#30231C]">Your Bag is Empty</h2>
        <p className="text-sm text-[#4B3428]/80">Please add coffee before proceeding to checkout.</p>
        <button
          onClick={() => navigate('/shop')}
          className="px-6 py-2.5 rounded-full bg-[#30231C] text-[#F8F5EE] text-xs font-bold uppercase"
        >
          Go to Shop
        </button>
      </div>
    );
  }

  const shippingAmount = isFreeShipping ? 0 : BRAND.shippingFee;
  const totalAmount = subtotal + shippingAmount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // Validate 6-digit PIN code
      if (!/^[1-9][0-9]{5}$/.test(formData.postalCode)) {
        throw new Error('Please enter a valid 6-digit Indian PIN code.');
      }

      const payload = {
        items,
        address: formData,
        notes: 'Handle with care. Kahvi Panda fresh roast.'
      };

      const result = await ApiClient.createOrder(payload);

      // Clear cart
      clearCart();

      // Navigate to confirmation
      navigate(`/order-confirmation/${result.orderNumber}`);
    } catch (err: any) {
      setError(err.message || 'Checkout failed. Please review your address details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      <div className="border-b border-[#30231C]/10 pb-6 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#30231C]">Secure Checkout</h1>
          <p className="text-xs text-[#4B3428]/80 mt-1">256-bit encrypted • Freshly dispatched from Kolkata</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[#9CA88E] font-bold">
          <Lock className="w-4 h-4" />
          <span>Encrypted Checkout</span>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left: Shipping Address Form */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-10 rounded-3xl border border-[#30231C]/10 shadow-soft space-y-6">
          <h2 className="font-serif text-2xl text-[#30231C]">Delivery Details</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#30231C] block mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="e.g. Sourav Banerjee"
                className="w-full px-4 py-2.5 rounded-xl text-xs bg-[#FAF7F2] border border-[#30231C]/15 focus:outline-none focus:border-[#30231C]"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#30231C] block mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="sourav@example.com"
                className="w-full px-4 py-2.5 rounded-xl text-xs bg-[#FAF7F2] border border-[#30231C]/15 focus:outline-none focus:border-[#30231C]"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#30231C] block mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98300 00000"
                className="w-full px-4 py-2.5 rounded-xl text-xs bg-[#FAF7F2] border border-[#30231C]/15 focus:outline-none focus:border-[#30231C]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#30231C] block mb-1">
                Street Address *
              </label>
              <input
                type="text"
                required
                value={formData.street}
                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                placeholder="House / Flat No., Road, Landmark"
                className="w-full px-4 py-2.5 rounded-xl text-xs bg-[#FAF7F2] border border-[#30231C]/15 focus:outline-none focus:border-[#30231C]"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#30231C] block mb-1">
                City *
              </label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl text-xs bg-[#FAF7F2] border border-[#30231C]/15 focus:outline-none focus:border-[#30231C]"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#30231C] block mb-1">
                State *
              </label>
              <input
                type="text"
                required
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl text-xs bg-[#FAF7F2] border border-[#30231C]/15 focus:outline-none focus:border-[#30231C]"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#30231C] block mb-1">
                PIN Code *
              </label>
              <input
                type="text"
                required
                maxLength={6}
                value={formData.postalCode}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                placeholder="700091"
                className="w-full px-4 py-2.5 rounded-xl text-xs bg-[#FAF7F2] border border-[#30231C]/15 focus:outline-none focus:border-[#30231C]"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#30231C] block mb-1">
                Country
              </label>
              <input
                type="text"
                disabled
                value="India"
                className="w-full px-4 py-2.5 rounded-xl text-xs bg-[#FAF7F2]/60 border border-[#30231C]/10 text-[#4B3428]/60 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="pt-6 border-t border-[#30231C]/10 space-y-3">
            <h3 className="font-serif text-xl text-[#30231C]">Select Payment Method</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                className={`p-4 rounded-2xl border cursor-pointer flex flex-col justify-between transition-all ${
                  paymentMode === 'TEST_MODE'
                    ? 'border-[#30231C] bg-[#FAF7F2] shadow-sm'
                    : 'border-[#30231C]/10 bg-white hover:border-[#30231C]/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#30231C]">Instant Test Order</span>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMode === 'TEST_MODE'}
                    onChange={() => setPaymentMode('TEST_MODE')}
                    className="accent-[#30231C]"
                  />
                </div>
                <p className="text-[11px] text-[#4B3428]/70 mt-2">
                  Simulated local order. Immediate confirmation with live inventory decrement.
                </p>
              </label>

              <label
                className={`p-4 rounded-2xl border cursor-pointer flex flex-col justify-between transition-all ${
                  paymentMode === 'RAZORPAY'
                    ? 'border-[#30231C] bg-[#FAF7F2] shadow-sm'
                    : 'border-[#30231C]/10 bg-white hover:border-[#30231C]/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#30231C]">Razorpay Gateway</span>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMode === 'RAZORPAY'}
                    onChange={() => setPaymentMode('RAZORPAY')}
                    className="accent-[#30231C]"
                  />
                </div>
                <p className="text-[11px] text-[#4B3428]/70 mt-2">
                  UPI, Cards, NetBanking. (Active when business credentials configured).
                </p>
              </label>
            </div>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-5 bg-[#FAF7F2] p-6 sm:p-8 rounded-3xl border border-[#30231C]/10 shadow-soft space-y-6">
          <h2 className="font-serif text-2xl text-[#30231C]">Order Items ({items.length})</h2>

          <div className="divide-y divide-[#30231C]/10 max-h-80 overflow-y-auto pr-1">
            {items.map((item) => (
              <div key={item.key} className="py-3 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded-xl object-cover bg-white"
                  />
                  <div>
                    <h4 className="font-bold text-[#30231C]">{item.name}</h4>
                    <span className="text-[#4B3428]/70 text-[11px]">
                      {item.weight} • {item.grindType} (Qty: {item.quantity})
                    </span>
                  </div>
                </div>
                <span className="font-bold text-[#30231C]">
                  {formatINR(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-2 text-xs border-t border-[#30231C]/10 pt-4">
            <div className="flex justify-between text-[#4B3428]">
              <span>Subtotal</span>
              <span className="font-semibold text-[#30231C]">{formatINR(subtotal)}</span>
            </div>
            <div className="flex justify-between text-[#4B3428]">
              <span>Delivery Charges</span>
              <span>{isFreeShipping ? 'FREE' : formatINR(BRAND.shippingFee)}</span>
            </div>
            <div className="flex justify-between items-baseline pt-3 border-t border-[#30231C]/10 text-base">
              <span className="font-serif text-xl text-[#30231C]">Total Amount</span>
              <span className="font-serif text-2xl font-bold text-[#30231C]">
                {formatINR(totalAmount)}
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-pill bg-[#30231C] text-[#F8F5EE] text-xs font-bold tracking-widest uppercase hover:bg-[#4B3428] shadow-elevated transition-all flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <span>{isSubmitting ? 'Placing Order...' : `Place Order • ${formatINR(totalAmount)}`}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#4B3428]/70">
            <ShieldCheck className="w-3.5 h-3.5 text-[#9CA88E]" />
            <span>Kolkata roastery dispatch within 24 hours</span>
          </div>
        </div>

      </form>
    </div>
  );
};

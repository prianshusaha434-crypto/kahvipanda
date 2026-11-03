import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../features/cart/CartContext';
import { formatINR, BRAND } from '@kahvi-panda/shared';
import { Trash2, ArrowRight, ShieldCheck, ShoppingBag, Tag, Check } from 'lucide-react';

export const CartPage: React.FC = () => {
  const {
    items,
    removeItem,
    updateQuantity,
    subtotal,
    isFreeShipping,
    amountNeededForFreeShipping
  } = useCart();

  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (code === 'RUSH10') {
      setAppliedCoupon('RUSH10');
      setCouponError(null);
    } else if (code === 'FIRSTSIP') {
      setAppliedCoupon('FIRSTSIP');
      setCouponError(null);
    } else {
      setCouponError('Invalid coupon code. Try RUSH10 or FIRSTSIP.');
    }
  };

  const discountAmount = appliedCoupon === 'RUSH10'
    ? Math.round(subtotal * 0.1)
    : appliedCoupon === 'FIRSTSIP'
    ? 50
    : 0;

  const shippingAmount = isFreeShipping || subtotal === 0 ? 0 : BRAND.shippingFee;
  const totalAmount = Math.max(0, subtotal + shippingAmount - discountAmount);

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-[#E9DCC9]/40 flex items-center justify-center text-4xl mx-auto">
          🐼
        </div>
        <h1 className="font-serif text-3xl text-[#30231C]">Your Coffee Bag is Empty</h1>
        <p className="text-sm text-[#4B3428]/80 max-w-sm mx-auto">
          Fresh roasted batches are waiting for you. Discover our signature Kolkata roasts!
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 mt-4 px-8 py-3.5 rounded-pill bg-[#30231C] text-[#F8F5EE] text-xs font-bold uppercase tracking-wider hover:bg-[#4B3428] transition-colors"
        >
          <span>Explore Coffee Catalogue</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      <div className="border-b border-[#30231C]/10 pb-6">
        <h1 className="font-serif text-4xl sm:text-5xl text-[#30231C]">Shopping Bag</h1>
        <p className="text-sm text-[#4B3428]/80 mt-1">Review your freshly roasted coffee and gear</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Items Table */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-[#30231C]/10 p-6 sm:p-8 shadow-soft space-y-6">
          
          {/* Free Shipping Alert */}
          <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#30231C]/10 flex items-center justify-between text-xs">
            <span className="font-medium text-[#4B3428]">
              {isFreeShipping ? (
                <strong className="text-[#30231C]">🎉 You have qualified for FREE Shipping across India!</strong>
              ) : (
                <>Add <strong>{formatINR(amountNeededForFreeShipping)}</strong> more to unlock Free Delivery!</>
              )}
            </span>
            <span className="font-bold text-[#30231C]">Free over ₹999</span>
          </div>

          <div className="divide-y divide-[#30231C]/10">
            {items.map((item) => (
              <div key={item.key} className="py-6 flex gap-4 sm:gap-6 items-center">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-2xl bg-[#E9DCC9]/20"
                />
                <div className="flex-1">
                  <h3 className="font-serif text-lg font-bold text-[#30231C]">
                    <Link to={`/products/${item.slug}`} className="hover:underline">
                      {item.name}
                    </Link>
                  </h3>
                  <p className="text-xs text-[#4B3428]/70 mt-0.5">
                    {item.weight} • {item.grindType}
                  </p>
                  <span className="text-xs font-semibold text-[#30231C] mt-1 block">
                    {formatINR(item.price)} each
                  </span>
                </div>

                {/* Stepper */}
                <div className="flex items-center border border-[#30231C]/20 rounded-full px-2 py-1 bg-[#FAF7F2]">
                  <button
                    onClick={() => updateQuantity(item.key, item.quantity - 1)}
                    className="px-2 py-0.5 text-xs font-bold text-[#30231C]"
                  >
                    -
                  </button>
                  <span className="px-2 text-xs font-bold">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.key, item.quantity + 1)}
                    className="px-2 py-0.5 text-xs font-bold text-[#30231C]"
                  >
                    +
                  </button>
                </div>

                <div className="text-right">
                  <span className="font-serif text-base sm:text-lg font-bold text-[#30231C] block">
                    {formatINR(item.price * item.quantity)}
                  </span>
                  <button
                    onClick={() => removeItem(item.key)}
                    className="text-[#BC785C] hover:text-[#9E5F46] text-xs font-medium mt-1 inline-flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary & Coupon */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#FAF7F2] p-6 sm:p-8 rounded-3xl border border-[#30231C]/10 space-y-6">
            <h3 className="font-serif text-2xl text-[#30231C]">Order Summary</h3>

            {/* Coupon Code Input */}
            <div>
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Coupon code (e.g. RUSH10)"
                  className="flex-1 px-3.5 py-2.5 rounded-full text-xs uppercase bg-white border border-[#30231C]/20 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-full bg-[#30231C] text-[#F8F5EE] text-xs font-bold uppercase tracking-wider hover:bg-[#4B3428]"
                >
                  Apply
                </button>
              </form>
              {appliedCoupon && (
                <p className="text-[11px] text-[#9CA88E] font-bold mt-1.5 flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  <span>Coupon {appliedCoupon} applied successfully!</span>
                </p>
              )}
              {couponError && (
                <p className="text-[11px] text-[#BC785C] font-semibold mt-1.5">{couponError}</p>
              )}
            </div>

            <div className="space-y-2 text-xs border-t border-[#30231C]/10 pt-4">
              <div className="flex justify-between text-[#4B3428]">
                <span>Bag Subtotal</span>
                <span className="font-semibold text-[#30231C]">{formatINR(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-[#9CA88E] font-semibold">
                  <span>Coupon Discount</span>
                  <span>-{formatINR(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-[#4B3428]">
                <span>Delivery (India)</span>
                <span>{isFreeShipping ? 'FREE' : formatINR(BRAND.shippingFee)}</span>
              </div>
              <div className="flex justify-between items-baseline pt-3 border-t border-[#30231C]/10 text-base">
                <span className="font-serif text-xl text-[#30231C]">Total</span>
                <span className="font-serif text-2xl font-bold text-[#30231C]">
                  {formatINR(totalAmount)}
                </span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-4 rounded-pill bg-[#30231C] text-[#F8F5EE] text-xs font-bold tracking-widest uppercase hover:bg-[#4B3428] shadow-elevated transition-all flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#4B3428]/70">
              <ShieldCheck className="w-3.5 h-3.5 text-[#9CA88E]" />
              <span>Free returns on damaged transit • 100% Arabica Guarantee</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

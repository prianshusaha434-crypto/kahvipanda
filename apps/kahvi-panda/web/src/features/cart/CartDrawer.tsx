import React from 'react';
import { useCart } from './CartContext';
import { formatINR, BRAND } from '@kahvi-panda/shared';
import { X, Plus, Minus, Trash2, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CartDrawer: React.FC = () => {
  const {
    items,
    isDrawerOpen,
    closeDrawer,
    removeItem,
    updateQuantity,
    subtotal,
    isFreeShipping,
    amountNeededForFreeShipping
  } = useCart();

  const navigate = useNavigate();

  if (!isDrawerOpen) return null;

  const progressPercentage = Math.min(100, (subtotal / BRAND.freeShippingThreshold) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#30231C]/60 backdrop-blur-sm transition-opacity"
        onClick={closeDrawer}
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <aside className="w-screen max-w-md bg-[#F8F5EE] shadow-2xl flex flex-col justify-between border-l border-[#30231C]/10 animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="p-6 border-b border-[#30231C]/10 bg-[#FAF7F2]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#30231C]" />
                <h2 className="font-serif text-2xl text-[#30231C]">Your Coffee Bag</h2>
              </div>
              <button
                onClick={closeDrawer}
                className="p-2 rounded-full hover:bg-[#E9DCC9]/50 text-[#30231C] transition-colors"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Shipping Meter */}
            <div className="mt-4 p-3 rounded-brand bg-[#E9DCC9]/40 border border-[#30231C]/5">
              <div className="flex justify-between text-xs font-medium text-[#4B3428] mb-1.5">
                <span>
                  {isFreeShipping ? (
                    <span className="text-[#30231C] font-semibold flex items-center gap-1">
                      🎉 Free shipping unlocked!
                    </span>
                  ) : (
                    <>Add <strong className="text-[#30231C]">{formatINR(amountNeededForFreeShipping)}</strong> for Free Shipping</>
                  )}
                </span>
                <span>{Math.round(progressPercentage)}%</span>
              </div>
              <div className="w-full bg-[#E9DCC9] rounded-full h-2 overflow-hidden">
                <div
                  className="bg-[#9CA88E] h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-[#E9DCC9]/50 flex items-center justify-center mb-4 text-3xl">
                  🐼
                </div>
                <h3 className="font-serif text-xl text-[#30231C]">Your bag is peaceful & empty</h3>
                <p className="text-sm text-[#4B3428]/80 mt-1 max-w-xs">
                  Discover our Nordic roast blends fresh from our roastery in Kolkata.
                </p>
                <button
                  onClick={() => {
                    closeDrawer();
                    navigate('/shop');
                  }}
                  className="mt-6 px-6 py-2.5 rounded-pill bg-[#30231C] text-[#F8F5EE] text-xs font-semibold tracking-wider uppercase hover:bg-[#4B3428] transition-colors"
                >
                  Explore Coffees
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.key}
                  className="flex gap-4 p-3.5 rounded-brand bg-white/70 border border-[#30231C]/5 shadow-sm"
                >
                  <img
                    src={item.image || BRAND.logoUrl}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg bg-[#E9DCC9]/20"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-medium text-sm text-[#30231C] leading-snug line-clamp-1">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeItem(item.key)}
                          className="text-[#BC785C] hover:text-[#9E5F46] p-1 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-xs text-[#4B3428]/70 mt-0.5">
                        {item.weight} • {item.grindType}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#30231C]/5">
                      <div className="flex items-center border border-[#30231C]/20 rounded-pill px-2 py-0.5 bg-[#FAF7F2]">
                        <button
                          onClick={() => updateQuantity(item.key, item.quantity - 1)}
                          className="p-1 hover:text-[#BC785C] transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="mx-2 text-xs font-medium w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.key, item.quantity + 1)}
                          className="p-1 hover:text-[#9CA88E] transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="font-medium text-sm text-[#30231C]">
                        {formatINR(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Action */}
          {items.length > 0 && (
            <div className="p-6 border-t border-[#30231C]/10 bg-[#FAF7F2] space-y-4">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-[#4B3428]">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#30231C]">{formatINR(subtotal)}</span>
                </div>
                <div className="flex justify-between text-xs text-[#4B3428]/80">
                  <span>Estimated Delivery</span>
                  <span>{isFreeShipping ? 'FREE' : formatINR(BRAND.shippingFee)}</span>
                </div>
                <div className="flex justify-between items-baseline pt-2 border-t border-[#30231C]/10 text-base">
                  <span className="font-serif text-lg text-[#30231C]">Total</span>
                  <span className="font-bold text-lg text-[#30231C]">
                    {formatINR(subtotal + (isFreeShipping ? 0 : BRAND.shippingFee))}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => {
                    closeDrawer();
                    navigate('/checkout');
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-pill bg-[#30231C] text-[#F8F5EE] text-xs font-bold tracking-widest uppercase hover:bg-[#4B3428] shadow-md hover:shadow-lg transition-all"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    closeDrawer();
                    navigate('/cart');
                  }}
                  className="w-full text-center py-2 text-xs font-semibold text-[#4B3428] hover:text-[#30231C] uppercase tracking-wider transition-colors"
                >
                  View Full Bag & Apply Coupons
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[11px] text-[#4B3428]/70">
                <ShieldCheck className="w-3.5 h-3.5 text-[#9CA88E]" />
                <span>Freshness Guaranteed • Secure 256-bit Indian Checkout</span>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};

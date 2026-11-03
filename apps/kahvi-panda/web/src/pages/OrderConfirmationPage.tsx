import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ApiClient } from '../services/api';
import { Order } from '../types';
import { formatINR, BRAND } from '@kahvi-panda/shared';
import confetti from 'canvas-confetti';
import { CheckCircle2, Truck, ArrowRight, Package, Calendar } from 'lucide-react';

export const OrderConfirmationPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fire confetti celebration!
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }

    async function loadOrder() {
      if (!orderId) return;
      try {
        const data = await ApiClient.getOrder(orderId);
        setOrder(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadOrder();
  }, [orderId]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 sm:py-24 space-y-8">
      
      {/* Celebration Header */}
      <div className="text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-[#9CA88E]/20 text-[#9CA88E] flex items-center justify-center mx-auto text-4xl shadow-inner">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        
        <span className="text-xs font-bold uppercase tracking-widest text-[#9CA88E] block">
          Order Successfully Placed
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl text-[#30231C]">
          Thank You for Brewing with Us!
        </h1>
        <p className="text-sm text-[#4B3428]/80 max-w-md mx-auto">
          We’ve received your order and our roasters in Kolkata are preparing your fresh batch.
        </p>

        <div className="inline-block px-4 py-2 rounded-xl bg-[#FAF7F2] border border-[#30231C]/10 text-xs font-mono font-bold text-[#30231C]">
          Order Reference: {orderId}
        </div>
      </div>

      {/* Order Details Card */}
      {order && (
        <div className="bg-white rounded-3xl border border-[#30231C]/10 shadow-soft p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#30231C]/10 text-xs">
            <div className="flex items-center gap-2 text-[#4B3428]">
              <Calendar className="w-4 h-4 text-[#9CA88E]" />
              <span>Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </div>
            <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#9CA88E]/20 text-[#7E8C6F]">
              {order.status}
            </span>
          </div>

          {/* Items */}
          <div className="divide-y divide-[#30231C]/10">
            {order.items.map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-[#30231C]">{item.name}</h4>
                  <span className="text-[#4B3428]/70 text-[11px]">
                    {item.weight} • {item.grindType} (Qty: {item.quantity})
                  </span>
                </div>
                <span className="font-bold text-[#30231C]">
                  {formatINR(item.totalPrice)}
                </span>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="border-t border-[#30231C]/10 pt-4 space-y-1.5 text-xs text-[#4B3428]">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatINR(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping Fee</span>
              <span>{order.shippingAmount === 0 ? 'FREE' : formatINR(order.shippingAmount)}</span>
            </div>
            <div className="flex justify-between font-bold text-sm text-[#30231C] pt-2 border-t border-[#30231C]/10">
              <span>Total Paid</span>
              <span>{formatINR(order.totalAmount)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Delivery & Timeline Notice */}
      <div className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#30231C]/10 flex items-start gap-4 text-xs text-[#4B3428]">
        <Truck className="w-5 h-5 text-[#BC785C] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="text-[#30231C] block">Estimated Delivery: 2–5 Working Days</strong>
          <p>
            Your coffee is roasted fresh and dispatched via priority courier from Kolkata. You will receive an SMS and WhatsApp update once dispatched.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <Link
          to={`/track-order?id=${orderId}`}
          className="w-full sm:w-auto px-8 py-3.5 rounded-pill bg-[#30231C] text-[#F8F5EE] text-xs font-bold uppercase tracking-wider hover:bg-[#4B3428] text-center"
        >
          Track This Order
        </Link>
        <Link
          to="/shop"
          className="w-full sm:w-auto px-8 py-3.5 rounded-pill bg-white border border-[#30231C]/20 text-[#30231C] text-xs font-bold uppercase tracking-wider hover:bg-[#E9DCC9]/40 text-center"
        >
          Continue Shopping
        </Link>
      </div>

    </div>
  );
};

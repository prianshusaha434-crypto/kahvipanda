import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { BRAND } from '@kahvi-panda/shared';
import { ShieldCheck, Truck, RotateCcw, HelpCircle, FileText } from 'lucide-react';

export const PolicyPage: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;

  let title = 'Store Policies';
  let icon = <FileText className="w-8 h-8 text-[#9CA88E]" />;

  if (path.includes('shipping')) {
    title = 'Shipping & Delivery Policy';
    icon = <Truck className="w-8 h-8 text-[#9CA88E]" />;
  } else if (path.includes('refund')) {
    title = 'Returns & Refund Policy';
    icon = <RotateCcw className="w-8 h-8 text-[#BC785C]" />;
  } else if (path.includes('faq')) {
    title = 'Frequently Asked Questions';
    icon = <HelpCircle className="w-8 h-8 text-[#4B3428]" />;
  } else if (path.includes('privacy')) {
    title = 'Privacy Policy';
    icon = <ShieldCheck className="w-8 h-8 text-[#9CA88E]" />;
  } else if (path.includes('terms')) {
    title = 'Terms & Conditions';
    icon = <FileText className="w-8 h-8 text-[#4B3428]" />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:py-20 space-y-10">
      
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-[#FAF7F2] border border-[#30231C]/10 flex items-center justify-center mx-auto mb-2">
          {icon}
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl text-[#30231C]">{title}</h1>
        <p className="text-xs text-[#4B3428]/70">Last updated: November 2026 • Kolkata, India</p>
      </div>

      <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#30231C]/10 shadow-soft text-xs sm:text-sm text-[#4B3428] leading-relaxed space-y-6">
        
        {path.includes('shipping') && (
          <>
            <h3 className="font-serif text-xl text-[#30231C]">1. Free Shipping & Delivery Thresholds</h3>
            <p>
              We provide <strong>FREE SHIPPING</strong> across India on all retail orders of <strong>₹999 and above</strong>. For orders below ₹999, a flat delivery fee of <strong>₹99</strong> is applied at checkout.
            </p>
            <h3 className="font-serif text-xl text-[#30231C]">2. Dispatch & Roasting Schedules</h3>
            <p>
              We roast in small batches in Kolkata to guarantee peak freshness. Orders placed before 1:00 PM IST on working days are roasted, packed, and dispatched within 24 to 48 hours. Orders placed on Sundays or public holidays are processed the following business day.
            </p>
            <h3 className="font-serif text-xl text-[#30231C]">3. Estimated Transit Times</h3>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Kolkata & Metro Cities:</strong> 2 to 5 business days.</li>
              <li><strong>Rest of India:</strong> 4 to 8 business days.</li>
            </ul>
            <p>
              Once your shipment is picked up by our courier partners (Delhivery, Blue Dart, DTDC), an automatic tracking notification is generated with your tracking link.
            </p>
          </>
        )}

        {path.includes('refund') && (
          <>
            <h3 className="font-serif text-xl text-[#30231C]">1. Coffee Freshness & Perishable Guarantee</h3>
            <p>
              Because coffee is a freshly roasted food product, we cannot accept returns once the vacuum seal is broken. However, if your bag arrives damaged in transit or you received the incorrect grind size, we will send an immediate free replacement or full refund.
            </p>
            <h3 className="font-serif text-xl text-[#30231C]">2. Brewing Gear & Accessories</h3>
            <p>
              Non-perishable hardware (such as French presses or tumblers) can be returned within 7 days of delivery in their original, unused condition with complete packaging.
            </p>
            <h3 className="font-serif text-xl text-[#30231C]">3. How to Request a Replacement</h3>
            <p>
              Simply email <strong>{BRAND.supportEmail}</strong> or ping us directly on WhatsApp at <strong>{BRAND.whatsappNumber}</strong> with a quick photo of the package.
            </p>
          </>
        )}

        {path.includes('faq') && (
          <div className="space-y-6">
            <div>
              <h4 className="font-serif text-base font-bold text-[#30231C]">What does "The Nordic Blend" mean?</h4>
              <p className="mt-1">
                It reflects our roasting philosophy: lighter, slower roasting curves that preserve the origin's natural sweetness, jasmine florals, and citrus notes rather than burning the bean into harsh charcoal bitterness.
              </p>
            </div>
            <div>
              <h4 className="font-serif text-base font-bold text-[#30231C]">Where do your coffee beans come from?</h4>
              <p className="mt-1">
                We ethically source 100% shade-grown specialty Arabica from high-altitude estates in Chikmagalur, Coorg, Wayanad, and Biligirirangana Hills, roasted in Kolkata.
              </p>
            </div>
            <div>
              <h4 className="font-serif text-base font-bold text-[#30231C]">How should I store my coffee?</h4>
              <p className="mt-1">
                Store in an airtight, opaque container at room temperature away from heat and direct sunlight. Never put roasted coffee in the refrigerator!
              </p>
            </div>
          </div>
        )}

        {(!path.includes('shipping') && !path.includes('refund') && !path.includes('faq')) && (
          <>
            <h3 className="font-serif text-xl text-[#30231C]">Privacy & Data Security</h3>
            <p>
              Kahvi Panda values your privacy. We never sell or share customer personal information. All checkout transactions are secured using standard 256-bit encryption. Payment details are processed securely via verified gateways and raw card details are never stored on our servers.
            </p>
            <h3 className="font-serif text-xl text-[#30231C]">Governing Law</h3>
            <p>
              Transactions and disputes are governed by applicable laws in Kolkata, West Bengal, India.
            </p>
          </>
        )}

      </div>

      <div className="text-center">
        <Link
          to="/contact"
          className="text-xs font-bold text-[#30231C] underline hover:text-[#BC785C]"
        >
          Have questions? Talk to our Kolkata customer team →
        </Link>
      </div>

    </div>
  );
};

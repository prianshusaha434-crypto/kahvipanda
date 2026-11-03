import React from 'react';
import { Link } from 'react-router-dom';
import { BRAND } from '@kahvi-panda/shared';
import { CheckCircle2, Compass, Coffee, Heart, ArrowRight } from 'lucide-react';

export const OurStoryPage: React.FC = () => {
  return (
    <div className="space-y-16 sm:space-y-24 py-12 sm:py-20">
      
      {/* Hero Header */}
      <section className="max-w-4xl mx-auto px-4 text-center space-y-4">
        <span className="text-[11px] uppercase tracking-widest font-extrabold text-[#9CA88E]">
          Kolkata · Established 2026
        </span>
        <h1 className="font-serif text-4xl sm:text-7xl text-[#30231C] leading-[0.95]">
          A Little Wild.<br />
          <span className="italic text-[#4B3428]">A Lot of Coffee.</span>
        </h1>
        <p className="text-base sm:text-lg text-[#4B3428]/90 max-w-2xl mx-auto leading-relaxed pt-2">
          How a Scandinavian love for minimalism and terroir found its second home in the spirited, conversation-fueled coffee culture of Kolkata.
        </p>
      </section>

      {/* Hero Image */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="aspect-[21/9] rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-[#E9DCC9]/40">
          <img
            src="https://media.base44.com/images/public/6ae797797bf6e0fab7fe1feb/8039d1f24_generated_240f5e4b.png"
            alt="Kahvi Panda Kolkata Roastery"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="max-w-4xl mx-auto px-4 space-y-8 text-sm sm:text-base text-[#4B3428] leading-relaxed">
        <h2 className="font-serif text-3xl sm:text-4xl text-[#30231C]">
          The Nordic Blend: Less Noise, More Terroir
        </h2>
        <p>
          In traditional commercial coffee roasting, beans are roasted dark to hide age, defects, or low-altitude bitterness. The result is often an acrid, smoky cup that practically demands heavy sugar and condensed milk just to become palatable.
        </p>
        <p>
          In the Nordic countries—where per capita coffee consumption is among the highest on earth—roasting is treated differently. Roasters use gentle, carefully managed heat curves to coax out inherent jasmine florals, orange blossom, wild honey, and crisp fruit sweetness.
        </p>
        <p>
          <strong>Kahvi Panda</strong> was founded on the belief that India grows some of the most extraordinary shade-grown coffee in the world. High-altitude Arabicas from Chikmagalur, Baba Budangiri, and the Nilgiris deserve the clean Scandinavian roasting curve.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
          <div className="p-6 rounded-2xl bg-white border border-[#30231C]/10 shadow-sm space-y-2">
            <span className="text-3xl">🌿</span>
            <h4 className="font-serif text-lg font-bold text-[#30231C]">100% Shade-Grown</h4>
            <p className="text-xs text-[#4B3428]/80 leading-relaxed">
              Harvested under native silver oak, rosewood, and jackfruit canopies that preserve biodiversity.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-white border border-[#30231C]/10 shadow-sm space-y-2">
            <span className="text-3xl">🐼</span>
            <h4 className="font-serif text-lg font-bold text-[#30231C]">The Panda Spirit</h4>
            <p className="text-xs text-[#4B3428]/80 leading-relaxed">
              Playful, approachable, and animal-friendly. We reject coffee snobbery while taking quality dead seriously.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-white border border-[#30231C]/10 shadow-sm space-y-2">
            <span className="text-3xl">☕</span>
            <h4 className="font-serif text-lg font-bold text-[#30231C]">Roasted in Kolkata</h4>
            <p className="text-xs text-[#4B3428]/80 leading-relaxed">
              Every bag is cupped, profiled, and dispatched fresh from our Kolkata kitchen within days of harvest.
            </p>
          </div>
        </div>

        <div className="pt-8 text-center">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-pill bg-[#30231C] text-[#F8F5EE] text-xs font-bold uppercase tracking-widest hover:bg-[#4B3428] shadow-elevated"
          >
            <span>Taste Our Roasts</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

    </div>
  );
};

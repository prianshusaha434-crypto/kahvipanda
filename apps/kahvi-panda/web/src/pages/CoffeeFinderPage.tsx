import React, { useState } from 'react';
import { ProductCard } from '../components/ProductCard';
import { ApiClient } from '../services/api';
import { Product } from '../types';
import { Sparkles, ArrowRight, RotateCcw, CheckCircle2 } from 'lucide-react';

export const CoffeeFinderPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [brewMethod, setBrewMethod] = useState('');
  const [milkStyle, setMilkStyle] = useState('');
  const [flavorPreference, setFlavorPreference] = useState('');
  const [recommended, setRecommended] = useState<Product[]>([]);
  const [calculating, setCalculating] = useState(false);

  const handleFinish = async () => {
    setCalculating(true);
    setStep(5); // Result step

    try {
      const data = await ApiClient.getProducts({});
      const products: Product[] = data.products || [];

      // Score matching products
      const scored = products.map((p) => {
        let score = 0;
        if (brewMethod && p.compatibleBrewingMethods.toLowerCase().includes(brewMethod.toLowerCase())) {
          score += 4;
        }
        if (milkStyle === 'milk' && (p.roastLevel === 'Medium' || p.roastLevel === 'Medium-Dark' || p.roastLevel === 'Dark')) {
          score += 4;
        }
        if (milkStyle === 'black' && (p.roastLevel === 'Light' || p.roastLevel === 'Nordic Roast')) {
          score += 4;
        }
        if (flavorPreference === 'chocolate' && p.tastingNotes.toLowerCase().includes('chocolate')) {
          score += 3;
        }
        if (flavorPreference === 'floral' && (p.tastingNotes.toLowerCase().includes('jasmine') || p.tastingNotes.toLowerCase().includes('citrus') || p.tastingNotes.toLowerCase().includes('bergamot'))) {
          score += 3;
        }
        if (p.bestseller) score += 1;
        return { product: p, score };
      });

      scored.sort((a, b) => b.score - a.score);
      setRecommended(scored.slice(0, 2).map((s) => s.product));
    } catch (e) {
      console.error(e);
    } finally {
      setCalculating(false);
    }
  };

  const resetQuiz = () => {
    setStep(1);
    setBrewMethod('');
    setMilkStyle('');
    setFlavorPreference('');
    setRecommended([]);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:py-20 space-y-10">
      
      {/* Quiz Header */}
      <div className="text-center space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-[#E9DCC9]/50 text-[#4B3428] border border-[#30231C]/10">
          <Sparkles className="w-3.5 h-3.5 text-[#BC785C]" />
          <span>Interactive Brew Concierge</span>
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl text-[#30231C]">
          Find Your Perfect Brew
        </h1>
        <p className="text-sm text-[#4B3428]/80 max-w-md mx-auto">
          Answer 3 quick questions. We’ll match your palate with our exact Nordic roasting curve.
        </p>

        {/* Step Progress Dots */}
        {step <= 3 && (
          <div className="flex items-center justify-center gap-2 pt-4">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 rounded-full transition-all duration-300 ${
                  step === s ? 'w-8 bg-[#30231C]' : 'w-2 bg-[#E9DCC9]'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* QUESTION 1 */}
      {step === 1 && (
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#30231C]/10 shadow-soft space-y-6 animate-in fade-in duration-300">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-[#9CA88E]">Question 1 of 3</span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#30231C] mt-1">
              How do you prepare your coffee at home?
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { id: 'French Press', label: 'French Press', icon: '☕' },
              { id: 'Moka Pot', label: 'Stovetop Moka Pot', icon: '🫖' },
              { id: 'Pour Over', label: 'Pour Over (V60)', icon: '⏳' },
              { id: 'South Indian Filter', label: 'South Indian Filter', icon: '🥛' },
              { id: 'Espresso', label: 'Espresso Machine', icon: '⚡' },
              { id: 'Instant', label: 'Instant / Quick Cup', icon: '✨' },
            ].map((option) => (
              <button
                key={option.id}
                onClick={() => {
                  setBrewMethod(option.id);
                  setStep(2);
                }}
                className={`p-6 rounded-2xl border text-center transition-all ${
                  brewMethod === option.id
                    ? 'border-[#30231C] bg-[#FAF7F2] shadow-sm'
                    : 'border-[#30231C]/10 hover:border-[#30231C]/40 bg-white'
                }`}
              >
                <span className="text-3xl block mb-2">{option.icon}</span>
                <span className="text-xs font-bold text-[#30231C] block">{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* QUESTION 2 */}
      {step === 2 && (
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#30231C]/10 shadow-soft space-y-6 animate-in fade-in duration-300">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-[#9CA88E]">Question 2 of 3</span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#30231C] mt-1">
              How do you like to drink it?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { id: 'milk', label: 'With Warm Milk / Oat Milk', desc: 'Needs rich cocoa & body to punch through dairy', icon: '🥛' },
              { id: 'black', label: 'Pure Black / Americano', desc: 'Highlights origin florals, citrus sweetness, and clarity', icon: '☕' },
              { id: 'iced', label: 'Iced & Cold Brewed', desc: 'Crisp, refreshing, low acidity on hot Kolkata days', icon: '🧊' },
            ].map((option) => (
              <button
                key={option.id}
                onClick={() => {
                  setMilkStyle(option.id);
                  setStep(3);
                }}
                className={`p-6 rounded-2xl border text-center transition-all ${
                  milkStyle === option.id
                    ? 'border-[#30231C] bg-[#FAF7F2] shadow-sm'
                    : 'border-[#30231C]/10 hover:border-[#30231C]/40 bg-white'
                }`}
              >
                <span className="text-3xl block mb-2">{option.icon}</span>
                <h4 className="text-sm font-bold text-[#30231C]">{option.label}</h4>
                <p className="text-[11px] text-[#4B3428]/70 mt-1">{option.desc}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* QUESTION 3 */}
      {step === 3 && (
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#30231C]/10 shadow-soft space-y-6 animate-in fade-in duration-300">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-[#9CA88E]">Question 3 of 3</span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#30231C] mt-1">
              What flavour profile makes you happiest?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { id: 'chocolate', label: 'Milk Chocolate & Caramel', desc: 'Comforting, nutty, smooth, zero bitterness', icon: '🍫' },
              { id: 'floral', label: 'Citrus, Jasmine & Honey', desc: 'Scandinavian light roast, crisp, tea-like elegance', icon: '🍋' },
              { id: 'smoky', label: 'Dark Cocoa & Spice', desc: 'Intense, bold, smoky crema with heavy mouthfeel', icon: '🪵' },
            ].map((option) => (
              <button
                key={option.id}
                onClick={() => {
                  setFlavorPreference(option.id);
                  handleFinish();
                }}
                className={`p-6 rounded-2xl border text-center transition-all ${
                  flavorPreference === option.id
                    ? 'border-[#30231C] bg-[#FAF7F2] shadow-sm'
                    : 'border-[#30231C]/10 hover:border-[#30231C]/40 bg-white'
                }`}
              >
                <span className="text-3xl block mb-2">{option.icon}</span>
                <h4 className="text-sm font-bold text-[#30231C]">{option.label}</h4>
                <p className="text-[11px] text-[#4B3428]/70 mt-1">{option.desc}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STEP 5: RESULTS */}
      {step === 5 && (
        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
          <div className="text-center bg-[#FAF7F2] p-8 rounded-3xl border border-[#30231C]/10 space-y-2">
            <div className="text-3xl">🎉</div>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#30231C]">
              Here Is Your Coffee Match!
            </h2>
            <p className="text-sm text-[#4B3428]/80 max-w-md mx-auto">
              Based on brewing with a <strong>{brewMethod}</strong>, drinking {milkStyle}, and craving {flavorPreference} tones.
            </p>
            <div className="pt-2">
              <button
                onClick={resetQuiz}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#BC785C] hover:underline"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Retake Quiz</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {recommended.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

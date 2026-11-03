import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Product, Category } from '../types';
import { ProductCard } from '../components/ProductCard';
import { ApiClient } from '../services/api';
import { BRAND } from '@kahvi-panda/shared';
import { ArrowRight, Sparkles, Coffee, Compass, Award, Shield, CheckCircle2, Flame, Droplets, Zap } from 'lucide-react';

export const HomePage: React.FC = () => {
  const [bestsellers, setBestsellers] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistSuccess, setWaitlistSuccess] = useState(false);

  useEffect(() => {
    async function loadHomeData() {
      try {
        const [bestsellersData, categoriesData] = await Promise.all([
          ApiClient.getBestsellers(),
          ApiClient.getCategories()
        ]);
        setBestsellers(bestsellersData);
        setCategories(categoriesData);
      } catch (err) {
        console.error('Failed to load homepage data', err);
      } finally {
        setLoading(false);
      }
    }
    loadHomeData();
  }, []);

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!waitlistEmail) return;
    try {
      await ApiClient.submitEnquiry({
        name: 'Waitlist Member',
        phone: '+91 0000000000',
        email: waitlistEmail,
        type: 'PRODUCT',
        subject: 'Innovation RTD Waitlist',
        message: 'Signed up for the Self-Heating Smart Brew Can waitlist from homepage'
      });
      setWaitlistSuccess(true);
      setWaitlistEmail('');
    } catch {
      setWaitlistSuccess(true);
    }
  };

  return (
    <div className="space-y-20 sm:space-y-28 pb-16">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-8 pb-16 sm:py-20 lg:py-28 bg-[#F8F5EE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E9DCC9]/60 border border-[#30231C]/10 text-[#30231C]">
              <span className="w-2 h-2 rounded-full bg-[#9CA88E]" />
              <span className="text-[11px] uppercase tracking-widest font-extrabold">
                Kolkata · Specialty Coffee · 2026
              </span>
            </div>

            <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl tracking-tight text-[#30231C] leading-[0.95]">
              RUSH. SIP.<br />
              <span className="italic font-normal text-[#4B3428]">REPEAT.</span>
            </h1>

            <p className="text-base sm:text-xl text-[#4B3428]/90 max-w-xl font-normal leading-relaxed mx-auto lg:mx-0">
              Your days move fast. Your coffee should still be exceptional. Specialty beans inspired by Nordic simplicity, roasted for India.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <Link
                to="/shop"
                className="w-full sm:w-auto px-8 py-4 rounded-pill bg-[#30231C] text-[#F8F5EE] text-xs font-bold tracking-widest uppercase hover:bg-[#4B3428] hover:scale-105 active:scale-95 transition-all shadow-elevated flex items-center justify-center gap-2"
              >
                <span>Shop Coffee</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/our-story"
                className="w-full sm:w-auto px-8 py-4 rounded-pill bg-[#FAF7F2] border border-[#30231C]/15 text-[#30231C] text-xs font-bold tracking-widest uppercase hover:bg-[#E9DCC9]/50 transition-all flex items-center justify-center"
              >
                Discover Kahvi Panda
              </Link>
            </div>

            {/* Quick trust metrics */}
            <div className="pt-6 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-[#4B3428]/80 font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#9CA88E]" />
                <span>Small batch roasted in Kolkata</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#9CA88E]" />
                <span>Free shipping over ₹999</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#9CA88E]" />
                <span>Zero artificial flavours</span>
              </div>
            </div>
          </div>

          {/* Hero Image Composition */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/60 bg-[#E9DCC9]/40 relative">
                <img
                  src="https://media.base44.com/images/public/6ae797797bf6e0fab7fe1feb/8039d1f24_generated_240f5e4b.png"
                  alt="Kahvi Panda Specialty Coffee"
                  className="w-full h-full object-cover object-center transform hover:scale-102 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#30231C]/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white p-4 rounded-2xl backdrop-blur-md bg-white/10 border border-white/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-[#E9DCC9]">
                        Featured Roast
                      </span>
                      <h4 className="font-serif text-lg font-bold">Kolkata Classic Medium</h4>
                    </div>
                    <span className="text-sm font-bold bg-[#30231C] px-3 py-1 rounded-full text-[#F8F5EE]">
                      ₹420
                    </span>
                  </div>
                </div>
              </div>

              {/* Floating mascot badge */}
              <div className="absolute -top-4 -right-4 bg-white p-3.5 rounded-2xl shadow-elevated border border-[#30231C]/10 flex items-center gap-2 animate-float-slow">
                <span className="text-2xl">🐼</span>
                <div>
                  <p className="text-[10px] uppercase tracking-wider font-extrabold text-[#30231C]">The Nordic Blend</p>
                  <p className="text-[11px] text-[#4B3428]/70">Pure Terroir</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. BRAND PILLARS BAR */}
      <section className="border-y border-[#30231C]/10 bg-[#FAF7F2] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 text-center">
            <div className="space-y-1">
              <Flame className="w-5 h-5 mx-auto text-[#BC785C]" />
              <p className="text-xs font-bold uppercase tracking-wider text-[#30231C]">Small Batch Roasted</p>
              <p className="text-[11px] text-[#4B3428]/70">Precision temperature profiles</p>
            </div>
            <div className="space-y-1">
              <Compass className="w-5 h-5 mx-auto text-[#9CA88E]" />
              <p className="text-xs font-bold uppercase tracking-wider text-[#30231C]">Nordic Inspired</p>
              <p className="text-[11px] text-[#4B3428]/70">Clean, crisp, sweet terroir</p>
            </div>
            <div className="space-y-1">
              <Coffee className="w-5 h-5 mx-auto text-[#4B3428]" />
              <p className="text-xs font-bold uppercase tracking-wider text-[#30231C]">Made For India</p>
              <p className="text-[11px] text-[#4B3428]/70">Great black or with milk</p>
            </div>
            <div className="space-y-1">
              <Droplets className="w-5 h-5 mx-auto text-[#BC785C]" />
              <p className="text-xs font-bold uppercase tracking-wider text-[#30231C]">Slow Rested</p>
              <p className="text-[11px] text-[#4B3428]/70">Degassed for optimal aroma</p>
            </div>
            <div className="space-y-1 col-span-2 sm:col-span-1">
              <Award className="w-5 h-5 mx-auto text-[#9CA88E]" />
              <p className="text-xs font-bold uppercase tracking-wider text-[#30231C]">Animal Friendly</p>
              <p className="text-[11px] text-[#4B3428]/70">Kindness in every harvest</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SHOP BY CATEGORY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[11px] uppercase tracking-widest font-extrabold text-[#9CA88E]">
            Curated Catalogue
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl text-[#30231C] mt-2">
            Explore Your Way of Brewing
          </h2>
          <p className="text-sm text-[#4B3428]/80 mt-3">
            Whether you grind by hand or need a cup in ten seconds, our Nordic-curated formats have you covered.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/shop/${cat.slug}`}
              className="group p-4 rounded-2xl bg-white border border-[#30231C]/10 text-center flex flex-col items-center justify-between hover:shadow-elevated hover:border-[#30231C]/30 transition-all duration-300"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-[#FAF7F2] mb-3 group-hover:scale-105 transition-transform">
                <img
                  src={cat.image || BRAND.logoUrl}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-serif text-sm font-bold text-[#30231C] group-hover:text-[#4B3428]">
                  {cat.name}
                </h4>
                <p className="text-[10px] text-[#4B3428]/60 mt-0.5 line-clamp-1">
                  {cat.slug === 'innovations' ? 'Waitlist' : 'Browse'}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. BESTSELLERS: THE PANDA PICKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-baseline justify-between mb-10 pb-4 border-b border-[#30231C]/10 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🐼</span>
              <span className="text-xs uppercase font-extrabold tracking-widest text-[#624637]">
                Customer Favorites
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl text-[#30231C] mt-1">
              THE PANDA PICKS
            </h2>
            <p className="text-xs sm:text-sm text-[#4B3428]/80 mt-1">
              Freshly roasted bags leaving our Kolkata roastery first.
            </p>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#30231C] hover:text-[#4B3428] group"
          >
            <span>View All Coffees</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="aspect-[3/4] bg-[#E9DCC9]/40 rounded-brand" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {bestsellers.slice(0, 6).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 5. INTERACTIVE COFFEE FINDER BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#30231C] text-[#F8F5EE] p-8 sm:p-14 lg:p-16 relative overflow-hidden shadow-2xl border border-[#4B3428]">
          <div className="relative z-10 max-w-xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-[#9CA88E]/20 text-[#9CA88E] border border-[#9CA88E]/30">
              <Sparkles className="w-3 h-3" />
              <span>Interactive Quiz</span>
            </span>

            <h2 className="font-serif text-3xl sm:text-5xl text-[#F8F5EE] leading-tight">
              FIND YOUR PERFECT BREW IN 60 SECONDS.
            </h2>

            <p className="text-sm text-[#E9DCC9]/90 leading-relaxed">
              Don’t know where to start? Tell us your home setup, whether you drink with milk or black, and your favorite taste notes. We’ll match you with the exact roast curve.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
              <Link
                to="/coffee-finder"
                className="w-full sm:w-auto px-8 py-3.5 rounded-pill bg-[#9CA88E] text-[#30231C] text-xs font-bold tracking-widest uppercase hover:bg-[#B5BEAA] transition-all flex items-center justify-center gap-2"
              >
                <span>Take the Coffee Quiz</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('open-panda-ai'));
                }}
                className="text-xs font-semibold text-[#E9DCC9] hover:underline"
              >
                Or ask Panda AI directly 🐼
              </button>
            </div>
          </div>

          {/* Decorative graphic */}
          <div className="absolute right-0 bottom-0 top-0 w-1/2 opacity-20 pointer-events-none hidden lg:flex items-center justify-center">
            <span className="text-[200px]">🐼</span>
          </div>
        </div>
      </section>

      {/* 6. BRAND STORY SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-[#E9DCC9]/30">
              <img
                src="https://media.base44.com/images/public/6ae797797bf6e0fab7fe1feb/23e39189d_generated_964adc29.png"
                alt="Nordic Coffee Roasting Philosophy"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
            <span className="text-[11px] uppercase tracking-widest font-extrabold text-[#BC785C]">
              Brand Philosophy
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl text-[#30231C] leading-tight">
              SERIOUS ABOUT COFFEE.<br />
              <span className="italic text-[#4B3428]">NOT ABOUT OURSELVES.</span>
            </h2>
            <div className="space-y-4 text-sm text-[#4B3428] leading-relaxed">
              <p>
                In the Scandinavian coffee tradition, roasting is treated as an act of subtraction: removing flaws to reveal the clean, fruit-forward, naturally sweet terroir of each bean.
              </p>
              <p>
                At <strong>Kahvi Panda</strong>, we combine this Nordic design and roasting sensibility with India’s extraordinary high-elevation shade-grown harvests from Chikmagalur, Wayanad, and the Nilgiris.
              </p>
              <p>
                Launching in <strong>Kolkata</strong>—the city that gave India some of its most iconic coffee-house culture—we’re here for students, busy founders, home baristas, and anyone who wants world-class coffee without pomp or pretension.
              </p>
            </div>
            <div className="pt-2">
              <Link
                to="/our-story"
                className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#30231C] border-b-2 border-[#30231C] pb-1 hover:text-[#4B3428] hover:border-[#4B3428] transition-colors"
              >
                <span>Read Our Full Story</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* 7. COFFEE EDUCATION (BREW LIKE YOU MEAN IT) */}
      <section className="bg-[#FAF7F2] py-16 sm:py-24 border-y border-[#30231C]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[11px] uppercase tracking-widest font-extrabold text-[#9CA88E]">
              Coffee Journal
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl text-[#30231C] mt-2">
              BREW LIKE YOU MEAN IT.
            </h2>
            <p className="text-sm text-[#4B3428]/80 mt-2">
              You don’t need a ₹50,000 espresso machine. Master these five home brewing principles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <article className="bg-white rounded-2xl overflow-hidden border border-[#30231C]/10 shadow-soft hover:shadow-elevated transition-all flex flex-col justify-between">
              <div className="aspect-[16/10] overflow-hidden bg-[#E9DCC9]/30">
                <img
                  src="https://media.base44.com/images/public/6ae797797bf6e0fab7fe1feb/8039d1f24_generated_240f5e4b.png"
                  alt="French Press Guide"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#BC785C]">
                    Brewing Guide • 4 min read
                  </span>
                  <h3 className="font-serif text-xl font-bold text-[#30231C] mt-2">
                    How to make better coffee at home: The French Press
                  </h3>
                  <p className="text-xs text-[#4B3428]/80 mt-2 leading-relaxed">
                    Five simple adjustments to water temperature, steeping time, and agitation that will transform your morning cup.
                  </p>
                </div>
                <Link
                  to="/coffee-journal/how-to-brew-with-french-press"
                  className="mt-4 text-xs font-bold text-[#30231C] hover:underline flex items-center gap-1"
                >
                  <span>Read Guide</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </article>

            <article className="bg-white rounded-2xl overflow-hidden border border-[#30231C]/10 shadow-soft hover:shadow-elevated transition-all flex flex-col justify-between">
              <div className="aspect-[16/10] overflow-hidden bg-[#E9DCC9]/30">
                <img
                  src="https://media.base44.com/images/public/6ae797797bf6e0fab7fe1feb/5cd9b52af_generated_image.png"
                  alt="Nordic Roasting Curves"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#9CA88E]">
                    Roast Profile • 5 min read
                  </span>
                  <h3 className="font-serif text-xl font-bold text-[#30231C] mt-2">
                    Why Nordic Roasting? Respecting the Bean Terroir
                  </h3>
                  <p className="text-xs text-[#4B3428]/80 mt-2 leading-relaxed">
                    Why lighter, slower roasting curves reveal delicate florals and sweet citrus notes without scorch or bitterness.
                  </p>
                </div>
                <Link
                  to="/coffee-journal/nordic-roasting-philosophy"
                  className="mt-4 text-xs font-bold text-[#30231C] hover:underline flex items-center gap-1"
                >
                  <span>Read Article</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </article>

            <article className="bg-white rounded-2xl overflow-hidden border border-[#30231C]/10 shadow-soft hover:shadow-elevated transition-all flex flex-col justify-between">
              <div className="aspect-[16/10] overflow-hidden bg-[#E9DCC9]/30">
                <img
                  src="https://media.base44.com/images/public/6ae797797bf6e0fab7fe1feb/302d490fe_generated_6d60790f.png"
                  alt="Moka Pot Extraction"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#BC785C]">
                    Home Barista • 3 min read
                  </span>
                  <h3 className="font-serif text-xl font-bold text-[#30231C] mt-2">
                    The Stovetop Moka Pot: Rich, Syrupy Coffee Without Sputter
                  </h3>
                  <p className="text-xs text-[#4B3428]/80 mt-2 leading-relaxed">
                    The secret to extracting thick, sweet crema on Indian gas stoves with our Midnight Malabar dark roast.
                  </p>
                </div>
                <Link
                  to="/coffee-journal"
                  className="mt-4 text-xs font-bold text-[#30231C] hover:underline flex items-center gap-1"
                >
                  <span>View All Journal Entries</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* 8. WHOLESALE & B2B CALLOUT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#FAF7F2] border border-[#30231C]/15 p-8 sm:p-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <span className="text-[11px] uppercase tracking-widest font-extrabold text-[#9CA88E]">
              B2B & Commercial Partnerships
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl text-[#30231C]">
              BETTER COFFEE FOR BETTER BUSINESSES.
            </h2>
            <p className="text-sm text-[#4B3428] leading-relaxed max-w-2xl">
              We supply cafes, creative studios, offices, and restaurants with freshly roasted whole beans, custom espresso curves, barista training, and dedicated equipment consultation.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to="/wholesale"
                className="px-8 py-3.5 rounded-pill bg-[#30231C] text-[#F8F5EE] text-xs font-bold tracking-widest uppercase hover:bg-[#4B3428] transition-colors"
              >
                Enquire for Wholesale & Samples
              </Link>
              <a
                href={`https://wa.me/${BRAND.whatsappRaw}?text=${encodeURIComponent("Hi! I'm interested in wholesale coffee beans for my business in Kolkata.")}`}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3.5 rounded-pill bg-[#25D366] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-[#20ba59] transition-colors"
              >
                <span>Direct WhatsApp: {BRAND.whatsappNumber}</span>
              </a>
            </div>
          </div>
          <div className="lg:col-span-4 text-center p-6 bg-white rounded-2xl border border-[#30231C]/10 shadow-sm">
            <span className="text-3xl">☕</span>
            <h4 className="font-serif text-lg text-[#30231C] mt-2">Complimentary Tasting Box</h4>
            <p className="text-xs text-[#4B3428]/80 mt-1">
              Registered food & hospitality businesses receive a 3-roast sample pack delivered directly in Kolkata.
            </p>
          </div>
        </div>
      </section>

      {/* 9. INNOVATION LAB & WAITLIST */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-[#E9DCC9]/60 to-[#F8F5EE] border border-[#30231C]/10 p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-4 aspect-square rounded-2xl overflow-hidden shadow-md">
            <img
              src="https://media.base44.com/images/public/6ae797797bf6e0fab7fe1feb/a67e4a30a_generated_4a833012.png"
              alt="Coffee Innovations"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-[#BC785C]/20 text-[#BC785C]">
              <Zap className="w-3 h-3" />
              <span>In Active R&D in Kolkata</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-4xl text-[#30231C]">
              Self-Heating & Chilling Smart Brew Tech
            </h3>
            <p className="text-sm text-[#4B3428] leading-relaxed max-w-xl">
              Imagine twist-activating a hot specialty double-shot on a train, or an iced cold brew in the park—with zero electricity required. Sign up to join our prototype tasting panel.
            </p>

            {waitlistSuccess ? (
              <div className="p-3 bg-[#9CA88E]/30 text-[#30231C] rounded-xl text-xs font-semibold">
                ✨ You are on the prototype waitlist! We will reach out when batch #001 is ready for testing.
              </div>
            ) : (
              <form onSubmit={handleWaitlistSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md pt-2">
                <input
                  type="email"
                  value={waitlistEmail}
                  onChange={(e) => setWaitlistEmail(e.target.value)}
                  placeholder="Enter email for prototype access..."
                  required
                  className="px-4 py-2.5 rounded-full text-xs bg-white border border-[#30231C]/20 focus:outline-none text-[#252525] flex-1"
                />
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#30231C] text-[#F8F5EE] text-xs font-bold uppercase tracking-wider hover:bg-[#4B3428] transition-colors"
                >
                  Join Waitlist
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

    </div>
  );
};

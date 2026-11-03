import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BRAND } from '@kahvi-panda/shared';
import { ApiClient } from '../services/api';
import { MessageSquare, ArrowRight, ShieldCheck, Mail, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setLoading(true);
    try {
      await ApiClient.subscribeNewsletter(email);
      setSubscribed(true);
      setEmail('');
    } catch {
      // fallback success feedback
      setSubscribed(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-[#30231C] text-[#F8F5EE] border-t border-[#4B3428] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid: Newsletter & Brand Statement */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-[#4B3428]">
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={BRAND.logoUrl}
                alt="Kahvi Panda"
                className="w-12 h-12 object-contain"
              />
              <div>
                <h3 className="font-serif text-2xl text-[#F8F5EE]">{BRAND.name}</h3>
                <p className="text-[10px] uppercase tracking-[0.25em] text-[#E9DCC9] font-semibold">
                  {BRAND.descriptor} • {BRAND.tagline}
                </p>
              </div>
            </div>
            <p className="text-sm text-[#F8F5EE]/80 max-w-md leading-relaxed">
              Specialty coffee inspired by Nordic simplicity, roasted small-batch in Kolkata for India.
              Clean cups, honest sourcing, and extraordinary everyday rituals.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={BRAND.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#25D366] text-white text-xs font-bold hover:bg-[#20ba59] transition-colors"
              >
                <span>WhatsApp: {BRAND.whatsappNumber}</span>
              </a>
              <span className="text-xs text-[#E9DCC9]/70">Mon – Sat, 9:00 am – 6:00 pm IST</span>
            </div>
          </div>

          {/* Newsletter Box */}
          <div className="lg:col-span-6 flex flex-col justify-center bg-[#4B3428]/40 p-8 rounded-2xl border border-[#E9DCC9]/10">
            <h4 className="font-serif text-xl text-[#F8F5EE]">Join the Nordic Coffee Circle</h4>
            <p className="text-xs text-[#E9DCC9]/80 mt-1 mb-4">
              Get 10% off your first order (code: <strong>RUSH10</strong>), plus early access to limited harvest roasts.
            </p>

            {subscribed ? (
              <div className="p-3 bg-[#9CA88E]/20 border border-[#9CA88E]/40 rounded-xl text-xs text-[#9CA88E] font-medium flex items-center gap-2">
                <span>🎉 Welcome to the Kahvi Panda circle! Check your inbox soon.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  required
                  className="flex-1 px-4 py-2.5 rounded-full text-xs bg-white text-[#252525] focus:outline-none focus:ring-2 focus:ring-[#9CA88E]"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 rounded-full bg-[#9CA88E] text-[#30231C] text-xs font-bold uppercase tracking-wider hover:bg-[#B5BEAA] transition-colors flex items-center gap-1.5"
                >
                  <span>{loading ? 'Joining...' : 'Subscribe'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Middle Grid: Navigation Columns */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8 py-12 border-b border-[#4B3428] text-xs">
          {/* Shop */}
          <div className="space-y-3">
            <h5 className="font-bold uppercase tracking-wider text-[#E9DCC9] text-[11px]">Shop Coffee</h5>
            <ul className="space-y-2 text-[#F8F5EE]/80">
              <li><Link to="/shop" className="hover:text-[#F8F5EE] transition-colors">All Coffees</Link></li>
              <li><Link to="/shop/whole-beans" className="hover:text-[#F8F5EE] transition-colors">Whole Coffee Beans</Link></li>
              <li><Link to="/shop/ground-coffee" className="hover:text-[#F8F5EE] transition-colors">Ground Coffee</Link></li>
              <li><Link to="/shop/instant-coffee" className="hover:text-[#F8F5EE] transition-colors">Instant Coffee Crystals</Link></li>
              <li><Link to="/bundles" className="hover:text-[#F8F5EE] transition-colors">Coffee Bundles & Trios</Link></li>
              <li><Link to="/shop/accessories" className="hover:text-[#F8F5EE] transition-colors">Brewing Accessories</Link></li>
            </ul>
          </div>

          {/* Discovery & Guides */}
          <div className="space-y-3">
            <h5 className="font-bold uppercase tracking-wider text-[#E9DCC9] text-[11px]">Explore & Learn</h5>
            <ul className="space-y-2 text-[#F8F5EE]/80">
              <li><Link to="/coffee-finder" className="text-[#BC785C] hover:text-[#CE937B] font-semibold transition-colors">Coffee Finder Quiz</Link></li>
              <li><Link to="/shop?bestseller=true" className="hover:text-[#F8F5EE] transition-colors">The Panda Picks</Link></li>
              <li><Link to="/coffee-journal" className="hover:text-[#F8F5EE] transition-colors">Coffee Journal & Recipes</Link></li>
              <li><Link to="/our-story" className="hover:text-[#F8F5EE] transition-colors">Our Story & Roastery</Link></li>
              <li><Link to="/wholesale" className="hover:text-[#F8F5EE] transition-colors">Wholesale & Cafe Supply</Link></li>
            </ul>
          </div>

          {/* Support & Account */}
          <div className="space-y-3">
            <h5 className="font-bold uppercase tracking-wider text-[#E9DCC9] text-[11px]">Customer Care</h5>
            <ul className="space-y-2 text-[#F8F5EE]/80">
              <li><Link to="/track-order" className="hover:text-[#F8F5EE] transition-colors">Track Your Order</Link></li>
              <li><Link to="/account/profile" className="hover:text-[#F8F5EE] transition-colors">My Account</Link></li>
              <li><Link to="/contact" className="hover:text-[#F8F5EE] transition-colors">Contact Support</Link></li>
              <li><Link to="/faq" className="hover:text-[#F8F5EE] transition-colors">FAQs & Brewing Help</Link></li>
              <li><a href={BRAND.whatsappUrl} target="_blank" rel="noreferrer" className="hover:text-[#F8F5EE] transition-colors">WhatsApp Concierge</a></li>
            </ul>
          </div>

          {/* Policies & Staff */}
          <div className="space-y-3">
            <h5 className="font-bold uppercase tracking-wider text-[#E9DCC9] text-[11px]">Policies & Trust</h5>
            <ul className="space-y-2 text-[#F8F5EE]/80">
              <li><Link to="/shipping-policy" className="hover:text-[#F8F5EE] transition-colors">Shipping & Delivery Policy</Link></li>
              <li><Link to="/refund-policy" className="hover:text-[#F8F5EE] transition-colors">Returns & Refunds</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-[#F8F5EE] transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-[#F8F5EE] transition-colors">Terms of Service</Link></li>
              <li><Link to="/admin" className="text-[#9CA88E] hover:underline font-semibold transition-colors">Staff Portal (Admin)</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Location */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#E9DCC9]/60 gap-4">
          <p>© {new Date().getFullYear()} KAHVI PANDA. Roasted with care in Kolkata, West Bengal, India.</p>
          <div className="flex items-center gap-1">
            <span>The Nordic Blend: Scandinavian Simplicity • Indian Terroir</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

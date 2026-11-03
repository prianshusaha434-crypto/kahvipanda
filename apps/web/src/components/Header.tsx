import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../features/cart/CartContext';
import { BRAND } from '@kahvi-panda/shared';
import { ShoppingBag, Search, Menu, X, User, Sparkles, ChevronDown } from 'lucide-react';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { itemCount, openDrawer } = useCart();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearchOpen(false);
    navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    setSearchQuery('');
  };

  const navLinks = [
    { label: 'Shop Coffee', path: '/shop', hasDropdown: true },
    { label: 'The Panda Picks', path: '/shop?bestseller=true' },
    { label: 'Find Your Brew', path: '/coffee-finder', isHighlight: true },
    { label: 'Our Story', path: '/our-story' },
    { label: 'Coffee Journal', path: '/coffee-journal' },
    { label: 'Wholesale B2B', path: '/wholesale' },
  ];

  const shopCategories = [
    { label: 'All Coffees', path: '/shop' },
    { label: 'Whole Coffee Beans', path: '/shop/whole-beans' },
    { label: 'Ground Coffee', path: '/shop/ground-coffee' },
    { label: 'Instant Coffee Crystals', path: '/shop/instant-coffee' },
    { label: 'Coffee Bundles & Trios', path: '/bundles' },
    { label: 'Brewing Accessories', path: '/shop/accessories' },
    { label: 'Coffee Innovations (R&D)', path: '/shop/innovations' },
  ];

  return (
    <>
      {/* 1. Announcement Bar */}
      <div className="bg-[#30231C] text-[#F8F5EE] py-2 px-4 text-center text-[11px] font-medium tracking-widest uppercase flex items-center justify-center gap-2">
        <span>Crafted for Coffee Lovers. Born from Nordic Inspiration. Made for India.</span>
        <span className="hidden sm:inline opacity-40">•</span>
        <span className="hidden sm:inline text-[#E9DCC9]">Free Shipping Over ₹999</span>
      </div>

      {/* 2. Main Sticky Header */}
      <header className="sticky top-0 z-40 bg-[#F8F5EE]/95 backdrop-blur-md border-b border-[#30231C]/10 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#30231C] hover:bg-[#E9DCC9]/40 rounded-full transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Brand Logo & Descriptor */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src={BRAND.logoUrl}
              alt="Kahvi Panda Logo"
              className="w-11 h-11 object-contain transition-transform group-hover:scale-105"
            />
            <div className="flex flex-col">
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#30231C] leading-none">
                {BRAND.name}
              </span>
              <span className="text-[9px] uppercase tracking-[0.24em] font-bold text-[#4B3428]/80 mt-1">
                {BRAND.descriptor}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={() => link.hasDropdown && setShopDropdownOpen(true)}
                onMouseLeave={() => link.hasDropdown && setShopDropdownOpen(false)}
              >
                <Link
                  to={link.path}
                  className={`text-xs font-semibold tracking-wider uppercase flex items-center gap-1 transition-colors py-2 ${
                    link.isHighlight
                      ? 'text-[#BC785C] hover:text-[#9E5F46]'
                      : 'text-[#30231C] hover:text-[#4B3428]'
                  }`}
                >
                  {link.isHighlight && <Sparkles className="w-3.5 h-3.5" />}
                  <span>{link.label}</span>
                  {link.hasDropdown && <ChevronDown className="w-3 h-3 opacity-60" />}
                </Link>

                {/* Dropdown Menu */}
                {link.hasDropdown && shopDropdownOpen && (
                  <div className="absolute top-full left-0 w-64 bg-[#FAF7F2] rounded-xl shadow-elevated border border-[#30231C]/10 py-3 px-2 animate-in fade-in zoom-in-95 duration-150">
                    {shopCategories.map((cat) => (
                      <Link
                        key={cat.label}
                        to={cat.path}
                        className="block px-3 py-2 text-xs font-medium text-[#4B3428] hover:text-[#30231C] hover:bg-[#E9DCC9]/40 rounded-lg transition-colors"
                        onClick={() => setShopDropdownOpen(false)}
                      >
                        {cat.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Header Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Toggle */}
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2.5 text-[#30231C] hover:bg-[#E9DCC9]/40 rounded-full transition-colors"
              aria-label="Search products"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Account Link */}
            <Link
              to="/account/profile"
              className="p-2.5 text-[#30231C] hover:bg-[#E9DCC9]/40 rounded-full transition-colors"
              aria-label="Customer account"
            >
              <User className="w-5 h-5" />
            </Link>

            {/* Cart Button with Count Badge */}
            <button
              onClick={openDrawer}
              className="relative flex items-center gap-2 p-2 sm:px-4 sm:py-2 rounded-full bg-[#30231C] text-[#F8F5EE] hover:bg-[#4B3428] transition-all shadow-sm"
              aria-label="Open cart drawer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline text-xs font-bold uppercase tracking-wider">Bag</span>
              {itemCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#9CA88E] text-[#30231C] text-[11px] font-extrabold flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#30231C]/10 bg-[#FAF7F2] p-6 space-y-4 animate-in slide-in-from-top duration-200">
            <div className="space-y-3">
              <span className="text-[10px] font-bold tracking-widest text-[#4B3428]/60 uppercase block">
                Shop Coffees
              </span>
              {shopCategories.map((cat) => (
                <Link
                  key={cat.label}
                  to={cat.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm font-semibold text-[#30231C] hover:text-[#BC785C]"
                >
                  {cat.label}
                </Link>
              ))}
            </div>

            <hr className="border-[#30231C]/10 my-4" />

            <div className="space-y-3">
              <Link
                to="/coffee-finder"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-sm font-bold text-[#BC785C]"
              >
                <Sparkles className="w-4 h-4" />
                <span>Find Your Brew Quiz</span>
              </Link>
              <Link
                to="/our-story"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-semibold text-[#30231C]"
              >
                Our Story
              </Link>
              <Link
                to="/coffee-journal"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-semibold text-[#30231C]"
              >
                Coffee Journal
              </Link>
              <Link
                to="/wholesale"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-semibold text-[#30231C]"
              >
                Wholesale & B2B
              </Link>
              <Link
                to="/track-order"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-semibold text-[#4B3428]"
              >
                Track Your Order
              </Link>
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-xs font-semibold text-[#624637] pt-2"
              >
                Staff Admin Portal →
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Search Modal Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-[#30231C]/70 backdrop-blur-sm flex items-start justify-center pt-24 px-4 animate-in fade-in duration-200">
          <div className="bg-[#F8F5EE] w-full max-w-2xl rounded-2xl shadow-modal p-6 border border-[#30231C]/15 relative">
            <button
              onClick={() => setSearchOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-[#E9DCC9]/50 text-[#30231C]"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-serif text-2xl text-[#30231C] mb-4">Search Coffee & Brew Gear</h3>
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by roast, beans, moka pot, Kolkata, or flavor notes..."
                autoFocus
                className="flex-1 px-4 py-3 rounded-full text-sm bg-white border border-[#30231C]/20 focus:outline-none focus:border-[#30231C]"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-full bg-[#30231C] text-[#F8F5EE] text-xs font-bold uppercase tracking-wider hover:bg-[#4B3428]"
              >
                Search
              </button>
            </form>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-[#4B3428]">
              <span className="font-semibold text-[#30231C]">Popular:</span>
              <button onClick={() => { setSearchQuery('Moka Pot'); }} className="hover:underline">Moka Pot</button>
              <span>•</span>
              <button onClick={() => { setSearchQuery('Light Roast'); }} className="hover:underline">Light Roast</button>
              <span>•</span>
              <button onClick={() => { setSearchQuery('Instant'); }} className="hover:underline">Instant Coffee</button>
              <span>•</span>
              <button onClick={() => { setSearchQuery('Kolkata'); }} className="hover:underline">Kolkata Classic</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

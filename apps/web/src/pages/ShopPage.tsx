import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Product, Category } from '../types';
import { ProductCard } from '../components/ProductCard';
import { ApiClient } from '../services/api';
import { Filter, SlidersHorizontal, Search, RotateCcw, Sparkles } from 'lucide-react';

export const ShopPage: React.FC = () => {
  const { categorySlug } = useParams<{ categorySlug?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [selectedRoast, setSelectedRoast] = useState<string>('');
  const [selectedSort, setSelectedSort] = useState<string>('popular');
  const [searchQuery, setSearchQuery] = useState<string>(searchParams.get('search') || '');
  const [bestsellerOnly, setBestsellerOnly] = useState<boolean>(searchParams.get('bestseller') === 'true');

  useEffect(() => {
    async function fetchCategories() {
      try {
        const cats = await ApiClient.getCategories();
        setCategories(cats);
      } catch (e) {
        console.error(e);
      }
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      try {
        const data = await ApiClient.getProducts({
          category: categorySlug,
          roastLevel: selectedRoast,
          sort: selectedSort,
          search: searchQuery,
          bestseller: bestsellerOnly
        });
        setProducts(data.products || []);
      } catch (err) {
        console.error('Failed to load products', err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [categorySlug, selectedRoast, selectedSort, searchQuery, bestsellerOnly]);

  const roasts = ['Light', 'Medium', 'Medium-Dark', 'Dark', 'Nordic Roast'];

  const resetFilters = () => {
    setSelectedRoast('');
    setSelectedSort('popular');
    setSearchQuery('');
    setBestsellerOnly(false);
    setSearchParams({});
  };

  const activeCategory = categories.find((c) => c.slug === categorySlug);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      
      {/* Header Banner */}
      <div className="border-b border-[#30231C]/10 pb-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[11px] uppercase tracking-widest font-extrabold text-[#9CA88E]">
              Freshly Roasted in Kolkata
            </span>
            <h1 className="font-serif text-4xl sm:text-6xl text-[#30231C] mt-2">
              {activeCategory ? activeCategory.name : bestsellerOnly ? 'The Panda Picks' : 'All Specialty Coffees'}
            </h1>
            <p className="text-sm text-[#4B3428]/80 mt-2 max-w-2xl">
              {activeCategory?.description ||
                'Explore our Scandinavian-inspired coffee catalogue. Ethically sourced from shade-grown Indian estates and roasted for clean, sweet, honest cups.'}
            </p>
          </div>

          <span className="text-xs font-semibold text-[#4B3428]/70">
            Showing {products.length} {products.length === 1 ? 'coffee' : 'coffees'}
          </span>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#30231C]/10 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
          <button
            onClick={() => {
              setSearchParams({});
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
              !categorySlug
                ? 'bg-[#30231C] text-[#F8F5EE]'
                : 'bg-white text-[#4B3428] hover:bg-[#E9DCC9]/50 border border-[#30231C]/10'
            }`}
          >
            All Categories
          </button>
          {categories.map((c) => (
            <a
              key={c.id}
              href={`/shop/${c.slug}`}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                categorySlug === c.slug
                  ? 'bg-[#30231C] text-[#F8F5EE]'
                  : 'bg-white text-[#4B3428] hover:bg-[#E9DCC9]/50 border border-[#30231C]/10'
              }`}
            >
              {c.name}
            </a>
          ))}
        </div>

        {/* Secondary Filters: Roast & Sort */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
          
          {/* Roast Selector */}
          <select
            value={selectedRoast}
            onChange={(e) => setSelectedRoast(e.target.value)}
            className="px-3 py-1.5 rounded-full text-xs font-medium bg-white border border-[#30231C]/15 text-[#30231C] focus:outline-none"
          >
            <option value="">All Roast Curves</option>
            {roasts.map((r) => (
              <option key={r} value={r}>
                {r} Roast
              </option>
            ))}
          </select>

          {/* Sort Selector */}
          <select
            value={selectedSort}
            onChange={(e) => setSelectedSort(e.target.value)}
            className="px-3 py-1.5 rounded-full text-xs font-medium bg-white border border-[#30231C]/15 text-[#30231C] focus:outline-none"
          >
            <option value="popular">Most Popular</option>
            <option value="newest">Newest Batches</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>

          {/* Reset Filters button */}
          {(selectedRoast || searchQuery || categorySlug || bestsellerOnly) && (
            <button
              onClick={resetFilters}
              className="p-2 rounded-full bg-white text-[#BC785C] hover:bg-[#BC785C]/10 border border-[#BC785C]/30 text-xs flex items-center gap-1"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="aspect-[3/4] bg-[#E9DCC9]/40 rounded-brand" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-3xl border border-[#30231C]/10 p-8">
          <span className="text-4xl block mb-3">🐼</span>
          <h3 className="font-serif text-2xl text-[#30231C]">No coffees match your filter</h3>
          <p className="text-sm text-[#4B3428]/80 mt-1 max-w-sm mx-auto">
            Try adjusting your roast curve or search terms, or ask Panda AI to recommend a roast!
          </p>
          <button
            onClick={resetFilters}
            className="mt-6 px-6 py-2.5 rounded-full bg-[#30231C] text-[#F8F5EE] text-xs font-bold uppercase tracking-wider hover:bg-[#4B3428]"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

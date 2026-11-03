import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Product, ProductVariant } from '../types';
import { ApiClient } from '../services/api';
import { useCart } from '../features/cart/CartContext';
import { formatINR, BRAND } from '@kahvi-panda/shared';
import {
  ShoppingBag,
  Check,
  Truck,
  RotateCcw,
  Coffee,
  Sparkles,
  ShieldCheck,
  Flame,
  ArrowRight
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedGrind, setSelectedGrind] = useState<string>('Whole Beans');
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      if (!slug) return;
      setLoading(true);
      try {
        const data = await ApiClient.getProductBySlug(slug);
        setProduct(data);
        if (data.variants && data.variants.length > 0) {
          setSelectedVariant(data.variants[0]);
          setSelectedGrind(data.variants[0].grindType || 'Whole Beans');
        }
        if (data.images && data.images.length > 0) {
          setSelectedImage(data.images[0].url);
        }
      } catch (err) {
        console.error('Failed to load product', err);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 animate-pulse space-y-8">
        <div className="h-8 bg-[#E9DCC9]/40 w-1/3 rounded-lg" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-6 aspect-square bg-[#E9DCC9]/40 rounded-3xl" />
          <div className="lg:col-span-6 space-y-4">
            <div className="h-10 bg-[#E9DCC9]/40 w-3/4 rounded-lg" />
            <div className="h-6 bg-[#E9DCC9]/40 w-1/4 rounded-lg" />
            <div className="h-24 bg-[#E9DCC9]/40 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <span className="text-4xl">🐼</span>
        <h2 className="font-serif text-3xl text-[#30231C] mt-2">Coffee Not Found</h2>
        <p className="text-sm text-[#4B3428]/80 mt-1">This harvest or roast profile may have retired.</p>
        <Link
          to="/shop"
          className="mt-6 inline-block px-6 py-2.5 rounded-full bg-[#30231C] text-[#F8F5EE] text-xs font-bold uppercase tracking-wider"
        >
          Back to Shop
        </Link>
      </div>
    );
  }

  const grindOptions = [
    'Whole Beans',
    'French Press (Coarse)',
    'Moka Pot (Fine-Medium)',
    'Aeropress / Pour Over',
    'South Indian Filter',
    'Espresso (Ultra-Fine)'
  ];

  const handleAddToCart = (shouldRedirect = false) => {
    if (!selectedVariant) return;

    addItem({
      productId: product.id,
      variantId: selectedVariant.id,
      name: product.name,
      slug: product.slug,
      image: selectedImage || BRAND.logoUrl,
      price: selectedVariant.price,
      weight: selectedVariant.weight,
      grindType: selectedGrind,
      quantity
    }, !shouldRedirect);

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);

    if (shouldRedirect) {
      navigate('/checkout');
    }
  };

  const tastingNotes = product.tastingNotes
    ? product.tastingNotes.split(',').map((t) => t.trim())
    : [];

  const brewingMethods = product.compatibleBrewingMethods
    ? product.compatibleBrewingMethods.split(',').map((b) => b.trim())
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      
      {/* Breadcrumb */}
      <nav className="text-xs text-[#4B3428]/70 flex items-center gap-2">
        <Link to="/" className="hover:text-[#30231C]">Home</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-[#30231C]">Shop</Link>
        <span>/</span>
        <span className="text-[#30231C] font-semibold">{product.name}</span>
      </nav>

      {/* Product Hero Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        
        {/* Left: Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="aspect-square rounded-3xl overflow-hidden bg-white border border-[#30231C]/10 shadow-elevated relative">
            <img
              src={selectedImage || BRAND.logoUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.bestseller && (
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#30231C] text-[#F8F5EE] flex items-center gap-1.5 shadow-md">
                <Sparkles className="w-3.5 h-3.5 text-[#E9DCC9]" />
                <span>Panda Pick</span>
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(img.url)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === img.url ? 'border-[#30231C] scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img.url} alt="thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details & Purchase Form */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] uppercase tracking-widest font-extrabold text-[#9CA88E]">
                {product.origin}
              </span>
              <span className="text-xs text-[#30231C]/30">•</span>
              <span className="text-xs font-bold uppercase tracking-wider text-[#BC785C]">
                {product.roastLevel} Roast
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl text-[#30231C] leading-tight">
              {product.name}
            </h1>

            <p className="text-sm text-[#4B3428] mt-3 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Tasting Notes */}
          {tastingNotes.length > 0 && (
            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#30231C]/10 space-y-1.5">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#4B3428]/70 block">
                Primary Tasting Notes
              </span>
              <div className="flex flex-wrap gap-2">
                {tastingNotes.map((note) => (
                  <span
                    key={note}
                    className="px-3 py-1 rounded-full text-xs font-semibold bg-white border border-[#30231C]/10 text-[#30231C]"
                  >
                    {note}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Price Header */}
          <div className="flex items-baseline gap-3 pt-2">
            <span className="font-serif text-3xl font-bold text-[#30231C]">
              {formatINR(selectedVariant?.price || 0)}
            </span>
            {selectedVariant?.compareAtPrice && selectedVariant.compareAtPrice > (selectedVariant.price || 0) && (
              <span className="text-sm text-[#4B3428]/50 line-through">
                {formatINR(selectedVariant.compareAtPrice)}
              </span>
            )}
            <span className="text-xs text-[#9CA88E] font-bold">
              Inclusive of all taxes
            </span>
          </div>

          {/* Variant Selector: Weight */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#30231C]">
              Select Pack Size
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {product.variants.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariant(v)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedVariant?.id === v.id
                      ? 'border-[#30231C] bg-white shadow-sm'
                      : 'border-[#30231C]/15 bg-[#FAF7F2] hover:border-[#30231C]/40'
                  }`}
                >
                  <p className="text-xs font-bold text-[#30231C]">{v.weight}</p>
                  <p className="text-[11px] text-[#4B3428]/80">{formatINR(v.price)}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Grind Selector (Only for Beans/Ground) */}
          {product.coffeeType !== 'Instant Coffee' && (
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#30231C]">
                Select Grind Size
              </span>
              <select
                value={selectedGrind}
                onChange={(e) => setSelectedGrind(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-xs font-medium bg-white border border-[#30231C]/20 text-[#30231C] focus:outline-none focus:border-[#30231C]"
              >
                {grindOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Quantity & Add to Cart Actions */}
          <div className="pt-2 space-y-3">
            <div className="flex gap-3">
              {/* Stepper */}
              <div className="flex items-center border border-[#30231C]/20 rounded-full px-3 py-1 bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-2 py-1 text-sm font-bold text-[#30231C] hover:text-[#BC785C]"
                >
                  -
                </button>
                <span className="px-3 text-xs font-bold w-6 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(50, quantity + 1))}
                  className="px-2 py-1 text-sm font-bold text-[#30231C] hover:text-[#9CA88E]"
                >
                  +
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={() => handleAddToCart(false)}
                className={`flex-1 py-3.5 px-6 rounded-pill text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-all shadow-md ${
                  added
                    ? 'bg-[#9CA88E] text-[#F8F5EE]'
                    : 'bg-[#30231C] text-[#F8F5EE] hover:bg-[#4B3428]'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Bag</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Bag</span>
                  </>
                )}
              </button>
            </div>

            {/* Buy Now Direct Button */}
            <button
              onClick={() => handleAddToCart(true)}
              className="w-full py-3.5 px-6 rounded-pill bg-[#FAF7F2] border border-[#30231C]/20 text-[#30231C] text-xs font-bold tracking-widest uppercase hover:bg-[#E9DCC9]/40 transition-colors"
            >
              Buy Now (Express Checkout)
            </button>
          </div>

          {/* Shipping & Freshness Badges */}
          <div className="pt-4 border-t border-[#30231C]/10 grid grid-cols-2 gap-4 text-xs text-[#4B3428]">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#9CA88E]" />
              <span>Ships in 24 hours from Kolkata</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#9CA88E]" />
              <span>Free shipping over ₹999</span>
            </div>
          </div>
        </div>

      </div>

      {/* Brewing Guide & Terroir Accordion */}
      <div className="bg-white rounded-3xl border border-[#30231C]/10 p-8 sm:p-12 space-y-6">
        <h3 className="font-serif text-2xl sm:text-3xl text-[#30231C]">
          Recommended Brewing Methods
        </h3>
        <p className="text-sm text-[#4B3428]/80 leading-relaxed">
          Each coffee from Kahvi Panda is cupped and profiled for specific extraction dynamics.
        </p>

        <div className="flex flex-wrap gap-3">
          {brewingMethods.map((method) => (
            <div
              key={method}
              className="px-4 py-2 rounded-xl bg-[#FAF7F2] border border-[#30231C]/10 text-xs font-bold text-[#30231C] flex items-center gap-2"
            >
              <Coffee className="w-4 h-4 text-[#BC785C]" />
              <span>{method}</span>
            </div>
          ))}
        </div>

        {product.ingredients && (
          <div className="pt-4 border-t border-[#30231C]/10">
            <span className="text-xs font-bold text-[#30231C] uppercase tracking-wider">
              Ingredients & Declarations:
            </span>
            <p className="text-xs text-[#4B3428]/80 mt-1">{product.ingredients}</p>
          </div>
        )}
      </div>

    </div>
  );
};

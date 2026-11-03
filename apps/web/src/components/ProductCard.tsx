import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { useCart } from '../features/cart/CartContext';
import { formatINR, BRAND } from '@kahvi-panda/shared';
import { ShoppingBag, Check, Sparkles } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const defaultVariant = product.variants?.[0];
  const price = defaultVariant ? defaultVariant.price : 0;
  const compareAtPrice = defaultVariant?.compareAtPrice;
  const imageUrl = product.images?.[0]?.url || BRAND.logoUrl;

  const tastingNotesList = product.tastingNotes
    ? product.tastingNotes.split(',').map((t) => t.trim()).slice(0, 3)
    : [];

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!defaultVariant) return;

    addItem(
      {
        productId: product.id,
        variantId: defaultVariant.id,
        name: product.name,
        slug: product.slug,
        image: imageUrl,
        price: defaultVariant.price,
        weight: defaultVariant.weight || '250g',
        grindType: defaultVariant.grindType || 'Whole Beans',
        quantity: 1,
      },
      true
    );

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="group flex flex-col justify-between bg-white/70 rounded-brand border border-[#30231C]/10 overflow-hidden shadow-soft hover:shadow-elevated hover:border-[#30231C]/25 transition-all duration-300">
      <Link to={`/products/${product.slug}`} className="block relative aspect-square overflow-hidden bg-[#E9DCC9]/20">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
          {product.bestseller && (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-[#30231C] text-[#F8F5EE] shadow-sm flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-[#E9DCC9]" />
              <span>Panda Pick</span>
            </span>
          )}
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#F8F5EE]/90 backdrop-blur-sm text-[#4B3428] border border-[#30231C]/10">
            {product.roastLevel}
          </span>
        </div>

        {compareAtPrice && compareAtPrice > price && (
          <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#BC785C] text-white">
            Save {Math.round(((compareAtPrice - price) / compareAtPrice) * 100)}%
          </span>
        )}
      </Link>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-[10px] uppercase tracking-widest font-bold text-[#9CA88E]">
            {product.origin}
          </span>

          <Link to={`/products/${product.slug}`}>
            <h3 className="font-serif text-lg font-bold text-[#30231C] mt-1 group-hover:text-[#4B3428] transition-colors leading-snug line-clamp-1">
              {product.name}
            </h3>
          </Link>

          <p className="text-xs text-[#4B3428]/80 mt-1 line-clamp-2 leading-relaxed">
            {product.shortDescription || product.description}
          </p>

          {/* Tasting notes pills */}
          {tastingNotesList.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {tastingNotesList.map((note) => (
                <span
                  key={note}
                  className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-[#E9DCC9]/40 text-[#4B3428]"
                >
                  {note}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="mt-5 pt-3 border-t border-[#30231C]/5 flex items-center justify-between">
          <div>
            <span className="font-serif text-lg font-bold text-[#30231C]">
              {formatINR(price)}
            </span>
            {compareAtPrice && compareAtPrice > price && (
              <span className="ml-1.5 text-xs text-[#4B3428]/50 line-through">
                {formatINR(compareAtPrice)}
              </span>
            )}
            <span className="text-[11px] text-[#4B3428]/70 block">
              {defaultVariant?.weight || '250g'}
            </span>
          </div>

          <button
            onClick={handleQuickAdd}
            disabled={!product.variants?.some((v) => v.isAvailable)}
            className={`px-3.5 py-2 rounded-full text-xs font-bold tracking-wider uppercase flex items-center gap-1.5 transition-all shadow-sm ${
              isAdded
                ? 'bg-[#9CA88E] text-[#F8F5EE]'
                : 'bg-[#30231C] text-[#F8F5EE] hover:bg-[#4B3428] hover:scale-105 active:scale-95'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Quick Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

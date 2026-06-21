'use client';

import React from 'react';
import Link from 'next/link';
import { Star, ShoppingBag, Heart } from 'lucide-react';
import { Product } from '../../types';
import { useCartStore } from '../../store/cartStore';
import { toast } from '../ui/Toast';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, toggleWishlist, isInWishlist } = useCartStore();
  const isWish = isInWishlist(product.id);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    toast(isWish ? 'Removed from Wishlist' : 'Saved to Wishlist', 'info', `${product.title} was updated.`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast('Added to Cart', 'success', `${product.title} has been added.`);
  };

  return (
    <div className="group flex flex-col border border-gray-100 rounded-2xl bg-white shadow-sm overflow-hidden hover:-translate-y-1 hover:shadow-xl transition-all duration-300 relative">
      {/* Wishlist Button */}
      <button
        onClick={handleWishlistToggle}
        className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur-md hover:bg-white text-gray-400 hover:text-red-500 w-9 h-9 rounded-full flex items-center justify-center border border-gray-100 shadow-sm focus:outline-none transition-all cursor-pointer"
        aria-label={isWish ? 'Remove from Wishlist' : 'Add to Wishlist'}
      >
        <Heart className={`w-4 h-4 transition-colors ${isWish ? 'fill-red-500 text-red-500' : ''}`} />
      </button>

      {/* Sale Badge */}
      {product.discountPrice && (
        <div className="absolute top-4 left-4 z-10 bg-orange-500 text-white text-[9px] font-bold px-2 py-1 rounded-full uppercase tracking-wider select-none">
          Sale
        </div>
      )}

      {/* Product Image Link */}
      <Link href={`/product/${product.slug}`} className="cursor-pointer block relative aspect-square w-full bg-slate-50 overflow-hidden">
        <img
          src={product.images[0]?.url}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </Link>

      {/* Product Info */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-[10px] text-orange-500 font-extrabold uppercase tracking-widest block">{product.brand}</span>
          <Link href={`/product/${product.slug}`} className="cursor-pointer block mt-1">
            <h4 className="text-sm font-extrabold text-gray-900 group-hover:text-orange-500 transition-colors leading-snug line-clamp-2">{product.title}</h4>
          </Link>
          <div className="flex items-center gap-1 mt-2">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span className="text-xs font-bold text-gray-800">{product.averageRating}</span>
            <span className="text-[10px] text-gray-400">({product.reviewCount})</span>
          </div>
        </div>

        {/* Pricing and Action */}
        <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
          <div>
            {product.discountPrice ? (
              <div className="flex items-baseline gap-1.5">
                <span className="text-base font-extrabold text-gray-900">${product.discountPrice}</span>
                <span className="text-xs text-gray-400 line-through font-semibold">${product.price}</span>
              </div>
            ) : (
              <span className="text-base font-extrabold text-gray-900">${product.price}</span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            className="bg-orange-50 hover:bg-orange-500 text-orange-600 hover:text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all duration-300 flex items-center gap-1.5 cursor-pointer shadow-sm hover:shadow-orange"
          >
            <ShoppingBag className="w-4 h-4" />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import ProductCard from '../../components/store/ProductCard';

export default function WishlistPage() {
  const { wishlist } = useCartStore();

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 select-none flex-1 flex flex-col justify-start">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-8 text-left">My Wishlist</h1>

        {wishlist.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center min-h-[450px] my-auto">
            <div className="max-w-md w-full bg-white border border-dashed border-gray-200 rounded-3xl p-8 md:p-10 shadow-sm text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center border border-orange-100/60 mb-5 text-orange-500">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-gray-900">Your wishlist is empty</h3>
              <p className="text-xs text-gray-500 mt-2 max-w-sm leading-normal">
                Save items you like to access them here later. Browse products to add gear to your wishlist.
              </p>
              <Link
                href="/shop"
                className="mt-6 w-full bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold py-3.5 rounded-xl transition-all shadow-sm hover:shadow-orange cursor-pointer text-center block"
              >
                Discover Products
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
    </div>
  );
}

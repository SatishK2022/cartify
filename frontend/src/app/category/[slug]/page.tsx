'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { use } from 'react';
import { useCartStore } from '../../../store/cartStore';
import { mockCategories } from '../../../data/mockData';
import ProductCard from '../../../components/store/ProductCard';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function CategoryPage({ params }: PageProps) {
  const { slug } = use(params);
  const { products } = useCartStore();

  const category = useMemo(() => {
    return mockCategories.find((c) => c.slug === slug) || { name: slug, id: slug };
  }, [slug]);

  const catProducts = useMemo(() => {
    return products.filter((p) => p.categoryId.replace('cat-', '') === slug || p.categoryName.toLowerCase() === slug.toLowerCase());
  }, [products, slug]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 select-none">
        
        {/* Breadcrumbs */}
        <div className="text-[11px] text-gray-400 mb-6 flex gap-1">
          <Link href="/" className="hover:text-gray-600">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-gray-600">Categories</Link>
          <span>/</span>
          <span className="text-gray-655 font-semibold uppercase">{category.name}</span>
        </div>

        {/* Title */}
        <div className="border-b border-gray-100 pb-6 mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 capitalize">{category.name} Collection</h1>
          <p className="text-xs text-gray-500 mt-1">Showing all {catProducts.length} items in the {category.name} collection</p>
        </div>

        {catProducts.length === 0 ? (
          <div className="text-center py-20 bg-surface rounded-xl border border-gray-200">
            <p className="text-xs text-gray-500 italic">No products available in this category yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {catProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
  );
}

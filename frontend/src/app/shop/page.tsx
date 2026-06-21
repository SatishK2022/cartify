'use client';

import React, { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Star, ChevronDown, SlidersHorizontal, Grid, List, X } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { mockCategories, mockBrands } from '../../data/mockData';
import ProductCard from '../../components/store/ProductCard';

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || '';
  const initialSearch = searchParams.get('q') || '';

  const { products } = useCartStore();

  // Filters State
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCategory ? [initialCategory] : []);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 2500 });
  const [minRating, setMinRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false);
  const [showDesktopFilters, setShowDesktopFilters] = useState<boolean>(false);

  // Sync state if category changes in URL
  React.useEffect(() => {
    if (initialCategory) {
      setSelectedCategories([initialCategory]);
    }
  }, [initialCategory]);

  const handleCategoryToggle = (slug: string) => {
    setSelectedCategories((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
    setCurrentPage(1);
  };

  const handleBrandToggle = (brandName: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brandName) ? prev.filter((b) => b !== brandName) : [...prev, brandName]
    );
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceRange({ min: 0, max: 2500 });
    setMinRating(null);
    setSortBy('featured');
    setCurrentPage(1);
  };

  // Filter & Sort computation
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Search query
        if (initialSearch && !p.title.toLowerCase().includes(initialSearch.toLowerCase()) && !p.brand.toLowerCase().includes(initialSearch.toLowerCase())) {
          return false;
        }
        // Categories
        if (selectedCategories.length > 0 && !selectedCategories.includes(p.categoryId.replace('cat-', ''))) {
          return false;
        }
        // Brands
        if (selectedBrands.length > 0 && !selectedBrands.includes(p.brand)) {
          return false;
        }
        // Price
        const actualPrice = p.discountPrice || p.price;
        if (actualPrice < priceRange.min || actualPrice > priceRange.max) {
          return false;
        }
        // Rating
        if (minRating !== null && p.averageRating < minRating) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        const aPrice = a.discountPrice || a.price;
        const bPrice = b.discountPrice || b.price;

        if (sortBy === 'price-asc') return aPrice - bPrice;
        if (sortBy === 'price-desc') return bPrice - aPrice;
        if (sortBy === 'rating') return b.averageRating - a.averageRating;
        return 0; // Default Featured (natural index)
      });
  }, [products, initialSearch, selectedCategories, selectedBrands, priceRange, minRating, sortBy]);

  // Pagination logic
  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredProducts, currentPage]);

  return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 select-none">
        
        {/* Breadcrumbs */}
        <div className="text-[11px] text-gray-400 mb-6 flex gap-1">
          <Link href="/" className="hover:text-gray-600">Home</Link>
          <span>/</span>
          <span className="text-gray-600 font-medium">Shop Catalog</span>
        </div>

        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-gray-100 pb-6 mb-8 gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">
              {initialSearch ? `Search Results for "${initialSearch}"` : 'Premium Collection'}
            </h1>
            <p className="text-sm text-gray-500 mt-2 font-medium">{filteredProducts.length} items found</p>
          </div>

          {/* Sort dropdown and layout toggler */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setShowDesktopFilters((prev) => !prev);
                if (typeof window !== 'undefined' && window.innerWidth < 1024) setShowMobileFilters(true);
              }}
              className={`flex items-center gap-2 border rounded-xl px-4 py-2.5 text-sm font-bold transition-all shadow-sm ${
                showDesktopFilters ? 'bg-orange-50 border-orange-200 text-orange-600' : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline">Filters</span>
            </button>
            
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white border border-gray-200 rounded-xl pl-4 pr-10 py-2.5 text-sm font-bold text-gray-700 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 cursor-pointer shadow-sm transition-all"
              >
                <option value="featured">Featured Drops</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* 2-Column Grid */}
        <div className="flex gap-8 items-start">
          
          {/* Desktop Left Sidebar Filters */}
          {showDesktopFilters && (
            <aside className="w-64 shrink-0 hidden lg:block border border-gray-100 rounded-2xl p-6 shadow-sm bg-white">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900">Filters</h3>
              <button
                onClick={clearAllFilters}
                className="text-[10px] font-bold text-accent hover:underline focus:outline-none"
              >
                Clear All
              </button>
            </div>

            {/* Category Filter */}
            <div className="mb-6 pb-6 border-b border-gray-100">
              <h4 className="text-xs font-bold text-gray-900 mb-3 uppercase tracking-wider">Categories</h4>
              <div className="flex flex-col gap-2">
                {mockCategories.map((cat) => (
                  <label key={cat.id} className="flex items-center gap-2.5 text-xs text-gray-650 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat.slug)}
                      onChange={() => handleCategoryToggle(cat.slug)}
                      className="rounded border-gray-300 text-accent focus:ring-accent"
                    />
                    <span>{cat.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Brand Filter */}
            <div className="mb-6 pb-6 border-b border-gray-100">
              <h4 className="text-xs font-bold text-gray-900 mb-3 uppercase tracking-wider">Brands</h4>
              <div className="flex flex-col gap-2">
                {mockBrands.map((brand) => (
                  <label key={brand.id} className="flex items-center gap-2.5 text-xs text-gray-655 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand.name)}
                      onChange={() => handleBrandToggle(brand.name)}
                      className="rounded border-gray-300 text-accent focus:ring-accent"
                    />
                    <span>{brand.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="mb-6 pb-6 border-b border-gray-100">
              <h4 className="text-xs font-bold text-gray-900 mb-3 uppercase tracking-wider">Price Range</h4>
              <div className="flex flex-col gap-3">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <span className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Min ($)</span>
                    <input
                      type="number"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                      className="w-full px-2 py-1.5 border border-gray-250 rounded text-xs focus:outline-none focus:border-primary text-gray-900"
                    />
                  </div>
                  <div className="flex-1">
                    <span className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Max ($)</span>
                    <input
                      type="number"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                      className="w-full px-2 py-1.5 border border-gray-250 rounded text-xs focus:outline-none focus:border-primary text-gray-900"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Rating Filter */}
            <div>
              <h4 className="text-xs font-bold text-gray-900 mb-3 uppercase tracking-wider">Rating</h4>
              <div className="flex flex-col gap-2">
                {[5, 4, 3].map((stars) => (
                  <button
                    key={stars}
                    onClick={() => setMinRating(minRating === stars ? null : stars)}
                    className={`flex items-center gap-1.5 text-xs text-left focus:outline-none transition-colors ${
                      minRating === stars ? 'text-accent font-bold' : 'text-gray-650 hover:text-gray-900'
                    }`}
                  >
                    <div className="flex text-amber-500">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star
                          key={idx}
                          className={`w-3.5 h-3.5 ${idx < stars ? 'fill-amber-500' : 'text-gray-200'}`}
                        />
                      ))}
                    </div>
                    <span>{stars === 5 ? '5.0 Only' : `& Up`}</span>
                  </button>
                ))}
              </div>
            </div>
          </aside>
          )}

          {/* Right Product Grid */}
          <div className="flex-1">
            {paginatedProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-gray-200 rounded-xl bg-white">
                <SlidersHorizontal className="w-8 h-8 text-gray-400 mb-3" />
                <h3 className="text-sm font-semibold text-gray-900">No products match filters</h3>
                <p className="text-xs text-gray-500 mt-1 max-w-xs leading-normal">Try adjusting your filters, price limits, or clearing search search terms to locate matches.</p>
                <button
                  onClick={clearAllFilters}
                  className="mt-4 bg-primary text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedProducts.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-12 gap-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1.5 border border-gray-250 rounded-lg text-xs font-semibold hover:bg-gray-50 focus:outline-none disabled:opacity-40"
                    >
                      Prev
                    </button>
                    {Array.from({ length: totalPages }).map((_, idx) => {
                      const pageNum = idx + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold focus:outline-none transition-all ${
                            currentPage === pageNum
                              ? 'bg-primary text-white'
                              : 'border border-gray-250 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1.5 border border-gray-250 rounded-lg text-xs font-semibold hover:bg-gray-50 focus:outline-none disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
  );
}

export default function Shop() {
  return (
    <Suspense fallback={
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center select-none bg-white">
        <p className="text-xs text-gray-400">Loading catalog...</p>
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}

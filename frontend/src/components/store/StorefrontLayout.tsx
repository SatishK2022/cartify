'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, ShoppingBag, Heart, User, ArrowRight, X, Plus, Minus,
  Menu, ChevronDown, Check, ShieldAlert, Sparkles, Send, HelpCircle,
  Headphones, Monitor, Watch, SlidersHorizontal, TrendingUp, Tag, LayoutGrid, Truck
} from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { mockCategories, mockProducts } from '../../data/mockData';
import { toast, ToastContainer } from '../ui/Toast';

interface StorefrontLayoutProps {
  children: React.ReactNode;
}

export default function StorefrontLayout({ children }: StorefrontLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { cart, wishlist, removeFromCart, updateQuantity, getCartTotal, getDiscountAmount, getFinalTotal, coupon, applyCoupon, removeCoupon } = useCartStore();
  const { user, logout } = useAuthStore();

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);

  // Cart quantity count
  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  // Search results preview
  const searchResults = searchQuery.trim()
    ? mockProducts.filter((p) =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    const success = applyCoupon(couponCode);
    if (success) {
      toast('Coupon Applied Successfully!', 'success', `${couponCode} has been applied.`);
      setCouponCode('');
    } else {
      toast('Invalid Coupon Code', 'error', 'This coupon does not exist or order minimum is not met.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <ToastContainer />

      {/* 1. Announcement Bar */}
      <div className="bg-gradient-to-r from-orange-500 via-orange-500 to-orange-600 text-white text-[11px] py-2 px-4 font-semibold tracking-wide flex items-center justify-between select-none">
        <div className="flex-1 flex items-center justify-center gap-2">
          <span>🚚 Free Delivery on Orders Over $150</span>
          <span className="text-orange-200">•</span>
          <span>Use code <strong>WELCOME10</strong> for 10% off your first order</span>
        </div>
        <div className="hidden md:flex items-center gap-4 text-[11px] text-orange-100 font-semibold">
          <Link href="/track-order" className="hover:text-white transition-colors">Track Order</Link>
          <span className="text-orange-300">•</span>
          <Link href="/faq" className="hover:text-white transition-colors">Support</Link>
        </div>
      </div>

      {/* 2. Premium Navbar */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Left: Brand Logo & Navigation */}
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2 cursor-pointer">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-extrabold text-sm">C</span>
                </div>
                <span className="font-extrabold text-lg tracking-wide text-gray-900">Cartify</span>
              </Link>

              {/* Center Menu Links (Desktop) */}
              <nav className="hidden lg:flex items-center gap-1">
                {/* Categories Mega Menu */}
                <div
                  className="relative"
                  onMouseEnter={() => setActiveMegaMenu('categories')}
                  onMouseLeave={() => setActiveMegaMenu(null)}
                >
                  <button className="flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-orange-500 hover:bg-orange-50 px-3 py-2 rounded-lg transition-all cursor-pointer">
                    Categories
                    <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${activeMegaMenu === 'categories' ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {activeMegaMenu === 'categories' && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.98 }}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                        className="absolute left-0 top-[calc(100%+10px)] w-[480px] bg-white rounded-2xl z-50 text-left"
                        style={{ boxShadow: '0 20px 60px -10px rgba(0,0,0,0.15), 0 4px 20px -4px rgba(0,0,0,0.1)' }}
                      >
                        {/* Header */}
                        <div className="px-5 pt-5 pb-3 border-b border-gray-100">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Browse by Category</p>
                        </div>

                        {/* Category Icon Grid */}
                        <div className="p-4 grid grid-cols-4 gap-2">
                          {[
                            { id: 'cat-audio',       name: 'Audio',       slug: 'audio',       Icon: Headphones,        count: 12 },
                            { id: 'cat-computing',   name: 'Computing',   slug: 'computing',   Icon: Monitor,           count: 8  },
                            { id: 'cat-wearables',   name: 'Wearables',   slug: 'wearables',   Icon: Watch,             count: 6  },
                            { id: 'cat-accessories', name: 'Accessories', slug: 'accessories', Icon: SlidersHorizontal, count: 15 },
                          ].map((cat) => (
                            <Link
                              key={cat.id}
                              href={`/category/${cat.slug}`}
                              onClick={() => setActiveMegaMenu(null)}
                              className="group flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-orange-50 transition-all duration-150 text-center"
                            >
                              <div className="w-12 h-12 bg-gray-50 group-hover:bg-orange-100 rounded-xl flex items-center justify-center transition-colors duration-150 border border-gray-100 group-hover:border-orange-200">
                                <cat.Icon className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors" />
                              </div>
                              <div>
                                <p className="text-xs font-semibold text-gray-700 group-hover:text-orange-600 transition-colors">{cat.name}</p>
                                <p className="text-[10px] text-gray-400 mt-0.5">{cat.count} items</p>
                              </div>
                            </Link>
                          ))}
                        </div>

                        {/* Quick links row */}
                        <div className="px-4 pb-3 flex flex-col gap-1">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5 px-1">Quick Links</p>
                          <div className="grid grid-cols-2 gap-1">
                            {[
                              { label: 'New Arrivals', href: '/shop?sort=newest',  Icon: Sparkles   },
                              { label: 'Best Sellers', href: '/shop?sort=popular', Icon: TrendingUp  },
                              { label: 'On Sale',      href: '/shop?filter=sale',  Icon: Tag        },
                              { label: 'All Products', href: '/shop',              Icon: LayoutGrid  },
                            ].map((link) => (
                              <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setActiveMegaMenu(null)}
                                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-orange-50 transition-colors group"
                              >
                                <div className="w-7 h-7 bg-gray-100 group-hover:bg-orange-100 rounded-lg flex items-center justify-center shrink-0 transition-colors">
                                  <link.Icon className="w-3.5 h-3.5 text-gray-400 group-hover:text-orange-500 transition-colors" />
                                </div>
                                <span className="text-xs font-semibold text-gray-600 group-hover:text-orange-600 transition-colors">{link.label}</span>
                              </Link>
                            ))}
                          </div>
                        </div>

                        {/* Footer CTA */}
                        <div className="mx-4 mb-4 p-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
                              <Truck className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <p className="text-white text-xs font-bold">Free Shipping Today</p>
                              <p className="text-orange-100 text-[10px] mt-0.5">On orders over $150</p>
                            </div>
                          </div>
                          <Link
                            href="/shop"
                            onClick={() => setActiveMegaMenu(null)}
                            className="bg-white text-orange-600 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-orange-50 transition-colors shrink-0"
                          >
                            Shop Now
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Link href="/shop" className="text-sm font-semibold text-gray-600 hover:text-orange-500 hover:bg-orange-50 px-3 py-2 rounded-lg transition-all">
                  Shop All
                </Link>
                <Link href="/blog" className="text-sm font-semibold text-gray-600 hover:text-orange-500 hover:bg-orange-50 px-3 py-2 rounded-lg transition-all">
                  Insights
                </Link>
                <Link href="/about" className="text-sm font-semibold text-gray-600 hover:text-orange-500 hover:bg-orange-50 px-3 py-2 rounded-lg transition-all">
                  About
                </Link>
              </nav>
            </div>

            {/* Right: Search & Actions */}
            <div className="flex items-center gap-4 flex-1 justify-end">
              
              {/* Direct Search Input inside header */}
              <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center relative max-w-[220px] w-full">
                <Search className="absolute left-3 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 bg-gray-50 text-gray-900 placeholder-gray-400 transition-all"
                />
                {searchQuery.trim() && (
                  <div className="absolute top-[calc(100%+8px)] right-0 w-80 bg-white border border-gray-100 rounded-2xl shadow-xl p-3 flex flex-col gap-2 z-50 text-left">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Matching Products</span>
                    {searchResults.slice(0, 4).map((p) => (
                      <Link
                        key={p.id}
                        href={`/product/${p.slug}`}
                        onClick={() => setSearchQuery('')}
                        className="flex items-center gap-3 hover:bg-orange-50 p-2 rounded-xl transition-colors group"
                      >
                        <img src={p.images[0]?.url} alt={p.title} className="w-9 h-9 object-cover rounded-lg border border-gray-100 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h5 className="text-xs font-semibold text-gray-900 truncate group-hover:text-orange-500 transition-colors">{p.title}</h5>
                          <p className="text-[10px] text-gray-400 mt-0.5 font-medium">${p.price}</p>
                        </div>
                      </Link>
                    ))}
                    <Link href={`/search?q=${encodeURIComponent(searchQuery)}`} onClick={() => setSearchQuery('')} className="text-xs font-bold text-orange-500 hover:text-orange-600 mt-1 block text-center py-1.5 border-t border-gray-100">
                      View all results →
                    </Link>
                  </div>
                )}
              </form>

              {/* Wishlist Link */}
              <Link
                href="/wishlist"
                className="relative p-2 text-gray-500 hover:text-orange-500 hover:bg-orange-50 rounded-xl transition-all"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-orange-500 text-white text-[8px] font-bold min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* Cart Drawer Trigger */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-gray-500 hover:text-orange-500 hover:bg-orange-50 rounded-xl focus:outline-none transition-all cursor-pointer"
                aria-label="Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-orange-500 text-white text-[8px] font-bold min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>

              {/* User Link */}
              {user ? (
                <div className="flex items-center gap-2">
                  <Link
                    href="/dashboard"
                    className="p-2 text-gray-500 hover:text-orange-500 hover:bg-orange-50 rounded-xl transition-all"
                  >
                    <User className="w-5 h-5" />
                  </Link>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-xl transition-all shadow-sm"
                  aria-label="Login"
                >
                  <User className="w-4 h-4" /> Sign In
                </Link>
              )}

              {/* Mobile Menu Icon */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-gray-500 hover:text-orange-500 hover:bg-orange-50 rounded-xl transition-all focus:outline-none"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu panel */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white px-4 py-5 flex flex-col gap-1 text-left">
            <Link href="/shop" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold text-gray-700 hover:text-orange-500 hover:bg-orange-50 px-3 py-2.5 rounded-lg transition-all">Shop All</Link>
            {mockCategories.map((c) => (
              <Link
                key={c.id}
                href={`/category/${c.slug}`}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-semibold text-gray-600 hover:text-orange-500 hover:bg-orange-50 px-3 py-2.5 rounded-lg pl-5 transition-all"
              >
                {c.name}
              </Link>
            ))}
            <Link href="/blog" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold text-gray-700 hover:text-orange-500 hover:bg-orange-50 px-3 py-2.5 rounded-lg transition-all">Insights</Link>
            <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold text-gray-700 hover:text-orange-500 hover:bg-orange-50 px-3 py-2.5 rounded-lg transition-all">About Us</Link>
            <Link href="/faq" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold text-gray-700 hover:text-orange-500 hover:bg-orange-50 px-3 py-2.5 rounded-lg transition-all">Help / Support</Link>
          </div>
        )}
      </header>

      {/* 4. Sliding Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden pointer-events-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-premium-lg flex flex-col"
            >
              {/* Header */}
              <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 bg-orange-100 rounded-xl flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">Your Cart</h3>
                    <p className="text-xs text-gray-400">{cartItemCount} item{cartItemCount !== 1 ? 's' : ''}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl focus:outline-none transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Free shipping banner */}
              {getCartTotal() > 0 && (
                <div className="bg-surface px-6 py-3 border-b border-gray-150 text-xs">
                  {getCartTotal() >= 150 ? (
                    <div className="flex items-center gap-2 text-green-700 font-semibold">
                      <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3" />
                      </div>
                      <span>You qualify for Free Shipping! 🎉</span>
                    </div>
                  ) : (
                    <div>
                      <span className="text-gray-600 text-xs">Add <span className="font-bold text-gray-900">${(150 - getCartTotal()).toFixed(2)}</span> more for free shipping</span>
                      <div className="w-full bg-orange-100 h-1.5 rounded-full mt-2 overflow-hidden">
                        <div
                          className="bg-orange-400 h-full rounded-full transition-all duration-500"
                          style={{ width: `${Math.min((getCartTotal() / 150) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Items List */}
              <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-gray-100">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="w-14 h-14 bg-orange-50 flex items-center justify-center border border-orange-100 mb-4 text-orange-400 rounded-2xl">
                      <ShoppingBag className="w-7 h-7" />
                    </div>
                    <h4 className="text-base font-bold text-gray-900">Your cart is empty</h4>
                    <p className="text-sm text-gray-500 mt-2 max-w-xs leading-relaxed">Looks like you haven&apos;t added anything yet. Explore our curated collection.</p>
                    <Link
                      href="/shop"
                      onClick={() => setIsCartOpen(false)}
                      className="mt-5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
                    >
                      Browse Products
                    </Link>
                  </div>
                ) : (
                  cart.map((item) => {
                    const price = item.product.discountPrice || item.product.price;
                    return (
                      <div key={item.id} className="py-4 flex gap-4 first:pt-0">
                        <img
                          src={item.product.images[0]?.url}
                          alt={item.product.title}
                          className="w-16 h-16 object-cover border border-gray-100 rounded-xl flex-shrink-0"
                        />
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between gap-1">
                              <h5 className="text-xs font-bold text-gray-900 leading-tight line-clamp-1">{item.product.title}</h5>
                              <button
                                onClick={() => {
                                  removeFromCart(item.id);
                                  toast('Removed from Cart', 'info', `${item.product.title} was removed.`);
                                }}
                                className="text-gray-400 hover:text-red-600 focus:outline-none"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <p className="text-[10px] text-gray-400 mt-0.5">{item.product.brand}</p>
                          </div>
                          
                          <div className="flex items-center justify-between mt-2">
                            {/* Quantity Editor */}
                            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="p-1 text-gray-500 hover:text-gray-800 focus:outline-none disabled:opacity-40"
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="px-2 text-xs font-bold text-gray-800 leading-none">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="p-1 text-gray-500 hover:text-gray-800 focus:outline-none disabled:opacity-40"
                                disabled={item.quantity >= item.product.stock}
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            {/* Price */}
                            <span className="text-xs font-bold text-gray-900">${(price * item.quantity).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Checkout panel */}
              {cart.length > 0 && (
                <div className="p-6 border-t border-gray-200 bg-surface">
                  {/* Coupon Area */}
                  {coupon ? (
                    <div className="mb-4 flex items-center justify-between bg-green-50 border border-green-200 rounded-none p-2.5 text-xs text-green-800">
                      <div className="flex items-center gap-1.5">
                        <Check className="w-4 h-4 text-green-600" />
                        <span>Code <strong className="uppercase">{coupon.code}</strong> applied (${getDiscountAmount().toFixed(2)} off)</span>
                      </div>
                      <button
                        onClick={removeCoupon}
                        className="text-[10px] font-bold text-green-700 hover:underline focus:outline-none"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="mb-4 flex gap-2">
                      <input
                        type="text"
                        placeholder="Discount code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-xs bg-white focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 text-gray-900 transition-all"
                      />
                      <button
                        type="submit"
                        className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer shadow-sm"
                      >
                        Apply
                      </button>
                    </form>
                  )}

                  {/* Calculations */}
                  <div className="flex flex-col gap-2.5 text-xs text-gray-600 border-b border-gray-200 pb-4 mb-4">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-bold text-gray-900">${getCartTotal().toFixed(2)}</span>
                    </div>
                    {coupon && (
                      <div className="flex justify-between text-green-700">
                        <span>Discount</span>
                        <span className="font-bold">-${getDiscountAmount().toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span className="font-bold text-gray-900">
                        {getCartTotal() >= 150 ? 'Free' : '$15.00'}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between text-xs mb-5">
                    <span className="font-bold text-gray-900">Estimated Total</span>
                    <span className="font-extrabold text-gray-900 text-sm">${getFinalTotal().toFixed(2)}</span>
                  </div>

                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      router.push('/checkout');
                    }}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow-orange"
                  >
                    Proceed to Checkout
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. Page Content */}
      <main className="flex-1 flex flex-col">{children}</main>

      {/* 6. Premium Responsive Footer */}
      <footer className="bg-gray-900 text-gray-400 select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
            {/* Logo and About */}
            <div className="lg:col-span-2 text-left">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-extrabold text-sm">C</span>
                </div>
                <span className="font-extrabold text-lg tracking-wide text-white">Cartify</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
                Premium gear for creators. We curate the world's finest audio, computing, and lifestyle products.
              </p>
              
              {/* Newsletter Form */}
              <div className="mt-6 max-w-sm">
                <h5 className="font-semibold text-gray-300 text-xs mb-3">Stay in the loop</h5>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    toast('Subscribed!', 'success', 'You have successfully joined our newsletter.');
                  }}
                  className="flex gap-2"
                >
                  <input
                    type="email"
                    required
                    placeholder="your@email.com"
                    className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                  />
                  <button
                    type="submit"
                    className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl px-4 flex items-center justify-center transition-colors cursor-pointer shadow-sm"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>

            {/* Quick Links */}
            <div className="text-left">
              <h5 className="font-semibold text-white text-xs uppercase tracking-widest mb-4">Products</h5>
              <ul className="flex flex-col gap-2.5 text-sm">
                <li><Link href="/shop" className="hover:text-orange-400 transition-colors">All Products</Link></li>
                {mockCategories.map((cat) => (
                  <li key={cat.id}>
                    <Link href={`/category/${cat.slug}`} className="hover:text-orange-400 transition-colors">{cat.name}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company / Info */}
            <div className="text-left">
              <h5 className="font-semibold text-white text-xs uppercase tracking-widest mb-4">Company</h5>
              <ul className="flex flex-col gap-2.5 text-sm">
                <li><Link href="/about" className="hover:text-orange-400 transition-colors">About Us</Link></li>
                <li><Link href="/blog" className="hover:text-orange-400 transition-colors">Insights Blog</Link></li>
                <li><Link href="/contact" className="hover:text-orange-400 transition-colors">Contact Support</Link></li>
                <li><Link href="/faq" className="hover:text-orange-400 transition-colors">FAQs Help</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div className="text-left">
              <h5 className="font-semibold text-white text-xs uppercase tracking-widest mb-4">Legal</h5>
              <ul className="flex flex-col gap-2.5 text-sm">
                <li><Link href="/terms" className="hover:text-orange-400 transition-colors">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-orange-400 transition-colors">Privacy Policy</Link></li>
                <li><Link href="/track-order" className="hover:text-orange-400 transition-colors">Track Orders</Link></li>
              </ul>
            </div>
          </div>

          {/* Bottom Copyright */}
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
            <span className="text-gray-500">&copy; 2026 Cartify Inc. All rights reserved.</span>
            <div className="flex gap-5 text-gray-500">
              <span className="hover:text-orange-400 cursor-pointer transition-colors">Twitter</span>
              <span className="hover:text-orange-400 cursor-pointer transition-colors">Instagram</span>
              <span className="hover:text-orange-400 cursor-pointer transition-colors">LinkedIn</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

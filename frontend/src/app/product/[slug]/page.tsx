'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Star, ShoppingBag, Heart, ShieldCheck, Truck, RefreshCw, Send, Plus, Minus, Info } from 'lucide-react';
import { useCartStore } from '../../../store/cartStore';
import { Accordion } from '../../../components/ui/Accordion';
import { toast } from '../../../components/ui/Toast';
import ProductCard from '../../../components/store/ProductCard';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const router = useRouter();
  const { slug } = React.use(params);
  
  const { products, addToCart, toggleWishlist, isInWishlist, addReview } = useCartStore();

  // Find current product
  const product = useMemo(() => {
    return products.find((p) => p.slug === slug) || products[0];
  }, [products, slug]);

  const isWish = isInWishlist(product.id);

  // Gallery Active Image
  const [activeImgIdx, setActiveImgIdx] = useState(0);

  // Quantity selection
  const [quantity, setQuantity] = useState(1);

  // Variant selections (simulated)
  const [selectedColor, setSelectedColor] = useState('Graphite');
  const [selectedSize, setSelectedSize] = useState('Standard');

  // Review Form state
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [newName, setNewName] = useState('');

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast('Added to Cart', 'success', `${product.title} (${quantity} items) was added.`);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    router.push('/checkout');
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newComment.trim()) {
      toast('Form Incomplete', 'error', 'Please fill out your name and write a comment.');
      return;
    }
    addReview(product.id, newRating, newComment.trim(), newName.trim());
    toast('Review Submitted', 'success', 'Thank you for your feedback!');
    // Reset fields
    setNewComment('');
    setNewName('');
    setNewRating(5);
  };

  // Specs map
  const specItems = product.specifications.map((spec) => ({
    title: spec.label,
    content: <span className="font-semibold text-gray-800">{spec.value}</span>
  }));

  // Similar Products in category
  const related = useMemo(() => {
    return products
      .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
      .slice(0, 3);
  }, [products, product]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 select-none">
        {/* Breadcrumbs */}
        <div className="text-[11px] text-gray-400 mb-8 flex gap-1.5 items-center">
          <Link href="/" className="hover:text-orange-500 transition-colors">Home</Link>
          <span className="text-gray-300">/</span>
          <Link href="/shop" className="hover:text-orange-500 transition-colors">Shop Catalog</Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-600 font-semibold line-clamp-1">{product.title}</span>
        </div>

        {/* 2-Column Detail Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-16">
          
          {/* Left: Gallery Column */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="aspect-square bg-slate-50 border border-gray-100 rounded-3xl overflow-hidden flex items-center justify-center p-8 relative shadow-sm hover:shadow-md transition-all duration-300">
              <img
                src={product.images[activeImgIdx]?.url || product.images[0]?.url}
                alt={product.title}
                className="max-w-full max-h-[85%] object-contain drop-shadow-md hover:scale-105 transition-transform duration-500"
              />
            </div>
            
            {/* Gallery Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={img.id}
                    onClick={() => setActiveImgIdx(idx)}
                    className={`w-20 h-20 bg-slate-50 border rounded-2xl overflow-hidden p-2 focus:outline-none transition-all hover:scale-105 hover:shadow-sm cursor-pointer ${
                      idx === activeImgIdx ? 'border-orange-500 ring-2 ring-orange-500/10' : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <img src={img.thumbnail} alt="" className="w-full h-full object-cover rounded-xl" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info Column */}
          <div className="lg:col-span-5 flex flex-col justify-start">
            <span className="text-[10px] text-orange-500 font-extrabold uppercase tracking-widest block mb-2">{product.brand}</span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight mt-1 mb-4">{product.title}</h1>
            
            {/* Reviews summary */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex text-amber-500">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star
                    key={idx}
                    className={`w-4 h-4 ${idx < Math.round(product.averageRating) ? 'fill-amber-500' : 'text-gray-200'}`}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-gray-800">{product.averageRating}</span>
              <span className="text-gray-300 text-xs">|</span>
              <a href="#reviews" className="text-xs text-gray-500 hover:text-orange-500 font-semibold hover:underline">{product.reviewCount} customer reviews</a>
            </div>

            {/* Pricing details */}
            <div className="border-y border-gray-100 py-5 mb-6">
              {product.discountPrice ? (
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="text-3xl font-extrabold text-gray-900">${product.discountPrice}</span>
                  <span className="text-sm text-gray-400 line-through font-semibold">${product.price}</span>
                  <span className="bg-red-50 text-red-650 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-red-100/50">
                    Save ${(product.price - product.discountPrice).toFixed(0)}
                  </span>
                </div>
              ) : (
                <span className="text-3xl font-extrabold text-gray-900">${product.price}</span>
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-gray-505 leading-relaxed mb-6 font-normal">{product.description}</p>

            {/* Simulated Color variant selectors */}
            <div className="mb-6">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-2.5">Color</span>
              <div className="flex gap-2">
                {['Graphite', 'Silver', 'Sandy Beach'].map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2.5 border text-xs font-bold rounded-xl transition-all focus:outline-none cursor-pointer ${
                      color === selectedColor
                        ? 'border-orange-500 bg-orange-500 text-white shadow-md shadow-orange/10'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700 bg-white hover:bg-slate-50'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Simulated Size variant selectors */}
            <div className="mb-6">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-2.5">Size variant</span>
              <div className="flex gap-2">
                {['Standard', 'Professional Pack (+ $99)'].map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2.5 border text-xs font-bold rounded-xl transition-all focus:outline-none cursor-pointer ${
                      size === selectedSize
                        ? 'border-orange-500 bg-orange-500 text-white shadow-md shadow-orange/10'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700 bg-white hover:bg-slate-50'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Picker & Stock level */}
            <div className="mb-6">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-2.5">Quantity</span>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-200 rounded-xl bg-white overflow-hidden w-28 justify-between shadow-sm focus-within:ring-2 focus-within:ring-orange-100">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 text-gray-500 hover:text-gray-800 disabled:opacity-40 focus:outline-none cursor-pointer hover:bg-slate-50 transition-colors"
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-extrabold text-gray-800 leading-none">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="p-3 text-gray-500 hover:text-gray-800 disabled:opacity-40 focus:outline-none cursor-pointer hover:bg-slate-50 transition-colors"
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div>
                  {product.stock <= 5 ? (
                    <span className="text-[11px] font-bold text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded-lg">Low Stock: Only {product.stock} units left!</span>
                  ) : (
                    <span className="text-[11px] font-bold text-green-700 bg-green-50 border border-green-100 px-2 py-0.5 rounded-lg">In Stock & ready to ship</span>
                  )}
                </div>
              </div>
            </div>

            {/* Purchase CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-6 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md hover:shadow-orange hover:-translate-y-0.5 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-bold py-4 px-6 rounded-xl text-xs flex items-center justify-center transition-all hover:-translate-y-0.5 shadow-sm cursor-pointer"
              >
                Buy Now
              </button>
              <button
                onClick={() => {
                  toggleWishlist(product);
                  toast(isWish ? 'Removed from Wishlist' : 'Saved to Wishlist', 'info', `${product.title} was updated.`);
                }}
                className={`w-14 h-14 border ${
                  isWish ? 'border-red-200 bg-red-50 text-red-500' : 'border-gray-200 hover:border-red-200 hover:bg-red-50 text-gray-400 hover:text-red-500'
                } rounded-xl flex items-center justify-center transition-all focus:outline-none cursor-pointer`}
              >
                <Heart className={`w-5 h-5 ${isWish ? 'fill-red-500 text-red-500' : ''}`} />
              </button>
            </div>

            {/* Fine Specifications Accordion */}
            {product.specifications && (
              <div className="border-t border-gray-100 pt-2 mb-8">
                <Accordion items={specItems} />
              </div>
            )}

            {/* Support assurances */}
            <div className="grid grid-cols-3 gap-4 border border-gray-100 rounded-2xl p-5 bg-slate-50/40 text-center mt-2">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center border border-orange-100/50 mb-2">
                  <Truck className="w-5 h-5 text-orange-500" />
                </div>
                <span className="text-[10px] font-bold text-gray-800 uppercase tracking-wide">Fast Shipping</span>
                <span className="text-[9px] text-gray-400 mt-0.5">2-3 day delivery</span>
              </div>
              <div className="flex flex-col items-center border-x border-gray-200/65 px-2">
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center border border-orange-100/50 mb-2">
                  <RefreshCw className="w-5 h-5 text-orange-500" />
                </div>
                <span className="text-[10px] font-bold text-gray-800 uppercase tracking-wide">30-Day Returns</span>
                <span className="text-[9px] text-gray-400 mt-0.5">Easy exchanges</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center border border-orange-100/50 mb-2">
                  <ShieldCheck className="w-5 h-5 text-orange-500" />
                </div>
                <span className="text-[10px] font-bold text-gray-800 uppercase tracking-wide">Secure Checkout</span>
                <span className="text-[9px] text-gray-400 mt-0.5">Stripe secured</span>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <section id="reviews" className="border-t border-gray-100 pt-16 mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Reviews display list */}
            <div className="lg:col-span-7">
              <h2 className="text-xl font-bold text-gray-900 tracking-tight mb-8">Customer Reviews ({product.reviews.length})</h2>
              
              {product.reviews.length === 0 ? (
                <p className="text-xs text-gray-500 italic py-6">Be the first to review this product!</p>
              ) : (
                <div className="flex flex-col gap-6 divide-y divide-gray-100">
                  {product.reviews.map((rev) => (
                    <div key={rev.id} className="pt-6 first:pt-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs font-bold text-gray-900">{rev.userName}</span>
                        <div className="flex text-amber-500">
                          {Array.from({ length: 5 }).map((_, idx) => (
                            <Star
                              key={idx}
                              className={`w-3 h-3 ${idx < rev.rating ? 'fill-amber-500 text-amber-500' : 'text-gray-200'}`}
                            />
                          ))}
                        </div>
                        <span className="text-[10px] text-gray-400 ml-auto">{rev.createdAt}</span>
                      </div>
                      <p className="text-xs text-gray-650 leading-relaxed">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Write a Review form */}
            <div className="lg:col-span-5 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 mb-4">Write a review</h3>
              <form onSubmit={handleReviewSubmit} className="flex flex-col gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-2">Rating</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((stars) => (
                      <button
                        type="button"
                        key={stars}
                        onClick={() => setNewRating(stars)}
                        className="text-amber-500 focus:outline-none cursor-pointer"
                      >
                        <Star className={`w-6 h-6 transition-all ${stars <= newRating ? 'fill-amber-500 text-amber-500' : 'text-gray-200'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1.5">Your Name</span>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-xs bg-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 text-gray-900 placeholder-gray-400 transition-all"
                  />
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1.5">Comments</span>
                  <textarea
                    required
                    rows={4}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="What did you like or dislike about this gear?"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-xs bg-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 text-gray-900 resize-none placeholder-gray-400 transition-all"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer mt-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  Submit Feedback
                </button>
              </form>
            </div>

          </div>
        </section>

        {/* Related Products grid */}
        {related.length > 0 && (
          <section className="border-t border-gray-100 pt-16">
            <h2 className="text-lg font-bold text-gray-900 tracking-tight mb-8">Related Gear You May Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
  );
}

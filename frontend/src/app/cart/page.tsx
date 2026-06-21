'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, ArrowRight, Trash2, Plus, Minus, Check } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { toast } from '../../components/ui/Toast';

export default function CartPage() {
  const router = useRouter();
  const { cart, removeFromCart, updateQuantity, getCartTotal, getDiscountAmount, getFinalTotal, coupon, applyCoupon, removeCoupon } = useCartStore();
  const [couponCode, setCouponCode] = useState('');

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    const success = applyCoupon(couponCode);
    if (success) {
      toast('Discount Code Applied', 'success', `Coupon code ${couponCode} was applied.`);
      setCouponCode('');
    } else {
      toast('Invalid Code', 'error', 'This coupon is invalid or order amount does not satisfy minimum constraint.');
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 select-none flex-1 flex flex-col justify-start">
        {/* Title */}
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-8 text-left">Shopping Cart</h1>

        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center min-h-[450px] my-auto">
            <div className="max-w-md w-full bg-white border border-dashed border-gray-200 rounded-3xl p-8 md:p-10 shadow-sm text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center border border-orange-100/60 mb-5 text-orange-500">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-gray-900">Your cart is empty</h3>
              <p className="text-xs text-gray-500 mt-2 max-w-sm leading-normal">
                Looks like you haven&apos;t added any products to your bag yet. Head over to our catalog to select premium items.
              </p>
              <Link
                href="/shop"
                className="mt-6 w-full bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold py-3.5 rounded-xl transition-all shadow-sm hover:shadow-orange cursor-pointer text-center block"
              >
                Browse Shop Catalog
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Items List */}
            <div className="lg:col-span-8 border border-gray-100 rounded-2xl bg-white shadow-sm divide-y divide-gray-100 px-6">
              {cart.map((item) => {
                const price = item.product.discountPrice || item.product.price;
                return (
                  <div key={item.id} className="py-6 flex flex-col sm:flex-row gap-4 sm:items-center">
                    <img
                      src={item.product.images[0]?.url}
                      alt={item.product.title}
                      className="w-20 h-20 object-cover rounded-xl border border-gray-100 flex-shrink-0"
                    />
                    <div className="flex-1 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                      <div>
                        <span className="text-[10px] text-orange-500 font-extrabold uppercase tracking-widest">{item.product.brand}</span>
                        <Link href={`/product/${item.product.slug}`} className="block">
                          <h4 className="text-sm font-extrabold text-gray-900 hover:text-orange-500 transition-colors leading-snug line-clamp-2 mt-0.5">{item.product.title}</h4>
                        </Link>
                        {item.product.stock <= 5 && (
                          <span className="text-[9px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded mt-1.5 inline-block">Only {item.product.stock} left in stock</span>
                        )}
                      </div>
                      
                      {/* Quantity & Actions */}
                      <div className="flex items-center justify-between sm:justify-end gap-6">
                        {/* Quantity Counter */}
                        <div className="flex items-center border border-gray-200 rounded-xl bg-white overflow-hidden shadow-sm">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-2 text-gray-500 hover:text-gray-800 focus:outline-none disabled:opacity-40 cursor-pointer"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-3 text-xs font-bold text-gray-800">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-2 text-gray-500 hover:text-gray-800 focus:outline-none disabled:opacity-40 cursor-pointer"
                            disabled={item.quantity >= item.product.stock}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Price */}
                        <span className="text-sm font-extrabold text-gray-900 w-20 text-right">${(price * item.quantity).toFixed(2)}</span>

                        {/* Delete Button */}
                        <button
                          onClick={() => {
                            removeFromCart(item.id);
                            toast('Removed from Cart', 'info', `${item.product.title} was removed.`);
                          }}
                          className="text-gray-400 hover:text-red-600 focus:outline-none transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-4 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <h3 className="text-sm font-extrabold text-gray-900 mb-5">Order Summary</h3>

              {/* Coupon Form */}
              {coupon ? (
                <div className="mb-5 flex items-center justify-between bg-green-50 border border-green-205 rounded-xl p-3 text-xs text-green-800">
                  <div className="flex items-center gap-1.5">
                    <Check className="w-4.5 h-4.5 text-green-600" />
                    <span>Code <strong className="uppercase">{coupon.code}</strong> applied (${getDiscountAmount().toFixed(2)} off)</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-[10px] font-bold text-green-700 hover:underline focus:outline-none cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="mb-5 flex gap-2">
                  <input
                    type="text"
                    placeholder="Promo Code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-xs bg-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 text-gray-900 placeholder-gray-400 transition-all"
                  />
                  <button
                    type="submit"
                    className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm cursor-pointer"
                  >
                    Apply
                  </button>
                </form>
              )}

              {/* Price Calculations */}
              <div className="flex flex-col gap-3 text-xs text-gray-600 border-b border-gray-200 pb-5 mb-5">
                <div className="flex justify-between">
                  <span>Cart Subtotal</span>
                  <span className="font-bold text-gray-900">${getCartTotal().toFixed(2)}</span>
                </div>
                {coupon && (
                  <div className="flex justify-between text-green-700">
                    <span>Discount</span>
                    <span className="font-bold">-${getDiscountAmount().toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping Cost</span>
                  <span className="font-bold text-gray-900">
                    {getCartTotal() >= 150 ? 'Free' : '$15.00'}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-gray-400">
                  <span>Taxes (Estimated)</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between text-xs mb-6">
                <span className="font-bold text-gray-900">Order Total</span>
                <span className="font-extrabold text-gray-950 text-base">${getFinalTotal().toFixed(2)}</span>
              </div>

              <button
                onClick={() => router.push('/checkout')}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold py-4 rounded-xl transition-all shadow-sm hover:shadow-orange flex items-center justify-center gap-1.5 cursor-pointer"
              >
                Checkout Now
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="mt-4 text-center">
                <Link href="/shop" className="text-xs text-orange-500 hover:text-orange-600 font-bold hover:underline">
                  Continue Shopping
                </Link>
              </div>
            </div>

          </div>
        )}
    </div>
  );
}

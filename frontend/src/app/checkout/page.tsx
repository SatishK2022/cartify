'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, ShoppingBag, CreditCard, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { toast } from '../../components/ui/Toast';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, getCartTotal, getDiscountAmount, getFinalTotal, createOrder, clearCart, coupon } = useCartStore();
  const { addresses } = useAuthStore();

  // Address form inputs
  const defaultAddr = addresses.find((a) => a.isDefault) || addresses[0] || {
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    country: 'United States',
  };

  const [form, setForm] = useState({
    email: 'hello@cartify.com',
    fullName: defaultAddr.fullName || '',
    phone: defaultAddr.phone || '',
    addressLine1: defaultAddr.addressLine1 || '',
    addressLine2: defaultAddr.addressLine2 || '',
    city: defaultAddr.city || '',
    state: defaultAddr.state || '',
    pincode: defaultAddr.pincode || '',
    country: defaultAddr.country || 'United States',
  });

  const [card, setCard] = useState({
    name: 'Jane Doe',
    number: '4242 •••• •••• 4242',
    expiry: '12/28',
    cvc: '***',
  });

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'paypal'>('card');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.addressLine1 || !form.city || !form.pincode) {
      toast('Form Incomplete', 'error', 'Please fill in all required shipping details.');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate payment transaction latency (1.5 seconds)
    setTimeout(() => {
      const finalTotal = getFinalTotal();
      const shippingAddress = {
        id: `addr-${Math.random().toString(36).substr(2, 9)}`,
        fullName: form.fullName,
        phone: form.phone,
        addressLine1: form.addressLine1,
        addressLine2: form.addressLine2,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
        country: form.country,
        isDefault: false
      };

      const order = createOrder(cart, shippingAddress, finalTotal);
      clearCart();
      setIsSubmitting(false);
      router.push(`/checkout/success?orderId=${order.id}`);
    }, 1500);
  };

  if (cart.length === 0) {
    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center select-none bg-white">
          <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center border border-orange-100 mb-4 text-orange-500 mx-auto">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h2 className="text-base font-bold text-gray-900">Your Cart is Empty</h2>
          <p className="text-xs text-gray-500 mt-1 mb-6">You need products in your cart to proceed with checkout.</p>
          <Link href="/shop" className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm hover:shadow-orange">
            Browse Store
          </Link>
        </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 select-none">
        
        {/* Back Link */}
        <Link href="/cart" className="text-xs font-bold text-gray-500 hover:text-orange-500 mb-8 inline-flex items-center gap-1.5 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Return to Cart
        </Link>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mt-4">
          
          {/* Left: Contact + Shipping + Card Forms */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* Step 1: Customer Contact info */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-900 mb-4">1. Contact Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1.5">Email Address</span>
                  <input
                    type="email"
                    required
                    name="email"
                    value={form.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-xs bg-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 text-gray-900 transition-all placeholder-gray-400"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1.5">Phone Number</span>
                  <input
                    type="tel"
                    required
                    name="phone"
                    value={form.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-xs bg-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 text-gray-900 transition-all placeholder-gray-400"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Shipping Address */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-900 mb-4">2. Shipping Address</h3>
              
              <div className="flex flex-col gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1.5">Full Name</span>
                  <input
                    type="text"
                    required
                    name="fullName"
                    value={form.fullName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-xs bg-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 text-gray-900 transition-all placeholder-gray-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1.5">Street Address Line 1</span>
                    <input
                      type="text"
                      required
                      name="addressLine1"
                      value={form.addressLine1}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-xs bg-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 text-gray-900 transition-all placeholder-gray-400"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1.5">Apt, Suite, Unit (Optional)</span>
                    <input
                      type="text"
                      name="addressLine2"
                      value={form.addressLine2}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-xs bg-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 text-gray-900 transition-all placeholder-gray-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="col-span-2 sm:col-span-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1.5">City</span>
                    <input
                      type="text"
                      required
                      name="city"
                      value={form.city}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-xs bg-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 text-gray-900 transition-all placeholder-gray-400"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1.5">State / Prov</span>
                    <input
                      type="text"
                      required
                      name="state"
                      value={form.state}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-xs bg-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 text-gray-900 transition-all placeholder-gray-400"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1.5">Postal Code</span>
                    <input
                      type="text"
                      required
                      name="pincode"
                      value={form.pincode}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-xs bg-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 text-gray-900 transition-all placeholder-gray-400"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1.5">Country</span>
                    <input
                      type="text"
                      required
                      name="country"
                      value={form.country}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-xs bg-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 text-gray-950 transition-all placeholder-gray-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Payment Section */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-900 mb-4">3. Payment Information</h3>
              
              <div className="flex gap-3 mb-5">
                {[
                  { id: 'card', label: 'Credit Card', icon: CreditCard },
                  { id: 'paypal', label: 'PayPal', icon: CheckCircle2 },
                ].map((pay) => (
                  <button
                    key={pay.id}
                    type="button"
                    onClick={() => setPaymentMethod(pay.id as any)}
                    className={`flex-1 flex items-center justify-center gap-2 border py-2.5 rounded-xl text-xs font-bold focus:outline-none transition-all cursor-pointer ${
                      paymentMethod === pay.id
                        ? 'border-orange-500 bg-orange-500 text-white shadow-sm shadow-orange/20'
                        : 'border-gray-200 hover:border-gray-300 bg-white text-gray-700'
                    }`}
                  >
                    <pay.icon className="w-4 h-4" />
                    {pay.label}
                  </button>
                ))}
              </div>

              {paymentMethod === 'card' ? (
                <div className="flex flex-col gap-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1.5">Cardholder Name</span>
                    <input
                      type="text"
                      required
                      value={card.name}
                      onChange={(e) => setCard({ ...card, name: e.target.value })}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-xs bg-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 text-gray-900 transition-all placeholder-gray-400"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1.5">Card Number</span>
                    <input
                      type="text"
                      required
                      value={card.number}
                      onChange={(e) => setCard({ ...card, number: e.target.value })}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-xs bg-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 text-gray-900 transition-all placeholder-gray-400"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1.5">Expiration Date</span>
                      <input
                        type="text"
                        required
                        value={card.expiry}
                        onChange={(e) => setCard({ ...card, expiry: e.target.value })}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-xs bg-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 text-gray-900 text-center transition-all placeholder-gray-400"
                        placeholder="MM/YY"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1.5">CVC</span>
                      <input
                        type="text"
                        required
                        value={card.cvc}
                        onChange={(e) => setCard({ ...card, cvc: e.target.value })}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-xs bg-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 text-gray-900 text-center transition-all placeholder-gray-400"
                        placeholder="•••"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-gray-500 py-4 italic text-center bg-slate-50/50 border border-gray-100 rounded-xl">PayPal checkout integration simulated. Click &ldquo;Submit Order&rdquo; to complete.</p>
              )}
            </div>
          </div>

          {/* Right: Order Summary Sidebar */}
          <div className="lg:col-span-5 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-extrabold text-gray-900 mb-5">Your Order</h3>
            
            {/* Products summary list */}
            <div className="flex flex-col gap-3.5 border-b border-gray-200 pb-5 mb-5 max-h-60 overflow-y-auto pr-1">
              {cart.map((item) => {
                const price = item.product.discountPrice || item.product.price;
                return (
                  <div key={item.id} className="flex items-center gap-3">
                    <img
                      src={item.product.images[0]?.url}
                      alt={item.product.title}
                      className="w-10 h-10 object-cover rounded-xl border border-gray-100 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-gray-900 truncate leading-snug">{item.product.title}</h4>
                      <p className="text-[10px] text-gray-400 mt-0.5 font-medium">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-xs font-extrabold text-gray-900">${(price * item.quantity).toFixed(2)}</span>
                  </div>
                );
              })}
            </div>

            {/* Price Calculations */}
            <div className="flex flex-col gap-3 text-xs text-gray-600 border-b border-gray-200 pb-5 mb-5">
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

            <div className="flex justify-between text-xs mb-6">
              <span className="font-bold text-gray-900">Final Total</span>
              <span className="font-extrabold text-gray-950 text-base">${getFinalTotal().toFixed(2)}</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold py-4 rounded-xl transition-all shadow-sm hover:shadow-orange flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Authorizing Payment...' : 'Submit Order'}
            </button>

            <div className="flex items-center gap-2 justify-center text-[10px] text-gray-400 mt-4 font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-green-600" />
              <span>Stripe Secure 256-bit encryption</span>
            </div>
          </div>

        </form>
      </div>
  );
}

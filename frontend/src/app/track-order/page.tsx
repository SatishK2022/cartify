'use client';

import React, { useState } from 'react';
import { Search, MapPin, Calendar, Clock, CheckCircle2 } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';

export default function TrackOrder() {
  const { orders } = useCartStore();
  const [orderId, setOrderId] = useState('');
  const [searchResult, setSearchResult] = useState<any | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;
    
    const found = orders.find((o) => o.id.toLowerCase() === orderId.trim().toLowerCase());
    setSearchResult(found || null);
    setHasSearched(true);
  };

  const steps = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED'];
  const getStepIndex = (status: string) => steps.indexOf(status);

  return (
    <div className="max-w-xl mx-auto px-4 py-16 select-none flex-1 flex flex-col justify-start">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Track Your Order</h1>
          <p className="text-xs text-gray-500 mt-1.5">Enter your Receipt ID to check delivery status and timelines.</p>
        </div>

        {/* Search Input Box */}
        <form onSubmit={handleSearch} className="flex gap-2.5 mb-10 bg-white border border-gray-200 p-2 rounded-xl shadow-sm">
          <div className="relative flex-1 flex items-center">
            <Search className="absolute left-3.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              required
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="e.g. ORD-77382"
              className="w-full pl-10 pr-3 py-2 border-0 bg-transparent text-xs focus:outline-none focus:ring-0 text-gray-900"
            />
          </div>
          <button
            type="submit"
            className="bg-primary hover:bg-gray-800 text-white text-xs font-bold px-5 py-2.5 rounded-lg transition-colors cursor-pointer"
          >
            Track Status
          </button>
        </form>

        {/* Results display */}
        {hasSearched && (
          <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm">
            {searchResult ? (
              <div>
                {/* Header detail */}
                <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-6 text-xs">
                  <div>
                    <span className="text-gray-400">Order ID</span>
                    <h3 className="font-bold text-gray-900 mt-0.5">{searchResult.id}</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-gray-400">Payment Status</span>
                    <span className="bg-green-50 text-green-700 font-bold px-2 py-0.5 rounded-full block text-[10px] mt-0.5 uppercase tracking-wide">
                      {searchResult.paymentStatus}
                    </span>
                  </div>
                </div>

                {/* Tracking Progress Timeline */}
                <div className="flex flex-col gap-6 mb-6">
                  {steps.map((step, idx) => {
                    const currentIdx = getStepIndex(searchResult.status);
                    const isCompleted = idx <= currentIdx;
                    const isActive = idx === currentIdx;

                    return (
                      <div key={step} className="flex gap-4 relative">
                        {/* Connecting Line */}
                        {idx < steps.length - 1 && (
                          <div className={`absolute left-3 top-6 w-0.5 h-10 -ml-px ${isCompleted ? 'bg-accent' : 'bg-gray-200'}`} />
                        )}

                        {/* Node circle */}
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center border font-bold text-[10px] z-10 transition-colors ${
                          isCompleted
                            ? 'bg-accent border-accent text-white'
                            : 'bg-white border-gray-200 text-gray-400'
                        }`}>
                          {isCompleted ? '✓' : idx + 1}
                        </div>

                        {/* Node Text info */}
                        <div>
                          <h4 className={`text-xs font-bold ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                            {step === 'PENDING' ? 'Order Submitted' : step === 'CONFIRMED' ? 'Order Confirmed' : step === 'SHIPPED' ? 'Shipped out' : 'Delivered'}
                          </h4>
                          <p className="text-[10px] text-gray-500 mt-0.5">
                            {step === 'PENDING' ? 'We have received your request.' : step === 'CONFIRMED' ? 'Seller confirmed your checkout.' : step === 'SHIPPED' ? 'Courier picked up package.' : 'Successfully signed by recipient.'}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Delivery Address block */}
                <div className="bg-surface border border-gray-150 rounded-xl p-4 flex gap-3 text-xs text-gray-650">
                  <MapPin className="w-5 h-5 text-gray-450 mt-0.5 flex-shrink-0" />
                  <div>
                    <h5 className="font-bold text-gray-900">Destination Address</h5>
                    <p className="mt-1 leading-normal">
                      {searchResult.shippingAddress.fullName}<br />
                      {searchResult.shippingAddress.addressLine1}, {searchResult.shippingAddress.city}, {searchResult.shippingAddress.state} {searchResult.shippingAddress.pincode}
                    </p>
                  </div>
                </div>

              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-xs text-red-600 font-semibold">Order ID &ldquo;{orderId}&rdquo; was not found.</p>
                <p className="text-[11px] text-gray-500 mt-1">Please double-check your order number and try again. For demo tracking, try using: <span className="font-bold text-gray-800">ORD-77382</span></p>
              </div>
            )}
          </div>
        )}
      </div>
  );
}

'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, ShoppingBag, ArrowRight } from 'lucide-react';

function SuccessPageContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') || 'ORD-99123';

  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center select-none flex-1 flex flex-col justify-center">
      <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center border border-green-100 mx-auto mb-6">
        <CheckCircle2 className="w-8 h-8 text-green-600" />
      </div>
      
      <span className="text-[10px] font-extrabold uppercase tracking-widest text-green-700 bg-green-50 px-3 py-1 rounded-full mb-3 inline-block mx-auto">
        Payment Success
      </span>
      <h1 className="text-2xl font-bold tracking-tight text-gray-900 mt-2">Order Confirmed!</h1>
      <p className="text-xs text-gray-500 mt-2 max-w-sm mx-auto leading-relaxed">
        Thank you for your purchase. We&apos;ve processed your payment and sent a copy of your receipt to <span className="font-semibold text-gray-800">hello@cartify.com</span>.
      </p>

      <div className="bg-surface border border-gray-150 rounded-xl p-4 my-8 text-left">
        <div className="flex justify-between border-b border-gray-200/60 pb-2.5 mb-2.5 text-xs">
          <span className="text-gray-500">Receipt ID</span>
          <span className="font-bold text-gray-900">{orderId}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-500">Shipping Mode</span>
          <span className="font-semibold text-gray-800">Standard Delivery (3-5 days)</span>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Link
          href="/dashboard/orders"
          className="bg-primary hover:bg-gray-800 text-white text-xs font-bold py-3.5 rounded-xl transition-all shadow-premium hover:shadow-premium-md flex items-center justify-center gap-1.5 cursor-pointer"
        >
          Manage Order in Dashboard
        </Link>
        <div className="flex gap-3">
          <Link
            href="/track-order"
            className="flex-1 bg-white border border-gray-205 text-gray-700 hover:bg-gray-50 text-xs font-bold py-3 rounded-xl transition-all text-center"
          >
            Track Order
          </Link>
          <Link
            href="/shop"
            className="flex-1 bg-white border border-gray-205 text-gray-700 hover:bg-gray-50 text-xs font-bold py-3 rounded-xl transition-all text-center"
          >
            Back to Shop
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="max-w-md mx-auto px-4 py-20 text-center select-none flex-1 flex flex-col justify-center">
        <p className="text-xs text-gray-500">Loading order receipt details...</p>
      </div>
    }>
      <SuccessPageContent />
    </Suspense>
  );
}

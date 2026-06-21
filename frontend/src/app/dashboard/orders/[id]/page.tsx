'use client';

import React, { useMemo, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Printer, Truck, Check } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useCartStore } from '@/store/cartStore';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function OrderDetailsPage({ params }: PageProps) {
  const { id } = use(params);
  const { orders } = useCartStore();

  const order = useMemo(() => {
    return orders.find((o) => o.id === id) || orders[0];
  }, [orders, id]);

  if (!order) {
    return (
      <DashboardLayout>
        <p className="text-xs text-gray-500 italic text-left">Order not found.</p>
      </DashboardLayout>
    );
  }

  const steps = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED'];
  const getStepIndex = (status: string) => steps.indexOf(status);

  return (
    <DashboardLayout>
      <div className="text-left select-none w-full">
        {/* Back Link */}
        <div className="flex justify-between items-center mb-6">
          <Link href="/dashboard/orders" className="text-xs font-semibold text-gray-500 hover:text-primary inline-flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Purchases
          </Link>
          <button
            onClick={() => window.print()}
            className="border border-gray-200 hover:bg-gray-50 text-gray-600 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 focus:outline-none transition-colors"
          >
            <Printer className="w-4 h-4" /> Print Invoice
          </button>
        </div>

        {/* Header summary */}
        <div className="bg-gray-50/40 border border-gray-100 rounded-2xl p-5 mb-8 flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Order Reference</span>
            <h3 className="text-sm font-extrabold text-gray-900 mt-0.5">{order.id}</h3>
            <span className="text-[10px] text-gray-400 mt-1 block">Placed on {new Date(order.createdAt).toLocaleDateString()}</span>
          </div>

          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Delivery Status</span>
            <span className={`px-2.5 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-wide border mt-1.5 inline-block ${
              order.status === 'DELIVERED'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-100/50'
                : order.status === 'SHIPPED'
                ? 'bg-blue-50 text-blue-700 border-blue-100/50'
                : 'bg-amber-50 text-amber-700 border-amber-100/50'
            }`}>
              {order.status}
            </span>
          </div>
        </div>

        {/* Visual Progress timeline */}
        <div className="border border-gray-100 rounded-2xl p-6 mb-8 bg-white shadow-sm">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-450 mb-6">Shipping Progress</h4>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 relative">
            {/* Horizontal Line for Desktop */}
            <div className="hidden sm:block absolute left-4 right-4 top-4 h-0.5 bg-gray-100 -z-10" />

            {steps.map((step, idx) => {
              const currentIdx = getStepIndex(order.status);
              const isCompleted = idx <= currentIdx;
              
              return (
                <div key={step} className="flex sm:flex-col items-center gap-3 sm:gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border text-[11px] font-extrabold transition-all duration-150 ${
                    isCompleted
                      ? 'bg-primary border-primary text-white shadow-orange'
                      : 'bg-white border-gray-200 text-gray-400'
                  }`}>
                    {isCompleted ? '✓' : idx + 1}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2-Column Details (Address vs Invoice Summary) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Shipping Address */}
          <div className="border border-gray-100 rounded-2xl p-5 bg-white shadow-sm flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-405 mb-3.5">Shipping Destination</h4>
              <p className="text-xs text-gray-700 leading-relaxed font-medium">
                {order.shippingAddress.fullName}<br />
                {order.shippingAddress.addressLine1}<br />
                {order.shippingAddress.addressLine2 && <>{order.shippingAddress.addressLine2}<br /></>}
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}<br />
                {order.shippingAddress.country}
              </p>
            </div>
          </div>

          {/* Payment Details */}
          <div className="border border-gray-100 rounded-2xl p-5 bg-white shadow-sm">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-405 mb-3.5">Payment Method</h4>
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-gray-55 text-gray-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border border-gray-100">
                Simulated Credit Card
              </span>
              <span className="text-[11px] text-gray-500 font-medium">Ending in 4242</span>
            </div>
            <div className="border-t border-gray-100 pt-3.5 text-xs flex flex-col gap-2">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span className="font-bold text-gray-900">${order.totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Shipping</span>
                <span className="text-green-700 font-bold">Free Shipping</span>
              </div>
              <div className="flex justify-between border-t border-gray-100 pt-2 font-bold text-gray-900">
                <span>Invoice Total</span>
                <span className="font-extrabold">${order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Items Grid */}
        <div className="border border-gray-100 rounded-2xl bg-white shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-950">Package Items ({order.items.length})</h4>
          </div>
          <div className="divide-y divide-gray-100">
            {order.items.map((item) => (
              <div key={item.id} className="p-5 flex items-center gap-4">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-12 h-12 object-cover rounded-xl border border-gray-100 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h5 className="text-xs font-bold text-gray-900 leading-snug truncate">{item.title}</h5>
                  <p className="text-[10px] text-gray-400 mt-0.5">Quantity: {item.quantity}</p>
                </div>
                <span className="text-xs font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}

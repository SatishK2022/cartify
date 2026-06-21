'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useCartStore } from '@/store/cartStore';

export default function CustomerOrders() {
  const { orders } = useCartStore();

  const userOrders = orders.filter((o) => o.userId === 'usr-johndoe' || o.userId === 'usr-default-1');

  return (
    <DashboardLayout>
      <div className="text-left select-none w-full">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900">Your Purchases</h2>
          <p className="text-xs text-gray-500 mt-1">Review invoices and tracking states for your orders.</p>
        </div>

        {userOrders.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-gray-250 rounded-2xl bg-gray-50">
            <ShoppingBag className="w-8 h-8 text-primary/70 mx-auto mb-3" />
            <p className="text-xs text-gray-500 italic">No orders found.</p>
          </div>
        ) : (
          <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100 font-bold text-gray-500 uppercase text-[10px] tracking-wider">
                    <th className="px-5 py-3.5">Order ID</th>
                    <th className="px-5 py-3.5">Date Placed</th>
                    <th className="px-5 py-3.5">Items Count</th>
                    <th className="px-5 py-3.5">Price Total</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-800">
                  {userOrders.map((o) => {
                    const totalQty = o.items.reduce((sum, item) => sum + item.quantity, 0);
                    return (
                      <tr key={o.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-5 py-3.5 font-bold text-gray-900">{o.id}</td>
                        <td className="px-5 py-3.5 text-gray-500">{new Date(o.createdAt).toLocaleDateString()}</td>
                        <td className="px-5 py-3.5 text-gray-650 font-semibold">{totalQty} {totalQty === 1 ? 'item' : 'items'}</td>
                        <td className="px-5 py-3.5 font-bold text-gray-900">${o.totalAmount.toFixed(2)}</td>
                        <td className="px-5 py-3.5">
                          <span className={`px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-wide border ${
                            o.status === 'DELIVERED'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-100/50'
                              : o.status === 'SHIPPED'
                              ? 'bg-blue-50 text-blue-700 border-blue-100/50'
                              : 'bg-amber-50 text-amber-700 border-amber-100/50'
                          }`}>
                            {o.status}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <Link
                            href={`/dashboard/orders/${o.id}`}
                            className="text-primary hover:underline font-bold text-[11px]"
                          >
                            Details
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

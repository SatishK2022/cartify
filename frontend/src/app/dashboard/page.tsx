'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Heart, MapPin, ArrowRight } from 'lucide-react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';

export default function DashboardOverview() {
  const { user, addresses } = useAuthStore();
  const { orders, wishlist } = useCartStore();

  const defaultAddress = addresses.find((a) => a.isDefault) || addresses[0];

  // User orders
  const userOrders = orders.filter((o) => o.userId === 'usr-johndoe' || o.userId === 'usr-default-1');

  return (
    <DashboardLayout>
      <div className="text-left select-none w-full">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900">Welcome Back, {user?.name || 'Customer'}!</h2>
          <p className="text-xs text-gray-500 mt-1">Manage your order timelines, addresses, and account details in one place.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          {/* Card 1 */}
          <div className="border border-gray-100 rounded-2xl p-5 bg-white shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-primary border border-orange-100/60">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Total Orders</span>
              <span className="text-lg font-extrabold text-gray-900 mt-0.5 inline-block">{userOrders.length}</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="border border-gray-100 rounded-2xl p-5 bg-white shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-primary border border-orange-100/60">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Wishlist Items</span>
              <span className="text-lg font-extrabold text-gray-900 mt-0.5 inline-block">{wishlist.length}</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="border border-gray-100 rounded-2xl p-5 bg-white shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-primary border border-orange-100/60">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Default Address</span>
              <span className="text-xs font-bold text-gray-900 truncate block mt-1">
                {defaultAddress ? `${defaultAddress.city}, ${defaultAddress.state}` : 'Not Set'}
              </span>
            </div>
          </div>
        </div>

        {/* Recent Orders table */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-950">Recent Orders</h3>
            <Link href="/dashboard/orders" className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1">
              All Orders <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {userOrders.length === 0 ? (
            <div className="text-center py-8 border border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
              <p className="text-xs text-gray-500 italic">No orders recorded yet.</p>
            </div>
          ) : (
            <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm bg-white">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-gray-50/50 border-b border-gray-100 font-bold text-gray-500 uppercase text-[10px] tracking-wider">
                      <th className="px-5 py-3.5">Order ID</th>
                      <th className="px-5 py-3.5">Date</th>
                      <th className="px-5 py-3.5">Amount</th>
                      <th className="px-5 py-3.5">Status</th>
                      <th className="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-800">
                    {userOrders.slice(0, 3).map((o) => (
                      <tr key={o.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-5 py-3.5 font-semibold text-gray-900">{o.id}</td>
                        <td className="px-5 py-3.5 text-gray-500">{new Date(o.createdAt).toLocaleDateString()}</td>
                        <td className="px-5 py-3.5 font-semibold">${o.totalAmount.toFixed(2)}</td>
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
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

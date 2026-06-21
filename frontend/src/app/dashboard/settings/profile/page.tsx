'use client';

import React, { useState } from 'react';
import { Save, User } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useAuthStore } from '@/store/authStore';
import { toast } from '@/components/ui/Toast';

export default function ProfileSettings() {
  const { user, updateProfile } = useAuthStore();
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    avatar: user?.avatar || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      toast('Form Error', 'error', 'Name and Email are required.');
      return;
    }
    updateProfile({
      name: form.name,
      email: form.email,
      phone: form.phone,
      avatar: form.avatar,
    });
    toast('Profile Saved', 'success', 'Changes updated successfully.');
  };

  return (
    <DashboardLayout>
      <div className="text-left select-none w-full">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900">Personal Details</h2>
          <p className="text-xs text-gray-500 mt-1">Configure name details, phone indicators, and photo settings.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-lg bg-white border border-gray-100 rounded-2xl p-5 md:p-6 shadow-sm">
          {/* Avatar preview */}
          <div className="flex items-center gap-4 border-b border-gray-100 pb-5 mb-1">
            <img
              src={form.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&h=150&fit=crop"}
              alt=""
              className="w-14 h-14 rounded-full object-cover border border-gray-100"
            />
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Avatar Image URL</span>
              <input
                type="text"
                value={form.avatar}
                onChange={(e) => setForm({ ...form, avatar: e.target.value })}
                className="w-64 px-2.5 py-1.5 border border-gray-200 rounded-xl text-[11px] bg-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 text-gray-900 transition-all placeholder-gray-400"
              />
            </div>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1.5">Full Name</span>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-xs bg-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 text-gray-900 transition-all placeholder-gray-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1.5">Email Address</span>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-xs bg-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 text-gray-900 transition-all placeholder-gray-400"
              />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1.5">Phone Number</span>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-xs bg-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 text-gray-900 transition-all placeholder-gray-400"
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-primary hover:bg-primary-dark text-white text-xs font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-2 shadow-orange"
          >
            <Save className="w-3.5 h-3.5" />
            Save Profile
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}

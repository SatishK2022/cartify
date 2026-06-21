'use client';

import React, { useState } from 'react';
import { Plus, Trash2, MapPin, Check, PlusCircle } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useAuthStore } from '@/store/authStore';
import { Dialog } from '@/components/ui/Dialog';
import { toast } from '@/components/ui/Toast';

export default function CustomerAddresses() {
  const { addresses, addAddress, deleteAddress, setDefaultAddress } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);

  // Form states
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    country: 'United States',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.addressLine1 || !form.city || !form.pincode) {
      toast('Form Error', 'error', 'Please fill out all required fields.');
      return;
    }
    
    addAddress({
      fullName: form.fullName,
      phone: form.phone,
      addressLine1: form.addressLine1,
      addressLine2: form.addressLine2,
      city: form.city,
      state: form.state,
      pincode: form.pincode,
      country: form.country,
      isDefault: false
    });

    toast('Address Added', 'success', 'New address added.');
    setIsOpen(false);
    // Reset
    setForm({
      fullName: '',
      phone: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      pincode: '',
      country: 'United States'
    });
  };

  return (
    <DashboardLayout>
      <div className="text-left select-none w-full">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Delivery Addresses</h2>
            <p className="text-xs text-gray-500 mt-1">Manage delivery locations and defaults for checkout.</p>
          </div>
          <button
            onClick={() => setIsOpen(true)}
            className="bg-primary hover:bg-primary-dark text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors flex items-center gap-1.5 focus:outline-none cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Location
          </button>
        </div>

        {/* Modal Dialog Form */}
        <Dialog isOpen={isOpen} onClose={() => setIsOpen(false)} title="New Delivery Address">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Full Name</span>
              <input
                type="text"
                required
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-xs bg-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 text-gray-900 transition-all placeholder-gray-400"
              />
            </div>
            
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Phone Number</span>
              <input
                type="tel"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-xs bg-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 text-gray-900 transition-all placeholder-gray-400"
              />
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Street Address Line 1</span>
              <input
                type="text"
                required
                value={form.addressLine1}
                onChange={(e) => setForm({ ...form, addressLine1: e.target.value })}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-xs bg-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 text-gray-900 transition-all placeholder-gray-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">City</span>
                <input
                  type="text"
                  required
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-xs bg-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 text-gray-900 transition-all placeholder-gray-400"
                />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Postal Code</span>
                <input
                  type="text"
                  required
                  value={form.pincode}
                  onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-xs bg-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 text-gray-900 transition-all placeholder-gray-400"
                />
              </div>
            </div>

            <button
              type="submit"
              className="bg-primary hover:bg-primary-dark text-white text-xs font-bold py-3 rounded-xl transition-all cursor-pointer text-center mt-2 shadow-orange"
            >
              Add Address
            </button>
          </form>
        </Dialog>

        {/* Address List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`border rounded-2xl p-5 shadow-sm bg-white flex flex-col justify-between hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 ${
                addr.isDefault ? 'border-primary ring-2 ring-orange-100/50' : 'border-gray-100'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[9px] font-bold uppercase tracking-wider bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-lg text-gray-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" /> Address Card
                  </span>
                  
                  {addr.isDefault && (
                    <span className="text-[9px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-lg border border-emerald-100/50 flex items-center gap-0.5">
                      <Check className="w-3.5 h-3.5" /> Default
                    </span>
                  )}
                </div>

                <h4 className="text-xs font-bold text-gray-900">{addr.fullName}</h4>
                <p className="text-xs text-gray-505 mt-2 leading-relaxed">
                  {addr.addressLine1}<br />
                  {addr.addressLine2 && <>{addr.addressLine2}<br /></>}
                  {addr.city}, {addr.state} {addr.pincode}<br />
                  {addr.country}
                </p>
                <span className="text-[10px] text-gray-450 mt-2 block font-medium">Tel: {addr.phone}</span>
              </div>

              {/* Actions */}
              <div className="flex justify-between items-center mt-5 pt-4 border-t border-gray-100">
                {!addr.isDefault ? (
                  <button
                    onClick={() => {
                      setDefaultAddress(addr.id);
                      toast('Default Address Updated', 'info');
                    }}
                    className="text-[10px] font-bold text-primary hover:underline focus:outline-none cursor-pointer"
                  >
                    Set as Default
                  </button>
                ) : (
                  <span className="text-[10px] text-gray-400 font-semibold italic">Default Billing Target</span>
                )}

                <button
                  onClick={() => {
                    deleteAddress(addr.id);
                    toast('Address Deleted', 'info');
                  }}
                  className="text-gray-400 hover:text-red-650 focus:outline-none transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

'use client';

import React, { useState } from 'react';
import { ShieldCheck, KeyRound } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { toast } from '@/components/ui/Toast';

export default function SecuritySettings() {
  const [currPass, setCurrPass] = useState('••••••••');
  const [newPass, setNewPass] = useState('');
  const [confirmNew, setConfirmNew] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPass || newPass !== confirmNew) {
      toast('Verification Error', 'error', 'Passwords do not match.');
      return;
    }
    toast('Credentials Updated', 'success', 'Your password was changed.');
    setNewPass('');
    setConfirmNew('');
  };

  return (
    <DashboardLayout>
      <div className="text-left select-none w-full">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900">Security Credentials</h2>
          <p className="text-xs text-gray-500 mt-1">Configure account password settings and MFA settings.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-lg bg-white border border-gray-100 rounded-2xl p-5 md:p-6 shadow-sm">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1.5">Current Password</span>
            <input
              type="password"
              required
              value={currPass}
              onChange={(e) => setCurrPass(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-xs bg-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 text-gray-900 transition-all placeholder-gray-400"
            />
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1.5">New Password</span>
            <input
              type="password"
              required
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-xs bg-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 text-gray-900 transition-all placeholder-gray-400"
            />
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1.5">Confirm New Password</span>
            <input
              type="password"
              required
              value={confirmNew}
              onChange={(e) => setConfirmNew(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-xs bg-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 text-gray-900 transition-all placeholder-gray-400"
            />
          </div>

          <button
            type="submit"
            className="bg-primary hover:bg-primary-dark text-white text-xs font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-2 shadow-orange"
          >
            <KeyRound className="w-3.5 h-3.5" />
            Update Credentials
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, Save } from 'lucide-react';
import { toast } from '../../../components/ui/Toast';

export default function ResetPassword() {
  const router = useRouter();
  const [pass, setPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pass || pass !== confirmPass) {
      toast('Passwords Mismatch', 'error', 'Passwords do not match. Please verify.');
      return;
    }
    toast('Password Updated', 'success', 'You can now log in with your new password.');
    router.push('/login');
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-20 select-none flex-1 flex flex-col justify-center">
      
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-md text-left">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Reset Password</h2>
          <p className="text-xs text-gray-500 mt-1">Configure your new account password.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1.5">New Password</span>
            <div className="relative flex items-center">
              <Lock className="absolute left-3 w-4 h-4 text-gray-400" />
              <input
                type="password"
                required
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none focus:border-primary text-gray-900"
              />
            </div>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1.5">Confirm Password</span>
            <div className="relative flex items-center">
              <Lock className="absolute left-3 w-4 h-4 text-gray-400" />
              <input
                type="password"
                required
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none focus:border-primary text-gray-900"
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-primary hover:bg-gray-800 text-white text-xs font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer mt-2"
          >
            <Save className="w-3.5 h-3.5" />
            Save Credentials
          </button>
        </form>
      </div>
    </div>
  );
}

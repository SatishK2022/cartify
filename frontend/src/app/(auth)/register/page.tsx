'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Mail, Lock, UserPlus } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import { toast } from '../../../components/ui/Toast';

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      toast('Form Error', 'error', 'All fields are required.');
      return;
    }
    
    // Simulate successful account creation and OTP redirection
    toast('Account Registered', 'success', 'Verification code sent.');
    router.push(`/verify-otp?email=${encodeURIComponent(form.email)}`);
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-20 select-none flex-1 flex flex-col justify-center">
      
      <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm text-left">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Create Profile</h2>
          <p className="text-xs text-gray-500 mt-1">Get started with a clean, tactile storefront.</p>
        </div>

        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1.5">Full Name</span>
            <div className="relative flex items-center">
              <User className="absolute left-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-xs bg-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 text-gray-900 placeholder-gray-400 transition-all"
              />
            </div>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1.5">Email Address</span>
            <div className="relative flex items-center">
              <Mail className="absolute left-3 w-4 h-4 text-gray-400" />
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-xs bg-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 text-gray-900 placeholder-gray-400 transition-all"
              />
            </div>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1.5">Password</span>
            <div className="relative flex items-center">
              <Lock className="absolute left-3 w-4 h-4 text-gray-400" />
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-xs bg-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 text-gray-900 placeholder-gray-400 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold py-3.5 rounded-xl transition-all shadow-sm hover:shadow-orange flex items-center justify-center gap-1.5 cursor-pointer mt-2"
          >
            <UserPlus className="w-3.5 h-3.5" />
            Register Account
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-gray-500">
          Already have an account?{' '}
          <Link href="/login" className="text-orange-500 hover:text-orange-600 font-bold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

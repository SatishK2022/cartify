'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, KeyRound, ArrowLeft } from 'lucide-react';
import { toast } from '../../../components/ui/Toast';

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    toast('Reset Link Sent', 'success', `Recovery email was dispatched to ${email}.`);
    // Redirect to reset password page directly for testing
    router.push('/reset-password');
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-20 select-none flex-1 flex flex-col justify-center">
      
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm text-left">
        <Link href="/login" className="text-[10px] font-bold text-gray-500 hover:text-primary mb-5 inline-flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
        </Link>
        
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Forgot Password?</h2>
          <p className="text-xs text-gray-500 mt-1">Provide your email, and we will send instructions.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1.5">Email Address</span>
            <div className="relative flex items-center">
              <Mail className="absolute left-3 w-4 h-4 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hello@cartify.com"
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none focus:border-primary text-gray-900"
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-primary hover:bg-gray-800 text-white text-xs font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer mt-2"
          >
            <KeyRound className="w-3.5 h-3.5" />
            Send Reset Code
          </button>
        </form>
      </div>
    </div>
  );
}

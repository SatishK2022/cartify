'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, Mail, Lock, LogIn } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import { toast } from '../../../components/ui/Toast';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [email, setEmail] = useState('hello@cartify.com');
  const [password, setPassword] = useState('••••••••');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast('Form Error', 'error', 'Please fill out all fields.');
      return;
    }
    
    login(email.trim(), 'USER');
    toast('Logged In', 'success', `Welcome back, ${email}!`);
    router.push('/dashboard');
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-20 select-none flex-1 flex flex-col justify-center">
        {/* Main Card */}
        <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm text-left">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">Welcome Back</h2>
            <p className="text-xs text-gray-500 mt-1">Sign in to your Cartify customer profile.</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1.5">Email Address</span>
              <div className="relative flex items-center">
                <Mail className="absolute left-3 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-xs bg-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 text-gray-900 placeholder-gray-400 transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Password</span>
                <Link href="/forgot-password" className="text-[10px] text-orange-500 hover:text-orange-600 hover:underline font-bold">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative flex items-center">
                <Lock className="absolute left-3 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-xs bg-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 text-gray-900 placeholder-gray-400 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold py-3.5 rounded-xl transition-all shadow-sm hover:shadow-orange flex items-center justify-center gap-1.5 cursor-pointer mt-2"
            >
              <LogIn className="w-3.5 h-3.5" />
              Sign In
            </button>
          </form>

          {/* Quick Mock Login helper for evaluation */}
          <div className="mt-6 border-t border-gray-100 pt-5 text-center">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-3">Quick Mock Login</span>
            <button
              onClick={() => {
                setEmail('hello@cartify.com');
                login('hello@cartify.com', 'USER');
                toast('Logged In as Customer', 'success');
                router.push('/dashboard');
              }}
              className="w-full bg-slate-50 hover:bg-slate-100 border border-gray-200 rounded-xl py-2.5 text-[10px] font-bold text-gray-750 focus:outline-none transition-all cursor-pointer"
            >
              Sign In as Demo Customer
            </button>
          </div>

          <div className="mt-6 text-center text-xs text-gray-500">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-orange-500 hover:text-orange-600 font-bold hover:underline">
              Create one
            </Link>
          </div>
        </div>
      </div>
  );
}

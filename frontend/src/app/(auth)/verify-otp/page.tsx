'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import { toast } from '../../../components/ui/Toast';

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || 'hello@cartify.com';
  
  const { login } = useAuthStore();
  const [code, setCode] = useState(['', '', '', '']);

  const handleCodeChange = (idx: number, val: string) => {
    if (val.length > 1) return;
    const newCode = [...code];
    newCode[idx] = val;
    setCode(newCode);

    // Auto focus next input
    if (val && idx < 3) {
      const nextInput = document.getElementById(`otp-${idx + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const finalCode = code.join('');
    if (finalCode.length < 4) {
      toast('Invalid Code', 'error', 'Please fill out all digit boxes.');
      return;
    }
    
    // Log in the user and redirect to customer dashboard
    login(email, 'USER');
    toast('Account Verified!', 'success', 'Welcome to Cartify!');
    router.push('/dashboard');
  };

  return (
    <div className="bg-white rounded-2xl p-6 md:p-8 shadow-md text-left">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">Enter Code</h2>
        <p className="text-xs text-gray-500 mt-1">We sent a 4-digit code to <span className="font-semibold text-gray-800">{email}</span>.</p>
      </div>

      <form onSubmit={handleVerify} className="flex flex-col gap-5">
        <div className="flex gap-3 justify-center">
          {code.map((digit, idx) => (
            <input
              key={idx}
              id={`otp-${idx}`}
              type="text"
              required
              maxLength={1}
              value={digit}
              onChange={(e) => handleCodeChange(idx, e.target.value)}
              className="w-14 h-14 border border-gray-200 rounded-xl text-center font-extrabold text-lg bg-gray-50 text-gray-900 focus:outline-none focus:border-primary focus:bg-white transition-all"
            />
          ))}
        </div>

        <button
          type="submit"
          className="bg-primary hover:bg-gray-800 text-white text-xs font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer mt-2"
        >
          Verify OTP Code
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <div className="mt-6 text-center text-xs text-gray-500">
        Didn&apos;t receive code?{' '}
        <button
          onClick={() => toast('Code Resent', 'info', 'A new code has been dispatched.')}
          className="text-accent font-bold hover:underline focus:outline-none"
        >
          Resend Code
        </button>
      </div>
    </div>
  );
}

export default function VerifyOtp() {
  return (
    <div className="w-full max-w-md mx-auto px-4 py-20 select-none flex-1 flex flex-col justify-center">
      <Suspense fallback={
        <div className="bg-white border border-gray-150 rounded-2xl p-6 md:p-8 shadow-sm text-center">
          <p className="text-xs text-gray-500">Loading verification session...</p>
        </div>
      }>
        <VerifyOtpContent />
      </Suspense>
    </div>
  );
}

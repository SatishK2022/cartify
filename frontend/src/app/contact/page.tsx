'use client';

import React, { useState } from 'react';
import { Mail, MapPin, Phone, Send } from 'lucide-react';
import { toast } from '../../components/ui/Toast';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast('Form Incomplete', 'error', 'Please fill in all fields.');
      return;
    }
    toast('Message Received', 'success', 'Our team will contact you back inside 24 hours.');
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 select-none flex-1 flex flex-col justify-start">
        <div className="text-center mb-12">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Get In Touch</h1>
          <p className="text-xs text-gray-500 mt-1.5">Have questions about orders, technical specs, or custom builds?</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch max-w-4xl mx-auto w-full">
          
          {/* Left: Contact Info cards */}
          <div className="lg:col-span-5 flex flex-col gap-6 justify-between bg-surface border border-gray-150 rounded-2xl p-6">
            <div className="flex flex-col gap-6">
              <div className="flex gap-4">
                <Mail className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wide">Email Support</h4>
                  <p className="text-xs text-gray-500 mt-1">support@cartify.com</p>
                </div>
              </div>

              <div className="flex gap-4">
                <Phone className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wide">Phone Office</h4>
                  <p className="text-xs text-gray-500 mt-1">+1 (555) 019-2834</p>
                </div>
              </div>

              <div className="flex gap-4">
                <MapPin className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wide">Studio Address</h4>
                  <p className="text-xs text-gray-500 mt-1 leading-normal">
                    120 Stripe Way, Suite 400<br />
                    San Francisco, CA 94103
                  </p>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200/60 pt-4 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
              Cartify Support Hours: 9am - 6pm PST
            </div>
          </div>

          {/* Right: Message Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-7 bg-white border border-gray-150 rounded-2xl p-6 flex flex-col gap-4 shadow-sm">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1.5">Full Name</span>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none focus:border-primary text-gray-900"
              />
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1.5">Email Address</span>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none focus:border-primary text-gray-900"
              />
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1.5">Message</span>
              <textarea
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none focus:border-primary text-gray-900 resize-none"
                placeholder="Write your query details..."
              />
            </div>

            <button
              type="submit"
              className="bg-primary hover:bg-gray-800 text-white text-xs font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer mt-2"
            >
              <Send className="w-3.5 h-3.5" />
              Send Message
            </button>
          </form>

        </div>
    </div>
  );
}

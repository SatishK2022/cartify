'use client';

import React, { createRef } from 'react';
import { create } from 'zustand';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: ToastType;
}

interface ToastStore {
  toasts: ToastMessage[];
  addToast: (title: string, type: ToastType, description?: string) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (title, type, description) => set((state) => {
    const id = Math.random().toString(36).substring(2, 9);
    // Auto remove after 4 seconds
    setTimeout(() => {
      set((curr) => ({ toasts: curr.toasts.filter((t) => t.id !== id) }));
    }, 4000);
    return { toasts: [...state.toasts, { id, title, type, description }] };
  }),
  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

export function toast(title: string, type: ToastType = 'info', description?: string) {
  useToastStore.getState().addToast(title, type, description);
}

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 w-full max-w-sm pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => {
          const Icon = t.type === 'success' ? CheckCircle2 : t.type === 'error' ? AlertCircle : Info;
          const bgColors = {
            success: 'bg-white border-green-200 text-green-800 shadow-premium',
            error: 'bg-white border-red-200 text-red-800 shadow-premium',
            info: 'bg-white border-gray-200 text-gray-800 shadow-premium',
          };
          const iconColors = {
            success: 'text-green-600',
            error: 'text-red-600',
            info: 'text-accent',
          };

          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: -5 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className={`flex items-start gap-3 p-4 border rounded-lg shadow-premium-md pointer-events-auto ${bgColors[t.type]}`}
            >
              <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${iconColors[t.type]}`} />
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900 leading-snug">{t.title}</p>
                {t.description && (
                  <p className="text-xs text-gray-500 mt-1 leading-normal">{t.description}</p>
                )}
              </div>
              <button
                onClick={() => removeToast(t.id)}
                className="text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

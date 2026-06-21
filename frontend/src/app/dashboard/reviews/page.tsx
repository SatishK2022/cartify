'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { Star, MessageSquare } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useCartStore } from '@/store/cartStore';

export default function CustomerReviews() {
  const { products } = useCartStore();

  // Find all reviews written by user with id 'usr-johndoe' or 'usr-default-1'
  const userReviews = useMemo(() => {
    const list: Array<{ productTitle: string; productSlug: string; rating: number; comment: string; date: string; id: string }> = [];
    products.forEach((p) => {
      p.reviews.forEach((r) => {
        if (r.userId === 'usr-johndoe' || r.userId === 'usr-default-1') {
          list.push({
            id: r.id,
            productTitle: p.title,
            productSlug: p.slug,
            rating: r.rating,
            comment: r.comment,
            date: r.createdAt
          });
        }
      });
    });
    return list;
  }, [products]);

  return (
    <DashboardLayout>
      <div className="text-left select-none w-full">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900">Your Product Feedback</h2>
          <p className="text-xs text-gray-500 mt-1">Review feedback, rating summaries, and comments you posted.</p>
        </div>

        {userReviews.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-gray-200 rounded-2xl bg-gray-50">
            <MessageSquare className="w-8 h-8 text-primary/70 mx-auto mb-3" />
            <p className="text-xs text-gray-500 italic">No reviews written yet.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {userReviews.map((rev) => (
              <div key={rev.id} className="border border-gray-100 rounded-2xl p-5 bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center justify-between mb-3">
                  <Link href={`/product/${rev.productSlug}`} className="text-xs font-bold text-gray-900 hover:text-primary transition-colors leading-tight">
                    {rev.productTitle}
                  </Link>
                  <span className="text-[10px] text-gray-400">{rev.date}</span>
                </div>

                <div className="flex text-amber-500 mb-2">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star
                      key={idx}
                      className={`w-3.5 h-3.5 ${idx < rev.rating ? 'fill-amber-500' : 'text-gray-200'}`}
                    />
                  ))}
                </div>

                <p className="text-xs text-gray-650 leading-relaxed font-medium mt-1">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

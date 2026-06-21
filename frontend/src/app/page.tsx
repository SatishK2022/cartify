'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ArrowLeft, Star, Flame, ShieldCheck, Truck, RefreshCw, Zap, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import ProductCard from '../components/store/ProductCard';
import { toast } from '../components/ui/Toast';

export default function Home() {
  const { products } = useCartStore();

  const [timeLeft, setTimeLeft] = useState({ hours: 8, minutes: 42, seconds: 15 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 0, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const featured = products.filter((p) => p.featured);
  const bestSellers = products.filter((p) => p.bestSeller);

  // ── Hero Carousel ─────────────────────────────────────────────
  const heroSlides = [
    {
      id: 0,
      badge: 'New Arrivals 2026',
      eyebrow: 'Audio',
      heading: 'Sound Without\nCompromise.',
      highlight: 'Without',
      sub: 'Professional-grade synthesizers and headphones for artists who refuse to settle.',
      cta: { label: 'Shop Audio', href: '/category/audio' },
      img: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1600&fit=crop',
      thumb: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=120&fit=crop',
      alt: 'OP-1 Field Synthesizer',
    },
    {
      id: 1,
      badge: 'Flash Deal — Save $100',
      eyebrow: 'Computing',
      heading: 'Your Best Work\nStarts Here.',
      highlight: 'Best',
      sub: 'Apple Studio Display 5K with Spatial Audio. The monitor that transforms your workspace.',
      cta: { label: 'Shop Computing', href: '/category/computing' },
      img: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=1600&fit=crop',
      thumb: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=120&fit=crop',
      alt: 'Apple Studio Display',
    },
    {
      id: 2,
      badge: 'Best Seller — Over 340 Sold',
      eyebrow: 'Headphones',
      heading: 'Silence the World.\nHear Everything.',
      highlight: 'Silence',
      sub: 'Sony WH-1000XM5 with industry-leading ANC and 30-hour battery life.',
      cta: { label: 'Shop Headphones', href: '/product/sony-wh1000xm5' },
      img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1600&fit=crop',
      thumb: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=120&fit=crop',
      alt: 'Sony WH-1000XM5',
    },
  ];

  const [activeSlide, setActiveSlide] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  const goTo = useCallback((idx: number) => {
    setDirection(idx > activeSlide ? 1 : -1);
    setActiveSlide(idx);
  }, [activeSlide]);

  const next = useCallback(() => {
    const n = (activeSlide + 1) % heroSlides.length;
    setDirection(1);
    setActiveSlide(n);
  }, [activeSlide, heroSlides.length]);

  const prev = useCallback(() => {
    const n = (activeSlide - 1 + heroSlides.length) % heroSlides.length;
    setDirection(-1);
    setActiveSlide(n);
  }, [activeSlide, heroSlides.length]);

  useEffect(() => {
    if (isPaused) return;
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [next, isPaused]);

  return (
    <>

      {/* ── 1. Hero Carousel ─────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden select-none bg-black"
        style={{ height: 'min(85vh, 580px)' }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* ── Full-bleed background images (crossfade) ── */}
        <AnimatePresence initial={false}>
          <motion.div
            key={heroSlides[activeSlide].id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: 'easeInOut' }}
            className="absolute inset-0"
          >
            <img
              src={heroSlides[activeSlide].img}
              alt={heroSlides[activeSlide].alt}
              className="w-full h-full object-cover"
            />
            {/* Dark overlay — gradient from bottom-left for legibility */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-black/10" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* ── Text content ── */}
        <div className="relative z-10 h-full flex flex-col justify-center px-8 sm:px-12 lg:px-20 max-w-7xl mx-auto w-full pt-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="max-w-xl"
            >
              {/* Eyebrow */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-5 h-0.5 bg-orange-500" />
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-orange-400">
                  {heroSlides[activeSlide].eyebrow}
                </span>
                <span className="text-[11px] font-semibold text-white/50 uppercase tracking-widest">
                  {heroSlides[activeSlide].badge}
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-white mb-4 whitespace-pre-line">
                {heroSlides[activeSlide].heading.split('\n').map((line, i) =>
                  line.includes(heroSlides[activeSlide].highlight)
                    ? <span key={i} className="block text-orange-400">{line}</span>
                    : <span key={i} className="block">{line}</span>
                )}
              </h1>

              {/* Sub */}
              <p className="text-sm sm:text-base text-white/70 max-w-sm leading-relaxed mb-8">
                {heroSlides[activeSlide].sub}
              </p>

              {/* CTAs */}
              <div className="flex gap-3 flex-wrap">
                <Link
                  href={heroSlides[activeSlide].cta.href}
                  className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold px-7 py-3.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5"
                  style={{ boxShadow: '0 4px 20px rgba(234,88,12,0.45)' }}
                >
                  {heroSlides[activeSlide].cta.label}
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/25 text-white text-sm font-semibold px-7 py-3.5 rounded-xl backdrop-blur-sm transition-all duration-200"
                >
                  Browse All
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Slide thumbnail strip (bottom-right) ── */}
        <div className="absolute bottom-8 right-8 sm:right-12 lg:right-20 z-10 flex gap-3 items-end">
          {heroSlides.map((slide, idx) => (
            <button
              key={idx}
              onClick={() => goTo(idx)}
              className={`group relative overflow-hidden rounded-sm cursor-pointer transition-all duration-300 border-b-2 ${
                idx === activeSlide
                  ? 'w-16 h-12 border-orange-500 opacity-100'
                  : 'w-12 h-8 border-transparent opacity-50 hover:opacity-75 hover:border-white/30'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            >
              <img
                src={slide.thumb}
                alt={slide.alt}
                className="w-full h-full object-cover"
              />
              <div className={`absolute inset-0 bg-black/30 transition-opacity ${idx === activeSlide ? 'opacity-0' : 'opacity-100'}`} />
            </button>
          ))}
        </div>

        {/* ── Slide counter ── */}
        <div className="absolute top-8 right-8 sm:right-12 lg:right-20 z-10 flex items-center gap-1.5 text-white/60">
          <span className="text-lg font-bold text-white leading-none">{String(activeSlide + 1).padStart(2,'0')}</span>
          <span className="text-white/30 text-sm">/</span>
          <span className="text-sm">{String(heroSlides.length).padStart(2,'0')}</span>
        </div>

        {/* ── Prev / Next arrows ── */}
        <button
          onClick={prev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full flex items-center justify-center backdrop-blur-sm transition-all cursor-pointer"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        <button
          onClick={next}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full flex items-center justify-center backdrop-blur-sm transition-all cursor-pointer"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </button>

        {/* ── Progress bar ── */}
        <div className="absolute bottom-0 left-0 h-0.5 bg-white/10 w-full z-10">
          {!isPaused && (
            <motion.div
              key={activeSlide}
              className="h-full bg-orange-500"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 5, ease: 'linear' }}
            />
          )}
        </div>
      </section>



      {/* ── 2. Value Props ───────────────────────────────────────────── */}
      <section className="bg-white border-y border-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Truck className="w-5 h-5 text-orange-500" />, title: 'Free Shipping', desc: 'On all orders over $150' },
              { icon: <ShieldCheck className="w-5 h-5 text-orange-500" />, title: '1-Year Warranty', desc: 'Full coverage on hardware' },
              { icon: <RefreshCw className="w-5 h-5 text-orange-500" />, title: '30-Day Returns', desc: 'Hassle-free refunds' },
              { icon: <Star className="w-5 h-5 text-orange-500" />, title: 'Top Rated', desc: '4.9/5 from 12k+ reviews' },
            ].map((item, idx) => (
              <div key={idx} className={`flex items-center gap-3 ${idx > 0 ? 'border-l border-gray-100 pl-6' : ''}`}>
                <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">{item.title}</h4>
                  <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. Categories ────────────────────────────────────────────── */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-2">Collections</p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Shop by Category</h2>
            </div>
            <Link href="/shop" className="inline-flex items-center gap-1 text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {[
              { name: 'Audio Gear', slug: 'audio', count: 12, emoji: '🎧', bg: 'from-orange-400 to-red-400', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=400&fit=crop' },
              { name: 'Computing', slug: 'computing', count: 8, emoji: '💻', bg: 'from-blue-500 to-indigo-500', img: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=400&fit=crop' },
              { name: 'Wearables', slug: 'wearables', count: 6, emoji: '⌚', bg: 'from-emerald-400 to-teal-500', img: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?q=80&w=400&fit=crop' },
              { name: 'Accessories', slug: 'accessories', count: 15, emoji: '🎛️', bg: 'from-purple-400 to-pink-400', img: 'https://images.unsplash.com/photo-1622445262465-2481c4574875?q=80&w=400&fit=crop' },
            ].map((c) => (
              <Link
                key={c.slug}
                href={`/category/${c.slug}`}
                className="group relative rounded-2xl overflow-hidden aspect-[4/3] block shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <img src={c.img} alt={c.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-4">
                  <h4 className="text-white font-bold text-sm">{c.name}</h4>
                  <p className="text-white/70 text-xs mt-0.5">{c.count} items</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Featured Collections ──────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-2">Handpicked</p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Featured Collections</h2>
            </div>
            <Link href="/shop" className="inline-flex items-center gap-1 text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors">
              Explore Store <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. Best Sellers ──────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-2">Top Picks</p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Best Sellers</h2>
            </div>
            <Link href="/shop" className="inline-flex items-center gap-1 text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bestSellers.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. Brand Partners ────────────────────────────────────────── */}
      <section className="py-14 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-10">Trusted Partners & Brands</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
            {[
              { name: 'Apple', logo: '' },
              { name: 'Teenage Engineering', logo: 'T.E.' },
              { name: 'Sony Audio', logo: 'SONY' },
              { name: 'Keychron', logo: 'KEYCHRON' },
              { name: 'Nomad Goods', logo: 'NOMAD' },
            ].map((brand, idx) => (
              <div key={idx} className="bg-white border border-gray-200 rounded-xl py-6 px-4 flex flex-col items-center justify-center hover:border-orange-300 hover:shadow-md transition-all duration-200">
                <span className="text-sm font-black text-gray-800 tracking-wider font-mono">{brand.logo}</span>
                <span className="text-[10px] font-semibold text-gray-400 mt-2 uppercase tracking-wider">{brand.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. CTA / Editorial Banner ────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl px-8 py-14 relative overflow-hidden shadow-orange-lg">
            {/* Decorative */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2" />

            <p className="relative text-orange-100 text-xs font-bold uppercase tracking-widest mb-4">Join 12,000+ Creators</p>
            <h2 className="relative text-3xl sm:text-4xl font-extrabold text-white mb-4 leading-tight">
              Get the Best Deals<br />Straight to Your Inbox
            </h2>
            <p className="relative text-orange-100/90 text-sm max-w-md mx-auto mb-8 leading-relaxed">
              Subscribe to exclusive early access offers, new arrivals, and curated picks — before everyone else.
            </p>
            <form
              className="relative flex gap-2 max-w-sm mx-auto"
              onSubmit={(e) => { e.preventDefault(); toast('Subscribed!', 'success', 'Welcome to the Cartify family!'); }}
            >
              <input
                type="email"
                required
                placeholder="your@email.com"
                className="flex-1 bg-white/20 border border-white/30 text-white placeholder-orange-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/60 backdrop-blur-sm"
              />
              <button
                type="submit"
                className="bg-white text-orange-600 font-bold text-sm px-5 py-3 rounded-xl hover:bg-orange-50 transition-colors shrink-0"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>

    </>
  );
}

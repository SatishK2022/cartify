
export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 select-none flex-1 flex flex-col justify-start text-left">
      <span className="text-[10px] font-bold tracking-widest text-accent uppercase mb-4 inline-block">Our Origin</span>
      <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight leading-tight mb-8">
        We believe in design details, grids, and premium tactile systems.
      </h1>
      
      <div className="prose prose-sm text-gray-600 leading-relaxed space-y-6 text-xs">
        <p>
          Cartify was started in 2026 by a small group of product engineers who were exhausted by bloated eCommerce sites, visual clutter, and sluggish search bars. We set out to design a storefront that behaves like a high-performance database—fast, precise, and visually satisfying.
        </p>
        <p>
          We take design principles from the Bauhaus movement, Apple hardware engineering, and Stripe billing spacing. We don&apos;t use placeholders, generic grids, or over-saturated background colors. Everything is designed on a consistent 8px padding grid with crisp, neutral styling.
        </p>
      </div>

      {/* Values Section */}
      <div className="mt-16 border-t border-gray-100 pt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">1. Functional Purity</h4>
          <p className="text-xs text-gray-500 leading-relaxed">
            We avoid unnecessary buttons, heavy animations, and noisy gradients. Design is only valid if it serves a user&apos;s intent.
          </p>
        </div>
        <div>
          <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">2. Type First</h4>
          <p className="text-xs text-gray-500 leading-relaxed">
            We build visual balance using type scales and spacing, rather than structural frames or dividing borders.
          </p>
        </div>
      </div>
    </div>
  );
}

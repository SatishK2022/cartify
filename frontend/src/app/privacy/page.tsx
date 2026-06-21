
export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16 select-none flex-1 flex flex-col justify-start text-left">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-8">Privacy Policy</h1>
      <div className="text-xs text-gray-655 leading-relaxed space-y-6">
        <p>Last updated: June 14, 2026</p>
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mt-6">1. Information Collection</h3>
        <p>We do not store, distribute, or sell any information submitted to the Cartify frontend. All session details (cart line items, addresses, passwords) are managed locally via client state and mock stores.</p>
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mt-6">2. Security Parameters</h3>
        <p>Although our checkout mimics Stripe secure systems, no real credit card numbers should be inputted into these mock inputs. Use standard card testing values (e.g. 4242) for demonstration.</p>
      </div>
    </div>
  );
}

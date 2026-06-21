
export default function TermsPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16 select-none flex-1 flex flex-col justify-start text-left">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-8">Terms of Service</h1>
      <div className="text-xs text-gray-650 leading-relaxed space-y-6">
        <p>Last updated: June 14, 2026</p>
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mt-6">1. Acceptance of Terms</h3>
        <p>By using the Cartify storefront, API endpoints, or database dashboards, you acknowledge that you agree to these legal conditions. If you disagree, you are prohibited from using the application.</p>
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mt-6">2. Simulated Transactions</h3>
        <p>Cartify is a simulated environment created for evaluation. Any payments processed, credit cards inputted, or orders placed are fully mocked. No real financial obligations or logistics shipments will occur.</p>
      </div>
    </div>
  );
}


import { Accordion } from '../../components/ui/Accordion';
import { mockFAQs } from '../../data/mockData';

export default function FAQPage() {
  const faqItems = mockFAQs.map((item) => ({
    title: item.question,
    content: <p className="text-gray-650 leading-relaxed text-xs">{item.answer}</p>
  }));

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 select-none flex-1 flex flex-col justify-start">
      <div className="text-center mb-10">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Frequently Asked Questions</h1>
        <p className="text-xs text-gray-500 mt-1.5">Have questions? Review support guidelines or contact help center.</p>
      </div>

      <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm">
        <Accordion items={faqItems} />
      </div>
    </div>
  );
}

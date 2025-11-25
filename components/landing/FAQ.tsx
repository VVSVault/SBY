'use client';

import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: 'How does the $795 flat fee work?',
    answer:
      'You pay a simple $795 flat fee to list your home, regardless of the sale price. This includes full MLS listing, professional photos, yard sign, lockbox, and guided closing support. No percentage commissions, no hidden fees.',
  },
  {
    question: 'Will my home be on the MLS and Zillow?',
    answer:
      'Yes! Your listing appears on the MLS, which automatically syndicates to Zillow, Realtor.com, Trulia, and all major real estate portals. You get the same exposure as traditional listings.',
  },
  {
    question: 'What if I need help during the process?',
    answer:
      'We provide full support throughout your transaction. Our team guides you through offers, negotiations, escrow, and closing. You can reach us via phone, email, or through your dashboard.',
  },
  {
    question: 'Is the buyer side really free?',
    answer:
      'Yes! Buyers can search homes, request showings, submit offers, and track transactions at no cost. We make money from the seller flat fee, not from buyers.',
  },
  {
    question: 'Can I use my own agent if I want?',
    answer:
      'Absolutely. Sellers can choose to work with a buyer\'s agent and offer a buyer agent commission if they prefer. Buyers can also bring their own agent. Our platform is flexible.',
  },
  {
    question: 'What areas do you serve?',
    answer:
      'We currently serve the Portland metro area and surrounding communities. Check your address on our site or contact us to confirm availability in your area.',
  },
  {
    question: 'How do I get started?',
    answer:
      'Sellers: Click "List Your Home" to create your listing. Buyers: Click "Start Your Home Search" to browse properties and set up your account. Both processes take just a few minutes!',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative py-20 px-4">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="/FAQbackground.png"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#318792]/70"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Frequently Asked Questions
          </h2>
          <a
            href="/faqs"
            className="inline-block px-8 py-3 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition font-semibold"
          >
            See Full FAQ
          </a>
        </div>

        <div className="space-y-4 mt-12">
          {faqData.slice(0, 3).map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl overflow-hidden shadow-lg"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 text-left hover:bg-gray-50 transition flex items-center justify-between"
              >
                <span className="font-semibold text-lg text-gray-900">
                  {item.question}
                </span>
                <svg
                  className={`w-6 h-6 text-gray-600 transition-transform flex-shrink-0 ml-4 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {openIndex === index && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <p className="text-gray-700 leading-relaxed">{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-2xl text-white font-semibold mb-8">
            Feel confident about getting the most value for your home with Sold By You.
          </p>
          <a
            href="/get-started"
            className="inline-block px-8 py-4 bg-[#FFD700] text-gray-900 rounded-lg hover:bg-[#E6C200] transition font-bold text-lg"
          >
            Get Started Today
          </a>
        </div>
      </div>
    </section>
  );
}

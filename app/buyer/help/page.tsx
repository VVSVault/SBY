'use client';

import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

interface ProcessStep {
  title: string;
  description: string;
  icon: string;
}

interface GlossaryTerm {
  term: string;
  definition: string;
}

export default function HelpPage() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const faqs: FAQItem[] = [
    {
      question: 'How do I search for homes?',
      answer: 'Use the Search page to filter homes by price, bedrooms, bathrooms, square footage, and location. You can save your favorite homes for later viewing and comparison.',
    },
    {
      question: 'How do I save a home to my favorites?',
      answer: 'Click the heart icon on any listing card or detail page to save it to your Saved Homes. You can access all saved homes from the navigation menu.',
    },
    {
      question: 'How do I request a showing?',
      answer: 'On any listing detail page, click the "Request Showing" button. Fill out your preferred date and time, and our team will coordinate with the listing agent to schedule your tour.',
    },
    {
      question: 'What information do I need to make an offer?',
      answer: 'You\'ll need your pre-approval letter, proof of funds for your down payment and earnest money, and valid identification. Our offer builder will guide you through all required fields.',
    },
    {
      question: 'How long does it take to hear back about my offer?',
      answer: 'Sellers typically respond within 24-48 hours. You\'ll receive email and portal notifications when there\'s an update on your offer status.',
    },
    {
      question: 'What happens after my offer is accepted?',
      answer: 'Once your offer is accepted, we create a transaction in your portal with a comprehensive checklist of tasks and deadlines. This includes scheduling inspections, finalizing financing, and preparing for closing.',
    },
    {
      question: 'How do I upload documents?',
      answer: 'Go to the Documents page and click "Upload Document". Select your file, choose the document type, and optionally add a description. You can link documents to specific transactions if needed.',
    },
    {
      question: 'What types of documents should I upload?',
      answer: 'Common documents include pre-approval letters, bank statements, ID copies, W-2s, pay stubs, contracts, inspection reports, and insurance policies.',
    },
    {
      question: 'How do I track my transaction progress?',
      answer: 'Visit the Transactions page to see all your active deals. Each transaction has a timeline showing current status and a task checklist to keep you on track through closing.',
    },
    {
      question: 'Can I change my notification preferences?',
      answer: 'Yes! Go to your Profile page and scroll to Notification Preferences. You can toggle email and SMS notifications on or off.',
    },
    {
      question: 'What if I need to cancel a showing?',
      answer: 'Go to the Showings page, find your scheduled showing, and click "Cancel". Please provide at least 24 hours notice when possible.',
    },
    {
      question: 'How secure is my information?',
      answer: 'We use industry-standard encryption for all data transmission and storage. Your documents and personal information are protected with bank-level security.',
    },
  ];

  const processSteps: ProcessStep[] = [
    {
      title: 'Get Pre-Approved',
      description: 'Work with a lender to get pre-approved for a mortgage. This shows sellers you\'re a serious buyer and helps you understand your budget.',
      icon: '💰',
    },
    {
      title: 'Search for Homes',
      description: 'Use our search tools to find properties that match your criteria. Save your favorites and schedule showings for the ones you love.',
      icon: '🔍',
    },
    {
      title: 'Tour Properties',
      description: 'Visit homes in person to get a feel for the space, neighborhood, and condition. Take notes and photos to compare properties later.',
      icon: '🏠',
    },
    {
      title: 'Make an Offer',
      description: 'When you find the right home, submit an offer through our digital offer builder. We\'ll guide you through price, contingencies, and terms.',
      icon: '📝',
    },
    {
      title: 'Negotiate',
      description: 'The seller may accept, reject, or counter your offer. We\'ll help you navigate negotiations to reach mutually agreeable terms.',
      icon: '🤝',
    },
    {
      title: 'Get Inspections',
      description: 'Once under contract, hire inspectors to evaluate the property\'s condition. Review reports and negotiate repairs if needed.',
      icon: '🔧',
    },
    {
      title: 'Secure Financing',
      description: 'Finalize your mortgage application, order the appraisal, and work with your lender to clear any conditions for loan approval.',
      icon: '🏦',
    },
    {
      title: 'Final Walkthrough',
      description: 'Visit the property one last time before closing to ensure it\'s in the agreed-upon condition and all repairs are complete.',
      icon: '✅',
    },
    {
      title: 'Close the Deal',
      description: 'Sign all closing documents, transfer funds, and receive the keys to your new home. Congratulations, you\'re a homeowner!',
      icon: '🎉',
    },
  ];

  const glossary: GlossaryTerm[] = [
    { term: 'Appraisal', definition: 'A professional assessment of a property\'s market value, typically required by lenders before approving a mortgage.' },
    { term: 'Closing Costs', definition: 'Fees and expenses paid at closing, including lender fees, title insurance, escrow fees, and prepaid property taxes.' },
    { term: 'Contingency', definition: 'A condition that must be met for a real estate contract to become binding, such as financing or inspection contingencies.' },
    { term: 'Earnest Money', definition: 'A deposit made by the buyer to show serious intent to purchase, typically 1-3% of the purchase price.' },
    { term: 'Escrow', definition: 'A neutral third party that holds funds and documents during a real estate transaction until all conditions are met.' },
    { term: 'Pre-Approval', definition: 'A lender\'s written commitment to loan you a specific amount based on verification of your financial information.' },
    { term: 'Title Insurance', definition: 'Insurance that protects the buyer and lender against legal claims to the property from previous ownership.' },
    { term: 'HOA', definition: 'Homeowners Association - an organization in a subdivision that makes and enforces rules for properties and residents.' },
    { term: 'PMI', definition: 'Private Mortgage Insurance - insurance that protects the lender if you default, typically required with less than 20% down payment.' },
    { term: 'MLS', definition: 'Multiple Listing Service - a database used by real estate brokers to share information about properties for sale.' },
    { term: 'Clear to Close', definition: 'Status indicating the lender has approved all documentation and conditions for your mortgage, and you\'re ready for closing.' },
    { term: 'Underwriting', definition: 'The process where a lender evaluates your financial information to determine loan approval and terms.' },
  ];

  const filteredFAQs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredGlossary = glossary.filter(
    (item) =>
      item.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.definition.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Help & Support</h1>
        <p className="text-gray-600 mb-6">
          Everything you need to know about your home buying journey
        </p>

        {/* Search Bar */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search FAQs and glossary terms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#406f77] focus:border-transparent text-gray-900 placeholder:text-gray-400"
          />
        </div>

        {/* Quick Contact Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-[#406f77]">
            <div className="flex items-center mb-3">
              <span className="text-2xl mr-3">📧</span>
              <h3 className="font-bold text-gray-900">Email Support</h3>
            </div>
            <a href="mailto:support@soldbyyou.com" className="text-[#406f77] hover:text-[#5DD5D9] transition text-sm">
              support@soldbyyou.com
            </a>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-[#5DD5D9]">
            <div className="flex items-center mb-3">
              <span className="text-2xl mr-3">📞</span>
              <h3 className="font-bold text-gray-900">Phone Support</h3>
            </div>
            <a href="tel:+15551234567" className="text-[#406f77] hover:text-[#5DD5D9] transition text-sm">
              (555) 123-4567
            </a>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-[#FFD700]">
            <div className="flex items-center mb-3">
              <span className="text-2xl mr-3">⏰</span>
              <h3 className="font-bold text-gray-900">Business Hours</h3>
            </div>
            <p className="text-gray-600 text-sm">Mon-Fri: 9am-6pm MST</p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {filteredFAQs.map((faq, index) => (
              <div key={index} className="border-b border-gray-200 last:border-b-0">
                <button
                  onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                  className="w-full flex items-center justify-between py-4 text-left hover:bg-gray-50 transition px-2 rounded"
                >
                  <span className="font-medium text-gray-900 pr-4">{faq.question}</span>
                  <svg
                    className={`w-5 h-5 text-gray-500 transition-transform flex-shrink-0 ${
                      openFAQ === index ? 'transform rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFAQ === index && (
                  <div className="pb-4 px-2 text-gray-600 text-sm leading-relaxed">{faq.answer}</div>
                )}
              </div>
            ))}
          </div>
          {filteredFAQs.length === 0 && (
            <p className="text-gray-500 text-center py-8">No FAQs match your search.</p>
          )}
        </div>

        {/* Home Buying Process */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Home Buying Process</h2>
          <p className="text-gray-600 mb-6 text-sm">
            Follow these steps to navigate your home buying journey with confidence.
          </p>
          <div className="space-y-4">
            {processSteps.map((step, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#406f77] to-[#5DD5D9] flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                </div>
                <div className="flex-1 pt-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{step.icon}</span>
                    <h3 className="font-bold text-gray-900">{step.title}</h3>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Real Estate Glossary */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Real Estate Glossary</h2>
          <p className="text-gray-600 mb-6 text-sm">
            Common terms you'll encounter during your home buying journey.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {filteredGlossary.map((item, index) => (
              <div key={index} className="border-l-4 border-[#406f77] pl-4 py-2">
                <h3 className="font-bold text-gray-900 mb-1">{item.term}</h3>
                <p className="text-gray-600 text-sm">{item.definition}</p>
              </div>
            ))}
          </div>
          {filteredGlossary.length === 0 && (
            <p className="text-gray-500 text-center py-8">No glossary terms match your search.</p>
          )}
        </div>

        {/* Trusted Service Providers */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Trusted Service Providers</h2>
          <p className="text-gray-600 mb-6 text-sm">
            These are providers that Sold By You has worked with on similar transactions. You are welcome to use any provider of your choice - these are simply offered as references for your convenience.
          </p>

          <div className="space-y-6">
            {/* Mortgage Lender */}
            <div className="border-l-4 border-[#406f77] pl-6 py-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🏦</span>
                <h3 className="font-bold text-gray-900 text-lg">Mortgage Lender</h3>
              </div>
              <div className="ml-8 space-y-1">
                <p className="font-medium text-gray-900">Shane Gowitt</p>
                <div className="flex flex-col text-sm text-gray-600">
                  <a href="mailto:Shane.Gowitt@fairwaymc.com" className="text-[#406f77] hover:text-[#5DD5D9] transition">
                    Shane.Gowitt@fairwaymc.com
                  </a>
                  <a href="tel:+16233005562" className="text-[#406f77] hover:text-[#5DD5D9] transition">
                    623-300-5562
                  </a>
                </div>
              </div>
            </div>

            {/* Title Company */}
            <div className="border-l-4 border-[#5DD5D9] pl-6 py-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">📋</span>
                <h3 className="font-bold text-gray-900 text-lg">Title Company</h3>
              </div>
              <div className="ml-8 space-y-1">
                <p className="font-medium text-gray-900">Amanda Zelenski</p>
                <div className="flex flex-col text-sm text-gray-600">
                  <a href="mailto:Amanda.Zalenski@LTIC.com" className="text-[#406f77] hover:text-[#5DD5D9] transition">
                    Amanda.Zalenski@LTIC.com
                  </a>
                  <a href="tel:+16235182795" className="text-[#406f77] hover:text-[#5DD5D9] transition">
                    623-518-2795
                  </a>
                </div>
              </div>
            </div>

            {/* Insurance */}
            <div className="border-l-4 border-[#FFD700] pl-6 py-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🛡️</span>
                <h3 className="font-bold text-gray-900 text-lg">Insurance</h3>
              </div>
              <div className="ml-8 space-y-1">
                <p className="font-medium text-gray-900">Paul Bianco</p>
                <div className="flex flex-col text-sm text-gray-600">
                  <a href="mailto:Paul.Bianco@libertymutual.com" className="text-[#406f77] hover:text-[#5DD5D9] transition">
                    Paul.Bianco@libertymutual.com
                  </a>
                  <a href="tel:+16022928371" className="text-[#406f77] hover:text-[#5DD5D9] transition">
                    602-292-8371
                  </a>
                </div>
              </div>
            </div>

            {/* Home Inspectors */}
            <div className="border-l-4 border-[#406f77] pl-6 py-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🔍</span>
                <h3 className="font-bold text-gray-900 text-lg">Home Inspectors</h3>
              </div>
              <div className="ml-8 space-y-4">
                <div>
                  <p className="font-medium text-gray-900">Jim Brown</p>
                  <p className="text-sm text-gray-600">Brown & Co Inspections</p>
                  <div className="flex flex-col text-sm text-gray-600">
                    <a href="mailto:Hello@BrownandCoInspections.com" className="text-[#406f77] hover:text-[#5DD5D9] transition">
                      Hello@BrownandCoInspections.com
                    </a>
                    <a href="tel:+14802902225" className="text-[#406f77] hover:text-[#5DD5D9] transition">
                      480-290-2225
                    </a>
                  </div>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Kris Houser</p>
                  <p className="text-sm text-gray-600">Insight Inspects</p>
                  <div className="flex flex-col text-sm text-gray-600">
                    <a href="mailto:Schedule@InsightInspects.com" className="text-[#406f77] hover:text-[#5DD5D9] transition">
                      Schedule@InsightInspects.com
                    </a>
                    <a href="tel:+16235948131" className="text-[#406f77] hover:text-[#5DD5D9] transition">
                      623-594-8131
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Resources */}
        <div className="bg-gradient-to-br from-[#406f77] to-[#5DD5D9] rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-4 text-white">Need More Help?</h2>
          <p className="mb-6 text-white">
            Our team is here to support you every step of the way. Don't hesitate to reach out with any questions.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="mailto:support@soldbyyou.com"
              className="px-6 py-3 bg-white text-[#406f77] rounded-lg font-medium hover:bg-gray-100 transition"
            >
              Email Us
            </a>
            <a
              href="tel:+15551234567"
              className="px-6 py-3 bg-transparent border-2 border-white text-white rounded-lg font-medium hover:bg-white hover:text-[#406f77] transition"
            >
              Call Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

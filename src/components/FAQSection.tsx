'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  {
    question: 'How does Deal Crafter AI find qualified leads?',
    answer: 'We use advanced technology to scan millions of business profiles across LinkedIn and other professional networks. Our system identifies prospects based on your target criteria including industry, company size, location, and decision-making roles.'
  },
  {
    question: 'Are the AI-generated emails really personalized?',
    answer: 'Yes! Our system analyzes each prospect&apos;s company, role, industry, and recent activities to create truly personalized messages. Unlike generic templates, every email is crafted specifically for that individual prospect to maximize reply rates.'
  },
  {
    question: 'What if I&apos;m not satisfied with the results?',
    answer: 'We offer a 30-day money-back guarantee. If you&apos;re not seeing results within your first month, we&apos;ll refund your subscription no questions asked. We&apos;re confident you&apos;ll see the value immediately.'
  },
  {
    question: 'How long does it take to get started?',
    answer: 'Setup takes just 5 minutes. Simply connect your email, define your target market, and our AI starts finding and reaching out to qualified prospects immediately. You&apos;ll see your first results within 24 hours.'
  },
  {
    question: 'Can I customize the system&apos;s approach?',
    answer: 'Absolutely! You can set your own messaging tone, customize your value proposition, and even upload your own templates. The system learns from your preferences and gets better over time.'
  },
  {
    question: 'Is this compliant with email regulations?',
    answer: 'Yes, we follow all GDPR, CAN-SPAM, and other email regulations. We only target business contacts, include proper opt-out mechanisms, and ensure all emails are sent in compliance with anti-spam laws.'
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-32 sm:py-48 bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600 uppercase tracking-wider">FAQ</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Everything you need to know
          </p>
          <p className="mt-6 text-xl leading-8 text-gray-600">
            Got questions? We&apos;ve got answers
          </p>
        </div>
        
        <div className="mx-auto mt-20 max-w-4xl">
          <dl className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-200">
                <dt className="text-lg">
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="flex w-full items-start justify-between text-left px-8 py-6 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <span className="font-semibold text-gray-900">{faq.question}</span>
                    <span className="ml-6 flex h-7 items-center">
                      {openIndex === index ? (
                        <ChevronUp className="h-5 w-5 text-blue-600" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      )}
                    </span>
                  </button>
                </dt>
                {openIndex === index && (
                  <dd className="px-8 pb-6">
                    <p className="text-base text-gray-600 leading-7">{faq.answer}</p>
                  </dd>
                )}
              </div>
            ))}
          </dl>
        </div>
        
        {/* Trust badges */}
        <div className="mx-auto mt-20 max-w-4xl text-center">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-4">
            <div className="flex flex-col items-center">
              <div className="text-2xl mb-2 text-blue-600">Security</div>
              <div className="text-sm font-medium text-gray-900">SOC 2 Compliant</div>
              <div className="text-xs text-gray-600">Enterprise security</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-2xl mb-2 text-green-600">Speed</div>
              <div className="text-sm font-medium text-gray-900">5-Minute Setup</div>
              <div className="text-xs text-gray-600">Start immediately</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-2xl mb-2 text-purple-600">Guarantee</div>
              <div className="text-sm font-medium text-gray-900">30-Day Guarantee</div>
              <div className="text-xs text-gray-600">Risk-free trial</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-2xl mb-2 text-orange-600">Compliance</div>
              <div className="text-sm font-medium text-gray-900">GDPR Compliant</div>
              <div className="text-xs text-gray-600">Legal & safe</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 
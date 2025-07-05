'use client';

import { Users, MessageSquare, BarChart3, Zap, Target, Shield } from 'lucide-react';

const features = [
  {
    name: 'Send up to 5,000 personalized emails per day',
    description: 'Scale your outreach with AI-powered email campaigns. Send up to 5,000 personalized emails daily with automated follow-ups and intelligent scheduling.',
    icon: Target,
    metric: '5,000 emails',
    timeframe: 'per day'
  },
  {
    name: 'AI emails that get 3x higher reply rates',
    description: 'Our AI crafts personalized messages by analyzing each prospect&apos;s company, role, and recent activities. No more generic templates that end up in spam.',
    icon: MessageSquare,
    metric: '3x replies',
    timeframe: 'vs templates'
  },
  {
    name: 'Close deals 10x faster with automation',
    description: 'Automated follow-ups, meeting scheduling, and deal tracking. Our AI handles the entire sales process while you focus on closing the deals.',
    icon: Zap,
    metric: '10x faster',
    timeframe: 'deal closure'
  },
  {
    name: 'Real-time analytics & optimization',
    description: 'Track open rates, reply rates, and conversion metrics in real-time. Our AI continuously optimizes your campaigns based on actual performance data.',
    icon: BarChart3,
    metric: 'Real-time',
    timeframe: 'optimization'
  },
  {
    name: 'Enterprise-grade security & compliance',
    description: 'SOC 2 compliant with GDPR, CAN-SPAM compliance built-in. Your data and your prospects&apos; data are protected with enterprise-level security.',
    icon: Shield,
    metric: 'SOC 2',
    timeframe: 'compliant'
  },
  {
    name: 'Setup in 5 minutes, results in 24 hours',
    description: 'Connect your email, define your target market, and our AI starts finding and reaching out to qualified prospects immediately.',
    icon: Users,
    metric: '5 min',
    timeframe: 'setup'
  }
];

export default function FeaturesSection() {
  return (
    <section className="py-32 sm:py-48 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600 uppercase tracking-wider">Why Deal Crafter AI</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Everything you need to replace your sales team
          </p>
          <p className="mt-6 text-xl leading-8 text-gray-600">
            From lead generation to deal closure, our AI handles your entire sales process with precision and scale that humans simply can&apos;t match.
          </p>
        </div>
        <div className="mx-auto mt-20 max-w-2xl sm:mt-24 lg:mt-32 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-12 lg:max-w-none lg:grid-cols-2 xl:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative p-8 rounded-3xl border border-gray-200 bg-white hover:border-blue-200 transition-all duration-300 hover:shadow-xl">
                  <dt className="flex items-center gap-x-4 text-xl font-semibold leading-7 text-gray-900 mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                      <feature.icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    {feature.name}
                  </dt>
                  <dd className="text-lg leading-7 text-gray-600 mb-4">
                    {feature.description}
                  </dd>
                  {/* Metric badge */}
                  <div className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                    {feature.metric} {feature.timeframe}
                  </div>
                </div>
              </div>
            ))}
          </dl>
        </div>
        
        {/* Comparison table */}
        <div className="mx-auto mt-20 max-w-4xl">
          <div className="bg-gray-50 rounded-3xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">Traditional Sales Team vs Deal Crafter AI</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-red-50 rounded-2xl p-6 border border-red-200">
                <h4 className="text-lg font-semibold text-red-900 mb-4">Traditional Sales Team</h4>
                <ul className="space-y-3 text-red-800">
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-1">•</span>
                    <span>$80,000+ per year per rep</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-1">•</span>
                    <span>3-6 months to hire and train</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-1">•</span>
                    <span>Limited to 8 hours per day</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-1">•</span>
                    <span>Inconsistent performance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-1">•</span>
                    <span>High turnover and burnout</span>
                  </li>
                </ul>
              </div>
              <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
                <h4 className="text-lg font-semibold text-green-900 mb-4">Deal Crafter AI</h4>
                <ul className="space-y-3 text-green-800">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span>Just $20/month</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span>Setup in 5 minutes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span>Works 24/7, never sleeps</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span>Consistent, scalable performance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span>Gets better over time with AI</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 
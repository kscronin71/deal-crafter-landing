'use client';

import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Founder, SaaSFlow',
    company: 'SaaSFlow',
    image: '/api/placeholder/60/60',
    content: 'Deal Crafter AI helped us close 3x more deals in our first month. We went from 2 sales to 6 deals worth $45k. The AI-generated emails are incredibly personalized.',
    results: '3x more deals, $45k in revenue',
    rating: 5
  },
  {
    name: 'Marcus Rodriguez',
    role: 'CEO, AgencyScale',
    company: 'AgencyScale',
    image: '/api/placeholder/60/60',
    content: 'We were spending $80k/year on sales reps who barely hit quota. Deal Crafter AI replaced our entire team for $20/month and we&apos;re closing more deals than ever.',
    results: 'Replaced $80k team, 40% higher close rate',
    rating: 5
  },
  {
    name: 'Jennifer Park',
    role: 'VP Sales, TechStart',
    company: 'TechStart',
    image: '/api/placeholder/60/60',
    content: 'The lead generation is incredible. We found 200 qualified prospects in our target market in just 2 days. The AI emails get 3x higher reply rates than our templates.',
    results: '200 qualified leads, 3x reply rates',
    rating: 5
  }
];

export default function TestimonialsSection() {
  return (
    <section className="py-32 sm:py-48 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600 uppercase tracking-wider">Real Results</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            See what our customers are saying
          </p>
          <p className="mt-6 text-xl leading-8 text-gray-600">
            Join hundreds of founders who&apos;ve transformed their sales with AI
          </p>
        </div>
        
        <div className="mx-auto mt-20 max-w-2xl sm:mt-24 lg:mt-32 lg:max-w-none">
          <div className="grid max-w-xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative p-8 rounded-3xl border border-gray-200 bg-white hover:border-blue-200 transition-all duration-300 hover:shadow-xl">
                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  
                  {/* Content */}
                  <blockquote className="text-lg leading-7 text-gray-600 mb-6">
                    "{testimonial.content}"
                  </blockquote>
                  
                  {/* Results badge */}
                  <div className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800 mb-6">
                    <span className="text-green-600 mr-1">📈</span>
                    {testimonial.results}
                  </div>
                  
                  {/* Author */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Stats */}
        <div className="mx-auto mt-20 max-w-4xl">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600">47+</div>
              <div className="text-sm text-gray-600">Founders on waitlist</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600">3x</div>
              <div className="text-sm text-gray-600">Average deal increase</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600">$20</div>
              <div className="text-sm text-gray-600">Per month (vs $80k/year)</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 
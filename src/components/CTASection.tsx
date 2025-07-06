'use client';

import { useState } from 'react';
import LoadingAnimation from './LoadingAnimation';

export default function CTASection() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');

  const handleJoinWaitlist = () => {
    // Open Tally form in new tab
    window.open('https://tally.so/r/3yAX4g', '_blank');
  };

  const handleGetStarted = async () => {
    if (!email) {
      alert('Please enter your email address');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.sessionId) {
        // Redirect to Stripe checkout
        window.location.href = `https://checkout.stripe.com/pay/${data.sessionId}`;
      } else {
        throw new Error(data.error || 'Failed to create checkout session');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Failed to create checkout session. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="bg-black">
      <div className="px-6 py-32 sm:px-6 sm:py-48 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Ready to transform your sales?
          </h2>
          <p className="mx-auto mt-8 max-w-2xl text-xl leading-8 text-white/70">
            Join founders who are already replacing expensive sales teams with AI that actually closes deals. Start your journey today.
          </p>
          
          {/* Social proof */}
          <div className="mt-8 flex items-center justify-center gap-8 text-white/60">
            <div className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              <span className="text-sm">30-day money-back guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              <span className="text-sm">Setup in 5 minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              <span className="text-sm">Cancel anytime</span>
            </div>
          </div>
          
          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
            <button
              onClick={handleJoinWaitlist}
              className="w-full rounded-xl bg-white px-8 py-4 text-lg font-semibold text-black transition-all duration-200 hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black sm:w-auto"
            >
              Join the early access list
            </button>
          </div>
          
          {/* Email input for checkout */}
          <div className="mt-8 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email to get started"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            />
          </div>
          
          <div className="mt-6">
            <button
              onClick={handleGetStarted}
              disabled={isLoading || !email}
              className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 text-lg font-semibold text-white transition-all duration-200 hover:from-blue-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {isLoading ? 'Processing...' : 'Start Closing Deals - $20/month'}
            </button>
          </div>
          
          <p className="mt-6 text-sm text-white/50">
            Early access pricing • No setup fees
          </p>
        </div>
      </div>
      
      {isLoading && (
        <LoadingAnimation 
          message="Creating checkout session..." 
          showProgress={false}
        />
      )}
    </section>
  );
} 
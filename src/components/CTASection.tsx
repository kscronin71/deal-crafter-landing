'use client';

import { useState } from 'react';
import SuccessAnimation from './SuccessAnimation';
import EarlyAccessSuccessAnimation from './EarlyAccessSuccessAnimation';
import LoadingAnimation from './LoadingAnimation';

export default function CTASection() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [showEarlyAccessAnimation, setShowEarlyAccessAnimation] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Final CTA Email submitted:', email);
    
    try {
      const response = await fetch('/api/signups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, source: 'cta-section' }),
      });

      if (!response.ok) {
        console.error('Failed to save email');
      } else {
        const data = await response.json();
        console.log('Email saved successfully:', data.updated ? 'updated existing' : 'new signup');
        
        // Send welcome email immediately for new signups
        if (!data.updated) {
          try {
            await fetch('/api/send-email', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ 
                email: email, 
                type: 'welcome' 
              }),
            });
            console.log('Welcome email sent to:', email);
          } catch (emailError) {
            console.error('Error sending welcome email:', emailError);
          }
        }
        
        // Show early access animation for waitlist signup
        setShowEarlyAccessAnimation(true);
      }
    } catch (error) {
      console.error('Error saving email:', error);
    }
    
    setEmail('');
  };

  const handleGetStarted = async () => {
    if (!email) {
      alert('Please enter your email first');
      return;
    }

    setShowSuccessAnimation(true);
  };

  const handleAnimationComplete = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { sessionId } = await response.json();
      
      // Redirect to Stripe Checkout
      const stripe = await import('@stripe/stripe-js');
      const stripeInstance = await stripe.loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
      
      if (stripeInstance) {
        const { error } = await stripeInstance.redirectToCheckout({ sessionId });
        if (error) {
          console.error('Stripe error:', error);
        }
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
      setShowSuccessAnimation(false);
    }
  };

  const handleEarlyAccessComplete = () => {
    console.log('Early access animation complete');
    setShowEarlyAccessAnimation(false);
    // Could add additional logic here like showing a thank you message
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
          
          <form onSubmit={handleSubmit} className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
            <div className="w-full max-w-md">
              <label htmlFor="email-address-cta" className="sr-only">
                Email address
              </label>
              <input
                id="email-address-cta"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border-0 bg-white/10 px-6 py-4 text-white placeholder:text-white/50 backdrop-blur-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black text-lg"
                placeholder="Enter your email address"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-xl bg-white px-8 py-4 text-lg font-semibold text-black transition-all duration-200 hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black sm:w-auto"
            >
              Join the early access list
            </button>
          </form>
          
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
      
      {showSuccessAnimation && (
        <SuccessAnimation 
          email={email} 
          onComplete={handleAnimationComplete}
        />
      )}
      
      {showEarlyAccessAnimation && (
        <EarlyAccessSuccessAnimation 
          email={email} 
          onComplete={handleEarlyAccessComplete}
        />
      )}
      
      {isLoading && (
        <LoadingAnimation 
          message="Creating checkout session..." 
          showProgress={false}
        />
      )}
    </section>
  );
} 
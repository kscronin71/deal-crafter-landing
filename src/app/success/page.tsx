'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, ArrowRight, Mail, Users, TrendingUp } from 'lucide-react';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    const emailParam = searchParams.get('email');

    if (emailParam) {
      setEmail(emailParam);
      markUserAsPaid(emailParam);
    } else {
      setError('Email not found in URL parameters');
      setIsLoading(false);
    }
  }, [searchParams]);

  const markUserAsPaid = async (userEmail: string) => {
    try {
      const response = await fetch('/api/mark-paid', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userEmail }),
      });

      if (!response.ok) {
        console.error('Failed to mark user as paid');
      } else {
        console.log('User marked as paid successfully');
        
        // Send welcome email to paid user
        await fetch('/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            email: userEmail, 
            type: 'welcome' 
          }),
        });
      }
    } catch (error) {
      console.error('Error marking user as paid:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Setting up your account...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">Error: {error}</p>
          <a href="/" className="text-blue-400 hover:text-blue-300">
            Return to homepage
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-6 py-32">
        <div className="text-center mb-16">
          <div className="mb-8">
            <CheckCircle className="h-24 w-24 text-green-400 mx-auto mb-4" />
            <h1 className="text-5xl font-bold mb-4">
              Welcome to Deal Crafter AI!
            </h1>
            <p className="text-xl text-white/70">
              You're now part of an exclusive group of founders replacing expensive sales teams with AI
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white/10 rounded-2xl p-8 backdrop-blur-sm">
            <Mail className="h-12 w-12 text-blue-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Welcome Email Sent</h3>
            <p className="text-white/70">
              Check your inbox for your welcome email with next steps and login credentials.
            </p>
          </div>

          <div className="bg-white/10 rounded-2xl p-8 backdrop-blur-sm">
            <Users className="h-12 w-12 text-green-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Priority Access</h3>
            <p className="text-white/70">
              You have priority access to our platform and exclusive onboarding support.
            </p>
          </div>

          <div className="bg-white/10 rounded-2xl p-8 backdrop-blur-sm">
            <TrendingUp className="h-12 w-12 text-purple-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Ready to Scale</h3>
            <p className="text-white/70">
              Start closing deals immediately with AI-powered lead generation and outreach.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl p-8 border border-blue-500/30">
          <h2 className="text-2xl font-bold mb-6">What's Next?</h2>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-blue-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                1
              </div>
              <div>
                <h3 className="font-semibold mb-2">Check Your Email</h3>
                <p className="text-white/70">
                  We've sent your welcome email to {email} with next steps and platform updates.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-blue-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                2
              </div>
              <div>
                <h3 className="font-semibold mb-2">We'll Notify You</h3>
                <p className="text-white/70">
                  We'll send you an email as soon as the full platform is ready with your login credentials.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-blue-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                3
              </div>
              <div>
                <h3 className="font-semibold mb-2">Start Closing Deals</h3>
                <p className="text-white/70">
                  Once the platform launches, you'll be able to send up to 5,000 emails per day and start seeing results immediately.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-white/60 mb-6">
            Need help getting started? Just reply to your welcome email or contact our support team.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/"
              className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-white/90 transition-colors"
            >
              Return to Homepage
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 
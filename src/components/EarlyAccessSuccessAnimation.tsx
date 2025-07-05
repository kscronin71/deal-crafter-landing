'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, Bell, Users, Gift, Heart } from 'lucide-react';

interface EarlyAccessSuccessAnimationProps {
  email: string;
  onComplete: () => void;
}

export default function EarlyAccessSuccessAnimation({ email, onComplete }: EarlyAccessSuccessAnimationProps) {
  const [step, setStep] = useState(0);
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    console.log('EarlyAccessSuccessAnimation mounted with email:', email);
    setShowAnimation(true);
    
    // Animation sequence for early access
    const timer1 = setTimeout(() => {
      console.log('Step 1: Email confirmation');
      setStep(1);
    }, 500);
    const timer2 = setTimeout(() => {
      console.log('Step 2: Early Access Granted');
      setStep(2);
    }, 1500);
    const timer3 = setTimeout(() => {
      console.log('Step 3: Exclusive Benefits');
      setStep(3);
    }, 2500);
    const timer4 = setTimeout(() => {
      console.log('Step 4: Success');
      setStep(4);
      setTimeout(() => {
        console.log('Early access animation complete, calling onComplete');
        onComplete();
      }, 1000);
    }, 3500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onComplete, email]);

  console.log('EarlyAccessSuccessAnimation render - showAnimation:', showAnimation, 'step:', step);

  if (!showAnimation) {
    console.log('EarlyAccessSuccessAnimation not showing - showAnimation is false');
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-3xl p-12 max-w-md mx-4 text-center relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 opacity-50"></div>
        
        <div className="relative z-10">
          {/* Step 1: Email confirmation */}
          {step >= 1 && (
            <div className={`transition-all duration-700 ${step === 1 ? 'scale-100 opacity-100' : 'scale-95 opacity-70'}`}>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Email Confirmed
              </h3>
              <p className="text-gray-600 text-sm">
                {email}
              </p>
            </div>
          )}

          {/* Step 2: Early Access Granted */}
          {step >= 2 && (
            <div className={`transition-all duration-700 ${step === 2 ? 'scale-100 opacity-100' : 'scale-95 opacity-70'}`}>
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8 text-purple-600 animate-pulse" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Early Access Granted
              </h3>
              <p className="text-gray-600 text-sm">
                You&apos;re now on the exclusive waitlist
              </p>
            </div>
          )}

          {/* Step 3: Exclusive Benefits */}
          {step >= 3 && (
            <div className={`transition-all duration-700 ${step === 3 ? 'scale-100 opacity-100' : 'scale-95 opacity-70'}`}>
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Exclusive Benefits Unlocked
              </h3>
              <p className="text-gray-600 text-sm">
                Priority access, special pricing, and insider updates
              </p>
            </div>
          )}

          {/* Step 4: Success */}
          {step >= 4 && (
            <div className="transition-all duration-700 scale-100 opacity-100">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                <Heart className="w-10 h-10 text-white" />
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full animate-ping opacity-20"></div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Welcome to the Family!
              </h3>
              <p className="text-gray-600 mb-6">
                You&apos;ll be the first to know when we launch
              </p>
              
              {/* Early access benefits */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">1st</div>
                  <div className="text-xs text-gray-500">Priority Access</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-pink-600">50%</div>
                  <div className="text-xs text-gray-500">Launch Discount</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">VIP</div>
                  <div className="text-xs text-gray-500">Updates</div>
                </div>
              </div>

              <div className="flex items-center justify-center text-sm text-gray-500">
                <Users className="w-4 h-4 mr-2" />
                You&apos;re now part of our exclusive community
              </div>
            </div>
          )}

          {/* Progress dots */}
          <div className="flex justify-center space-x-2 mt-8">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  step >= i ? 'bg-purple-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 
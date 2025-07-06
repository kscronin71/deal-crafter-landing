'use client';

import { useEffect, useState } from 'react';
import { CheckCircle } from 'lucide-react';

interface SuccessAnimationProps {
  email: string;
  onComplete: () => void;
}

export default function SuccessAnimation({ email, onComplete }: SuccessAnimationProps) {
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    console.log('SuccessAnimation mounted with email:', email);
    setShowAnimation(true);
    
    // Simple animation - just show checkmark for 2 seconds then complete
    const timer = setTimeout(() => {
      console.log('Animation complete, calling onComplete');
      onComplete();
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, [onComplete, email]);

  console.log('SuccessAnimation render - showAnimation:', showAnimation);

  if (!showAnimation) {
    console.log('SuccessAnimation not showing - showAnimation is false');
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-3xl p-12 max-w-md mx-4 text-center relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-50"></div>
        
        <div className="relative z-10">
          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 relative">
            <CheckCircle className="w-10 h-10 text-white" />
            <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-blue-500 rounded-full animate-ping opacity-20"></div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            Success!
          </h3>
          <p className="text-gray-600 mb-6">
            Your payment has been processed successfully
          </p>
          
          {/* Success metrics */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">10x</div>
              <div className="text-xs text-gray-500">Faster Closing</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">$20</div>
              <div className="text-xs text-gray-500">Per Month</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">∞</div>
              <div className="text-xs text-gray-500">Leads</div>
            </div>
          </div>

          <div className="text-sm text-gray-500">
            Welcome to Deal Crafter AI!
          </div>
        </div>
      </div>
    </div>
  );
} 
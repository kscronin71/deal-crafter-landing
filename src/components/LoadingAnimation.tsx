'use client';

import { Sparkles, Zap, Target } from 'lucide-react';

interface LoadingAnimationProps {
  message?: string;
  showProgress?: boolean;
}

export default function LoadingAnimation({ message = "Processing...", showProgress = false }: LoadingAnimationProps) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-3xl p-12 max-w-md mx-4 text-center relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-50"></div>
        
        <div className="relative z-10">
          {/* Animated icons */}
          <div className="flex justify-center items-center space-x-4 mb-8">
            <div className="animate-bounce">
              <Sparkles className="w-8 h-8 text-blue-600" />
            </div>
            <div className="animate-bounce" style={{ animationDelay: '0.1s' }}>
              <Zap className="w-8 h-8 text-purple-600" />
            </div>
            <div className="animate-bounce" style={{ animationDelay: '0.2s' }}>
              <Target className="w-8 h-8 text-green-600" />
            </div>
          </div>

          {/* Loading text */}
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            {message}
          </h3>
          
          <p className="text-gray-600 mb-8">
            Preparing your AI-powered sales automation...
          </p>

          {/* Progress bar */}
          {showProgress && (
            <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full animate-pulse"></div>
            </div>
          )}

          {/* Animated dots */}
          <div className="flex justify-center space-x-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
} 
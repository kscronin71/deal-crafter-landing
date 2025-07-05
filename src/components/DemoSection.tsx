'use client';

import { useState } from 'react';
import { Sparkles, Send, MessageSquare, TrendingUp, Users, Mail, CheckCircle, Zap, Target, BarChart3 } from 'lucide-react';
import LoadingAnimation from './LoadingAnimation';

interface Email {
  id: string;
  to: string;
  subject: string;
  content: string;
  status: 'draft' | 'sent' | 'opened' | 'replied';
  timestamp: string;
  openTime?: string;
  replyTime?: string;
  reply?: string;
}

interface Analytics {
  emailsSent: number;
  openRate: number;
  replyRate: number;
  meetingsBooked: number;
  dealsClosed: number;
}

interface ScaleCampaign {
  id: string;
  name: string;
  targetSize: number;
  emailsSent: number;
  openRate: number;
  replyRate: number;
  meetingsBooked: number;
  dealsClosed: number;
  status: 'running' | 'completed';
}

export default function DemoSection() {
  const [targetIndustry, setTargetIndustry] = useState('');
  const [location, setLocation] = useState('');
  const [generatedEmail, setGeneratedEmail] = useState<Email | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [simulationStep, setSimulationStep] = useState<'input' | 'generating' | 'email' | 'sending' | 'opened' | 'replied' | 'analytics'>('input');
  const [emails, setEmails] = useState<Email[]>([]);
  const [analytics, setAnalytics] = useState<Analytics>({
    emailsSent: 0,
    openRate: 0,
    replyRate: 0,
    meetingsBooked: 0,
    dealsClosed: 0
  });
  const [isScaleMode, setIsScaleMode] = useState(false);
  const [scaleCampaigns, setScaleCampaigns] = useState<ScaleCampaign[]>([]);
  const [isScaleRunning, setIsScaleRunning] = useState(false);

  const handleGenerateMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!targetIndustry || !location) return;

    setIsLoading(true);
    setSimulationStep('generating');

    try {
      const response = await fetch('/api/generate-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ targetIndustry, location }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate message');
      }

      const data = await response.json();
      
      const newEmail: Email = {
        id: Date.now().toString(),
        to: `ceo@${targetIndustry.toLowerCase().replace(/\s+/g, '')}.com`,
        subject: `Quick question about ${targetIndustry} growth`,
        content: data.message,
        status: 'draft',
        timestamp: new Date().toISOString()
      };

      setGeneratedEmail(newEmail);
      setSimulationStep('email');
    } catch (error) {
      console.error('Error generating message:', error);
      setGeneratedEmail({
        id: Date.now().toString(),
        to: `ceo@${targetIndustry.toLowerCase().replace(/\s+/g, '')}.com`,
        subject: `Quick question about ${targetIndustry} growth`,
        content: `Hi there,\n\nI noticed your company is doing some interesting work in the ${targetIndustry} space. I'd love to learn more about your growth challenges and see if we might be able to help.\n\nWould you be open to a quick 15-minute call this week?\n\nBest regards,\n[Your Name]`,
        status: 'draft',
        timestamp: new Date().toISOString()
      });
      setSimulationStep('email');
    } finally {
      setIsLoading(false);
    }
  };

  const simulateEmailSending = () => {
    if (!generatedEmail) return;
    
    setSimulationStep('sending');
    
    setTimeout(() => {
      const sentEmail = { ...generatedEmail, status: 'sent' as const };
      setEmails([sentEmail]);
      setAnalytics(prev => ({ ...prev, emailsSent: 1 }));
      setSimulationStep('opened');
      
      // Simulate email being opened
      setTimeout(() => {
        const openedEmail = { ...sentEmail, status: 'opened' as const, openTime: new Date().toISOString() };
        setEmails([openedEmail]);
        setAnalytics(prev => ({ ...prev, openRate: 100 }));
        setSimulationStep('replied');
        
        // Simulate getting a reply
        setTimeout(() => {
          const repliedEmail = { 
            ...openedEmail, 
            status: 'replied' as const, 
            replyTime: new Date().toISOString(),
            reply: `Hi,\n\nThanks for reaching out! We are indeed looking to scale our ${targetIndustry} operations. I'd be interested in learning more about your solution.\n\nHow about we schedule a call for tomorrow at 2 PM?\n\nBest,\nCEO`
          };
          setEmails([repliedEmail]);
          setAnalytics(prev => ({ 
            ...prev, 
            replyRate: 100,
            meetingsBooked: 1,
            dealsClosed: 0.3 // 30% chance of closing
          }));
          setSimulationStep('analytics');
        }, 2000);
      }, 1500);
    }, 1000);
  };

  const startScaleCampaign = () => {
    if (!targetIndustry || !location) return;
    
    setIsScaleRunning(true);
    
    // Create multiple campaigns with different scales
    const campaigns: ScaleCampaign[] = [
      {
        id: '1',
        name: `${targetIndustry} - Small Scale`,
        targetSize: 100,
        emailsSent: 0,
        openRate: 0,
        replyRate: 0,
        meetingsBooked: 0,
        dealsClosed: 0,
        status: 'running'
      },
      {
        id: '2',
        name: `${targetIndustry} - Medium Scale`,
        targetSize: 1000,
        emailsSent: 0,
        openRate: 0,
        replyRate: 0,
        meetingsBooked: 0,
        dealsClosed: 0,
        status: 'running'
      },
      {
        id: '3',
        name: `${targetIndustry} - Enterprise Scale`,
        targetSize: 5000,
        emailsSent: 0,
        openRate: 0,
        replyRate: 0,
        meetingsBooked: 0,
        dealsClosed: 0,
        status: 'running'
      }
    ];
    
    setScaleCampaigns(campaigns);
    
    // Simulate sending emails in batches
    let batchCount = 0;
    const interval = setInterval(() => {
      batchCount++;
      
      setScaleCampaigns(prev => prev.map(campaign => {
        const emailsInBatch = Math.min(50, campaign.targetSize - campaign.emailsSent);
        const newEmailsSent = campaign.emailsSent + emailsInBatch;
        const newOpenRate = Math.min(100, (newEmailsSent * 0.35)); // 35% open rate
        const newReplyRate = Math.min(100, (newEmailsSent * 0.08)); // 8% reply rate
        const newMeetingsBooked = Math.floor(newEmailsSent * 0.05); // 5% meeting rate
        const newDealsClosed = Math.floor(newEmailsSent * 0.015); // 1.5% close rate
        
        return {
          ...campaign,
          emailsSent: newEmailsSent,
          openRate: Math.round(newOpenRate),
          replyRate: Math.round(newReplyRate),
          meetingsBooked: newMeetingsBooked,
          dealsClosed: newDealsClosed,
          status: newEmailsSent >= campaign.targetSize ? 'completed' : 'running'
        };
      }));
      
      // Stop after all campaigns are complete
      if (batchCount >= 20) {
        clearInterval(interval);
        setIsScaleRunning(false);
      }
    }, 500); // Update every 500ms for fast simulation
  };

  const resetDemo = () => {
    setSimulationStep('input');
    setGeneratedEmail(null);
    setEmails([]);
    setAnalytics({
      emailsSent: 0,
      openRate: 0,
      replyRate: 0,
      meetingsBooked: 0,
      dealsClosed: 0
    });
    setIsScaleMode(false);
    setScaleCampaigns([]);
    setIsScaleRunning(false);
  };

  const totalScaleAnalytics = scaleCampaigns.reduce((acc, campaign) => ({
    emailsSent: acc.emailsSent + campaign.emailsSent,
    openRate: Math.round((acc.emailsSent * acc.openRate + campaign.emailsSent * campaign.openRate) / (acc.emailsSent + campaign.emailsSent) || 0),
    replyRate: Math.round((acc.emailsSent * acc.replyRate + campaign.emailsSent * campaign.replyRate) / (acc.emailsSent + campaign.emailsSent) || 0),
    meetingsBooked: acc.meetingsBooked + campaign.meetingsBooked,
    dealsClosed: acc.dealsClosed + campaign.dealsClosed
  }), { emailsSent: 0, openRate: 0, replyRate: 0, meetingsBooked: 0, dealsClosed: 0 });

  return (
    <section className="py-32 sm:py-48 bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            See Deal Crafter AI in action
          </h2>
          <p className="mt-6 text-xl leading-8 text-gray-600">
            Watch as our AI generates, sends, and tracks personalized outreach in real-time
          </p>
          
          {/* Mode Toggle */}
          <div className="mt-8 flex justify-center">
            <div className="bg-white rounded-xl p-1 shadow-sm border border-gray-200">
              <button
                onClick={() => setIsScaleMode(false)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  !isScaleMode 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Single Email
              </button>
              <button
                onClick={() => setIsScaleMode(true)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isScaleMode 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Scale Campaign
              </button>
            </div>
          </div>
        </div>

        {!isScaleMode ? (
          // Single Email Mode
          <div className="mx-auto mt-20 max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left: Input Form */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Configure Your Campaign</h3>
                  
                  {simulationStep === 'input' && (
                    <form onSubmit={handleGenerateMessage} className="space-y-6">
                      <div>
                        <label htmlFor="industry" className="block text-sm font-semibold leading-6 text-gray-900 mb-3">
                          Target Industry
                        </label>
                        <input
                          type="text"
                          id="industry"
                          value={targetIndustry}
                          onChange={(e) => setTargetIndustry(e.target.value)}
                          className="block w-full rounded-xl border-0 py-4 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 text-lg"
                          placeholder="e.g., SaaS, E-commerce, Healthcare"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="location" className="block text-sm font-semibold leading-6 text-gray-900 mb-3">
                          Location
                        </label>
                        <input
                          type="text"
                          id="location"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          className="block w-full rounded-xl border-0 py-4 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 text-lg"
                          placeholder="e.g., San Francisco, New York, Remote"
                          required
                        />
                      </div>
                      
                      <button
                        type="submit"
                        disabled={isLoading || !targetIndustry || !location}
                        className="flex w-full justify-center items-center gap-x-3 rounded-xl bg-black px-8 py-4 text-lg font-semibold text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                      >
                        {isLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            Generating...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-5 w-5" />
                            Generate & Send Email
                          </>
                        )}
                      </button>
                    </form>
                  )}

                  {simulationStep !== 'input' && (
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                        <div className="flex items-center gap-2 text-blue-900">
                          <CheckCircle className="h-5 w-5" />
                          <span className="font-medium">Campaign Active</span>
                        </div>
                        <p className="text-sm text-blue-700 mt-1">
                          {targetIndustry} companies in {location}
                        </p>
                      </div>
                      
                      <button
                        onClick={resetDemo}
                        className="w-full rounded-xl bg-gray-100 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
                      >
                        Start New Campaign
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Center: Email Simulation */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Email Campaign</h3>
                  
                  {simulationStep === 'generating' && (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <p className="text-gray-600">AI is crafting your personalized email...</p>
                    </div>
                  )}

                  {simulationStep === 'email' && generatedEmail && (
                    <div className="space-y-4">
                      <div className="border border-gray-200 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-500">To: {generatedEmail.to}</span>
                          <span className="text-xs text-gray-400">Draft</span>
                        </div>
                        <div className="text-sm font-medium text-gray-900 mb-2">
                          Subject: {generatedEmail.subject}
                        </div>
                        <div className="text-sm text-gray-700 whitespace-pre-wrap">
                          {generatedEmail.content}
                        </div>
                      </div>
                      
                      <button
                        onClick={simulateEmailSending}
                        className="flex w-full justify-center items-center gap-x-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-500 transition-colors"
                      >
                        <Send className="h-4 w-4" />
                        Send Email
                      </button>
                    </div>
                  )}

                  {simulationStep === 'sending' && (
                    <div className="text-center py-8">
                      <div className="animate-pulse">
                        <Send className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                        <p className="text-gray-600">Sending email...</p>
                      </div>
                    </div>
                  )}

                  {simulationStep === 'opened' && emails[0] && (
                    <div className="space-y-4">
                      <div className="border border-green-200 rounded-xl p-4 bg-green-50">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-500">To: {emails[0].to}</span>
                          <span className="text-xs text-green-600 flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            Opened
                          </span>
                        </div>
                        <div className="text-sm font-medium text-gray-900 mb-2">
                          Subject: {emails[0].subject}
                        </div>
                        <div className="text-sm text-gray-700 whitespace-pre-wrap">
                          {emails[0].content}
                        </div>
                      </div>
                    </div>
                  )}

                  {simulationStep === 'replied' && emails[0] && (
                    <div className="space-y-4">
                      <div className="border border-green-200 rounded-xl p-4 bg-green-50">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-500">To: {emails[0].to}</span>
                          <span className="text-xs text-green-600 flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            Replied
                          </span>
                        </div>
                        <div className="text-sm font-medium text-gray-900 mb-2">
                          Subject: {emails[0].subject}
                        </div>
                        <div className="text-sm text-gray-700 whitespace-pre-wrap">
                          {emails[0].content}
                        </div>
                      </div>
                      
                      {emails[0].reply && (
                        <div className="border border-blue-200 rounded-xl p-4 bg-blue-50 ml-4">
                          <div className="text-xs text-blue-600 mb-2">Reply received</div>
                          <div className="text-sm text-gray-700 whitespace-pre-wrap">
                            {emails[0].reply}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {simulationStep === 'analytics' && (
                    <div className="space-y-4">
                      <div className="border border-green-200 rounded-xl p-4 bg-green-50">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-500">To: {emails[0]?.to}</span>
                          <span className="text-xs text-green-600 flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" />
                            Meeting Booked
                          </span>
                        </div>
                        <div className="text-sm font-medium text-gray-900 mb-2">
                          Subject: {emails[0]?.subject}
                        </div>
                        <div className="text-sm text-gray-700 whitespace-pre-wrap">
                          {emails[0]?.content}
                        </div>
                      </div>
                      
                      {emails[0]?.reply && (
                        <div className="border border-blue-200 rounded-xl p-4 bg-blue-50 ml-4">
                          <div className="text-xs text-blue-600 mb-2">Reply received</div>
                          <div className="text-sm text-gray-700 whitespace-pre-wrap">
                            {emails[0].reply}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Right: Analytics */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Real-Time Analytics</h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Send className="h-6 w-6 text-blue-600" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">Emails Sent</div>
                          <div className="text-2xl font-bold text-blue-600">{analytics.emailsSent}</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Mail className="h-6 w-6 text-green-600" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">Open Rate</div>
                          <div className="text-2xl font-bold text-green-600">{analytics.openRate}%</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <MessageSquare className="h-6 w-6 text-purple-600" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">Reply Rate</div>
                          <div className="text-2xl font-bold text-purple-600">{analytics.replyRate}%</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-orange-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Users className="h-6 w-6 text-orange-600" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">Meetings Booked</div>
                          <div className="text-2xl font-bold text-orange-600">{analytics.meetingsBooked}</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <TrendingUp className="h-6 w-6 text-red-600" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">Deals Closed</div>
                          <div className="text-2xl font-bold text-red-600">${analytics.dealsClosed}k</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {simulationStep === 'analytics' && (
                    <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
                      <div className="text-sm font-medium text-green-900 mb-1">
                        Campaign Success!
                      </div>
                      <div className="text-xs text-green-700">
                        Your AI-generated email resulted in a meeting booking within minutes.
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Scale Mode
          <div className="mx-auto mt-20 max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left: Campaign Configuration */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Scale Campaign Setup</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="scale-industry" className="block text-sm font-semibold leading-6 text-gray-900 mb-3">
                        Target Industry
                      </label>
                      <input
                        type="text"
                        id="scale-industry"
                        value={targetIndustry}
                        onChange={(e) => setTargetIndustry(e.target.value)}
                        className="block w-full rounded-xl border-0 py-4 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 text-lg"
                        placeholder="e.g., SaaS, E-commerce, Healthcare"
                      />
                    </div>
                    <div>
                      <label htmlFor="scale-location" className="block text-sm font-semibold leading-6 text-gray-900 mb-3">
                        Location
                      </label>
                      <input
                        type="text"
                        id="scale-location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="block w-full rounded-xl border-0 py-4 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 text-lg"
                        placeholder="e.g., San Francisco, New York, Remote"
                      />
                    </div>
                    
                    <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                      <div className="flex items-center gap-2 text-blue-900 mb-2">
                        <Zap className="h-5 w-5" />
                        <span className="font-medium">Scale Capabilities</span>
                      </div>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Send up to 5,000 emails per day</li>
                        <li>• AI personalizes each message</li>
                        <li>• Automated follow-up sequences</li>
                        <li>• Real-time analytics & optimization</li>
                      </ul>
                    </div>
                    
                    <button
                      onClick={startScaleCampaign}
                      disabled={isScaleRunning || !targetIndustry || !location}
                      className="flex w-full justify-center items-center gap-x-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 text-lg font-semibold text-white shadow-sm hover:from-blue-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      {isScaleRunning ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          Running Campaigns...
                        </>
                      ) : (
                        <>
                          <Target className="h-5 w-5" />
                          Launch Scale Campaigns
                        </>
                      )}
                    </button>
                    
                    <button
                      onClick={resetDemo}
                      className="w-full rounded-xl bg-gray-100 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
                    >
                      Reset Demo
                    </button>
                  </div>
                </div>
              </div>

              {/* Right: Scale Analytics */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Scale Campaign Analytics</h3>
                  
                  {scaleCampaigns.length > 0 ? (
                    <div className="space-y-6">
                      {/* Individual Campaigns */}
                      {scaleCampaigns.map((campaign) => (
                        <div key={campaign.id} className="border border-gray-200 rounded-xl p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-gray-900">{campaign.name}</h4>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              campaign.status === 'running' 
                                ? 'bg-blue-100 text-blue-700' 
                                : 'bg-green-100 text-green-700'
                            }`}>
                              {campaign.status === 'running' ? 'Running' : 'Completed'}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <div className="text-gray-600">Target</div>
                              <div className="font-semibold">{campaign.targetSize.toLocaleString()}</div>
                            </div>
                            <div>
                              <div className="text-gray-600">Sent</div>
                              <div className="font-semibold">{campaign.emailsSent.toLocaleString()}</div>
                            </div>
                            <div>
                              <div className="text-gray-600">Open Rate</div>
                              <div className="font-semibold text-green-600">{campaign.openRate}%</div>
                            </div>
                            <div>
                              <div className="text-gray-600">Reply Rate</div>
                              <div className="font-semibold text-purple-600">{campaign.replyRate}%</div>
                            </div>
                            <div>
                              <div className="text-gray-600">Meetings</div>
                              <div className="font-semibold text-orange-600">{campaign.meetingsBooked}</div>
                            </div>
                            <div>
                              <div className="text-gray-600">Deals</div>
                              <div className="font-semibold text-red-600">{campaign.dealsClosed}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {/* Total Analytics */}
                      <div className="border-t pt-6">
                        <h4 className="font-semibold text-gray-900 mb-4">Total Results</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-blue-50 rounded-xl">
                            <div className="text-sm text-gray-600">Total Emails</div>
                            <div className="text-2xl font-bold text-blue-600">{totalScaleAnalytics.emailsSent.toLocaleString()}</div>
                          </div>
                          <div className="p-4 bg-green-50 rounded-xl">
                            <div className="text-sm text-gray-600">Avg Open Rate</div>
                            <div className="text-2xl font-bold text-green-600">{totalScaleAnalytics.openRate}%</div>
                          </div>
                          <div className="p-4 bg-purple-50 rounded-xl">
                            <div className="text-sm text-gray-600">Total Meetings</div>
                            <div className="text-2xl font-bold text-purple-600">{totalScaleAnalytics.meetingsBooked}</div>
                          </div>
                          <div className="p-4 bg-red-50 rounded-xl">
                            <div className="text-sm text-gray-600">Potential Revenue</div>
                            <div className="text-2xl font-bold text-red-600">${(totalScaleAnalytics.dealsClosed * 50).toLocaleString()}k</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Configure your campaign and click &quot;Launch Scale Campaigns&quot; to see the results</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {isLoading && (
        <LoadingAnimation 
          message="Generating AI Message..." 
          showProgress={true}
        />
      )}
    </section>
  );
} 
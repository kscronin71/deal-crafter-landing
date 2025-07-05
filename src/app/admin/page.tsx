'use client';

import { useState, useEffect } from 'react';
import { Download, Mail, Users, TrendingUp, CheckCircle, Clock } from 'lucide-react';

interface Signup {
  email: string;
  source: string;
  timestamp: string;
  id: string;
  lastUpdated?: string;
  status: 'early-access' | 'paid';
  paidAt?: string;
  emailSequence?: {
    welcomeSent: boolean;
    welcomeSentAt?: string;
    followUpSent: boolean;
    followUpSentAt?: string;
    onboardingSent: boolean;
    onboardingSentAt?: string;
  };
}

interface Analytics {
  total: number;
  earlyAccess: number;
  paid: number;
  bySource: Record<string, number>;
  recentSignups: Signup[];
}

export default function AdminPage() {
  const [signups, setSignups] = useState<Signup[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'early-access' | 'paid'>('all');

  useEffect(() => {
    fetchSignups();
  }, []);

  const fetchSignups = async () => {
    try {
      const response = await fetch('/api/signups');
      if (response.ok) {
        const data = await response.json();
        setSignups(data.signups);
        setAnalytics(data.analytics);
      }
    } catch (error) {
      console.error('Error fetching signups:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const exportSignups = () => {
    const csvContent = [
      ['Email', 'Status', 'Source', 'Signup Date', 'Paid Date', 'Welcome Sent', 'Follow-up Sent', 'Onboarding Sent'],
      ...signups.map(signup => [
        signup.email,
        signup.status,
        signup.source,
        new Date(signup.timestamp).toLocaleDateString(),
        signup.paidAt ? new Date(signup.paidAt).toLocaleDateString() : '',
        signup.emailSequence?.welcomeSent ? 'Yes' : 'No',
        signup.emailSequence?.followUpSent ? 'Yes' : 'No',
        signup.emailSequence?.onboardingSent ? 'Yes' : 'No'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dealcrafter-signups-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const sendWelcomeEmail = async (email: string) => {
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, type: 'welcome' }),
      });

      if (response.ok) {
        fetchSignups(); // Refresh data
        alert('Welcome email sent successfully!');
      } else {
        alert('Failed to send welcome email');
      }
    } catch (error) {
      console.error('Error sending welcome email:', error);
      alert('Error sending welcome email');
    }
  };

  const filteredSignups = signups.filter(signup => {
    if (filter === 'all') return true;
    return signup.status === filter;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading signups...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Deal Crafter AI Admin</h1>
          <p className="text-gray-600">Manage signups and track user engagement</p>
        </div>

        {/* Analytics Dashboard */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Signups</p>
                  <p className="text-3xl font-bold text-gray-900">{analytics.total}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Early Access</p>
                  <p className="text-3xl font-bold text-orange-600">{analytics.earlyAccess}</p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Paid Users</p>
                  <p className="text-3xl font-bold text-green-600">{analytics.paid}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {analytics.total > 0 ? Math.round((analytics.paid / analytics.total) * 100) : 0}%
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </div>
        )}

        {/* Source Breakdown */}
        {analytics && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Signups by Source</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(analytics.bySource).map(([source, count]) => (
                <div key={source} className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{count}</p>
                  <p className="text-sm text-gray-600 capitalize">{source.replace('-', ' ')}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-600 hover:text-gray-900 border border-gray-200'
              }`}
            >
              All ({signups.length})
            </button>
            <button
              onClick={() => setFilter('early-access')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'early-access' 
                  ? 'bg-orange-600 text-white' 
                  : 'bg-white text-gray-600 hover:text-gray-900 border border-gray-200'
              }`}
            >
              Early Access ({signups.filter(s => s.status === 'early-access').length})
            </button>
            <button
              onClick={() => setFilter('paid')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'paid' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-white text-gray-600 hover:text-gray-900 border border-gray-200'
              }`}
            >
              Paid ({signups.filter(s => s.status === 'paid').length})
            </button>
          </div>

          <button
            onClick={exportSignups}
            className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>

        {/* Signups Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Source
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Signup Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email Sequence
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSignups.map((signup) => (
                  <tr key={signup.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{signup.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        signup.status === 'paid' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {signup.status === 'paid' ? 'Paid' : 'Early Access'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900 capitalize">
                        {signup.source.replace('-', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(signup.timestamp).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(signup.timestamp).toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <span className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${
                          signup.emailSequence?.welcomeSent 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          <Mail className="h-3 w-3 mr-1" />
                          Welcome
                        </span>
                        <span className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${
                          signup.emailSequence?.followUpSent 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          Follow-up
                        </span>
                        <span className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${
                          signup.emailSequence?.onboardingSent 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          Onboarding
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {!signup.emailSequence?.welcomeSent && (
                        <button
                          onClick={() => sendWelcomeEmail(signup.email)}
                          className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                        >
                          Send Welcome
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredSignups.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No signups found for the selected filter.</p>
          </div>
        )}
      </div>
    </div>
  );
} 
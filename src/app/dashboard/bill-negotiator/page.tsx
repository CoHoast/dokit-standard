'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Bill {
  id: number;
  member_name: string;
  provider_name: string;
  total_billed: number;
  fair_price: number;
  status: string;
  received_at: string;
  savings_amount?: number;
  savings_percent?: number;
}

interface Analytics {
  overview: {
    totalBills: number;
    settledBills: number;
    pendingBills: number;
    totalSavings: number;
    avgSavingsPercent: string;
  };
  negotiations: {
    acceptanceRate: string;
  };
}

export default function BillNegotiatorPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [recentBills, setRecentBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_ADMIN_API_URL || '';
      const clientId = process.env.NEXT_PUBLIC_CLIENT_ID || '1';
      
      // Fetch analytics
      const analyticsRes = await fetch(`${apiUrl}/api/db/bill-negotiator/analytics?clientId=${clientId}`);
      if (analyticsRes.ok) {
        const analyticsData = await analyticsRes.json();
        setAnalytics(analyticsData);
      }

      // Fetch recent bills
      const billsRes = await fetch(`${apiUrl}/api/db/bill-negotiator/bills?clientId=${clientId}&limit=10`);
      if (billsRes.ok) {
        const billsData = await billsRes.json();
        setRecentBills(billsData.bills || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'settled': 
      case 'paid': return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' };
      case 'offer_sent': 
      case 'awaiting_response': return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' };
      case 'counter_received': return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' };
      case 'ready_to_negotiate': return { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200' };
      default: return { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200' };
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      received: 'New',
      analyzing: 'Analyzing',
      ready_to_negotiate: 'Ready',
      offer_sent: 'Offer Sent',
      awaiting_response: 'Awaiting',
      counter_received: 'Counter',
      settled: 'Settled',
      paid: 'Paid'
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center min-h-[400px]">
        <div className="text-slate-500">Loading Bill Negotiator...</div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">
            Bill Negotiator
          </h1>
          <p className="text-slate-500 mt-1">
            AI-powered medical bill negotiation
          </p>
        </div>
        <Link
          href="/dashboard/bill-negotiator/bills/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-500 text-white rounded-xl font-semibold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-shadow"
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M12 4v16m8-8H4"/>
          </svg>
          Add Bill
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
              <svg width="20" height="20" className="text-indigo-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
            <span className="text-sm text-slate-500 font-medium">Total Bills</span>
          </div>
          <p className="text-2xl lg:text-3xl font-bold text-slate-900">{analytics?.overview.totalBills || 0}</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
              <svg width="20" height="20" className="text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <span className="text-sm text-slate-500 font-medium">Total Savings</span>
          </div>
          <p className="text-2xl lg:text-3xl font-bold text-green-600">{formatCurrency(analytics?.overview.totalSavings || 0)}</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
              <svg width="20" height="20" className="text-violet-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <span className="text-sm text-slate-500 font-medium">Acceptance Rate</span>
          </div>
          <p className="text-2xl lg:text-3xl font-bold text-slate-900">{analytics?.negotiations.acceptanceRate || 0}%</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <svg width="20" height="20" className="text-amber-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <span className="text-sm text-slate-500 font-medium">Pending</span>
          </div>
          <p className="text-2xl lg:text-3xl font-bold text-slate-900">{analytics?.overview.pendingBills || 0}</p>
        </div>
      </div>

      {/* Recent Bills */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Recent Bills</h2>
          <Link href="/dashboard/bill-negotiator/bills" className="text-sm text-indigo-500 font-medium hover:text-indigo-600">
            View all →
          </Link>
        </div>

        {recentBills.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-2xl flex items-center justify-center">
              <svg width="32" height="32" className="text-slate-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No bills yet</h3>
            <p className="text-slate-500 mb-6">Get started by adding your first medical bill</p>
            <Link
              href="/dashboard/bill-negotiator/bills/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-500 text-white rounded-xl font-semibold text-sm hover:bg-indigo-600 transition-colors"
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 4v16m8-8H4"/>
              </svg>
              Add First Bill
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentBills.map((bill) => {
              const statusStyle = getStatusStyle(bill.status);
              return (
                <Link
                  key={bill.id}
                  href={`/dashboard/bill-negotiator/bills/${bill.id}`}
                  className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                      <svg width="20" height="20" className="text-slate-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{bill.member_name || 'Unknown Member'}</p>
                      <p className="text-sm text-slate-500">{bill.provider_name || 'Unknown Provider'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right hidden sm:block">
                      <p className="font-semibold text-slate-900">{formatCurrency(bill.total_billed || 0)}</p>
                      {bill.savings_amount && (
                        <p className="text-sm text-green-600">-{formatCurrency(bill.savings_amount)} saved</p>
                      )}
                    </div>
                    <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${statusStyle.bg} ${statusStyle.text} border ${statusStyle.border}`}>
                      {getStatusLabel(bill.status)}
                    </span>
                    <svg width="20" height="20" className="text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M9 5l7 7-7 7"/>
                    </svg>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

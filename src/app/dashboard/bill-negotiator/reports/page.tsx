'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { colors, getStatusColor, getStatusLabel } from '@/lib/design-tokens';

interface Analytics {
  overview: {
    totalBills: number;
    settledBills: number;
    pendingBills: number;
    totalBilled: number;
    totalSavings: number;
    avgSavingsPercent: string;
    avgDaysToSettle: string;
  };
  negotiations: {
    total: number;
    accepted: number;
    countered: number;
    rejected: number;
    acceptanceRate: string;
  };
  statusBreakdown: Array<{ status: string; count: number; total_billed: number }>;
  topProviders: Array<{ provider_name: string; bill_count: number; total_savings: number; avg_savings_percent: number }>;
  monthlySavings: Array<{ month: string; savings: number; bills: number }>;
}

// Simple Bar Chart Component
const BarChart = ({ data }: { data: { label: string; value: number }[] }) => {
  const max = Math.max(...data.map(d => d.value));
  
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '120px' }}>
      {data.map((item, index) => (
        <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '100%',
            height: `${max > 0 ? (item.value / max) * 100 : 0}px`,
            background: colors.purple,
            borderRadius: '4px 4px 0 0',
            minHeight: '4px',
            transition: 'height 0.5s ease-out'
          }} />
          <span style={{ fontSize: '11px', color: colors.textMuted }}>{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default function BillNegotiatorReportsPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('year');

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_ADMIN_API_URL || '';
      const clientId = process.env.NEXT_PUBLIC_CLIENT_ID || '1';
      
      const res = await fetch(`${apiUrl}/api/db/bill-negotiator/analytics?clientId=${clientId}&period=${period}`);
      if (res.ok) {
        const data = await res.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
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

  // Mock data for demo
  const mockAnalytics: Analytics = {
    overview: {
      totalBills: 47,
      settledBills: 38,
      pendingBills: 9,
      totalBilled: 156000,
      totalSavings: 42500,
      avgSavingsPercent: '27.2',
      avgDaysToSettle: '4.5'
    },
    negotiations: {
      total: 45,
      accepted: 38,
      countered: 5,
      rejected: 2,
      acceptanceRate: '84.4'
    },
    statusBreakdown: [
      { status: 'settled', count: 38, total_billed: 125000 },
      { status: 'awaiting_response', count: 5, total_billed: 18000 },
      { status: 'analyzing', count: 4, total_billed: 13000 },
    ],
    topProviders: [
      { provider_name: 'Memorial Hospital', bill_count: 12, total_savings: 15200, avg_savings_percent: 32 },
      { provider_name: 'City Medical Center', bill_count: 8, total_savings: 9800, avg_savings_percent: 28 },
      { provider_name: 'Regional Health', bill_count: 6, total_savings: 7500, avg_savings_percent: 25 },
    ],
    monthlySavings: [
      { month: 'Jan', savings: 5200, bills: 6 },
      { month: 'Feb', savings: 4800, bills: 5 },
      { month: 'Mar', savings: 6100, bills: 7 },
      { month: 'Apr', savings: 5500, bills: 6 },
      { month: 'May', savings: 7200, bills: 8 },
      { month: 'Jun', savings: 8700, bills: 9 },
    ]
  };

  const data = analytics || mockAnalytics;

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            border: `2px solid ${colors.border}`,
            borderTopColor: colors.purple,
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 16px'
          }} />
          <p style={{ color: colors.textMuted, fontSize: '14px' }}>Loading...</p>
        </div>
        <style jsx>{`@keyframes spin { to { transform: rotate(360deg); }}`}</style>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <Link 
          href="/dashboard/bill-negotiator"
          style={{ 
            fontSize: '13px', 
            color: colors.purple, 
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            marginBottom: '12px'
          }}
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back to Bill Negotiator
        </Link>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: '600', color: colors.text, marginBottom: '4px' }}>
              Reports & Analytics
            </h1>
            <p style={{ fontSize: '14px', color: colors.textSecondary }}>
              Track your savings and negotiation performance
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                border: `1px solid ${colors.border}`,
                fontSize: '13px',
                color: colors.text,
                cursor: 'pointer',
                background: colors.cardBg
              }}
            >
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
              <option value="all">All Time</option>
            </select>
            <button
              style={{
                padding: '8px 16px',
                background: colors.cardBg,
                color: colors.text,
                borderRadius: '8px',
                border: `1px solid ${colors.border}`,
                fontSize: '13px',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
              </svg>
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={{
          background: `linear-gradient(135deg, ${colors.greenLight} 0%, rgba(16, 185, 129, 0.05) 100%)`,
          borderRadius: '12px',
          padding: '24px',
          border: `1px solid rgba(16, 185, 129, 0.2)`
        }}>
          <p style={{ fontSize: '13px', color: colors.textSecondary, marginBottom: '8px' }}>Total Savings</p>
          <p style={{ fontSize: '32px', fontWeight: '700', color: colors.green }}>
            {formatCurrency(data.overview.totalSavings)}
          </p>
          <p style={{ fontSize: '13px', color: colors.textSecondary, marginTop: '8px' }}>
            {data.overview.avgSavingsPercent}% average per bill
          </p>
        </div>

        <div style={{
          background: colors.cardBg,
          borderRadius: '12px',
          padding: '24px',
          border: `1px solid ${colors.border}`
        }}>
          <p style={{ fontSize: '13px', color: colors.textSecondary, marginBottom: '8px' }}>Bills Processed</p>
          <p style={{ fontSize: '32px', fontWeight: '700', color: colors.text }}>
            {data.overview.totalBills}
          </p>
          <p style={{ fontSize: '13px', color: colors.textSecondary, marginTop: '8px' }}>
            {data.overview.settledBills} settled, {data.overview.pendingBills} pending
          </p>
        </div>

        <div style={{
          background: colors.cardBg,
          borderRadius: '12px',
          padding: '24px',
          border: `1px solid ${colors.border}`
        }}>
          <p style={{ fontSize: '13px', color: colors.textSecondary, marginBottom: '8px' }}>Acceptance Rate</p>
          <p style={{ fontSize: '32px', fontWeight: '700', color: colors.text }}>
            {data.negotiations.acceptanceRate}%
          </p>
          <p style={{ fontSize: '13px', color: colors.textSecondary, marginTop: '8px' }}>
            {data.negotiations.accepted} of {data.negotiations.total} offers accepted
          </p>
        </div>

        <div style={{
          background: colors.cardBg,
          borderRadius: '12px',
          padding: '24px',
          border: `1px solid ${colors.border}`
        }}>
          <p style={{ fontSize: '13px', color: colors.textSecondary, marginBottom: '8px' }}>Avg Days to Settle</p>
          <p style={{ fontSize: '32px', fontWeight: '700', color: colors.text }}>
            {data.overview.avgDaysToSettle}
          </p>
          <p style={{ fontSize: '13px', color: colors.textSecondary, marginTop: '8px' }}>
            days average turnaround
          </p>
        </div>
      </div>

      {/* Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        
        {/* Monthly Savings Chart */}
        <div style={{
          background: colors.cardBg,
          borderRadius: '12px',
          padding: '24px',
          border: `1px solid ${colors.border}`
        }}>
          <h3 style={{ fontSize: '15px', fontWeight: '600', color: colors.text, marginBottom: '20px' }}>
            Monthly Savings
          </h3>
          <BarChart data={data.monthlySavings.map(m => ({ label: m.month, value: m.savings }))} />
        </div>

        {/* Negotiation Outcomes */}
        <div style={{
          background: colors.cardBg,
          borderRadius: '12px',
          padding: '24px',
          border: `1px solid ${colors.border}`
        }}>
          <h3 style={{ fontSize: '15px', fontWeight: '600', color: colors.text, marginBottom: '20px' }}>
            Negotiation Outcomes
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '13px', color: colors.textSecondary }}>Accepted</span>
                <span style={{ fontSize: '13px', fontWeight: '600', color: colors.text }}>{data.negotiations.accepted}</span>
              </div>
              <div style={{ height: '8px', background: colors.borderLight, borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${data.negotiations.total > 0 ? (data.negotiations.accepted / data.negotiations.total) * 100 : 0}%`,
                  background: colors.green,
                  borderRadius: '4px'
                }} />
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '13px', color: colors.textSecondary }}>Countered</span>
                <span style={{ fontSize: '13px', fontWeight: '600', color: colors.text }}>{data.negotiations.countered}</span>
              </div>
              <div style={{ height: '8px', background: colors.borderLight, borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${data.negotiations.total > 0 ? (data.negotiations.countered / data.negotiations.total) * 100 : 0}%`,
                  background: colors.amber,
                  borderRadius: '4px'
                }} />
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '13px', color: colors.textSecondary }}>Rejected</span>
                <span style={{ fontSize: '13px', fontWeight: '600', color: colors.text }}>{data.negotiations.rejected}</span>
              </div>
              <div style={{ height: '8px', background: colors.borderLight, borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${data.negotiations.total > 0 ? (data.negotiations.rejected / data.negotiations.total) * 100 : 0}%`,
                  background: colors.rose,
                  borderRadius: '4px'
                }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Providers */}
      <div style={{
        background: colors.cardBg,
        borderRadius: '12px',
        border: `1px solid ${colors.border}`,
        overflow: 'hidden'
      }}>
        <div style={{ padding: '20px', borderBottom: `1px solid ${colors.borderLight}` }}>
          <h3 style={{ fontSize: '15px', fontWeight: '600', color: colors.text }}>
            Top Providers by Savings
          </h3>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Provider</th>
              <th style={{ padding: '12px 20px', textAlign: 'right', fontSize: '12px', fontWeight: '500', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Bills</th>
              <th style={{ padding: '12px 20px', textAlign: 'right', fontSize: '12px', fontWeight: '500', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Savings</th>
              <th style={{ padding: '12px 20px', textAlign: 'right', fontSize: '12px', fontWeight: '500', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Avg Savings</th>
            </tr>
          </thead>
          <tbody>
            {data.topProviders.map((provider, index) => (
              <tr key={index} style={{ borderTop: `1px solid ${colors.borderLight}` }}>
                <td style={{ padding: '14px 20px', fontSize: '14px', color: colors.text, fontWeight: '500' }}>
                  {provider.provider_name}
                </td>
                <td style={{ padding: '14px 20px', fontSize: '14px', color: colors.textSecondary, textAlign: 'right' }}>
                  {provider.bill_count}
                </td>
                <td style={{ padding: '14px 20px', fontSize: '14px', color: colors.green, fontWeight: '600', textAlign: 'right' }}>
                  {formatCurrency(provider.total_savings)}
                </td>
                <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '600',
                    background: colors.greenLight,
                    color: colors.green
                  }}>
                    {provider.avg_savings_percent}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

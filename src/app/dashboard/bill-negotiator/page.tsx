'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { colors, getStatusColor, getStatusLabel } from '@/lib/design-tokens';

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
    newBills: number;
    totalSavings: number;
    avgSavingsPercent: string;
  };
  negotiations: {
    total: number;
    accepted: number;
    acceptanceRate: string;
  };
  automation: {
    automationRate: string;
  };
  statusBreakdown: Array<{ status: string; count: number }>;
}

export default function BillNegotiatorPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [recentBills, setRecentBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('month');

  useEffect(() => {
    fetchData();
  }, [period]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_ADMIN_API_URL || '';
      const clientId = process.env.NEXT_PUBLIC_CLIENT_ID || '1';
      
      const analyticsRes = await fetch(`${apiUrl}/api/db/bill-negotiator/analytics?clientId=${clientId}&period=${period}`);
      if (analyticsRes.ok) {
        const analyticsData = await analyticsRes.json();
        setAnalytics(analyticsData);
      }

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
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '600', color: colors.text, marginBottom: '4px' }}>
            Bill Negotiator
          </h1>
          <p style={{ fontSize: '14px', color: colors.textSecondary }}>
            AI-powered medical bill negotiation
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
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
            <option value="day">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
            <option value="all">All Time</option>
          </select>
          <Link
            href="/dashboard/bill-negotiator/reports"
            style={{
              padding: '8px 16px',
              background: colors.cardBg,
              color: colors.text,
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '500',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              border: `1px solid ${colors.border}`,
            }}
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
            </svg>
            Reports
          </Link>
          <Link
            href="/dashboard/bill-negotiator/bills/new"
            style={{
              padding: '8px 16px',
              background: colors.text,
              color: 'white',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '500',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add Bill
          </Link>
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        
        {/* Total Bills */}
        <div style={{
          background: colors.cardBg,
          borderRadius: '12px',
          padding: '20px',
          border: `1px solid ${colors.border}`
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: colors.purpleLight,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg width="20" height="20" fill="none" stroke={colors.purple} strokeWidth="2" viewBox="0 0 24 24">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
            </div>
          </div>
          <p style={{ fontSize: '13px', color: colors.textMuted, marginBottom: '4px' }}>Total Bills</p>
          <p style={{ fontSize: '28px', fontWeight: '700', color: colors.text, letterSpacing: '-0.5px' }}>
            {analytics?.overview.totalBills || 0}
          </p>
        </div>

        {/* Total Savings */}
        <div style={{
          background: colors.cardBg,
          borderRadius: '12px',
          padding: '20px',
          border: `1px solid ${colors.border}`
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: colors.greenLight,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg width="20" height="20" fill="none" stroke={colors.green} strokeWidth="2" viewBox="0 0 24 24">
                <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
              </svg>
            </div>
            {analytics?.overview.avgSavingsPercent && (
              <span style={{
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '600',
                background: colors.greenLight,
                color: colors.green
              }}>
                {analytics.overview.avgSavingsPercent}% avg
              </span>
            )}
          </div>
          <p style={{ fontSize: '13px', color: colors.textMuted, marginBottom: '4px' }}>Total Savings</p>
          <p style={{ fontSize: '28px', fontWeight: '700', color: colors.green, letterSpacing: '-0.5px' }}>
            {formatCurrency(analytics?.overview.totalSavings || 0)}
          </p>
        </div>

        {/* Acceptance Rate */}
        <div style={{
          background: colors.cardBg,
          borderRadius: '12px',
          padding: '20px',
          border: `1px solid ${colors.border}`
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: colors.cyanLight,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg width="20" height="20" fill="none" stroke={colors.cyan} strokeWidth="2" viewBox="0 0 24 24">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
          </div>
          <p style={{ fontSize: '13px', color: colors.textMuted, marginBottom: '4px' }}>Acceptance Rate</p>
          <p style={{ fontSize: '28px', fontWeight: '700', color: colors.text, letterSpacing: '-0.5px' }}>
            {analytics?.negotiations.acceptanceRate || 0}%
          </p>
        </div>

        {/* Pending */}
        <div style={{
          background: colors.cardBg,
          borderRadius: '12px',
          padding: '20px',
          border: `1px solid ${colors.border}`
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: colors.amberLight,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg width="20" height="20" fill="none" stroke={colors.amber} strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            {(analytics?.overview.pendingBills || 0) > 0 && (
              <span style={{
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '600',
                background: colors.amberLight,
                color: colors.amber
              }}>
                Needs attention
              </span>
            )}
          </div>
          <p style={{ fontSize: '13px', color: colors.textMuted, marginBottom: '4px' }}>Pending Bills</p>
          <p style={{ fontSize: '28px', fontWeight: '700', color: colors.text, letterSpacing: '-0.5px' }}>
            {analytics?.overview.pendingBills || 0}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '24px' }}>
        <Link href="/dashboard/bill-negotiator/bills/new" style={{
          padding: '16px',
          background: colors.cardBg,
          borderRadius: '10px',
          border: `1px solid ${colors.border}`,
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          transition: 'border-color 0.15s'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: colors.purpleLight,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <svg width="20" height="20" fill="none" stroke={colors.purple} strokeWidth="2" viewBox="0 0 24 24">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </div>
          <div>
            <p style={{ fontSize: '14px', fontWeight: '500', color: colors.text }}>New Bill</p>
            <p style={{ fontSize: '12px', color: colors.textMuted }}>Add manually</p>
          </div>
        </Link>
        
        <Link href="/dashboard/bill-negotiator/settings" style={{
          padding: '16px',
          background: colors.cardBg,
          borderRadius: '10px',
          border: `1px solid ${colors.border}`,
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          transition: 'border-color 0.15s'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: colors.grayLight,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <svg width="20" height="20" fill="none" stroke={colors.gray} strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/>
            </svg>
          </div>
          <div>
            <p style={{ fontSize: '14px', fontWeight: '500', color: colors.text }}>Settings</p>
            <p style={{ fontSize: '12px', color: colors.textMuted }}>Configure rules</p>
          </div>
        </Link>
        
        <Link href="/dashboard/bill-negotiator/audit" style={{
          padding: '16px',
          background: colors.cardBg,
          borderRadius: '10px',
          border: `1px solid ${colors.border}`,
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          transition: 'border-color 0.15s'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: colors.cyanLight,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <svg width="20" height="20" fill="none" stroke={colors.cyan} strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <div>
            <p style={{ fontSize: '14px', fontWeight: '500', color: colors.text }}>Audit Log</p>
            <p style={{ fontSize: '12px', color: colors.textMuted }}>View activity</p>
          </div>
        </Link>

        <Link href="/dashboard/bill-negotiator/reports" style={{
          padding: '16px',
          background: colors.cardBg,
          borderRadius: '10px',
          border: `1px solid ${colors.border}`,
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          transition: 'border-color 0.15s'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: colors.blueLight,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <svg width="20" height="20" fill="none" stroke={colors.blue} strokeWidth="2" viewBox="0 0 24 24">
              <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
            </svg>
          </div>
          <div>
            <p style={{ fontSize: '14px', fontWeight: '500', color: colors.text }}>Reports</p>
            <p style={{ fontSize: '12px', color: colors.textMuted }}>Analytics</p>
          </div>
        </Link>
      </div>

      {/* Main Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px' }}>
        
        {/* Recent Bills */}
        <div style={{
          background: colors.cardBg,
          borderRadius: '12px',
          border: `1px solid ${colors.border}`,
          overflow: 'hidden'
        }}>
          <div style={{ 
            padding: '18px 20px', 
            borderBottom: `1px solid ${colors.borderLight}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <h2 style={{ fontSize: '15px', fontWeight: '600', color: colors.text, marginBottom: '2px' }}>
                Recent Bills
              </h2>
              <p style={{ fontSize: '13px', color: colors.textMuted }}>
                Latest bill activity
              </p>
            </div>
            <Link href="/dashboard/bill-negotiator/bills" style={{
              fontSize: '13px',
              fontWeight: '500',
              color: colors.purple,
              textDecoration: 'none'
            }}>
              View all →
            </Link>
          </div>
          
          {recentBills.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '16px',
                background: colors.purpleLight,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}>
                <svg width="32" height="32" fill="none" stroke={colors.purple} strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
              </div>
              <p style={{ fontSize: '15px', fontWeight: '500', color: colors.text, marginBottom: '4px' }}>
                No bills yet
              </p>
              <p style={{ fontSize: '13px', color: colors.textMuted, marginBottom: '16px' }}>
                Add your first medical bill to get started
              </p>
              <Link
                href="/dashboard/bill-negotiator/bills/new"
                style={{
                  display: 'inline-flex',
                  padding: '10px 20px',
                  background: colors.text,
                  color: 'white',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontWeight: '500',
                  fontSize: '13px'
                }}
              >
                Add First Bill
              </Link>
            </div>
          ) : (
            <div>
              {recentBills.slice(0, 6).map((bill, index) => {
                const statusStyle = getStatusColor(bill.status);
                return (
                  <Link
                    key={bill.id}
                    href={`/dashboard/bill-negotiator/bills/${bill.id}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '14px 20px',
                      borderBottom: index < recentBills.length - 1 ? `1px solid ${colors.borderLight}` : 'none',
                      textDecoration: 'none',
                      transition: 'background 0.15s'
                    }}
                  >
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: colors.purpleLight,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '14px',
                      flexShrink: 0
                    }}>
                      <svg width="18" height="18" fill="none" stroke={colors.purple} strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                      </svg>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: '14px', fontWeight: '500', color: colors.text, marginBottom: '2px' }}>
                        {bill.member_name || 'Unknown Member'}
                      </p>
                      <p style={{ fontSize: '12px', color: colors.textMuted }}>
                        {bill.provider_name || 'Unknown Provider'}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right', marginRight: '12px' }}>
                      <p style={{ fontSize: '14px', fontWeight: '600', color: colors.text }}>
                        {formatCurrency(bill.total_billed || 0)}
                      </p>
                      {bill.savings_amount && (
                        <p style={{ fontSize: '11px', color: colors.green }}>
                          -{formatCurrency(bill.savings_amount)} saved
                        </p>
                      )}
                    </div>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '500',
                      background: statusStyle.bg,
                      color: statusStyle.text
                    }}>
                      {getStatusLabel(bill.status)}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Status Breakdown */}
          <div style={{
            background: colors.cardBg,
            borderRadius: '12px',
            padding: '20px',
            border: `1px solid ${colors.border}`
          }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', color: colors.text, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="16" height="16" fill="none" stroke={colors.purple} strokeWidth="2" viewBox="0 0 24 24">
                <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
              </svg>
              Status Breakdown
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {analytics?.statusBreakdown?.slice(0, 5).map((item) => {
                const statusStyle = getStatusColor(item.status);
                const percentage = analytics.overview.totalBills > 0 
                  ? Math.round((item.count / analytics.overview.totalBills) * 100) 
                  : 0;
                return (
                  <div key={item.status}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '13px', color: colors.textSecondary }}>{getStatusLabel(item.status)}</span>
                      <span style={{ fontSize: '13px', fontWeight: '600', color: colors.text }}>{item.count}</span>
                    </div>
                    <div style={{ height: '6px', background: colors.borderLight, borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        width: `${percentage}%`,
                        background: statusStyle.text,
                        borderRadius: '3px'
                      }} />
                    </div>
                  </div>
                );
              })}
              {(!analytics?.statusBreakdown || analytics.statusBreakdown.length === 0) && (
                <p style={{ fontSize: '13px', color: colors.textMuted, textAlign: 'center', padding: '16px 0' }}>
                  No data yet
                </p>
              )}
            </div>
          </div>

          {/* Savings Summary */}
          <div style={{
            background: `linear-gradient(135deg, ${colors.greenLight} 0%, rgba(16, 185, 129, 0.05) 100%)`,
            borderRadius: '12px',
            padding: '20px',
            border: `1px solid rgba(16, 185, 129, 0.2)`
          }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', color: colors.text, marginBottom: '12px' }}>
              Your Savings
            </h3>
            <p style={{ fontSize: '32px', fontWeight: '700', color: colors.green, marginBottom: '4px' }}>
              {formatCurrency(analytics?.overview.totalSavings || 0)}
            </p>
            <p style={{ fontSize: '13px', color: colors.textSecondary }}>
              Avg {analytics?.overview.avgSavingsPercent || 0}% per bill
            </p>
          </div>

          {/* Need Help */}
          <div style={{
            background: colors.cardBg,
            borderRadius: '12px',
            padding: '20px',
            border: `1px solid ${colors.border}`
          }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', color: colors.text, marginBottom: '8px' }}>
              Need Help?
            </h3>
            <p style={{ fontSize: '13px', color: colors.textMuted, marginBottom: '12px' }}>
              Our team is here to help you maximize your savings.
            </p>
            <a
              href="mailto:support@dokit.ai"
              style={{
                display: 'inline-flex',
                padding: '8px 16px',
                background: colors.purpleLight,
                color: colors.purple,
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: '500',
                fontSize: '13px'
              }}
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

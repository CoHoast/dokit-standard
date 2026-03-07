'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { colors } from '@/lib/design-tokens';

interface AuditEvent {
  id: number;
  event_type: string;
  bill_id: number | null;
  bill_member_name: string | null;
  details: string;
  created_at: string;
}

export default function BillNegotiatorAuditPage() {
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchAuditLog();
  }, [filter]);

  const fetchAuditLog = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_ADMIN_API_URL || '';
      const clientId = process.env.NEXT_PUBLIC_CLIENT_ID || '1';
      
      const res = await fetch(`${apiUrl}/api/db/bill-negotiator/audit?clientId=${clientId}&limit=50`);
      if (res.ok) {
        const data = await res.json();
        setEvents(data.events || []);
      }
    } catch (error) {
      console.error('Error fetching audit log:', error);
    }
    setLoading(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'bill.created':
        return (
          <svg width="16" height="16" fill="none" stroke={colors.purple} strokeWidth="2" viewBox="0 0 24 24">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
          </svg>
        );
      case 'bill.analyzed':
        return (
          <svg width="16" height="16" fill="none" stroke={colors.blue} strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        );
      case 'offer.sent':
        return (
          <svg width="16" height="16" fill="none" stroke={colors.cyan} strokeWidth="2" viewBox="0 0 24 24">
            <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        );
      case 'bill.settled':
        return (
          <svg width="16" height="16" fill="none" stroke={colors.green} strokeWidth="2" viewBox="0 0 24 24">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        );
      case 'settings.updated':
        return (
          <svg width="16" height="16" fill="none" stroke={colors.gray} strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="3"/>
          </svg>
        );
      default:
        return (
          <svg width="16" height="16" fill="none" stroke={colors.gray} strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10"/>
          </svg>
        );
    }
  };

  const getEventColor = (eventType: string) => {
    switch (eventType) {
      case 'bill.created': return colors.purpleLight;
      case 'bill.analyzed': return colors.blueLight;
      case 'offer.sent': return colors.cyanLight;
      case 'bill.settled': return colors.greenLight;
      default: return colors.grayLight;
    }
  };

  const getEventLabel = (eventType: string) => {
    const labels: Record<string, string> = {
      'bill.created': 'Bill Created',
      'bill.analyzed': 'Bill Analyzed',
      'offer.sent': 'Offer Sent',
      'counter.received': 'Counter Received',
      'bill.settled': 'Bill Settled',
      'bill.paid': 'Bill Paid',
      'settings.updated': 'Settings Updated',
    };
    return labels[eventType] || eventType;
  };

  // Mock data for demo
  const mockEvents: AuditEvent[] = [
    { id: 1, event_type: 'bill.settled', bill_id: 123, bill_member_name: 'Sarah Johnson', details: 'Bill settled for $2,450 (saved $1,250)', created_at: new Date().toISOString() },
    { id: 2, event_type: 'offer.sent', bill_id: 124, bill_member_name: 'Michael Chen', details: 'Negotiation offer sent to Memorial Hospital', created_at: new Date(Date.now() - 3600000).toISOString() },
    { id: 3, event_type: 'bill.analyzed', bill_id: 124, bill_member_name: 'Michael Chen', details: 'AI analysis complete - Fair price: $1,800', created_at: new Date(Date.now() - 7200000).toISOString() },
    { id: 4, event_type: 'bill.created', bill_id: 124, bill_member_name: 'Michael Chen', details: 'New bill uploaded - $3,500 from Memorial Hospital', created_at: new Date(Date.now() - 10800000).toISOString() },
    { id: 5, event_type: 'settings.updated', bill_id: null, bill_member_name: null, details: 'Auto-approve threshold changed to $500', created_at: new Date(Date.now() - 86400000).toISOString() },
  ];

  const displayEvents = events.length > 0 ? events : mockEvents;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px' }}>
      
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
              Audit Log
            </h1>
            <p style={{ fontSize: '14px', color: colors.textSecondary }}>
              Track all activity on your bills
            </p>
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
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
            <option value="all">All Events</option>
            <option value="bills">Bill Events</option>
            <option value="settings">Settings Changes</option>
          </select>
        </div>
      </div>

      {/* Audit Log List */}
      <div style={{
        background: colors.cardBg,
        borderRadius: '12px',
        border: `1px solid ${colors.border}`,
        overflow: 'hidden'
      }}>
        {loading ? (
          <div style={{ padding: '48px', textAlign: 'center' }}>
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
            <style jsx>{`@keyframes spin { to { transform: rotate(360deg); }}`}</style>
          </div>
        ) : displayEvents.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              background: colors.grayLight,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <svg width="32" height="32" fill="none" stroke={colors.gray} strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <p style={{ fontSize: '15px', fontWeight: '500', color: colors.text, marginBottom: '4px' }}>
              No activity yet
            </p>
            <p style={{ fontSize: '13px', color: colors.textMuted }}>
              Events will appear here as you use Bill Negotiator
            </p>
          </div>
        ) : (
          <div>
            {displayEvents.map((event, index) => (
              <div
                key={event.id}
                style={{
                  padding: '16px 20px',
                  borderBottom: index < displayEvents.length - 1 ? `1px solid ${colors.borderLight}` : 'none',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '16px'
                }}
              >
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: getEventColor(event.event_type),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {getEventIcon(event.event_type)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '4px' }}>
                    <p style={{ fontSize: '14px', fontWeight: '500', color: colors.text }}>
                      {getEventLabel(event.event_type)}
                      {event.bill_member_name && (
                        <span style={{ fontWeight: '400', color: colors.textSecondary }}> — {event.bill_member_name}</span>
                      )}
                    </p>
                    <span style={{ fontSize: '12px', color: colors.textMuted, whiteSpace: 'nowrap' }}>
                      {formatDate(event.created_at)}
                    </span>
                  </div>
                  <p style={{ fontSize: '13px', color: colors.textSecondary }}>
                    {event.details}
                  </p>
                  {event.bill_id && (
                    <Link
                      href={`/dashboard/bill-negotiator/bills/${event.bill_id}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '12px',
                        color: colors.purple,
                        textDecoration: 'none',
                        marginTop: '8px'
                      }}
                    >
                      View Bill
                      <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_ADMIN_API_URL || '';
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || '';

interface LineItem {
  cpt_code: string;
  description: string;
  quantity: number;
  charge: number;
  medicare_rate?: number;
  fair_price?: number;
}

interface Bill {
  id: number;
  client_id: number;
  member_id: string;
  member_name: string;
  provider_name: string;
  provider_npi: string;
  account_number: string;
  date_of_service: string;
  total_billed: number;
  medicare_rate?: number;
  fair_price: number;
  status: string;
  line_items?: LineItem[];
  notes?: string;
  received_at: string;
  analyzed_at?: string;
  settled_at?: string;
}

interface Negotiation {
  id: number;
  bill_id: number;
  round: number;
  strategy: string;
  offer_amount: number;
  counter_amount?: number;
  final_amount?: number;
  status: string;
  response_status: string;
  savings_amount?: number;
  savings_percent?: number;
  offer_sent_at?: string;
  response_received_at?: string;
  auto_negotiated: boolean;
  created_at: string;
}

// Status progression for visual indicator
const STATUS_STEPS = [
  { key: 'received', label: 'Received', icon: '📥' },
  { key: 'analyzing', label: 'Analyzing', icon: '🔍' },
  { key: 'ready_to_negotiate', label: 'Ready', icon: '✅' },
  { key: 'offer_sent', label: 'Offer Sent', icon: '📤' },
  { key: 'awaiting_response', label: 'Awaiting', icon: '⏳' },
  { key: 'settled', label: 'Settled', icon: '🤝' },
  { key: 'paid', label: 'Paid', icon: '💰' },
];

export default function BillDetailPage() {
  const params = useParams();
  const billId = params.id as string;
  
  const [bill, setBill] = useState<Bill | null>(null);
  const [negotiations, setNegotiations] = useState<Negotiation[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [offerAmount, setOfferAmount] = useState('');
  const [offerStrategy, setOfferStrategy] = useState('cash_pay');
  const [responseType, setResponseType] = useState('accepted');
  const [counterAmount, setCounterAmount] = useState('');

  const fetchBill = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/db/bill-negotiator/bills/${billId}`);
      if (!res.ok) throw new Error('Bill not found');
      const data = await res.json();
      setBill(data);
      if (data.fair_price && !offerAmount) {
        setOfferAmount(Math.round(data.fair_price * 0.6).toString());
      }
    } catch (error) {
      console.error('Error fetching bill:', error);
    }
  }, [billId, offerAmount]);

  const fetchNegotiations = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/db/bill-negotiator/negotiations?bill_id=${billId}`);
      const data = await res.json();
      setNegotiations(data.negotiations || []);
    } catch (error) {
      console.error('Error fetching negotiations:', error);
    }
  }, [billId]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await fetchBill();
      await fetchNegotiations();
      setLoading(false);
    };
    load();
  }, [fetchBill, fetchNegotiations]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusIndex = (status: string) => {
    // Handle counter_received as part of negotiation flow
    if (status === 'counter_received') return 4; // Same as awaiting_response visually
    const index = STATUS_STEPS.findIndex(s => s.key === status);
    return index >= 0 ? index : 0;
  };

  const createOffer = async () => {
    if (!offerAmount) return;
    setActionLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/db/bill-negotiator/negotiations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bill_id: parseInt(billId),
          client_id: parseInt(CLIENT_ID),
          strategy: offerStrategy,
          offer_amount: parseFloat(offerAmount),
          round: negotiations.length + 1
        })
      });
      if (!res.ok) throw new Error('Failed to create offer');

      await fetch(`${API_URL}/api/db/bill-negotiator/bills/${billId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'offer_sent' })
      });

      setShowOfferModal(false);
      setOfferAmount('');
      await fetchBill();
      await fetchNegotiations();
    } catch (error) {
      console.error('Error creating offer:', error);
      alert('Failed to create offer');
    }
    setActionLoading(false);
  };

  const recordResponse = async () => {
    const activeNeg = negotiations.find(n => n.response_status === 'pending');
    if (!activeNeg) return;

    setActionLoading(true);
    try {
      const payload: Record<string, unknown> = {
        response_status: responseType,
        response_received_at: new Date().toISOString()
      };

      if (responseType === 'accepted') {
        payload.final_amount = activeNeg.offer_amount;
        payload.status = 'accepted';
        payload.savings_amount = bill ? bill.total_billed - activeNeg.offer_amount : 0;
        payload.savings_percent = bill ? ((bill.total_billed - activeNeg.offer_amount) / bill.total_billed * 100) : 0;
      } else if (responseType === 'counter_received' && counterAmount) {
        payload.counter_amount = parseFloat(counterAmount);
      } else if (responseType === 'rejected') {
        payload.status = 'rejected';
      }

      await fetch(`${API_URL}/api/db/bill-negotiator/negotiations/${activeNeg.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      // Update bill status
      const newBillStatus = responseType === 'accepted' ? 'settled' : 
                            responseType === 'counter_received' ? 'counter_received' : 'ready_to_negotiate';
      await fetch(`${API_URL}/api/db/bill-negotiator/bills/${billId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newBillStatus })
      });

      setShowResponseModal(false);
      setCounterAmount('');
      await fetchBill();
      await fetchNegotiations();
    } catch (error) {
      console.error('Error recording response:', error);
      alert('Failed to record response');
    }
    setActionLoading(false);
  };

  if (loading) {
    return (
      <div style={{ padding: '32px', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <p style={{ color: '#64748b' }}>Loading bill details...</p>
      </div>
    );
  }

  if (!bill) {
    return (
      <div style={{ padding: '32px', textAlign: 'center' }}>
        <p style={{ fontSize: '48px', marginBottom: '16px' }}>😕</p>
        <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#0f172a', marginBottom: '8px' }}>Bill not found</h2>
        <Link href="/dashboard/bill-negotiator/bills" style={{ color: '#6366f1' }}>Back to Bills</Link>
      </div>
    );
  }

  const currentStepIndex = getStatusIndex(bill.status);
  const activeNegotiation = negotiations.find(n => n.response_status === 'pending');
  const settledNegotiation = negotiations.find(n => n.response_status === 'accepted');

  return (
    <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
        <Link href="/dashboard/bill-negotiator" style={{ color: '#64748b', textDecoration: 'none', fontSize: '14px' }}>Bill Negotiator</Link>
        <span style={{ color: '#cbd5e1' }}>/</span>
        <Link href="/dashboard/bill-negotiator/bills" style={{ color: '#64748b', textDecoration: 'none', fontSize: '14px' }}>Bills</Link>
        <span style={{ color: '#cbd5e1' }}>/</span>
        <span style={{ color: '#6366f1', fontWeight: 500, fontSize: '14px' }}>#{bill.id}</span>
      </div>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>{bill.member_name}</h1>
          <p style={{ color: '#64748b', fontSize: '15px' }}>{bill.provider_name} • Account #{bill.account_number}</p>
        </div>
        
        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          {bill.status === 'ready_to_negotiate' && (
            <button onClick={() => setShowOfferModal(true)} style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontWeight: 600,
              cursor: 'pointer'
            }}>
              Create Offer
            </button>
          )}
          {(bill.status === 'offer_sent' || bill.status === 'awaiting_response') && activeNegotiation && (
            <button onClick={() => setShowResponseModal(true)} style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontWeight: 600,
              cursor: 'pointer'
            }}>
              Record Response
            </button>
          )}
          {bill.status === 'counter_received' && (
            <button onClick={() => setShowOfferModal(true)} style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontWeight: 600,
              cursor: 'pointer'
            }}>
              Counter Again
            </button>
          )}
        </div>
      </div>

      {/* Status Progression Bar */}
      <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#64748b', marginBottom: '20px', textTransform: 'uppercase' }}>Workflow Status</h3>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
          {/* Progress Line */}
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '40px',
            right: '40px',
            height: '4px',
            background: '#e2e8f0',
            borderRadius: '2px',
            zIndex: 0
          }}>
            <div style={{
              height: '100%',
              width: `${(currentStepIndex / (STATUS_STEPS.length - 1)) * 100}%`,
              background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)',
              borderRadius: '2px',
              transition: 'width 0.3s ease'
            }} />
          </div>
          
          {STATUS_STEPS.map((step, index) => {
            const isComplete = index < currentStepIndex;
            const isCurrent = index === currentStepIndex;
            const isPending = index > currentStepIndex;
            
            return (
              <div key={step.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1 }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  background: isComplete ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' :
                              isCurrent ? 'white' : '#f1f5f9',
                  border: isCurrent ? '3px solid #6366f1' : 'none',
                  boxShadow: isCurrent ? '0 0 0 4px rgba(99, 102, 241, 0.2)' : 'none'
                }}>
                  {isComplete ? '✓' : step.icon}
                </div>
                <span style={{
                  marginTop: '8px',
                  fontSize: '12px',
                  fontWeight: isCurrent ? 600 : 400,
                  color: isCurrent ? '#6366f1' : isPending ? '#94a3b8' : '#0f172a'
                }}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Bill Summary */}
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a' }}>Bill Summary</h2>
            </div>
            <div style={{ padding: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '24px' }}>
                <div>
                  <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '6px', textTransform: 'uppercase', fontWeight: 500 }}>Total Billed</p>
                  <p style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a' }}>{formatCurrency(bill.total_billed)}</p>
                </div>
                <div>
                  <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '6px', textTransform: 'uppercase', fontWeight: 500 }}>Medicare Rate</p>
                  <p style={{ fontSize: '24px', fontWeight: 700, color: '#64748b' }}>{bill.medicare_rate ? formatCurrency(bill.medicare_rate) : '-'}</p>
                </div>
                <div>
                  <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '6px', textTransform: 'uppercase', fontWeight: 500 }}>Fair Price</p>
                  <p style={{ fontSize: '24px', fontWeight: 700, color: '#6366f1' }}>{bill.fair_price ? formatCurrency(bill.fair_price) : '-'}</p>
                </div>
                <div>
                  <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '6px', textTransform: 'uppercase', fontWeight: 500 }}>
                    {settledNegotiation ? 'Final Amount' : 'Target Savings'}
                  </p>
                  <p style={{ fontSize: '24px', fontWeight: 700, color: '#16a34a' }}>
                    {settledNegotiation ? formatCurrency(settledNegotiation.final_amount || 0) :
                     bill.fair_price ? `${((bill.total_billed - bill.fair_price) / bill.total_billed * 100).toFixed(0)}%` : '-'}
                  </p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '10px' }}>
                  <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Date of Service</p>
                  <p style={{ fontWeight: 500, color: '#0f172a' }}>{formatDate(bill.date_of_service)}</p>
                </div>
                <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '10px' }}>
                  <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Member ID</p>
                  <p style={{ fontWeight: 500, color: '#0f172a' }}>{bill.member_id || 'N/A'}</p>
                </div>
                <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '10px' }}>
                  <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Provider NPI</p>
                  <p style={{ fontWeight: 500, color: '#0f172a' }}>{bill.provider_npi || 'N/A'}</p>
                </div>
                <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '10px' }}>
                  <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Received</p>
                  <p style={{ fontWeight: 500, color: '#0f172a' }}>{formatDate(bill.received_at)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Line Items */}
          {bill.line_items && bill.line_items.length > 0 && (
            <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0' }}>
                <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a' }}>Line Items</h2>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8fafc' }}>
                    <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#64748b' }}>CPT</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#64748b' }}>Description</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '12px', fontWeight: 600, color: '#64748b' }}>Charge</th>
                    <th style={{ padding: '12px 20px', textAlign: 'right', fontSize: '12px', fontWeight: 600, color: '#64748b' }}>Fair Price</th>
                  </tr>
                </thead>
                <tbody>
                  {bill.line_items.map((item, i) => (
                    <tr key={i} style={{ borderTop: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '14px 20px', fontWeight: 500, color: '#0f172a' }}>{item.cpt_code}</td>
                      <td style={{ padding: '14px 16px', color: '#64748b' }}>{item.description}</td>
                      <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 500, color: '#0f172a' }}>{formatCurrency(item.charge)}</td>
                      <td style={{ padding: '14px 20px', textAlign: 'right', fontWeight: 500, color: '#6366f1' }}>
                        {item.fair_price ? formatCurrency(item.fair_price) : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Negotiation Timeline */}
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a' }}>Negotiation Timeline</h2>
            </div>
            
            {negotiations.length === 0 ? (
              <div style={{ padding: '48px', textAlign: 'center' }}>
                <p style={{ fontSize: '36px', marginBottom: '12px' }}>💬</p>
                <p style={{ color: '#64748b' }}>No negotiations yet</p>
              </div>
            ) : (
              <div style={{ padding: '24px' }}>
                {negotiations.map((neg, i) => (
                  <div key={neg.id} style={{
                    display: 'flex',
                    gap: '16px',
                    paddingBottom: i < negotiations.length - 1 ? '24px' : 0,
                    borderLeft: '2px solid #e2e8f0',
                    marginLeft: '12px',
                    paddingLeft: '24px',
                    position: 'relative'
                  }}>
                    {/* Timeline dot */}
                    <div style={{
                      position: 'absolute',
                      left: '-7px',
                      top: 0,
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      background: neg.response_status === 'accepted' ? '#16a34a' :
                                  neg.response_status === 'pending' ? '#6366f1' : '#d97706',
                      border: '2px solid white'
                    }} />
                    
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <div>
                          <span style={{ fontWeight: 600, color: '#0f172a' }}>Round {neg.round}</span>
                          <span style={{ marginLeft: '12px', fontSize: '13px', color: '#64748b' }}>
                            {neg.strategy.replace('_', ' ')}
                          </span>
                        </div>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: 600,
                          background: neg.response_status === 'accepted' ? '#dcfce7' :
                                       neg.response_status === 'counter_received' ? '#fef3c7' :
                                       neg.response_status === 'pending' ? '#dbeafe' : '#fee2e2',
                          color: neg.response_status === 'accepted' ? '#16a34a' :
                                 neg.response_status === 'counter_received' ? '#d97706' :
                                 neg.response_status === 'pending' ? '#2563eb' : '#dc2626'
                        }}>
                          {neg.response_status === 'pending' ? 'Awaiting' :
                           neg.response_status === 'accepted' ? 'Accepted' :
                           neg.response_status === 'counter_received' ? 'Countered' : 'Rejected'}
                        </span>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '24px', marginBottom: '8px' }}>
                        <div>
                          <span style={{ fontSize: '12px', color: '#64748b' }}>Our Offer: </span>
                          <span style={{ fontWeight: 600, color: '#0f172a' }}>{formatCurrency(neg.offer_amount)}</span>
                        </div>
                        {neg.counter_amount && (
                          <div>
                            <span style={{ fontSize: '12px', color: '#64748b' }}>Their Counter: </span>
                            <span style={{ fontWeight: 600, color: '#d97706' }}>{formatCurrency(neg.counter_amount)}</span>
                          </div>
                        )}
                        {neg.final_amount && (
                          <div>
                            <span style={{ fontSize: '12px', color: '#64748b' }}>Final: </span>
                            <span style={{ fontWeight: 600, color: '#16a34a' }}>{formatCurrency(neg.final_amount)}</span>
                          </div>
                        )}
                      </div>
                      
                      {neg.savings_amount && neg.savings_amount > 0 && (
                        <div style={{ padding: '8px 12px', background: '#ecfdf5', borderRadius: '6px', display: 'inline-block' }}>
                          <span style={{ fontSize: '13px', color: '#059669', fontWeight: 500 }}>
                            💰 Saved {formatCurrency(neg.savings_amount)} ({neg.savings_percent?.toFixed(0)}%)
                          </span>
                        </div>
                      )}
                      
                      <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '8px' }}>
                        {formatDate(neg.created_at)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Quick Stats */}
          {settledNegotiation && (
            <div style={{ 
              background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)', 
              borderRadius: '16px', 
              padding: '24px',
              color: 'white'
            }}>
              <h3 style={{ fontSize: '14px', fontWeight: 500, opacity: 0.9, marginBottom: '8px' }}>TOTAL SAVINGS</h3>
              <p style={{ fontSize: '32px', fontWeight: 700, marginBottom: '4px' }}>
                {formatCurrency(settledNegotiation.savings_amount || 0)}
              </p>
              <p style={{ fontSize: '14px', opacity: 0.9 }}>
                {settledNegotiation.savings_percent?.toFixed(0)}% off original bill
              </p>
            </div>
          )}

          {/* Provider Info */}
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a', marginBottom: '20px' }}>Provider</h3>
            <div style={{ marginBottom: '16px' }}>
              <p style={{ fontSize: '15px', fontWeight: 500, color: '#0f172a' }}>{bill.provider_name}</p>
              <p style={{ fontSize: '13px', color: '#64748b' }}>NPI: {bill.provider_npi || 'N/A'}</p>
            </div>
            <Link href={`/dashboard/providers?npi=${bill.provider_npi}`} style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              color: '#6366f1',
              textDecoration: 'none'
            }}>
              View Provider History →
            </Link>
          </div>

          {/* Member Info */}
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a', marginBottom: '20px' }}>Member</h3>
            <div style={{ marginBottom: '16px' }}>
              <p style={{ fontSize: '15px', fontWeight: 500, color: '#0f172a' }}>{bill.member_name}</p>
              <p style={{ fontSize: '13px', color: '#64748b' }}>ID: {bill.member_id || 'N/A'}</p>
            </div>
            <Link href={`/dashboard/members?id=${bill.member_id}`} style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              color: '#6366f1',
              textDecoration: 'none'
            }}>
              View Member Bills →
            </Link>
          </div>

          {/* Notes */}
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a', marginBottom: '16px' }}>Notes</h3>
            <textarea
              defaultValue={bill.notes || ''}
              placeholder="Add notes..."
              style={{
                width: '100%',
                minHeight: '80px',
                padding: '12px',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '14px',
                resize: 'vertical'
              }}
            />
          </div>
        </div>
      </div>

      {/* Create Offer Modal */}
      {showOfferModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '32px',
            width: '100%',
            maxWidth: '480px'
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '24px' }}>Create Offer</h2>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>Strategy</label>
              <select
                value={offerStrategy}
                onChange={(e) => setOfferStrategy(e.target.value)}
                style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px' }}
              >
                <option value="cash_pay">Cash Pay Discount</option>
                <option value="medicare_percentage">% of Medicare</option>
                <option value="bundled_rate">Bundled Rate</option>
              </select>
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>Offer Amount</label>
              <input
                type="number"
                value={offerAmount}
                onChange={(e) => setOfferAmount(e.target.value)}
                placeholder="0"
                style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px' }}
              />
              {bill.fair_price && (
                <p style={{ fontSize: '12px', color: '#64748b', marginTop: '8px' }}>
                  Fair price: {formatCurrency(bill.fair_price)} • Suggested: {formatCurrency(bill.fair_price * 0.6)}
                </p>
              )}
            </div>
            
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowOfferModal(false)} style={{
                padding: '12px 24px',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                background: 'white',
                cursor: 'pointer'
              }}>Cancel</button>
              <button onClick={createOffer} disabled={actionLoading || !offerAmount} style={{
                padding: '12px 24px',
                background: actionLoading || !offerAmount ? '#94a3b8' : '#6366f1',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 600,
                cursor: actionLoading || !offerAmount ? 'not-allowed' : 'pointer'
              }}>{actionLoading ? 'Creating...' : 'Create Offer'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Record Response Modal */}
      {showResponseModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '32px',
            width: '100%',
            maxWidth: '480px'
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '24px' }}>Record Response</h2>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '12px' }}>Response Type</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { value: 'accepted', label: 'Accepted', color: '#16a34a' },
                  { value: 'counter_received', label: 'Counter Offer', color: '#d97706' },
                  { value: 'rejected', label: 'Rejected', color: '#dc2626' }
                ].map(opt => (
                  <label key={opt.value} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '14px',
                    border: responseType === opt.value ? `2px solid ${opt.color}` : '1px solid #e2e8f0',
                    borderRadius: '10px',
                    cursor: 'pointer'
                  }}>
                    <input
                      type="radio"
                      name="responseType"
                      value={opt.value}
                      checked={responseType === opt.value}
                      onChange={(e) => setResponseType(e.target.value)}
                    />
                    <span style={{ fontWeight: 500 }}>{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {responseType === 'counter_received' && (
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>Counter Amount</label>
                <input
                  type="number"
                  value={counterAmount}
                  onChange={(e) => setCounterAmount(e.target.value)}
                  placeholder="0"
                  style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                />
              </div>
            )}
            
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowResponseModal(false)} style={{
                padding: '12px 24px',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                background: 'white',
                cursor: 'pointer'
              }}>Cancel</button>
              <button onClick={recordResponse} disabled={actionLoading} style={{
                padding: '12px 24px',
                background: actionLoading ? '#94a3b8' : '#6366f1',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 600,
                cursor: actionLoading ? 'not-allowed' : 'pointer'
              }}>{actionLoading ? 'Saving...' : 'Record Response'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

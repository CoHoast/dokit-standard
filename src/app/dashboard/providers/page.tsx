'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_ADMIN_API_URL || '';
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || '';

interface Bill {
  id: number;
  member_name: string;
  provider_name: string;
  provider_npi: string;
  total_billed: number;
  fair_price: number;
  status: string;
  date_of_service: string;
}

interface ProviderSummary {
  provider_npi: string;
  provider_name: string;
  total_bills: number;
  total_billed: number;
  total_settled: number;
  avg_settlement_percent: number;
  bills: Bill[];
}

export default function ProvidersPage() {
  const searchParams = useSearchParams();
  const preselectedNpi = searchParams.get('npi');
  
  const [providers, setProviders] = useState<ProviderSummary[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<ProviderSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchProviders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/db/bill-negotiator/bills?clientId=${CLIENT_ID}&limit=500`);
      const data = await res.json();
      const bills: Bill[] = data.bills || [];
      
      // Group by provider
      const providerMap = new Map<string, ProviderSummary>();
      bills.forEach(bill => {
        const key = bill.provider_npi || bill.provider_name;
        if (!providerMap.has(key)) {
          providerMap.set(key, {
            provider_npi: bill.provider_npi,
            provider_name: bill.provider_name,
            total_bills: 0,
            total_billed: 0,
            total_settled: 0,
            avg_settlement_percent: 0,
            bills: []
          });
        }
        const provider = providerMap.get(key)!;
        provider.total_bills++;
        provider.total_billed += bill.total_billed || 0;
        if (bill.status === 'settled' || bill.status === 'paid') {
          provider.total_settled++;
        }
        provider.bills.push(bill);
      });
      
      // Calculate average settlement percent
      providerMap.forEach(provider => {
        const settledBills = provider.bills.filter(b => b.status === 'settled' || b.status === 'paid');
        if (settledBills.length > 0) {
          const totalOriginal = settledBills.reduce((sum, b) => sum + b.total_billed, 0);
          const totalFinal = settledBills.reduce((sum, b) => sum + (b.fair_price || b.total_billed), 0);
          provider.avg_settlement_percent = totalOriginal > 0 ? (totalFinal / totalOriginal * 100) : 0;
        }
      });
      
      const providerList = Array.from(providerMap.values())
        .sort((a, b) => b.total_bills - a.total_bills);
      
      setProviders(providerList);
      
      // Auto-select if preselected NPI
      if (preselectedNpi) {
        const match = providerList.find(p => p.provider_npi === preselectedNpi);
        if (match) setSelectedProvider(match);
      }
    } catch (error) {
      console.error('Error fetching providers:', error);
    }
    setLoading(false);
  }, [preselectedNpi]);

  useEffect(() => {
    fetchProviders();
  }, [fetchProviders]);

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
      year: 'numeric'
    });
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'settled':
      case 'paid': return { bg: '#dcfce7', color: '#16a34a' };
      case 'offer_sent':
      case 'awaiting_response': return { bg: '#dbeafe', color: '#2563eb' };
      case 'counter_received': return { bg: '#fef3c7', color: '#d97706' };
      default: return { bg: '#f1f5f9', color: '#64748b' };
    }
  };

  const getSettlementIndicator = (percent: number) => {
    if (percent === 0) return { label: 'No Data', color: '#94a3b8' };
    if (percent < 50) return { label: 'Excellent', color: '#16a34a' };
    if (percent < 70) return { label: 'Good', color: '#22c55e' };
    if (percent < 85) return { label: 'Average', color: '#f59e0b' };
    return { label: 'Difficult', color: '#ef4444' };
  };

  const filteredProviders = providers.filter(p =>
    p.provider_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.provider_npi?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div style={{ padding: '32px', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <p style={{ color: '#64748b' }}>Loading providers...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>Provider Directory</h1>
        <p style={{ color: '#64748b' }}>View provider history and negotiation intelligence</p>
      </div>

      {/* Search */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ position: 'relative', maxWidth: '400px' }}>
          <svg 
            width="20" 
            height="20" 
            fill="none" 
            stroke="#94a3b8" 
            strokeWidth="2" 
            viewBox="0 0 24 24"
            style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
          >
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter by name or NPI..."
            style={{
              width: '100%',
              padding: '12px 16px 12px 44px',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              fontSize: '14px',
              outline: 'none'
            }}
          />
        </div>
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: selectedProvider ? '1fr 2fr' : '1fr', gap: '24px' }}>
        {/* Provider List */}
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a' }}>
              {filteredProviders.length} Provider{filteredProviders.length !== 1 ? 's' : ''}
            </h2>
          </div>
          
          <div style={{ maxHeight: '600px', overflow: 'auto' }}>
            {filteredProviders.map((provider, i) => {
              const settlement = getSettlementIndicator(provider.avg_settlement_percent);
              return (
                <div
                  key={provider.provider_npi || i}
                  onClick={() => setSelectedProvider(provider)}
                  style={{
                    padding: '16px 24px',
                    borderBottom: i < filteredProviders.length - 1 ? '1px solid #f1f5f9' : 'none',
                    cursor: 'pointer',
                    background: selectedProvider?.provider_npi === provider.provider_npi ? '#f5f3ff' : 'white',
                    transition: 'background 0.15s'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 600, color: '#0f172a', marginBottom: '4px' }}>{provider.provider_name}</p>
                      <p style={{ fontSize: '13px', color: '#64748b' }}>NPI: {provider.provider_npi || 'N/A'}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontWeight: 600, color: '#0f172a' }}>{provider.total_bills} bills</p>
                      <p style={{ fontSize: '12px', color: settlement.color, fontWeight: 500 }}>{settlement.label}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Provider Detail */}
        {selectedProvider && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Provider Summary */}
            <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
                {selectedProvider.provider_name}
              </h2>
              <p style={{ color: '#64748b', marginBottom: '24px' }}>NPI: {selectedProvider.provider_npi || 'N/A'}</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '10px' }}>
                  <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px', textTransform: 'uppercase' }}>Total Bills</p>
                  <p style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a' }}>{selectedProvider.total_bills}</p>
                </div>
                <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '10px' }}>
                  <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px', textTransform: 'uppercase' }}>Total Billed</p>
                  <p style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a' }}>{formatCurrency(selectedProvider.total_billed)}</p>
                </div>
                <div style={{ padding: '16px', background: '#ecfdf5', borderRadius: '10px' }}>
                  <p style={{ fontSize: '12px', color: '#059669', marginBottom: '4px', textTransform: 'uppercase' }}>Settled</p>
                  <p style={{ fontSize: '24px', fontWeight: 700, color: '#16a34a' }}>{selectedProvider.total_settled}</p>
                </div>
                <div style={{ padding: '16px', background: '#f5f3ff', borderRadius: '10px' }}>
                  <p style={{ fontSize: '12px', color: '#6366f1', marginBottom: '4px', textTransform: 'uppercase' }}>Avg Settlement</p>
                  <p style={{ fontSize: '24px', fontWeight: 700, color: '#6366f1' }}>
                    {selectedProvider.avg_settlement_percent > 0 ? `${selectedProvider.avg_settlement_percent.toFixed(0)}%` : '-'}
                  </p>
                </div>
              </div>
            </div>

            {/* Intelligence Card */}
            {selectedProvider.avg_settlement_percent > 0 && (
              <div style={{ 
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', 
                borderRadius: '16px', 
                padding: '24px',
                color: 'white'
              }}>
                <h3 style={{ fontSize: '14px', fontWeight: 500, opacity: 0.9, marginBottom: '12px' }}>NEGOTIATION INTELLIGENCE</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                  <div>
                    <p style={{ fontSize: '13px', opacity: 0.8, marginBottom: '4px' }}>Avg. Settlement Rate</p>
                    <p style={{ fontSize: '28px', fontWeight: 700 }}>{selectedProvider.avg_settlement_percent.toFixed(0)}%</p>
                    <p style={{ fontSize: '13px', opacity: 0.8 }}>of original bill</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '13px', opacity: 0.8, marginBottom: '4px' }}>Recommended Strategy</p>
                    <p style={{ fontSize: '18px', fontWeight: 600 }}>
                      {selectedProvider.avg_settlement_percent < 50 ? 'Start at 40%' :
                       selectedProvider.avg_settlement_percent < 70 ? 'Start at 50%' :
                       selectedProvider.avg_settlement_percent < 85 ? 'Start at 60%' : 'Be aggressive'}
                    </p>
                    <p style={{ fontSize: '13px', opacity: 0.8 }}>Based on {selectedProvider.total_settled} settlements</p>
                  </div>
                </div>
              </div>
            )}

            {/* Bills List */}
            <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a' }}>Bill History</h3>
              </div>
              <div style={{ maxHeight: '400px', overflow: 'auto' }}>
                {selectedProvider.bills.map((bill, i) => {
                  const statusStyle = getStatusStyle(bill.status);
                  return (
                    <Link
                      key={bill.id}
                      href={`/dashboard/bill-negotiator/bills/${bill.id}`}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '14px 24px',
                        borderBottom: i < selectedProvider.bills.length - 1 ? '1px solid #f1f5f9' : 'none',
                        textDecoration: 'none',
                        transition: 'background 0.15s'
                      }}
                    >
                      <div>
                        <p style={{ fontWeight: 500, color: '#0f172a', marginBottom: '2px' }}>{bill.member_name}</p>
                        <p style={{ fontSize: '12px', color: '#64748b' }}>{formatDate(bill.date_of_service)}</p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ fontWeight: 600, color: '#0f172a', fontSize: '14px' }}>{formatCurrency(bill.total_billed)}</p>
                          {bill.fair_price && bill.fair_price < bill.total_billed && (
                            <p style={{ fontSize: '12px', color: '#16a34a' }}>→ {formatCurrency(bill.fair_price)}</p>
                          )}
                        </div>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: 600,
                          background: statusStyle.bg,
                          color: statusStyle.color,
                          whiteSpace: 'nowrap'
                        }}>
                          {bill.status.replace('_', ' ')}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

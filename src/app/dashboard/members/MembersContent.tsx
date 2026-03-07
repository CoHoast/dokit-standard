'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_ADMIN_API_URL || '';
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || '';

interface Bill {
  id: number;
  member_id: string;
  member_name: string;
  provider_name: string;
  total_billed: number;
  fair_price: number;
  status: string;
  date_of_service: string;
  received_at: string;
}

interface MemberSummary {
  member_id: string;
  member_name: string;
  total_bills: number;
  total_billed: number;
  total_savings: number;
  bills: Bill[];
}

export default function MembersContent() {
  const searchParams = useSearchParams();
  const preselectedId = searchParams.get('id');
  
  const [searchTerm, setSearchTerm] = useState(preselectedId || '');
  const [members, setMembers] = useState<MemberSummary[]>([]);
  const [selectedMember, setSelectedMember] = useState<MemberSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const searchMembers = useCallback(async (term: string) => {
    if (!term.trim()) return;
    
    setLoading(true);
    setHasSearched(true);
    try {
      const res = await fetch(`${API_URL}/api/db/bill-negotiator/bills?clientId=${CLIENT_ID}&limit=500`);
      const data = await res.json();
      const bills: Bill[] = data.bills || [];
      
      const filteredBills = bills.filter(b => 
        b.member_name?.toLowerCase().includes(term.toLowerCase()) ||
        b.member_id?.toLowerCase().includes(term.toLowerCase())
      );
      
      const memberMap = new Map<string, MemberSummary>();
      filteredBills.forEach(bill => {
        const key = bill.member_id || bill.member_name;
        if (!memberMap.has(key)) {
          memberMap.set(key, {
            member_id: bill.member_id,
            member_name: bill.member_name,
            total_bills: 0,
            total_billed: 0,
            total_savings: 0,
            bills: []
          });
        }
        const member = memberMap.get(key)!;
        member.total_bills++;
        member.total_billed += bill.total_billed || 0;
        if (bill.status === 'settled' || bill.status === 'paid') {
          member.total_savings += (bill.total_billed - (bill.fair_price || bill.total_billed));
        }
        member.bills.push(bill);
      });
      
      const memberList = Array.from(memberMap.values());
      setMembers(memberList);
      
      if (preselectedId && memberList.length === 1) {
        setSelectedMember(memberList[0]);
      }
    } catch (error) {
      console.error('Error searching members:', error);
    }
    setLoading(false);
  }, [preselectedId]);

  useEffect(() => {
    if (preselectedId) {
      searchMembers(preselectedId);
    }
  }, [preselectedId, searchMembers]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchMembers(searchTerm);
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

  return (
    <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>Member Search</h1>
        <p style={{ color: '#64748b' }}>Find members and view their bill history</p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <svg 
              width="20" 
              height="20" 
              fill="none" 
              stroke="#94a3b8" 
              strokeWidth="2" 
              viewBox="0 0 24 24"
              style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }}
            >
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by member name or ID..."
              style={{
                width: '100%',
                padding: '14px 16px 14px 48px',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                fontSize: '15px',
                outline: 'none'
              }}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '14px 32px',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {/* Results */}
      <div style={{ display: 'grid', gridTemplateColumns: selectedMember ? '1fr 2fr' : '1fr', gap: '24px' }}>
        {/* Member List */}
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a' }}>
              {hasSearched ? `${members.length} Member${members.length !== 1 ? 's' : ''} Found` : 'Search Results'}
            </h2>
          </div>
          
          {!hasSearched ? (
            <div style={{ padding: '48px', textAlign: 'center' }}>
              <svg width="48" height="48" fill="none" stroke="#94a3b8" strokeWidth="1.5" viewBox="0 0 24 24" style={{ margin: '0 auto 12px' }}>
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <p style={{ color: '#64748b' }}>Enter a name or ID to search</p>
            </div>
          ) : members.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center' }}>
              <svg width="48" height="48" fill="none" stroke="#94a3b8" strokeWidth="1.5" viewBox="0 0 24 24" style={{ margin: '0 auto 12px' }}>
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/>
              </svg>
              <p style={{ color: '#64748b' }}>No members found</p>
            </div>
          ) : (
            <div>
              {members.map((member, i) => (
                <div
                  key={member.member_id || i}
                  onClick={() => setSelectedMember(member)}
                  style={{
                    padding: '16px 24px',
                    borderBottom: i < members.length - 1 ? '1px solid #f1f5f9' : 'none',
                    cursor: 'pointer',
                    background: selectedMember?.member_id === member.member_id ? '#f5f3ff' : 'white',
                    transition: 'background 0.15s'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <p style={{ fontWeight: 600, color: '#0f172a', marginBottom: '4px' }}>{member.member_name}</p>
                      <p style={{ fontSize: '13px', color: '#64748b' }}>ID: {member.member_id || 'N/A'}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: '13px', color: '#64748b' }}>{member.total_bills} bill{member.total_bills !== 1 ? 's' : ''}</p>
                      <p style={{ fontWeight: 600, color: '#0f172a' }}>{formatCurrency(member.total_billed)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Member Detail */}
        {selectedMember && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Member Summary */}
            <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                <div>
                  <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
                    {selectedMember.member_name}
                  </h2>
                  <p style={{ color: '#64748b' }}>Member ID: {selectedMember.member_id || 'N/A'}</p>
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '10px' }}>
                  <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px', textTransform: 'uppercase' }}>Total Bills</p>
                  <p style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a' }}>{selectedMember.total_bills}</p>
                </div>
                <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '10px' }}>
                  <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px', textTransform: 'uppercase' }}>Total Billed</p>
                  <p style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a' }}>{formatCurrency(selectedMember.total_billed)}</p>
                </div>
                <div style={{ padding: '16px', background: '#ecfdf5', borderRadius: '10px' }}>
                  <p style={{ fontSize: '12px', color: '#059669', marginBottom: '4px', textTransform: 'uppercase' }}>Total Savings</p>
                  <p style={{ fontSize: '24px', fontWeight: 700, color: '#16a34a' }}>{formatCurrency(selectedMember.total_savings)}</p>
                </div>
              </div>
            </div>

            {/* Bills List */}
            <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a' }}>Bill History</h3>
              </div>
              <div>
                {selectedMember.bills.map((bill, i) => {
                  const statusStyle = getStatusStyle(bill.status);
                  return (
                    <Link
                      key={bill.id}
                      href={`/dashboard/bill-negotiator/bills/${bill.id}`}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '16px 24px',
                        borderBottom: i < selectedMember.bills.length - 1 ? '1px solid #f1f5f9' : 'none',
                        textDecoration: 'none',
                        transition: 'background 0.15s'
                      }}
                    >
                      <div>
                        <p style={{ fontWeight: 500, color: '#0f172a', marginBottom: '4px' }}>{bill.provider_name}</p>
                        <p style={{ fontSize: '13px', color: '#64748b' }}>{formatDate(bill.date_of_service)}</p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ fontWeight: 600, color: '#0f172a' }}>{formatCurrency(bill.total_billed)}</p>
                        </div>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: 600,
                          background: statusStyle.bg,
                          color: statusStyle.color
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

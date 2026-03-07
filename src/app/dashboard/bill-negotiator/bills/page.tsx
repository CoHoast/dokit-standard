'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Bill {
  id: number;
  member_name: string;
  provider_name: string;
  date_of_service: string;
  total_billed: number;
  fair_price: number;
  status: string;
  received_at: string;
  savings_amount?: number;
  savings_percent?: number;
}

export default function BillsListPage() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const limit = 20;

  useEffect(() => {
    fetchBills();
  }, [statusFilter, page]);

  const fetchBills = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_ADMIN_API_URL || '';
      const clientId = process.env.NEXT_PUBLIC_CLIENT_ID || '1';
      
      let url = `${apiUrl}/api/db/bill-negotiator/bills?limit=${limit}&offset=${page * limit}&clientId=${clientId}`;
      if (statusFilter !== 'all') url += `&status=${statusFilter}`;
      
      const res = await fetch(url);
      const data = await res.json();
      setBills(data.bills || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error('Error fetching bills:', error);
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
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'settled': 
      case 'paid': return { bg: 'bg-green-50', text: 'text-green-700' };
      case 'offer_sent': 
      case 'awaiting_response': return { bg: 'bg-blue-50', text: 'text-blue-700' };
      case 'counter_received': return { bg: 'bg-amber-50', text: 'text-amber-700' };
      case 'ready_to_negotiate': return { bg: 'bg-violet-50', text: 'text-violet-700' };
      default: return { bg: 'bg-slate-50', text: 'text-slate-600' };
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
      paid: 'Paid',
      cancelled: 'Cancelled'
    };
    return labels[status] || status;
  };

  const statuses = [
    { value: 'all', label: 'All Bills' },
    { value: 'received', label: 'New' },
    { value: 'ready_to_negotiate', label: 'Ready' },
    { value: 'offer_sent', label: 'Offer Sent' },
    { value: 'counter_received', label: 'Counter' },
    { value: 'settled', label: 'Settled' },
    { value: 'paid', label: 'Paid' },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
            <Link href="/dashboard/bill-negotiator" className="hover:text-slate-700">Bill Negotiator</Link>
            <span>/</span>
            <span className="text-indigo-500 font-medium">Bills</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">All Bills</h1>
          <p className="text-slate-500 mt-1">{total} total bills</p>
        </div>
        <Link
          href="/dashboard/bill-negotiator/bills/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-500 text-white rounded-xl font-semibold text-sm shadow-lg shadow-indigo-500/25"
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M12 4v16m8-8H4"/>
          </svg>
          Add Bill
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {statuses.map(s => (
          <button
            key={s.value}
            onClick={() => { setStatusFilter(s.value); setPage(0); }}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all
              ${statusFilter === s.value 
                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25' 
                : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-300'
              }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Bills Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500">Loading bills...</div>
        ) : bills.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-2xl flex items-center justify-center">
              <svg width="32" height="32" className="text-slate-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No bills found</h3>
            <p className="text-slate-500 mb-6">
              {statusFilter !== 'all' ? 'Try a different filter' : 'Get started by adding your first bill'}
            </p>
            <Link
              href="/dashboard/bill-negotiator/bills/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-500 text-white rounded-xl font-semibold text-sm"
            >
              Add First Bill
            </Link>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Member / Provider</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase hidden sm:table-cell">Service Date</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase">Billed</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase hidden md:table-cell">Fair Price</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase hidden lg:table-cell">Savings</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bills.map((bill) => {
                    const statusStyle = getStatusStyle(bill.status);
                    const potentialSavings = bill.total_billed && bill.fair_price 
                      ? bill.total_billed - bill.fair_price 
                      : null;
                    
                    return (
                      <tr 
                        key={bill.id}
                        onClick={() => window.location.href = `/dashboard/bill-negotiator/bills/${bill.id}`}
                        className="hover:bg-slate-50 cursor-pointer"
                      >
                        <td className="px-6 py-4">
                          <p className="font-medium text-slate-900">{bill.member_name || 'Unknown'}</p>
                          <p className="text-sm text-slate-500">{bill.provider_name || 'Unknown Provider'}</p>
                        </td>
                        <td className="px-4 py-4 text-center text-sm text-slate-600 hidden sm:table-cell">
                          {formatDate(bill.date_of_service)}
                        </td>
                        <td className="px-4 py-4 text-right font-semibold text-slate-900">
                          {formatCurrency(bill.total_billed || 0)}
                        </td>
                        <td className="px-4 py-4 text-right text-indigo-600 font-medium hidden md:table-cell">
                          {bill.fair_price ? formatCurrency(bill.fair_price) : '-'}
                        </td>
                        <td className="px-4 py-4 text-right hidden lg:table-cell">
                          {bill.savings_amount ? (
                            <span className="text-green-600 font-semibold">
                              {formatCurrency(bill.savings_amount)}
                            </span>
                          ) : potentialSavings && potentialSavings > 0 ? (
                            <span className="text-slate-400 text-sm">
                              ~{formatCurrency(potentialSavings)}
                            </span>
                          ) : '-'}
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className={`inline-block px-3 py-1 rounded-lg text-xs font-semibold ${statusStyle.bg} ${statusStyle.text}`}>
                            {getStatusLabel(bill.status)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {total > limit && (
              <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
                <p className="text-sm text-slate-500">
                  Showing {page * limit + 1} to {Math.min((page + 1) * limit, total)} of {total}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(Math.max(0, page - 1))}
                    disabled={page === 0}
                    className="px-4 py-2 rounded-lg text-sm font-medium border border-slate-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={(page + 1) * limit >= total}
                    className="px-4 py-2 rounded-lg text-sm font-medium border border-slate-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

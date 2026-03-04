'use client';

import { useState } from 'react';

export default function DocumentsPage() {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const documents = [
    { id: 1, name: 'CMS-1500_Johnson_03042026.pdf', type: 'CMS-1500', status: 'processed', confidence: 98, uploadedAt: '2 min ago', size: '245 KB' },
    { id: 2, name: 'UB04_Memorial_Hospital.pdf', type: 'UB-04', status: 'processed', confidence: 96, uploadedAt: '5 min ago', size: '512 KB' },
    { id: 3, name: 'Prior_Auth_Smith.pdf', type: 'Prior Auth', status: 'review', confidence: 87, uploadedAt: '8 min ago', size: '189 KB' },
    { id: 4, name: 'Member_Intake_Williams.pdf', type: 'Member Intake', status: 'processed', confidence: 99, uploadedAt: '12 min ago', size: '324 KB' },
    { id: 5, name: 'Provider_Bill_Acme.pdf', type: 'Provider Bill', status: 'processed', confidence: 95, uploadedAt: '15 min ago', size: '278 KB' },
    { id: 6, name: 'FROI_WorkersComp_Davis.pdf', type: 'Workers Comp', status: 'processing', confidence: 0, uploadedAt: 'Just now', size: '156 KB' },
  ];

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Document Intake</h1>
          <p className="text-slate-500 mt-1">Upload and process documents with AI extraction</p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transition-all">
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
          </svg>
          Upload Documents
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <svg width="20" height="20" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input
              type="text"
              placeholder="Search documents..."
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3">
            <select className="px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
              <option>All Types</option>
              <option>CMS-1500</option>
              <option>UB-04</option>
              <option>Prior Auth</option>
              <option>Member Intake</option>
              <option>Provider Bill</option>
              <option>Workers Comp</option>
            </select>

            <select className="px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
              <option>All Status</option>
              <option>Processed</option>
              <option>Processing</option>
              <option>Review Required</option>
              <option>Failed</option>
            </select>

            <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : 'text-slate-500'}`}
              >
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M4 6h16M4 12h16M4 18h16"/>
                </svg>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-slate-500'}`}
              >
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="data-table">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-5 py-3">
                <input type="checkbox" className="rounded border-slate-300" />
              </th>
              <th className="px-5 py-3">Document</th>
              <th className="px-5 py-3">Type</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Confidence</th>
              <th className="px-5 py-3">Uploaded</th>
              <th className="px-5 py-3">Size</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <tr key={doc.id} className="hover:bg-slate-50/50">
                <td className="px-5 py-4">
                  <input type="checkbox" className="rounded border-slate-300" />
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      doc.type === 'CMS-1500' ? 'bg-indigo-100' :
                      doc.type === 'UB-04' ? 'bg-blue-100' :
                      doc.type === 'Prior Auth' ? 'bg-violet-100' :
                      doc.type === 'Member Intake' ? 'bg-emerald-100' :
                      doc.type === 'Provider Bill' ? 'bg-amber-100' :
                      'bg-rose-100'
                    }`}>
                      <svg width="20" height="20" className={`${
                        doc.type === 'CMS-1500' ? 'text-indigo-600' :
                        doc.type === 'UB-04' ? 'text-blue-600' :
                        doc.type === 'Prior Auth' ? 'text-violet-600' :
                        doc.type === 'Member Intake' ? 'text-emerald-600' :
                        doc.type === 'Provider Bill' ? 'text-amber-600' :
                        'text-rose-600'
                      }`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium text-slate-900">{doc.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className="text-slate-600">{doc.type}</span>
                </td>
                <td className="px-5 py-4">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                    doc.status === 'processed' ? 'bg-emerald-50 text-emerald-700' :
                    doc.status === 'processing' ? 'bg-blue-50 text-blue-700' :
                    'bg-amber-50 text-amber-700'
                  }`}>
                    {doc.status === 'processing' && (
                      <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                    )}
                    {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                  </span>
                </td>
                <td className="px-5 py-4">
                  {doc.confidence > 0 ? (
                    <span className={`font-semibold ${doc.confidence >= 95 ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {doc.confidence}%
                    </span>
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </td>
                <td className="px-5 py-4 text-slate-500">{doc.uploadedAt}</td>
                <td className="px-5 py-4 text-slate-500">{doc.size}</td>
                <td className="px-5 py-4">
                  <button className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4 px-2">
        <div className="text-sm text-slate-500">
          Showing 1-6 of 127 documents
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-50" disabled>
            Previous
          </button>
          <button className="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            1
          </button>
          <button className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50">
            2
          </button>
          <button className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50">
            3
          </button>
          <button className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

'use client';

export default function DashboardPage() {
  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-1">Welcome back! Here's your document processing overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="stat-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-500">Documents Today</span>
            <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
              <svg width="18" height="18" className="text-indigo-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900">127</div>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">+18%</span>
            <span className="text-xs text-slate-400">vs yesterday</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-500">Avg. Processing Time</span>
            <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center">
              <svg width="18" height="18" className="text-violet-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900">8.3s</div>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">-12%</span>
            <span className="text-xs text-slate-400">faster than avg</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-500">Accuracy Rate</span>
            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
              <svg width="18" height="18" className="text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900">98.7%</div>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">+0.3%</span>
            <span className="text-xs text-slate-400">this week</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-500">Pending Review</span>
            <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
              <svg width="18" height="18" className="text-amber-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900">12</div>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-xs text-slate-400">needs attention</span>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Documents */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-100 shadow-sm">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Recent Documents</h2>
            <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700">View all</button>
          </div>
          <div className="p-5">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Document</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Confidence</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'CMS-1500_Johnson_03042026.pdf', type: 'CMS-1500', status: 'Processed', confidence: 98, time: '2 min ago' },
                  { name: 'UB04_Memorial_Hospital.pdf', type: 'UB-04', status: 'Processed', confidence: 96, time: '5 min ago' },
                  { name: 'Prior_Auth_Smith.pdf', type: 'Prior Auth', status: 'Review', confidence: 87, time: '8 min ago' },
                  { name: 'Member_Intake_Williams.pdf', type: 'Member Intake', status: 'Processed', confidence: 99, time: '12 min ago' },
                  { name: 'Provider_Bill_Acme.pdf', type: 'Provider Bill', status: 'Processed', confidence: 95, time: '15 min ago' },
                ].map((doc, i) => (
                  <tr key={i}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                          <svg width="16" height="16" className="text-slate-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                          </svg>
                        </div>
                        <span className="font-medium text-slate-900">{doc.name}</span>
                      </div>
                    </td>
                    <td className="text-slate-600">{doc.type}</td>
                    <td>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        doc.status === 'Processed' 
                          ? 'bg-emerald-50 text-emerald-700' 
                          : 'bg-amber-50 text-amber-700'
                      }`}>
                        {doc.status}
                      </span>
                    </td>
                    <td>
                      <span className={`font-medium ${doc.confidence >= 95 ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {doc.confidence}%
                      </span>
                    </td>
                    <td className="text-slate-400">{doc.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Module Stats */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-900">Documents by Module</h2>
          </div>
          <div className="p-5 space-y-4">
            {[
              { name: 'Claims Processing', count: 47, color: 'bg-indigo-500' },
              { name: 'Prior Auth', count: 32, color: 'bg-violet-500' },
              { name: 'Member Intake', count: 28, color: 'bg-blue-500' },
              { name: 'Provider Bills', count: 15, color: 'bg-emerald-500' },
              { name: 'Workers Comp', count: 5, color: 'bg-amber-500' },
            ].map((module) => (
              <div key={module.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium text-slate-700">{module.name}</span>
                  <span className="text-sm text-slate-500">{module.count}</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${module.color} rounded-full`}
                    style={{ width: `${(module.count / 50) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

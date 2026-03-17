'use client';

export default function DashboardPage() {
  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 mt-1">Welcome back! Here's your document processing overview.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
            Export Report
          </button>
          <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 4v16m8-8H4"/>
            </svg>
            Upload Documents
          </button>
        </div>
      </div>

      {/* Top Stats Grid - 6 cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <svg width="20" height="20" className="text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">2,847</div>
          <div className="text-xs text-slate-500">Documents Today</div>
          <div className="flex items-center gap-1 mt-2">
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">+23%</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
              <svg width="20" height="20" className="text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">2,691</div>
          <div className="text-xs text-slate-500">Auto-Processed</div>
          <div className="flex items-center gap-1 mt-2">
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">94.5%</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
              <svg width="20" height="20" className="text-violet-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">4.2s</div>
          <div className="text-xs text-slate-500">Avg. Process Time</div>
          <div className="flex items-center gap-1 mt-2">
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">-18%</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
              <svg width="20" height="20" className="text-indigo-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">99.2%</div>
          <div className="text-xs text-slate-500">Accuracy Rate</div>
          <div className="flex items-center gap-1 mt-2">
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">+0.4%</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
              <svg width="20" height="20" className="text-amber-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
              </svg>
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">156</div>
          <div className="text-xs text-slate-500">Pending Review</div>
          <div className="flex items-center gap-1 mt-2">
            <span className="text-xs font-medium text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">-12</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center">
              <svg width="20" height="20" className="text-rose-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">$847K</div>
          <div className="text-xs text-slate-500">Claims Processed</div>
          <div className="flex items-center gap-1 mt-2">
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">+$124K</span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        {/* Recent Documents - Takes 2 columns */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="font-semibold text-slate-900">Recent Documents</h2>
              <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">Live</span>
            </div>
            <button className="text-sm font-medium text-blue-600 hover:text-blue-700">View all →</button>
          </div>
          <div className="p-5 overflow-x-auto">
            <table className="data-table w-full">
              <thead>
                <tr>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider pb-3">Document</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider pb-3">Type</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider pb-3">Status</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider pb-3">Confidence</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider pb-3">Time</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'CMS-1500_Johnson_M.pdf', type: 'CMS-1500', status: 'Processed', confidence: 99, time: '12s ago' },
                  { name: 'UB04_Memorial_Hospital.pdf', type: 'UB-04', status: 'Processed', confidence: 97, time: '45s ago' },
                  { name: 'Prior_Auth_REQ_2847.pdf', type: 'Prior Auth', status: 'Processed', confidence: 98, time: '1m ago' },
                  { name: 'EOB_BlueCross_Smith.pdf', type: 'EOB', status: 'Review', confidence: 89, time: '2m ago' },
                  { name: 'Member_Enrollment_W.pdf', type: 'Enrollment', status: 'Processed', confidence: 99, time: '3m ago' },
                  { name: 'Provider_Contract_Acme.pdf', type: 'Contract', status: 'Processed', confidence: 96, time: '4m ago' },
                ].map((doc, i) => (
                  <tr key={i} className="border-b border-slate-50 last:border-0">
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                          <svg width="16" height="16" className="text-slate-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                          </svg>
                        </div>
                        <span className="font-medium text-slate-900 text-sm">{doc.name}</span>
                      </div>
                    </td>
                    <td className="py-3 text-sm text-slate-600">{doc.type}</td>
                    <td className="py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        doc.status === 'Processed' 
                          ? 'bg-emerald-50 text-emerald-700' 
                          : 'bg-amber-50 text-amber-700'
                      }`}>
                        {doc.status}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${doc.confidence >= 95 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                            style={{ width: `${doc.confidence}%` }}
                          />
                        </div>
                        <span className={`text-sm font-medium ${doc.confidence >= 95 ? 'text-emerald-600' : 'text-amber-600'}`}>
                          {doc.confidence}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 text-sm text-slate-400">{doc.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column - Processing Queue */}
        <div className="space-y-6">
          {/* Processing Status */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="font-semibold text-slate-900">Processing Queue</h2>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-slate-700">Active Jobs</span>
                </div>
                <span className="text-sm font-semibold text-slate-900">24</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-slate-700">Queued</span>
                </div>
                <span className="text-sm font-semibold text-slate-900">156</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  <span className="text-sm text-slate-700">Needs Review</span>
                </div>
                <span className="text-sm font-semibold text-slate-900">12</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
                  <span className="text-sm text-slate-700">Completed Today</span>
                </div>
                <span className="text-sm font-semibold text-slate-900">2,847</span>
              </div>
            </div>
          </div>

          {/* Document Types */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="font-semibold text-slate-900">By Document Type</h2>
            </div>
            <div className="p-5 space-y-3">
              {[
                { name: 'CMS-1500', count: 847, color: 'bg-blue-500', percent: 30 },
                { name: 'UB-04', count: 623, color: 'bg-indigo-500', percent: 22 },
                { name: 'Prior Auth', count: 512, color: 'bg-violet-500', percent: 18 },
                { name: 'EOB', count: 398, color: 'bg-emerald-500', percent: 14 },
                { name: 'Enrollment', count: 284, color: 'bg-amber-500', percent: 10 },
                { name: 'Other', count: 183, color: 'bg-slate-400', percent: 6 },
              ].map((type) => (
                <div key={type.name} className="flex items-center gap-3">
                  <div className={`w-3 h-3 ${type.color} rounded`}></div>
                  <span className="text-sm text-slate-700 flex-1">{type.name}</span>
                  <span className="text-sm font-medium text-slate-900">{type.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row - 3 Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Claims Overview */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Claims Overview</h2>
            <span className="text-xs text-slate-500">Last 7 days</span>
          </div>
          <div className="p-5">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-slate-600">Approved</span>
                  <span className="text-sm font-medium text-emerald-600">2,341</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '78%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-slate-600">Pending</span>
                  <span className="text-sm font-medium text-amber-600">412</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '14%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-slate-600">Denied</span>
                  <span className="text-sm font-medium text-rose-600">247</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500 rounded-full" style={{ width: '8%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Providers */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-900">Top Providers</h2>
          </div>
          <div className="p-5 space-y-3">
            {[
              { name: 'Memorial Hospital', docs: 342, trend: '+12%' },
              { name: 'City Medical Center', docs: 287, trend: '+8%' },
              { name: 'Regional Health', docs: 234, trend: '+15%' },
              { name: 'Unity Healthcare', docs: 198, trend: '+5%' },
              { name: 'Wellness Clinic', docs: 156, trend: '+22%' },
            ].map((provider, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white text-xs font-semibold">
                    {provider.name.charAt(0)}
                  </div>
                  <span className="text-sm text-slate-700">{provider.name}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-slate-900">{provider.docs}</div>
                  <div className="text-xs text-emerald-600">{provider.trend}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Health */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">System Health</h2>
            <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-600">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              All Systems Operational
            </span>
          </div>
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">API Uptime</span>
              <span className="text-sm font-medium text-emerald-600">99.99%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Avg Response Time</span>
              <span className="text-sm font-medium text-slate-900">127ms</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">OCR Engine</span>
              <span className="text-sm font-medium text-emerald-600">Healthy</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">AI Models</span>
              <span className="text-sm font-medium text-emerald-600">Healthy</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Storage</span>
              <span className="text-sm font-medium text-slate-900">2.4 TB / 5 TB</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

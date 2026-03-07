'use client';

import { useState } from 'react';
import Link from 'next/link';

// Settings page structure - Phase 2D will add actual rules engine functionality

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { key: 'general', label: 'General', icon: '⚙️' },
    { key: 'intake', label: 'Intake Sources', icon: '📥' },
    { key: 'automation', label: 'Automation', icon: '🤖' },
    { key: 'notifications', label: 'Notifications', icon: '🔔' },
  ];

  return (
    <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>Settings</h1>
        <p style={{ color: '#64748b' }}>Configure your Bill Negotiator preferences and automation rules</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '32px', borderBottom: '1px solid #e2e8f0', paddingBottom: '0' }}>
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '12px 20px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === tab.key ? '2px solid #6366f1' : '2px solid transparent',
              marginBottom: '-1px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: activeTab === tab.key ? 600 : 400,
              color: activeTab === tab.key ? '#6366f1' : '#64748b',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.15s'
            }}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        {activeTab === 'general' && (
          <div style={{ padding: '32px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#0f172a', marginBottom: '24px' }}>General Settings</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Autonomy Level */}
              <div style={{ padding: '24px', background: '#f8fafc', borderRadius: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a', marginBottom: '4px' }}>Automation Level</h3>
                    <p style={{ fontSize: '14px', color: '#64748b' }}>Control how much the AI handles automatically</p>
                  </div>
                  <span style={{ 
                    padding: '4px 12px', 
                    background: '#dbeafe', 
                    color: '#2563eb', 
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 600
                  }}>
                    Coming in Phase 2D
                  </span>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[
                    { value: 'manual', label: 'Manual', desc: 'Staff reviews and approves every step', selected: true },
                    { value: 'semi', label: 'Semi-Autonomous', desc: 'AI suggests, staff approves, system executes', selected: false },
                    { value: 'full', label: 'Fully Autonomous', desc: 'AI handles within configured rules', selected: false }
                  ].map(opt => (
                    <label
                      key={opt.value}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px',
                        padding: '14px',
                        border: opt.selected ? '2px solid #6366f1' : '1px solid #e2e8f0',
                        borderRadius: '10px',
                        cursor: 'not-allowed',
                        opacity: 0.7,
                        background: opt.selected ? '#f5f3ff' : 'white'
                      }}
                    >
                      <input
                        type="radio"
                        name="autonomy"
                        checked={opt.selected}
                        disabled
                        style={{ marginTop: '2px' }}
                      />
                      <div>
                        <p style={{ fontWeight: 500, color: '#0f172a' }}>{opt.label}</p>
                        <p style={{ fontSize: '13px', color: '#64748b' }}>{opt.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Default Strategy */}
              <div style={{ padding: '24px', background: '#f8fafc', borderRadius: '12px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a', marginBottom: '4px' }}>Default Negotiation Strategy</h3>
                <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '16px' }}>Default strategy used for new bills</p>
                
                <select
                  disabled
                  defaultValue="medicare_percentage"
                  style={{
                    width: '100%',
                    maxWidth: '300px',
                    padding: '12px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    opacity: 0.7,
                    cursor: 'not-allowed'
                  }}
                >
                  <option value="cash_pay">Cash Pay Discount</option>
                  <option value="medicare_percentage">% of Medicare Rate</option>
                  <option value="bundled_rate">Bundled Rate</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'intake' && (
          <div style={{ padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#0f172a', marginBottom: '4px' }}>Intake Sources</h2>
                <p style={{ fontSize: '14px', color: '#64748b' }}>Configure how bills are received</p>
              </div>
              <span style={{ 
                padding: '6px 14px', 
                background: '#fef3c7', 
                color: '#d97706', 
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600
              }}>
                Contact Admin to Configure
              </span>
            </div>

            <div style={{ padding: '48px', textAlign: 'center', background: '#f8fafc', borderRadius: '12px' }}>
              <p style={{ fontSize: '48px', marginBottom: '16px' }}>📥</p>
              <p style={{ fontSize: '16px', color: '#0f172a', fontWeight: 500, marginBottom: '8px' }}>Intake configuration is managed by your administrator</p>
              <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '24px' }}>
                Contact support to set up FTP, email, or API intake sources
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                {['Manual Upload', 'Bulk Upload', 'FTP/SFTP', 'Email', 'API'].map(source => (
                  <span key={source} style={{
                    padding: '8px 16px',
                    background: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '13px',
                    color: '#64748b'
                  }}>
                    {source}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'automation' && (
          <div style={{ padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#0f172a', marginBottom: '4px' }}>Automation Rules</h2>
                <p style={{ fontSize: '14px', color: '#64748b' }}>Configure auto-negotiation thresholds and rules</p>
              </div>
              <span style={{ 
                padding: '6px 14px', 
                background: '#dbeafe', 
                color: '#2563eb', 
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600
              }}>
                Coming in Phase 2D
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Offer Thresholds */}
              <div style={{ padding: '24px', background: '#f8fafc', borderRadius: '12px', opacity: 0.7 }}>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a', marginBottom: '16px' }}>Offer Thresholds</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', color: '#64748b', marginBottom: '6px' }}>Initial Offer %</label>
                    <input type="number" disabled defaultValue="50" style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      cursor: 'not-allowed'
                    }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', color: '#64748b', marginBottom: '6px' }}>Max Offer %</label>
                    <input type="number" disabled defaultValue="75" style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      cursor: 'not-allowed'
                    }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', color: '#64748b', marginBottom: '6px' }}>Walk Away Above %</label>
                    <input type="number" disabled defaultValue="90" style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      cursor: 'not-allowed'
                    }} />
                  </div>
                </div>
              </div>

              {/* Auto-Response Rules */}
              <div style={{ padding: '24px', background: '#f8fafc', borderRadius: '12px', opacity: 0.7 }}>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a', marginBottom: '16px' }}>Auto-Response Rules</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[
                    'Auto-accept if provider accepts our offer',
                    'Auto-accept counters within max threshold',
                    'Auto-send follow-up after 7 days',
                    'Escalate to supervisor if counter > $5,000'
                  ].map((rule, i) => (
                    <label key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <input type="checkbox" disabled checked={i === 0} />
                      <span style={{ fontSize: '14px', color: '#64748b' }}>{rule}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div style={{ padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#0f172a', marginBottom: '4px' }}>Notification Preferences</h2>
                <p style={{ fontSize: '14px', color: '#64748b' }}>Choose how you want to be notified</p>
              </div>
              <span style={{ 
                padding: '6px 14px', 
                background: '#dbeafe', 
                color: '#2563eb', 
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600
              }}>
                Coming in Phase 2E
              </span>
            </div>

            <div style={{ padding: '24px', background: '#f8fafc', borderRadius: '12px', opacity: 0.7 }}>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a', marginBottom: '16px' }}>Email Notifications</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  'New bill received',
                  'Bill analyzed and ready',
                  'Provider response received',
                  'Bill settled',
                  'Daily summary report',
                  'Weekly analytics report'
                ].map((notif, i) => (
                  <label key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <input type="checkbox" disabled checked={i < 4} />
                    <span style={{ fontSize: '14px', color: '#64748b' }}>{notif}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Info Banner */}
      <div style={{ 
        marginTop: '24px',
        padding: '16px 24px',
        background: '#f0f9ff',
        border: '1px solid #bae6fd',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <span style={{ fontSize: '20px' }}>💡</span>
        <div>
          <p style={{ fontSize: '14px', color: '#0369a1', fontWeight: 500 }}>Settings are being configured by your administrator</p>
          <p style={{ fontSize: '13px', color: '#0284c7' }}>
            Contact support if you need to adjust automation rules or intake sources.
          </p>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { colors } from '@/lib/design-tokens';

export default function BillNegotiatorSettingsPage() {
  const [settings, setSettings] = useState({
    autoNegotiate: true,
    emailNotifications: true,
    smsNotifications: false,
    autoApproveThreshold: 500,
    requireApprovalAbove: 5000,
    weeklyReports: true,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(s => ({ ...s, [key]: !s[key] }));
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
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
        <h1 style={{ fontSize: '22px', fontWeight: '600', color: colors.text, marginBottom: '4px' }}>
          Bill Negotiator Settings
        </h1>
        <p style={{ fontSize: '14px', color: colors.textSecondary }}>
          Configure automation rules and notification preferences
        </p>
      </div>

      {/* Automation Settings */}
      <div style={{
        background: colors.cardBg,
        borderRadius: '12px',
        border: `1px solid ${colors.border}`,
        marginBottom: '24px',
        overflow: 'hidden'
      }}>
        <div style={{ padding: '20px', borderBottom: `1px solid ${colors.borderLight}` }}>
          <h2 style={{ fontSize: '15px', fontWeight: '600', color: colors.text }}>
            Automation
          </h2>
          <p style={{ fontSize: '13px', color: colors.textMuted, marginTop: '4px' }}>
            Control how bills are automatically processed
          </p>
        </div>
        <div style={{ padding: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Auto Negotiate Toggle */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: '14px', fontWeight: '500', color: colors.text, marginBottom: '2px' }}>
                  Auto-Negotiate
                </p>
                <p style={{ fontSize: '13px', color: colors.textMuted }}>
                  Automatically send negotiation offers for new bills
                </p>
              </div>
              <button
                onClick={() => handleToggle('autoNegotiate')}
                style={{
                  width: '48px',
                  height: '28px',
                  borderRadius: '14px',
                  border: 'none',
                  cursor: 'pointer',
                  background: settings.autoNegotiate ? colors.purple : colors.border,
                  position: 'relative',
                  transition: 'background 0.2s'
                }}
              >
                <div style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  background: 'white',
                  position: 'absolute',
                  top: '3px',
                  left: settings.autoNegotiate ? '23px' : '3px',
                  transition: 'left 0.2s',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                }} />
              </button>
            </div>

            {/* Auto-Approve Threshold */}
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: colors.text, marginBottom: '8px' }}>
                Auto-Approve Savings Under
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '16px', color: colors.textSecondary }}>$</span>
                <input
                  type="number"
                  value={settings.autoApproveThreshold}
                  onChange={(e) => setSettings(s => ({ ...s, autoApproveThreshold: parseInt(e.target.value) || 0 }))}
                  style={{
                    width: '120px',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: `1px solid ${colors.border}`,
                    fontSize: '14px',
                    color: colors.text
                  }}
                />
              </div>
              <p style={{ fontSize: '12px', color: colors.textMuted, marginTop: '6px' }}>
                Settlements below this amount will be auto-approved
              </p>
            </div>

            {/* Require Approval Above */}
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: colors.text, marginBottom: '8px' }}>
                Require Manual Approval Above
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '16px', color: colors.textSecondary }}>$</span>
                <input
                  type="number"
                  value={settings.requireApprovalAbove}
                  onChange={(e) => setSettings(s => ({ ...s, requireApprovalAbove: parseInt(e.target.value) || 0 }))}
                  style={{
                    width: '120px',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: `1px solid ${colors.border}`,
                    fontSize: '14px',
                    color: colors.text
                  }}
                />
              </div>
              <p style={{ fontSize: '12px', color: colors.textMuted, marginTop: '6px' }}>
                Bills above this amount require your approval before negotiating
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div style={{
        background: colors.cardBg,
        borderRadius: '12px',
        border: `1px solid ${colors.border}`,
        marginBottom: '24px',
        overflow: 'hidden'
      }}>
        <div style={{ padding: '20px', borderBottom: `1px solid ${colors.borderLight}` }}>
          <h2 style={{ fontSize: '15px', fontWeight: '600', color: colors.text }}>
            Notifications
          </h2>
          <p style={{ fontSize: '13px', color: colors.textMuted, marginTop: '4px' }}>
            Choose how you want to be notified
          </p>
        </div>
        <div style={{ padding: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: '14px', fontWeight: '500', color: colors.text, marginBottom: '2px' }}>
                  Email Notifications
                </p>
                <p style={{ fontSize: '13px', color: colors.textMuted }}>
                  Get notified when bills are settled or need attention
                </p>
              </div>
              <button
                onClick={() => handleToggle('emailNotifications')}
                style={{
                  width: '48px',
                  height: '28px',
                  borderRadius: '14px',
                  border: 'none',
                  cursor: 'pointer',
                  background: settings.emailNotifications ? colors.purple : colors.border,
                  position: 'relative',
                  transition: 'background 0.2s'
                }}
              >
                <div style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  background: 'white',
                  position: 'absolute',
                  top: '3px',
                  left: settings.emailNotifications ? '23px' : '3px',
                  transition: 'left 0.2s',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                }} />
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: '14px', fontWeight: '500', color: colors.text, marginBottom: '2px' }}>
                  SMS Notifications
                </p>
                <p style={{ fontSize: '13px', color: colors.textMuted }}>
                  Receive text messages for urgent updates
                </p>
              </div>
              <button
                onClick={() => handleToggle('smsNotifications')}
                style={{
                  width: '48px',
                  height: '28px',
                  borderRadius: '14px',
                  border: 'none',
                  cursor: 'pointer',
                  background: settings.smsNotifications ? colors.purple : colors.border,
                  position: 'relative',
                  transition: 'background 0.2s'
                }}
              >
                <div style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  background: 'white',
                  position: 'absolute',
                  top: '3px',
                  left: settings.smsNotifications ? '23px' : '3px',
                  transition: 'left 0.2s',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                }} />
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: '14px', fontWeight: '500', color: colors.text, marginBottom: '2px' }}>
                  Weekly Reports
                </p>
                <p style={{ fontSize: '13px', color: colors.textMuted }}>
                  Receive a weekly summary of your savings
                </p>
              </div>
              <button
                onClick={() => handleToggle('weeklyReports')}
                style={{
                  width: '48px',
                  height: '28px',
                  borderRadius: '14px',
                  border: 'none',
                  cursor: 'pointer',
                  background: settings.weeklyReports ? colors.purple : colors.border,
                  position: 'relative',
                  transition: 'background 0.2s'
                }}
              >
                <div style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  background: 'white',
                  position: 'absolute',
                  top: '3px',
                  left: settings.weeklyReports ? '23px' : '3px',
                  transition: 'left 0.2s',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                }} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
        {saved && (
          <span style={{ 
            padding: '10px 20px', 
            color: colors.green, 
            fontSize: '14px', 
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Saved
          </span>
        )}
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            padding: '10px 24px',
            background: colors.text,
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: saving ? 'not-allowed' : 'pointer',
            opacity: saving ? 0.7 : 1
          }}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}

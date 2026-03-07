// DOKit Client Dashboard - Design tokens for consistent styling

export const colors = {
  // Text
  text: '#1a1a2e',
  textSecondary: '#6b7280',
  textMuted: '#9ca3af',
  
  // Backgrounds
  pageBg: '#f8fafc',
  cardBg: '#ffffff',
  
  // Primary purple
  purple: '#7c3aed',
  purpleLight: '#ede9fe',
  
  // Accent colors
  green: '#10b981',
  greenLight: '#d1fae5',
  amber: '#f59e0b',
  amberLight: '#fef3c7',
  rose: '#f43f5e',
  roseLight: '#ffe4e6',
  cyan: '#06b6d4',
  cyanLight: '#cffafe',
  blue: '#3b82f6',
  blueLight: '#dbeafe',
  gray: '#6b7280',
  grayLight: '#f3f4f6',
  
  // Borders
  border: '#e5e7eb',
  borderLight: '#f3f4f6',
};

// Status colors for badges
export const statusColors: Record<string, { bg: string; text: string }> = {
  settled: { bg: colors.greenLight, text: colors.green },
  paid: { bg: colors.greenLight, text: colors.green },
  completed: { bg: colors.greenLight, text: colors.green },
  offer_sent: { bg: colors.blueLight, text: colors.blue },
  awaiting_response: { bg: colors.blueLight, text: colors.blue },
  counter_received: { bg: colors.amberLight, text: colors.amber },
  pending: { bg: colors.amberLight, text: colors.amber },
  ready_to_negotiate: { bg: colors.purpleLight, text: colors.purple },
  analyzing: { bg: colors.grayLight, text: colors.gray },
  received: { bg: colors.grayLight, text: colors.gray },
  failed: { bg: colors.roseLight, text: colors.rose },
};

export const getStatusColor = (status: string) => {
  return statusColors[status] || { bg: colors.grayLight, text: colors.gray };
};

export const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    received: 'New',
    analyzing: 'Analyzing',
    ready_to_negotiate: 'Ready',
    offer_sent: 'Offer Sent',
    awaiting_response: 'Awaiting',
    counter_received: 'Counter',
    settled: 'Settled',
    paid: 'Paid',
    failed: 'Failed',
  };
  return labels[status] || status;
};

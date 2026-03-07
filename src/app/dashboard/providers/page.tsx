import { Suspense } from 'react';
import ProvidersContent from './ProvidersContent';

function LoadingFallback() {
  return (
    <div style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>Provider Directory</h1>
        <p style={{ color: '#64748b' }}>View provider history and negotiation intelligence</p>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}>
        <p style={{ color: '#64748b' }}>Loading providers...</p>
      </div>
    </div>
  );
}

export default function ProvidersPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ProvidersContent />
    </Suspense>
  );
}

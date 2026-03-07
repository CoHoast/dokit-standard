import { Suspense } from 'react';
import MembersContent from './MembersContent';

function LoadingFallback() {
  return (
    <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>Member Search</h1>
        <p style={{ color: '#64748b' }}>Find members and view their bill history</p>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}>
        <p style={{ color: '#64748b' }}>Loading...</p>
      </div>
    </div>
  );
}

export default function MembersPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <MembersContent />
    </Suspense>
  );
}

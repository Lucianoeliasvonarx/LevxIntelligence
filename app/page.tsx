'use client';

export default function Page() {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', border: 'none', margin: 0, padding: 0, overflow: 'hidden', zIndex: 999999 }}>
      <iframe 
        src="/index.html" 
        style={{ width: '100%', height: '100%', border: 'none' }}
        title="Quiz"
      />
    </div>
  );
}

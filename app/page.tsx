'use client';

export default function Page() {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: '#0f172a' }}>
      <iframe 
        src="./index.html" 
        style={{ width: '100%', height: '100%', border: 'none' }}
        title="Quiz LEVX"
      />
    </div>
  );
}

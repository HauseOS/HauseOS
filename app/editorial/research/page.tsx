'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EditorialResearchRedirect() {
  const router = useRouter();
  useEffect(() => { router.replace('/content/research'); }, [router]);
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
      <p style={{ color: 'var(--text-secondary)' }}>Redirecting to Content Research...</p>
    </div>
  );
}

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EditorialIdeasRedirect() {
  const router = useRouter();
  useEffect(() => { router.replace('/content/ideas'); }, [router]);
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
      <p style={{ color: 'var(--text-secondary)' }}>Redirecting to Content Ideas...</p>
    </div>
  );
}

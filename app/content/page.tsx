'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { mockContentPipeline } from '@/app/mock-content-pipeline';
import { mockIdeas } from '@/app/mock-data';

const CONTENT_TABS = [
  { label: 'Ideas', href: '/content/ideas', icon: '💡', desc: 'Video concepts and content ideas' },
  { label: 'Pipeline', href: '/content/pipeline', icon: '📹', desc: 'Track production from idea to published' },
  { label: 'Research', href: '/content/research', icon: '🔬', desc: 'Trending topics and insights' },
];

export default function ContentLanding() {
  const brainstorm = mockContentPipeline.filter(i => i.status === 'brainstorm').length;
  const inProd = mockContentPipeline.filter(i => i.status === 'in_production').length;
  const published = mockContentPipeline.filter(i => i.status === 'published').length;
  const totalIdeas = mockIdeas.length;

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Content</h1>
          <p className="mt-1" style={{ color: 'var(--text-secondary)' }}>Video production engine for Hause</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'TOTAL IDEAS', value: totalIdeas, color: '#3B82F6' },
            { label: 'BRAINSTORM', value: brainstorm, color: '#EAB308' },
            { label: 'IN PRODUCTION', value: inProd, color: '#8B5CF6' },
            { label: 'PUBLISHED', value: published, color: '#10B981' },
          ].map((s) => (
            <div key={s.label} className="surface-card p-5">
              <p className="label-uppercase mb-1">{s.label}</p>
              <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Section Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CONTENT_TABS.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className="surface-card-hover p-6 group block"
            >
              <span className="text-3xl mb-4 block">{tab.icon}</span>
              <h2
                className="text-xl font-bold mb-2 group-hover:text-[var(--accent-primary)] transition-colors"
                style={{ color: 'var(--text-primary)' }}
              >
                {tab.label}
              </h2>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {tab.desc}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

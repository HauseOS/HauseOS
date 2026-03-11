'use client';

import React from 'react';
import Link from 'next/link';
import { mockIdeas, mockDashboardStats } from '@/app/mock-data';
import { mockContentPipeline } from '@/app/mock-content-pipeline';

export default function Dashboard() {
  const ideasInPipeline = mockContentPipeline.filter(i => i.status !== 'published').length;
  const publishedCount = mockContentPipeline.filter(i => i.status === 'published').length;
  const totalRevenue = mockContentPipeline.reduce((sum, i) => sum + (i.revenue || 0), 0);
  const recentIdeas = mockIdeas.slice(0, 3);

  const stats = [
    { label: 'IDEAS IN PIPELINE', value: ideasInPipeline, color: '#3B82F6' },
    { label: 'PUBLISHED', value: publishedCount, color: '#10B981' },
    { label: 'TOTAL REVENUE', value: `$${totalRevenue.toLocaleString()}`, color: '#E63030' },
    { label: 'IDEAS SUBMITTED', value: mockDashboardStats.ideas_submitted, color: '#8B5CF6' },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Hero */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Dashboard
          </h1>
          <p className="mt-2 text-base" style={{ color: 'var(--text-secondary)' }}>
            Hause Collective operations at a glance
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="surface-card p-6 hover:border-[var(--accent-primary)] transition-all"
            >
              <p className="label-uppercase mb-2">{stat.label}</p>
              <p className="text-3xl font-bold" style={{ color: stat.color }}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Ideas */}
          <div className="surface-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                Recent Ideas
              </h2>
              <Link
                href="/content/ideas"
                className="text-sm font-medium transition-colors"
                style={{ color: 'var(--accent-primary)' }}
              >
                View all
              </Link>
            </div>
            <div className="space-y-3">
              {recentIdeas.map((idea) => (
                <div
                  key={idea.id}
                  className="p-4 rounded-lg transition-colors"
                  style={{
                    background: 'var(--bg-elevated)',
                    borderLeft: '3px solid var(--accent-primary)',
                  }}
                >
                  <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                    {idea.title}
                  </p>
                  <p className="text-xs mt-1 line-clamp-1" style={{ color: 'var(--text-secondary)' }}>
                    {idea.angle}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <span
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{ background: 'var(--accent-glow)', color: 'var(--accent-primary)' }}
                    >
                      {idea.status.replace('_', ' ')}
                    </span>
                    <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                      {idea.submitted_by_name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="surface-card p-6">
            <h2 className="text-lg font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 gap-3">
              {[
                { label: 'Content Pipeline', desc: 'Track video production status', href: '/content/pipeline', icon: '📹' },
                { label: 'Idea Board', desc: 'Browse and submit content ideas', href: '/content/ideas', icon: '💡' },
                { label: 'Partnerships', desc: 'Manage sponsor deals', href: '/partnerships', icon: '🤝' },
                { label: 'Company Directory', desc: 'View all sponsor companies', href: '/partnerships/companies', icon: '🏢' },
                { label: 'Research', desc: 'Trending topics and insights', href: '/content/research', icon: '🔬' },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-4 p-4 rounded-lg transition-all group"
                  style={{ background: 'var(--bg-elevated)' }}
                >
                  <span className="text-2xl">{item.icon}</span>
                  <div className="flex-1">
                    <p
                      className="font-semibold text-sm group-hover:text-[var(--accent-primary)] transition-colors"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {item.label}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {item.desc}
                    </p>
                  </div>
                  <span style={{ color: 'var(--text-tertiary)' }}>→</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Agent Contributions */}
        <div className="surface-card p-6 mt-6">
          <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Agent Contributions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mockDashboardStats.agent_contributions.map((contrib) => (
              <div key={contrib.agent_origin} className="p-4 rounded-lg" style={{ background: 'var(--bg-elevated)' }}>
                <p className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>Submitted by</p>
                <p className="font-bold capitalize mb-2" style={{ color: 'var(--text-primary)' }}>
                  {contrib.agent_origin}
                </p>
                <div className="w-full rounded-full h-2" style={{ background: 'var(--bg-overlay)' }}>
                  <div
                    className="h-2 rounded-full bg-accent"
                    style={{
                      width: `${(contrib.count / mockDashboardStats.agent_contributions.reduce((s, c) => s + c.count, 0)) * 100}%`,
                    }}
                  />
                </div>
                <p className="text-right text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>
                  {contrib.count} ideas
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import { mockDashboardStats, mockIdeas } from '@/app/mock-data';

export default function EditorialDashboard() {
  const ideasByStatus = {
    brainstorm: mockIdeas.filter((i) => i.status === 'brainstorm').length,
    under_review: mockIdeas.filter((i) => i.status === 'under_review').length,
    feedback_pending: mockIdeas.filter((i) => i.status === 'feedback_pending').length,
    greenlit: mockIdeas.filter((i) => i.status === 'greenlit').length,
    in_production: mockIdeas.filter((i) => i.status === 'in_production').length,
    published: mockIdeas.filter((i) => i.status === 'published').length,
  };

  const statusColors: Record<string, string> = {
    brainstorm: '#EAB308',
    under_review: '#3B82F6',
    feedback_pending: '#F97316',
    greenlit: '#10B981',
    in_production: '#8B5CF6',
    published: '#34D399',
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      {/* Header */}
      <div className="border-b sticky top-14 z-10" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-default)' }}>
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Editorial Dashboard</h1>
          <p className="mt-1" style={{ color: 'var(--text-secondary)' }}>Content pipeline and metrics</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Key Metrics */}
        <div>
          <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Key Metrics (Last 30 Days)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: '💡', label: 'IDEAS SUBMITTED', value: mockDashboardStats.ideas_submitted, color: '#3B82F6' },
              { icon: '✅', label: 'GREENLIT', value: mockDashboardStats.ideas_greenlit, color: '#10B981' },
              { icon: '📺', label: 'PUBLISHED', value: mockDashboardStats.ideas_published, color: '#8B5CF6' },
              { icon: '⏱️', label: 'AVG TIME TO GREENLIT', value: `${mockDashboardStats.avg_time_to_greenlit_days} days`, color: '#EAB308' },
            ].map((s) => (
              <div key={s.label} className="surface-card p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{s.icon}</span>
                  <p className="label-uppercase">{s.label}</p>
                </div>
                <p className="text-4xl font-bold" style={{ color: s.color }}>{s.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Ideas by Status */}
        <div>
          <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Ideas by Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Object.entries(ideasByStatus).map(([status, count]) => (
              <div key={status} className="surface-card p-4">
                <p className="label-uppercase mb-2">{status.replace('_', ' ')}</p>
                <p className="text-3xl font-bold" style={{ color: statusColors[status] }}>{count}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Agent Contributions */}
        <div>
          <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Agent Contributions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mockDashboardStats.agent_contributions.map((contrib) => (
              <div key={contrib.agent_origin} className="surface-card p-6">
                <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>Submitted by</p>
                <p className="font-bold text-lg mb-2 capitalize" style={{ color: 'var(--text-primary)' }}>{contrib.agent_origin}</p>
                <div className="w-full rounded-full h-2" style={{ background: 'var(--bg-overlay)' }}>
                  <div
                    className="h-2 rounded-full bg-accent"
                    style={{ width: `${(contrib.count / mockDashboardStats.agent_contributions.reduce((sum, c) => sum + c.count, 0)) * 100}%` }}
                  />
                </div>
                <p className="text-right text-sm mt-2" style={{ color: 'var(--text-tertiary)' }}>{contrib.count} ideas</p>
              </div>
            ))}
          </div>
        </div>

        {/* Trending Tags */}
        <div>
          <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Trending Tags</h2>
          <div className="surface-card p-6">
            <div className="space-y-3">
              {mockDashboardStats.trending_tags.map((tag) => (
                <div key={tag.tag} className="flex items-center justify-between">
                  <span className="font-medium" style={{ color: 'var(--text-primary)' }}>#{tag.tag}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 rounded-full h-2" style={{ background: 'var(--bg-overlay)' }}>
                      <div
                        className="h-2 rounded-full bg-accent"
                        style={{ width: `${(tag.count / mockDashboardStats.trending_tags.reduce((sum, t) => sum + t.count, 0)) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm w-8 text-right" style={{ color: 'var(--text-tertiary)' }}>{tag.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="btn-primary py-3">📝 Submit New Idea</button>
            <Link href="/content/ideas" className="btn-secondary py-3 text-center block">📊 View Ideas Board</Link>
            <Link href="/content/research" className="btn-secondary py-3 text-center block">📈 View Research</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

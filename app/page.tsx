'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

interface Idea {
  id: string;
  title: string;
  angle: string;
  status: string;
  submitted_by_name: string;
}

interface Deal {
  id: string;
  status: string;
  deal_value: number | null;
  notes: string;
  company_name?: string;
}

export default function Dashboard() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [ideasRes, dealsRes] = await Promise.allSettled([
          fetch(`${API_BASE}/api/editorial/ideas`),
          fetch(`${API_BASE}/api/deals`),
        ]);

        if (ideasRes.status === 'fulfilled' && ideasRes.value.ok) {
          const data = await ideasRes.value.json();
          setIdeas(data.ideas || []);
        }
        if (dealsRes.status === 'fulfilled' && dealsRes.value.ok) {
          const data = await dealsRes.value.json();
          setDeals(data.deals || []);
        }
      } catch (e) {
        console.error('Dashboard fetch error:', e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const totalIdeas = ideas.length;
  const greenlitOrProd = ideas.filter(i => ['greenlit', 'in_production'].includes(i.status)).length;
  const activeDeals = deals.filter(d => !['paid', 'lost'].includes(d.status)).length;
  const totalPipelineValue = deals.reduce((sum, d) => sum + (d.deal_value || 0), 0);
  const recentIdeas = ideas.slice(0, 3);

  const stats = [
    { label: 'TOTAL IDEAS', value: totalIdeas, color: '#3B82F6' },
    { label: 'GREENLIT / IN PRODUCTION', value: greenlitOrProd, color: '#10B981' },
    { label: 'ACTIVE DEALS', value: activeDeals, color: '#E63030' },
    { label: 'PIPELINE VALUE', value: `$${totalPipelineValue.toLocaleString()}`, color: '#8B5CF6' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto"></div>
      </div>
    );
  }

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
                View all →
              </Link>
            </div>
            <div className="space-y-3">
              {recentIdeas.length > 0 ? recentIdeas.map((idea) => (
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
              )) : (
                <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>No ideas yet</p>
              )}
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

        {/* Active Deals */}
        {deals.length > 0 && (
          <div className="surface-card p-6 mt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                Active Deals
              </h2>
              <Link href="/partnerships" className="text-sm font-medium" style={{ color: 'var(--accent-primary)' }}>
                View pipeline →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {deals.filter(d => !['paid', 'lost'].includes(d.status)).slice(0, 6).map((deal) => (
                <div key={deal.id} className="p-4 rounded-lg" style={{ background: 'var(--bg-elevated)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs px-2 py-0.5 rounded-full capitalize" style={{ background: 'var(--accent-glow)', color: 'var(--accent-primary)' }}>
                      {deal.status}
                    </span>
                    {deal.deal_value && (
                      <span className="font-bold text-sm" style={{ color: '#10B981' }}>
                        ${deal.deal_value.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <p className="text-sm line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                    {deal.notes || 'No notes'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

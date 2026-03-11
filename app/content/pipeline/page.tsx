'use client';

import React, { useState, useEffect, useCallback } from 'react';

interface ContentItem {
  id: string;
  title: string;
  status: 'brainstorm' | 'greenlit' | 'in_production' | 'published';
  sponsor?: string | null;
  difficulty: 'simple' | 'moderate' | 'complex';
  submitted_date: string;
  production_start_date?: string | null;
  publish_date?: string | null;
  views?: number;
  watch_hours?: number;
  revenue?: number;
  agent?: string | null;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

export default function ContentPipelinePage() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterSponsor, setFilterSponsor] = useState<string | null>(null);
  const [filterAgent, setFilterAgent] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/content-pipeline`);
      if (!res.ok) throw new Error('Failed to fetch pipeline data');
      const data = await res.json();
      setItems(data.items || []);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
      const { mockContentPipeline } = await import('@/app/mock-content-pipeline');
      setItems(mockContentPipeline.map(m => ({
        id: m.id, title: m.title, status: m.status, sponsor: m.sponsor || null,
        difficulty: m.difficulty, submitted_date: m.submittedDate,
        production_start_date: m.productionStartDate || null,
        publish_date: m.publishDate || null, views: m.views,
        watch_hours: m.watchHours, revenue: m.revenue, agent: m.agent,
      })));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const sponsors = [...new Set(items.map(i => i.sponsor).filter(Boolean) as string[])];
  const agents = [...new Set(items.map(i => i.agent).filter(Boolean) as string[])];

  const filtered = items.filter((item) => {
    if (filterSponsor && item.sponsor !== filterSponsor) return false;
    if (filterAgent && item.agent !== filterAgent) return false;
    return true;
  });

  const brainstorm = filtered.filter((i) => i.status === 'brainstorm');
  const greenlit = filtered.filter((i) => i.status === 'greenlit');
  const inProduction = filtered.filter((i) => i.status === 'in_production');
  const published = filtered.filter((i) => i.status === 'published');

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'simple': return { bg: 'rgba(16,185,129,0.15)', text: '#10B981' };
      case 'moderate': return { bg: 'rgba(234,179,8,0.15)', text: '#EAB308' };
      case 'complex': return { bg: 'rgba(239,68,68,0.15)', text: '#EF4444' };
      default: return { bg: 'var(--bg-elevated)', text: 'var(--text-secondary)' };
    }
  };

  const ContentCard = ({ item }: { item: ContentItem }) => {
    const diff = getDifficultyColor(item.difficulty);
    return (
      <div className="surface-card-hover p-4 cursor-pointer">
        <h4 className="font-semibold text-sm mb-2" style={{ color: 'var(--text-primary)' }}>{item.title}</h4>
        <div className="flex gap-1.5 flex-wrap mb-2">
          {item.sponsor && (
            <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'var(--accent-glow)', color: 'var(--accent-primary)' }}>
              💰 {item.sponsor}
            </span>
          )}
          <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: diff.bg, color: diff.text }}>
            {item.difficulty}
          </span>
          {item.agent && (
            <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)', border: '1px solid var(--border-default)' }}>
              {item.agent}
            </span>
          )}
        </div>
        <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
          {item.status === 'brainstorm' && item.submitted_date && (
            <p>📤 Submitted {new Date(item.submitted_date).toLocaleDateString()}</p>
          )}
          {item.status === 'in_production' && item.production_start_date && (
            <p>🎬 Since {new Date(item.production_start_date).toLocaleDateString()}</p>
          )}
          {item.status === 'published' && (
            <div className="p-2 rounded-lg mt-1" style={{ background: 'var(--bg-elevated)' }}>
              <p>👁️ {(item.views || 0).toLocaleString()} views</p>
              <p>⏱️ {(item.watch_hours || 0).toLocaleString()} watch hours</p>
              <p className="font-semibold" style={{ color: '#10B981' }}>💵 ${(item.revenue || 0).toLocaleString()}</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const KanbanColumn = ({ title, items, count }: { title: string; items: ContentItem[]; count: number }) => (
    <div className="flex-1 min-w-0">
      <div className="surface-card h-full flex flex-col">
        <div className="px-4 py-3 border-b" style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border-default)' }}>
          <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{title}</h3>
          <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{count} items</p>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {items.length === 0 ? (
            <p className="text-center text-sm py-8" style={{ color: 'var(--text-disabled)' }}>No items</p>
          ) : (
            items.map((item) => <ContentCard key={item.id} item={item} />)
          )}
        </div>
      </div>
    </div>
  );

  const totalVideos = filtered.length;
  const totalPublishedViews = published.reduce((sum, i) => sum + (i.views || 0), 0);
  const totalPublishedRevenue = published.reduce((sum, i) => sum + (Number(i.revenue) || 0), 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-4"></div>
          <p style={{ color: 'var(--text-secondary)' }}>Loading pipeline...</p>
        </div>
      </div>
    );
  }

  const FilterBadge = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
    <button
      onClick={onClick}
      className="text-xs px-2.5 py-1 rounded-full font-medium transition-colors"
      style={{
        background: active ? 'var(--accent-primary)' : 'transparent',
        color: active ? '#fff' : 'var(--text-secondary)',
        border: `1px solid ${active ? 'var(--accent-primary)' : 'var(--border-default)'}`,
      }}
    >
      {children}
    </button>
  );

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      {/* Header */}
      <div className="border-b sticky top-14 z-10" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-default)' }}>
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Content Pipeline</h1>
          <p className="mt-1" style={{ color: 'var(--text-secondary)' }}>Real-time view of all videos from idea to published</p>
          {error && <p className="text-xs text-amber-500 mt-1">Using cached data — API unavailable</p>}
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'TOTAL IN PIPELINE', value: totalVideos, color: '#3B82F6' },
            { label: 'PUBLISHED', value: published.length, color: '#10B981' },
            { label: 'TOTAL VIEWS', value: totalPublishedViews.toLocaleString(), color: '#8B5CF6' },
            { label: 'TOTAL REVENUE', value: `$${totalPublishedRevenue.toLocaleString()}`, color: '#10B981' },
          ].map((s) => (
            <div key={s.label} className="surface-card p-5">
              <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
              <p className="label-uppercase mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-6 pb-6">
        <div className="surface-card p-4">
          <p className="text-sm font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>Filter by:</p>
          <div className="flex gap-4 flex-wrap">
            <div>
              <p className="label-uppercase mb-1">Sponsor</p>
              <div className="flex gap-2 flex-wrap">
                <FilterBadge active={filterSponsor === null} onClick={() => setFilterSponsor(null)}>All</FilterBadge>
                {sponsors.map((s) => (
                  <FilterBadge key={s} active={filterSponsor === s} onClick={() => setFilterSponsor(filterSponsor === s ? null : s)}>{s}</FilterBadge>
                ))}
              </div>
            </div>
            <div>
              <p className="label-uppercase mb-1">Agent</p>
              <div className="flex gap-2 flex-wrap">
                <FilterBadge active={filterAgent === null} onClick={() => setFilterAgent(null)}>All</FilterBadge>
                {agents.map((a) => (
                  <FilterBadge key={a} active={filterAgent === a} onClick={() => setFilterAgent(filterAgent === a ? null : a)}>{a}</FilterBadge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Kanban */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-max">
          <KanbanColumn title="💡 Brainstorm" items={brainstorm} count={brainstorm.length} />
          <KanbanColumn title="✅ Greenlit" items={greenlit} count={greenlit.length} />
          <KanbanColumn title="🎬 In Production" items={inProduction} count={inProduction.length} />
          <KanbanColumn title="📺 Published" items={published} count={published.length} />
        </div>
      </div>
    </div>
  );
}

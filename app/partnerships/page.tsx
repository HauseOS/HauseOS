'use client';

import React, { useState, useEffect, useCallback } from 'react';

interface Deal {
  id: string;
  company_id: string;
  contact_id: string | null;
  content_idea_id: string | null;
  status: string;
  deal_type: string | null;
  deal_value: number | null;
  notes: string | null;
  company_name: string;
  company_category: string | null;
  company_fit_score: number | null;
  contact_name: string | null;
  contact_email: string | null;
  idea_title: string | null;
  created_at: string;
}

interface PipelineSummary {
  stages: { status: string; count: string; total_value: string }[];
  total_pipeline_value: number;
  total_active_deals: number;
  deals_this_month: number;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';
const STATUSES = ['discovered', 'researched', 'pitched', 'negotiating', 'confirmed', 'delivered', 'paid'];

const STATUS_CONFIG: Record<string, { label: string; emoji: string }> = {
  discovered: { label: 'Discovered', emoji: '🔍' },
  researched: { label: 'Researched', emoji: '📋' },
  pitched: { label: 'Pitched', emoji: '📨' },
  negotiating: { label: 'Negotiating', emoji: '🤝' },
  confirmed: { label: 'Confirmed', emoji: '✅' },
  delivered: { label: 'Delivered', emoji: '📦' },
  paid: { label: 'Paid', emoji: '💰' },
};

export default function PartnershipsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [pipeline, setPipeline] = useState<PipelineSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [dealsRes, pipelineRes] = await Promise.all([
        fetch(`${API_BASE}/api/deals`),
        fetch(`${API_BASE}/api/deals/pipeline`),
      ]);
      if (!dealsRes.ok || !pipelineRes.ok) throw new Error('Failed to fetch deals');
      const dealsData = await dealsRes.json();
      const pipelineData = await pipelineRes.json();
      setDeals(dealsData.deals || []);
      setPipeline(pipelineData);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
      setDeals([]);
      setPipeline(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const categories = [...new Set(deals.map(d => d.company_category).filter(Boolean) as string[])];

  const filtered = deals.filter((deal) => {
    if (filterStatus && deal.status !== filterStatus) return false;
    if (filterCategory && deal.company_category !== filterCategory) return false;
    return true;
  });

  const dealsByStatus = STATUSES.reduce((acc, status) => {
    acc[status] = filtered.filter(d => d.status === status);
    return acc;
  }, {} as Record<string, Deal[]>);

  const getDealTypeColor = (type: string | null) => {
    switch (type) {
      case 'integrated': return { bg: 'rgba(59,130,246,0.15)', text: '#3B82F6' };
      case 'dedicated': return { bg: 'rgba(139,92,246,0.15)', text: '#8B5CF6' };
      case 'shorts': return { bg: 'rgba(236,72,153,0.15)', text: '#EC4899' };
      case 'series': return { bg: 'rgba(245,158,11,0.15)', text: '#F59E0B' };
      default: return { bg: 'var(--bg-elevated)', text: 'var(--text-secondary)' };
    }
  };

  const FitScore = ({ score }: { score: number | null }) => {
    if (!score) return null;
    const color = score >= 85 ? '#22c55e' : score >= 70 ? '#f59e0b' : '#94a3b8';
    return <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.08)', color }}>{score}%</span>;
  };

  const DealCard = ({ deal }: { deal: Deal }) => {
    const dtColor = getDealTypeColor(deal.deal_type);
    return (
      <div className="surface-card-hover p-4 cursor-pointer">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h4 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{deal.company_name}</h4>
          <FitScore score={deal.company_fit_score} />
        </div>
        {deal.contact_name && <p className="text-xs mb-2" style={{ color: 'var(--text-tertiary)' }}>{deal.contact_name}</p>}
        <div className="flex gap-1.5 flex-wrap mb-2">
          {deal.deal_type && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: dtColor.bg, color: dtColor.text }}>{deal.deal_type}</span>
          )}
          {deal.deal_value && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold" style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)' }}>
              ${Number(deal.deal_value).toLocaleString()}
            </span>
          )}
        </div>
        {deal.idea_title && <p className="text-xs line-clamp-1" style={{ color: 'var(--text-tertiary)' }}>📹 {deal.idea_title}</p>}
        {deal.company_category && <p className="text-[10px] mt-1" style={{ color: 'var(--text-disabled)' }}>{deal.company_category}</p>}
      </div>
    );
  };

  const KanbanColumn = ({ status, deals }: { status: string; deals: Deal[] }) => {
    const config = STATUS_CONFIG[status];
    return (
      <div className="min-w-[200px] flex-1">
        <div className="surface-card h-full flex flex-col">
          <div className="px-3 py-2.5 border-b" style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border-default)' }}>
            <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{config.emoji} {config.label}</h3>
            <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{deals.length} deal{deals.length !== 1 ? 's' : ''}</p>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5 max-h-[600px]">
            {deals.length === 0 ? (
              <p className="text-center text-xs py-6" style={{ color: 'var(--text-disabled)' }}>No deals</p>
            ) : (
              deals.map((deal) => <DealCard key={deal.id} deal={deal} />)
            )}
          </div>
        </div>
      </div>
    );
  };

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-4"></div>
          <p style={{ color: 'var(--text-secondary)' }}>Loading partnerships...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      {/* Header */}
      <div className="border-b sticky top-14 z-10" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-default)' }}>
        <div className="max-w-[1400px] mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Partnerships Pipeline</h1>
              <p className="mt-1" style={{ color: 'var(--text-secondary)' }}>Sponsor deals from discovery to payment</p>
              {error && <p className="text-xs text-amber-500 mt-1">API unavailable — no data to display</p>}
            </div>
            <div className="flex gap-3">
              <a href="/partnerships/companies" className="btn-secondary text-sm">Company Directory</a>
              <button className="btn-primary text-sm">+ New Deal</button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-[1400px] mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: 'TOTAL PIPELINE VALUE', value: `$${(pipeline?.total_pipeline_value || 0).toLocaleString()}`, color: '#3B82F6' },
            { label: 'ACTIVE DEALS', value: pipeline?.total_active_deals || 0, color: '#10B981' },
            { label: 'DEALS THIS MONTH', value: pipeline?.deals_this_month || 0, color: '#8B5CF6' },
          ].map((s) => (
            <div key={s.label} className="surface-card p-5">
              <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
              <p className="label-uppercase mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-[1400px] mx-auto px-6 pb-6">
        <div className="surface-card p-4">
          <p className="text-sm font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>Filter by:</p>
          <div className="flex gap-4 flex-wrap">
            <div>
              <p className="label-uppercase mb-1">Status</p>
              <div className="flex gap-2 flex-wrap">
                <FilterBadge active={filterStatus === null} onClick={() => setFilterStatus(null)}>All</FilterBadge>
                {STATUSES.map((s) => (
                  <FilterBadge key={s} active={filterStatus === s} onClick={() => setFilterStatus(filterStatus === s ? null : s)}>
                    {STATUS_CONFIG[s].emoji} {STATUS_CONFIG[s].label}
                  </FilterBadge>
                ))}
              </div>
            </div>
            {categories.length > 0 && (
              <div>
                <p className="label-uppercase mb-1">Category</p>
                <div className="flex gap-2 flex-wrap">
                  <FilterBadge active={filterCategory === null} onClick={() => setFilterCategory(null)}>All</FilterBadge>
                  {categories.map((cat) => (
                    <FilterBadge key={cat} active={filterCategory === cat} onClick={() => setFilterCategory(filterCategory === cat ? null : cat)}>{cat}</FilterBadge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Kanban */}
      <div className="max-w-[1400px] mx-auto px-6 pb-12">
        <div className="flex gap-4 overflow-x-auto pb-4">
          {STATUSES.map((status) => (
            <KanbanColumn key={status} status={status} deals={dealsByStatus[status] || []} />
          ))}
        </div>
      </div>
    </div>
  );
}

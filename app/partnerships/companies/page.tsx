'use client';

import React, { useState, useEffect, useCallback } from 'react';

interface Company {
  id: string;
  name: string;
  website: string | null;
  category: string | null;
  fit_score: number;
  funding_stage: string | null;
  has_partnership_page: boolean;
  notes: string | null;
  source: string | null;
  channels_sponsoring: string[] | null;
  sponsor_frequency: number | null;
  first_seen_at: string | null;
  last_seen_at: string | null;
  created_at: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'fit_score' | 'name' | 'created_at'>('fit_score');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string | null>(null);

  const fetchCompanies = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/companies?sort=${sortBy}`);
      if (!res.ok) throw new Error('Failed to fetch companies');
      const data = await res.json();
      setCompanies(data.companies || []);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  }, [sortBy]);

  useEffect(() => { fetchCompanies(); }, [fetchCompanies]);

  const categories = [...new Set(companies.map(c => c.category).filter(Boolean) as string[])];

  const filtered = companies.filter((company) => {
    if (filterCategory && company.category !== filterCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!company.name.toLowerCase().includes(q) && !(company.category || '').toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const FitStars = ({ score }: { score: number }) => (
    <span className="text-amber-500 text-sm">{'★'.repeat(score)}{'☆'.repeat(5 - score)}</span>
  );

  const getSourceColor = (source: string | null) => {
    switch (source) {
      case 'peer_channel': return { bg: 'rgba(59,130,246,0.15)', text: '#3B82F6' };
      case 'inbound': return { bg: 'rgba(16,185,129,0.15)', text: '#10B981' };
      case 'product_hunt': return { bg: 'rgba(249,115,22,0.15)', text: '#F97316' };
      case 'cold_outreach': return { bg: 'rgba(139,92,246,0.15)', text: '#8B5CF6' };
      default: return { bg: 'var(--bg-elevated)', text: 'var(--text-secondary)' };
    }
  };

  const getFundingColor = (stage: string | null) => {
    switch (stage) {
      case 'Public': return { bg: 'rgba(16,185,129,0.15)', text: '#10B981' };
      case 'Series B+': return { bg: 'rgba(59,130,246,0.15)', text: '#3B82F6' };
      case 'Series A': return { bg: 'rgba(99,102,241,0.15)', text: '#6366F1' };
      case 'Seed': return { bg: 'rgba(245,158,11,0.15)', text: '#F59E0B' };
      default: return { bg: 'var(--bg-elevated)', text: 'var(--text-secondary)' };
    }
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
          <p style={{ color: 'var(--text-secondary)' }}>Loading companies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      {/* Header */}
      <div className="border-b sticky top-14 z-10" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-default)' }}>
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Company Directory</h1>
              <p className="mt-1" style={{ color: 'var(--text-secondary)' }}>All known sponsor companies</p>
              {error && <p className="text-xs text-amber-500 mt-1">API unavailable — no data to display</p>}
            </div>
            <div className="flex gap-3">
              <a href="/partnerships" className="btn-secondary text-sm">Pipeline View</a>
              <button className="btn-primary text-sm">+ Add Company</button>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="surface-card p-4 space-y-4">
          <input
            type="text"
            placeholder="Search companies by name or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg px-4 py-2 text-sm focus:outline-none transition-colors"
            style={{
              background: 'var(--bg-elevated)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-default)',
            }}
          />
          <div className="flex gap-4 flex-wrap items-end">
            <div>
              <p className="label-uppercase mb-1">Sort by</p>
              <div className="flex gap-2">
                {([['fit_score', 'Fit Score'], ['name', 'Name'], ['created_at', 'Newest']] as const).map(([key, label]) => (
                  <FilterBadge key={key} active={sortBy === key} onClick={() => setSortBy(key)}>{label}</FilterBadge>
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

      {/* Company Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-lg" style={{ color: 'var(--text-tertiary)' }}>
              {error ? 'Connect to the API to see companies' : 'No companies found'}
            </p>
            <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
              {error ? 'Make sure your API server is running' : 'Try adjusting your filters or add a new company'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((company) => (
              <div key={company.id} className="surface-card-hover p-5 group cursor-pointer">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold group-hover:text-[var(--accent-primary)] transition-colors" style={{ color: 'var(--text-primary)' }}>
                      {company.name}
                    </h3>
                    {company.category && <p className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{company.category}</p>}
                  </div>
                  <FitStars score={company.fit_score} />
                </div>

                <div className="flex gap-1.5 flex-wrap mb-3">
                  {company.funding_stage && (() => {
                    const fc = getFundingColor(company.funding_stage);
                    return <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: fc.bg, color: fc.text }}>{company.funding_stage}</span>;
                  })()}
                  {company.source && (() => {
                    const sc = getSourceColor(company.source);
                    return <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: sc.bg, color: sc.text }}>{company.source.replace('_', ' ')}</span>;
                  })()}
                  {company.has_partnership_page && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(16,185,129,0.15)', color: '#10B981' }}>partnership page</span>
                  )}
                </div>

                {company.channels_sponsoring && company.channels_sponsoring.length > 0 && (
                  <div className="mb-3">
                    <p className="label-uppercase mb-1">Sponsors</p>
                    <div className="flex gap-1 flex-wrap">
                      {company.channels_sponsoring.map((ch) => (
                        <span key={ch} className="text-xs px-2 py-0.5 rounded" style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)' }}>{ch}</span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-3" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                  <button className="flex-1 text-xs px-3 py-1.5 rounded-md btn-secondary">Add Contact</button>
                  <button className="flex-1 text-xs px-3 py-1.5 rounded-md btn-primary">Create Deal</button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 text-center text-sm" style={{ color: 'var(--text-tertiary)' }}>
          {filtered.length} compan{filtered.length !== 1 ? 'ies' : 'y'}
        </div>
      </div>
    </div>
  );
}

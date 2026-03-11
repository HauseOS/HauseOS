'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
      if (!company.name.toLowerCase().includes(q) && !(company.category || '').toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  const FitStars = ({ score }: { score: number }) => (
    <span className="text-amber-500 text-sm">
      {'★'.repeat(score)}{'☆'.repeat(5 - score)}
    </span>
  );

  const getSourceBadgeColor = (source: string | null) => {
    switch (source) {
      case 'peer_channel': return 'bg-blue-100 text-blue-800';
      case 'inbound': return 'bg-green-100 text-green-800';
      case 'product_hunt': return 'bg-orange-100 text-orange-800';
      case 'cold_outreach': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFundingColor = (stage: string | null) => {
    switch (stage) {
      case 'Public': return 'bg-emerald-100 text-emerald-800';
      case 'Series B+': return 'bg-blue-100 text-blue-800';
      case 'Series A': return 'bg-indigo-100 text-indigo-800';
      case 'Seed': return 'bg-amber-100 text-amber-800';
      case 'Bootstrapped': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff4e64] mx-auto mb-4"></div>
          <p className="text-gray-500">Loading companies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">🏢 Company Directory</h1>
              <p className="text-gray-600 mt-1">All known sponsor companies</p>
              {error && (
                <p className="text-xs text-amber-600 mt-1">API unavailable — no data to display</p>
              )}
            </div>
            <div className="flex gap-3">
              <a
                href="/partnerships"
                className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
              >
                Pipeline View
              </a>
              <button className="px-4 py-2 bg-[#ff4e64] text-white rounded-lg hover:bg-[#ff3a52] transition-colors font-medium text-sm">
                + Add Company
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
          {/* Search */}
          <input
            type="text"
            placeholder="Search companies by name or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#ff4e64] transition-colors"
          />

          <div className="flex gap-4 flex-wrap items-end">
            {/* Sort */}
            <div>
              <p className="text-xs text-gray-600 mb-1">Sort by</p>
              <div className="flex gap-2">
                {([
                  ['fit_score', 'Fit Score'],
                  ['name', 'Name'],
                  ['created_at', 'Newest'],
                ] as const).map(([key, label]) => (
                  <Badge
                    key={key}
                    variant={sortBy === key ? 'default' : 'outline'}
                    className="cursor-pointer text-xs"
                    onClick={() => setSortBy(key)}
                  >
                    {label}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            {categories.length > 0 && (
              <div>
                <p className="text-xs text-gray-600 mb-1">Category</p>
                <div className="flex gap-2 flex-wrap">
                  <Badge
                    variant={filterCategory === null ? 'default' : 'outline'}
                    className="cursor-pointer text-xs"
                    onClick={() => setFilterCategory(null)}
                  >
                    All
                  </Badge>
                  {categories.map((cat) => (
                    <Badge
                      key={cat}
                      variant={filterCategory === cat ? 'default' : 'outline'}
                      className="cursor-pointer text-xs"
                      onClick={() => setFilterCategory(filterCategory === cat ? null : cat)}
                    >
                      {cat}
                    </Badge>
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
            <p className="text-gray-400 text-lg">
              {error ? 'Connect to the API to see companies' : 'No companies found'}
            </p>
            <p className="text-gray-500 text-sm mt-2">
              {error ? 'Make sure your API server is running' : 'Try adjusting your filters or add a new company'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((company) => (
              <Card
                key={company.id}
                className="border border-gray-200 bg-white hover:border-[#ff4e64] hover:shadow-md transition-all cursor-pointer group"
              >
                <CardContent className="p-5">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 group-hover:text-[#ff4e64] transition-colors">
                        {company.name}
                      </h3>
                      {company.category && (
                        <p className="text-xs text-gray-500 mt-0.5">{company.category}</p>
                      )}
                    </div>
                    <FitStars score={company.fit_score} />
                  </div>

                  {/* Badges */}
                  <div className="flex gap-1.5 flex-wrap mb-3">
                    {company.funding_stage && (
                      <Badge className={`text-[10px] px-1.5 py-0 ${getFundingColor(company.funding_stage)}`}>
                        {company.funding_stage}
                      </Badge>
                    )}
                    {company.source && (
                      <Badge className={`text-[10px] px-1.5 py-0 ${getSourceBadgeColor(company.source)}`}>
                        {company.source.replace('_', ' ')}
                      </Badge>
                    )}
                    {company.has_partnership_page && (
                      <Badge className="text-[10px] px-1.5 py-0 bg-green-100 text-green-800">
                        partnership page
                      </Badge>
                    )}
                  </div>

                  {/* Channels */}
                  {company.channels_sponsoring && company.channels_sponsoring.length > 0 && (
                    <div className="mb-3">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">Sponsors</p>
                      <div className="flex gap-1 flex-wrap">
                        {company.channels_sponsoring.map((ch) => (
                          <span key={ch} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                            {ch}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-3 border-t border-gray-100">
                    <button className="flex-1 text-xs px-3 py-1.5 bg-gray-50 text-gray-700 rounded-md hover:bg-gray-100 transition-colors font-medium">
                      Add Contact
                    </button>
                    <button className="flex-1 text-xs px-3 py-1.5 bg-[#ff4e64] text-white rounded-md hover:bg-[#ff3a52] transition-colors font-medium">
                      Create Deal
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Count */}
        <div className="mt-8 text-center text-sm text-gray-500">
          {filtered.length} compan{filtered.length !== 1 ? 'ies' : 'y'}
        </div>
      </div>
    </div>
  );
}

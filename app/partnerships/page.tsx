'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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

const STATUS_CONFIG: Record<string, { label: string; emoji: string; color: string }> = {
  discovered: { label: 'Discovered', emoji: '🔍', color: 'border-gray-200 bg-gray-50' },
  researched: { label: 'Researched', emoji: '📋', color: 'border-blue-200 bg-blue-50' },
  pitched: { label: 'Pitched', emoji: '📨', color: 'border-indigo-200 bg-indigo-50' },
  negotiating: { label: 'Negotiating', emoji: '🤝', color: 'border-yellow-200 bg-yellow-50' },
  confirmed: { label: 'Confirmed', emoji: '✅', color: 'border-green-200 bg-green-50' },
  delivered: { label: 'Delivered', emoji: '📦', color: 'border-purple-200 bg-purple-50' },
  paid: { label: 'Paid', emoji: '💰', color: 'border-emerald-200 bg-emerald-50' },
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
      case 'integrated': return 'bg-blue-100 text-blue-800';
      case 'dedicated': return 'bg-purple-100 text-purple-800';
      case 'shorts': return 'bg-pink-100 text-pink-800';
      case 'series': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const FitStars = ({ score }: { score: number | null }) => {
    if (!score) return null;
    return (
      <span className="text-xs text-amber-500">
        {'★'.repeat(score)}{'☆'.repeat(5 - score)}
      </span>
    );
  };

  const DealCard = ({ deal }: { deal: Deal }) => (
    <Card className={`${STATUS_CONFIG[deal.status]?.color || 'border-gray-200 bg-white'} border cursor-pointer transition-all hover:shadow-md hover:border-[#ff4e64]`}>
      <CardHeader className="pb-2 pt-4 px-4">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-sm font-semibold leading-tight">{deal.company_name}</CardTitle>
          <FitStars score={deal.company_fit_score} />
        </div>
        {deal.contact_name && (
          <p className="text-xs text-gray-500 mt-1">{deal.contact_name}</p>
        )}
      </CardHeader>
      <CardContent className="pb-3 px-4">
        <div className="space-y-2">
          <div className="flex gap-1.5 flex-wrap">
            {deal.deal_type && (
              <Badge className={`text-[10px] px-1.5 py-0 ${getDealTypeColor(deal.deal_type)}`}>
                {deal.deal_type}
              </Badge>
            )}
            {deal.deal_value && (
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 font-semibold">
                ${Number(deal.deal_value).toLocaleString()}
              </Badge>
            )}
          </div>
          {deal.idea_title && (
            <p className="text-xs text-gray-600 line-clamp-1">📹 {deal.idea_title}</p>
          )}
          {deal.company_category && (
            <p className="text-[10px] text-gray-400">{deal.company_category}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const KanbanColumn = ({ status, deals }: { status: string; deals: Deal[] }) => {
    const config = STATUS_CONFIG[status];
    return (
      <div className="min-w-[200px] flex-1">
        <div className="bg-white rounded-lg border border-gray-200 h-full flex flex-col">
          <div className="bg-gray-50 border-b border-gray-200 px-3 py-2.5">
            <h3 className="font-semibold text-gray-900 text-sm">
              {config.emoji} {config.label}
            </h3>
            <p className="text-xs text-gray-500">{deals.length} deal{deals.length !== 1 ? 's' : ''}</p>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5 max-h-[600px]">
            {deals.length === 0 ? (
              <p className="text-center text-gray-400 text-xs py-6">No deals</p>
            ) : (
              deals.map((deal) => <DealCard key={deal.id} deal={deal} />)
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff4e64] mx-auto mb-4"></div>
          <p className="text-gray-500">Loading partnerships...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="max-w-[1400px] mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">🤝 Partnerships Pipeline</h1>
              <p className="text-gray-600 mt-1">Sponsor deals from discovery to payment</p>
              {error && (
                <p className="text-xs text-amber-600 mt-1">API unavailable — no data to display</p>
              )}
            </div>
            <div className="flex gap-3">
              <a
                href="/partnerships/companies"
                className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
              >
                Company Directory
              </a>
              <button className="px-4 py-2 bg-[#ff4e64] text-white rounded-lg hover:bg-[#ff3a52] transition-colors font-medium text-sm">
                + New Deal
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="max-w-[1400px] mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-blue-600">
                ${(pipeline?.total_pipeline_value || 0).toLocaleString()}
              </div>
              <p className="text-sm text-gray-600">Total Pipeline Value</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-green-600">
                {pipeline?.total_active_deals || 0}
              </div>
              <p className="text-sm text-gray-600">Active Deals</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-purple-600">
                {pipeline?.deals_this_month || 0}
              </div>
              <p className="text-sm text-gray-600">Deals This Month</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-[1400px] mx-auto px-6 pb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm font-semibold text-gray-700 mb-3">Filter by:</p>
          <div className="flex gap-4 flex-wrap">
            <div>
              <p className="text-xs text-gray-600 mb-1">Status</p>
              <div className="flex gap-2 flex-wrap">
                <Badge
                  variant={filterStatus === null ? 'default' : 'outline'}
                  className="cursor-pointer text-xs"
                  onClick={() => setFilterStatus(null)}
                >
                  All
                </Badge>
                {STATUSES.map((s) => (
                  <Badge
                    key={s}
                    variant={filterStatus === s ? 'default' : 'outline'}
                    className="cursor-pointer text-xs capitalize"
                    onClick={() => setFilterStatus(filterStatus === s ? null : s)}
                  >
                    {STATUS_CONFIG[s].emoji} {STATUS_CONFIG[s].label}
                  </Badge>
                ))}
              </div>
            </div>
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

      {/* Kanban Board */}
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

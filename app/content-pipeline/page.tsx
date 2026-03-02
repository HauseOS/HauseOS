'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockContentPipeline, sponsors, agents } from '@/app/mock-content-pipeline';

export default function ContentPipelinePage() {
  const [filterSponsor, setFilterSponsor] = useState<string | null>(null);
  const [filterAgent, setFilterAgent] = useState<string | null>(null);

  const filtered = mockContentPipeline.filter((item) => {
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
      case 'simple':
        return 'bg-green-100 text-green-800';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800';
      case 'complex':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'brainstorm':
        return 'border-yellow-200 bg-yellow-50';
      case 'greenlit':
        return 'border-blue-200 bg-blue-50';
      case 'in_production':
        return 'border-purple-200 bg-purple-50';
      case 'published':
        return 'border-green-200 bg-green-50';
      default:
        return 'border-gray-200 bg-white';
    }
  };

  const ContentCard = ({ item }: { item: (typeof mockContentPipeline)[0] }) => (
    <Card className={`${getStatusColor(item.status)} border-2 cursor-pointer transition-all hover:shadow-md`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base leading-tight">{item.title}</CardTitle>
        <div className="flex gap-2 mt-2">
          {item.sponsor && (
            <Badge variant="secondary" className="text-xs">
              💰 {item.sponsor}
            </Badge>
          )}
          <Badge className={`text-xs ${getDifficultyColor(item.difficulty)}`}>
            {item.difficulty}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {item.agent}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="space-y-2 text-xs text-gray-600">
          {item.status === 'brainstorm' && (
            <p>📤 Submitted {new Date(item.submittedDate).toLocaleDateString()}</p>
          )}
          {item.status === 'in_production' && item.productionStartDate && (
            <p>🎬 In production since {new Date(item.productionStartDate).toLocaleDateString()}</p>
          )}
          {item.status === 'published' && (
            <>
              <p>📅 Published {new Date(item.publishDate!).toLocaleDateString()}</p>
              <div className="bg-white/60 rounded p-2 space-y-1">
                <p>👁️ {item.views?.toLocaleString()} views</p>
                <p>⏱️ {item.watchHours?.toLocaleString()} watch hours</p>
                <p className="font-semibold text-green-700">💵 ${item.revenue?.toLocaleString()} revenue</p>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const KanbanColumn = ({ title, items, count }: { title: string; items: any[]; count: number }) => (
    <div className="flex-1 min-w-0">
      <div className="bg-white rounded-lg border border-gray-200 h-full flex flex-col">
        <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{count} items</p>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-8">No items</p>
          ) : (
            items.map((item) => <ContentCard key={item.id} item={item} />)
          )}
        </div>
      </div>
    </div>
  );

  const totalVideos = filtered.length;
  const totalPublishedViews = published.reduce((sum, i) => sum + (i.views || 0), 0);
  const totalPublishedRevenue = published.reduce((sum, i) => sum + (i.revenue || 0), 0);
  const avgPublishedRevenue = published.length > 0 ? totalPublishedRevenue / published.length : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold text-gray-900">📹 Content Pipeline</h1>
          <p className="text-gray-600 mt-1">Real-time view of all videos from idea to published</p>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-blue-600">{totalVideos}</div>
              <p className="text-sm text-gray-600">Total in Pipeline</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-green-600">{published.length}</div>
              <p className="text-sm text-gray-600">Published</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-purple-600">{totalPublishedViews.toLocaleString()}</div>
              <p className="text-sm text-gray-600">Total Views</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-green-700">${totalPublishedRevenue.toLocaleString()}</div>
              <p className="text-sm text-gray-600">Total Revenue</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-6 pb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm font-semibold text-gray-700 mb-3">Filter by:</p>
          <div className="flex gap-4 flex-wrap">
            <div>
              <p className="text-xs text-gray-600 mb-1">Sponsor</p>
              <div className="flex gap-2 flex-wrap">
                <Badge
                  variant={filterSponsor === null ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => setFilterSponsor(null)}
                >
                  All
                </Badge>
                {sponsors.map((sponsor) => (
                  <Badge
                    key={sponsor}
                    variant={filterSponsor === sponsor ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => setFilterSponsor(filterSponsor === sponsor ? null : sponsor)}
                  >
                    {sponsor}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Agent</p>
              <div className="flex gap-2 flex-wrap">
                <Badge
                  variant={filterAgent === null ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => setFilterAgent(null)}
                >
                  All
                </Badge>
                {agents.map((agent) => (
                  <Badge
                    key={agent}
                    variant={filterAgent === agent ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => setFilterAgent(filterAgent === agent ? null : agent)}
                  >
                    {agent}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
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

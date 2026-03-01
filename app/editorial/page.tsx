'use client';

import React from 'react';
import { mockDashboardStats, mockIdeas } from '@/app/mock-data';
import DashboardStatCard from './components/DashboardStatCard';

export default function EditorialDashboard() {
  const ideasByStatus = {
    brainstorm: mockIdeas.filter((i) => i.status === 'brainstorm').length,
    under_review: mockIdeas.filter((i) => i.status === 'under_review').length,
    feedback_pending: mockIdeas.filter((i) => i.status === 'feedback_pending').length,
    greenlit: mockIdeas.filter((i) => i.status === 'greenlit').length,
    in_production: mockIdeas.filter((i) => i.status === 'in_production').length,
    published: mockIdeas.filter((i) => i.status === 'published').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold">📈 Editorial Dashboard</h1>
          <p className="text-gray-400 mt-1">Content pipeline and performance metrics</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Key Metrics */}
        <div>
          <h2 className="text-xl font-bold mb-4">Key Metrics (Last 30 Days)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <DashboardStatCard
              icon="💡"
              label="Ideas Submitted"
              value={mockDashboardStats.ideas_submitted}
              color="blue"
            />
            <DashboardStatCard
              icon="✅"
              label="Greenlit"
              value={mockDashboardStats.ideas_greenlit}
              color="green"
            />
            <DashboardStatCard
              icon="📺"
              label="Published"
              value={mockDashboardStats.ideas_published}
              color="purple"
            />
            <DashboardStatCard
              icon="⏱️"
              label="Avg Time to Greenlit"
              value={`${mockDashboardStats.avg_time_to_greenlit_days} days`}
              color="yellow"
            />
          </div>
        </div>

        {/* Ideas by Status */}
        <div>
          <h2 className="text-xl font-bold mb-4">Ideas by Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
              <p className="text-gray-400 text-xs font-semibold mb-2">BRAINSTORM</p>
              <p className="text-3xl font-bold text-yellow-400">
                {ideasByStatus.brainstorm}
              </p>
            </div>
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
              <p className="text-gray-400 text-xs font-semibold mb-2">UNDER REVIEW</p>
              <p className="text-3xl font-bold text-blue-400">
                {ideasByStatus.under_review}
              </p>
            </div>
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
              <p className="text-gray-400 text-xs font-semibold mb-2">FEEDBACK</p>
              <p className="text-3xl font-bold text-orange-400">
                {ideasByStatus.feedback_pending}
              </p>
            </div>
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
              <p className="text-gray-400 text-xs font-semibold mb-2">GREENLIT</p>
              <p className="text-3xl font-bold text-green-400">
                {ideasByStatus.greenlit}
              </p>
            </div>
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
              <p className="text-gray-400 text-xs font-semibold mb-2">IN PRODUCTION</p>
              <p className="text-3xl font-bold text-purple-400">
                {ideasByStatus.in_production}
              </p>
            </div>
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
              <p className="text-gray-400 text-xs font-semibold mb-2">PUBLISHED</p>
              <p className="text-3xl font-bold text-green-300">
                {ideasByStatus.published}
              </p>
            </div>
          </div>
        </div>

        {/* Agent Contributions */}
        <div>
          <h2 className="text-xl font-bold mb-4">Agent Contributions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mockDashboardStats.agent_contributions.map((contrib) => (
              <div key={contrib.agent_origin} className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
                <p className="text-gray-400 text-sm mb-2">Submitted by</p>
                <p className="text-white font-bold text-lg mb-2 capitalize">
                  {contrib.agent_origin}
                </p>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div
                    className="bg-[#ff4e64] h-2 rounded-full"
                    style={{
                      width: `${
                        (contrib.count /
                          mockDashboardStats.agent_contributions.reduce(
                            (sum, c) => sum + c.count,
                            0
                          )) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
                <p className="text-right text-sm text-gray-400 mt-2">
                  {contrib.count} ideas
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Trending Tags */}
        <div>
          <h2 className="text-xl font-bold mb-4">Trending Tags</h2>
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
            <div className="space-y-3">
              {mockDashboardStats.trending_tags.map((tag) => (
                <div key={tag.tag} className="flex items-center justify-between">
                  <span className="text-white font-medium">#{tag.tag}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 bg-gray-800 rounded-full h-2">
                      <div
                        className="bg-[#ff4e64] h-2 rounded-full"
                        style={{
                          width: `${
                            (tag.count /
                              mockDashboardStats.trending_tags.reduce(
                                (sum, t) => sum + t.count,
                                0
                              )) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-gray-400 text-sm w-8 text-right">
                      {tag.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="px-6 py-3 bg-[#ff4e64] hover:bg-[#ff3a52] text-white rounded-lg transition-colors font-medium">
              📝 Submit New Idea
            </button>
            <button className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors font-medium">
              📊 View Ideas Board
            </button>
            <button className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors font-medium">
              📈 View Research
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

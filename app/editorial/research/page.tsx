'use client';

import React, { useState } from 'react';
import { mockResearchDrops } from '@/app/mock-data';

export default function ResearchBoard() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return 'border-red-600 bg-red-100/5';
      case 'medium':
        return 'border-yellow-600 bg-yellow-100/5';
      case 'low':
        return 'border-gray-600 bg-gray-100/5';
      default:
        return 'border-gray-600 bg-gray-100/5';
    }
  };

  const getUrgencyEmoji = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return '🔴';
      case 'medium':
        return '🟡';
      case 'low':
        return '⚪';
      default:
        return '⚪';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div>
            <h1 className="text-3xl font-bold">📊 Research Board</h1>
            <p className="text-gray-400 mt-1">Research findings and trending topics</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="space-y-4">
          {mockResearchDrops.map((drop) => (
            <div
              key={drop.id}
              className={`border rounded-lg p-6 cursor-pointer transition-all hover:border-[#ff4e64] ${getUrgencyColor(
                drop.urgency
              )}`}
              onClick={() =>
                setExpandedId(expandedId === drop.id ? null : drop.id)
              }
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">
                      {getUrgencyEmoji(drop.urgency)}
                    </span>
                    <h3 className="text-lg font-bold text-white">
                      {drop.topic}
                    </h3>
                  </div>
                  <p className="text-gray-300 text-sm">{drop.summary}</p>
                </div>
                <span className="text-2xl">
                  {expandedId === drop.id ? '▼' : '▶'}
                </span>
              </div>

              {/* Expanded Content */}
              {expandedId === drop.id && (
                <div className="mt-6 pt-6 border-t border-gray-700/50 space-y-6">
                  {/* Key Findings */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-300 mb-3">
                      KEY FINDINGS
                    </h4>
                    <ul className="space-y-2">
                      {drop.key_findings.map((finding, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-3 text-gray-300"
                        >
                          <span className="text-[#ff4e64] mt-1">•</span>
                          <span>{finding}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Suggested Angles */}
                  {drop.suggested_angles.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-300 mb-3">
                        SUGGESTED VIDEO ANGLES
                      </h4>
                      <div className="space-y-2">
                        {drop.suggested_angles.map((angle, idx) => (
                          <div
                            key={idx}
                            className="bg-gray-800/50 rounded p-3 text-gray-300"
                          >
                            {angle}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Partner Fit */}
                  {drop.partner_fit.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-300 mb-3">
                        PARTNER FIT
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {drop.partner_fit.map((partner) => (
                          <span
                            key={partner}
                            className="px-3 py-1 bg-[#ff4e64]/20 text-[#ff4e64] rounded-full text-sm"
                          >
                            🤝 {partner}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Meta */}
                  <div className="flex items-center gap-4 text-sm text-gray-500 pt-4 border-t border-gray-700/50">
                    <span>📤 {drop.agent_origin}</span>
                    <span>
                      📅{' '}
                      {new Date(drop.created_at).toLocaleDateString(
                        'en-US',
                        { month: 'short', day: 'numeric' }
                      )}
                    </span>
                  </div>

                  {/* Action */}
                  <button className="w-full px-4 py-2 bg-[#ff4e64] hover:bg-[#ff3a52] text-white rounded-lg transition-colors font-medium">
                    Create Idea from This
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

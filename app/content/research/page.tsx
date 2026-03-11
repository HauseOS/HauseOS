'use client';

import React, { useState, useEffect } from 'react';

interface ResearchDrop {
  id: string;
  topic: string;
  summary: string;
  key_findings: string[] | null;
  suggested_angles: string[] | null;
  partner_fit: string[] | null;
  urgency: string;
  agent_origin: string;
  created_at: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

export default function ContentResearchPage() {
  const [drops, setDrops] = useState<ResearchDrop[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/editorial/research?limit=50`)
      .then(r => r.json())
      .then(d => setDrops(d.research || []))
      .catch(() => setDrops([]))
      .finally(() => setLoading(false));
  }, []);

  const getUrgencyStyle = (urgency: string) => {
    switch (urgency) {
      case 'high': return { border: '#EF4444', bg: 'rgba(239,68,68,0.06)' };
      case 'medium': return { border: '#EAB308', bg: 'rgba(234,179,8,0.06)' };
      default: return { border: 'var(--border-default)', bg: 'var(--bg-surface)' };
    }
  };

  const getUrgencyEmoji = (urgency: string) => {
    switch (urgency) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      default: return '⚪';
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <div className="border-b sticky top-14 z-10" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-default)' }}>
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Research Board</h1>
          <p className="mt-1" style={{ color: 'var(--text-secondary)' }}>Research findings and trending topics</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {loading ? (
          <div className="text-center py-16" style={{ color: 'var(--text-tertiary)' }}>Loading research...</div>
        ) : drops.length === 0 ? (
          <div className="text-center py-16" style={{ color: 'var(--text-tertiary)' }}>No research drops yet.</div>
        ) : (
          <div className="space-y-4">
            {drops.map((drop) => {
              const urgStyle = getUrgencyStyle(drop.urgency);
              return (
                <div
                  key={drop.id}
                  className="rounded-xl p-6 cursor-pointer transition-all"
                  style={{ background: urgStyle.bg, border: `1px solid ${urgStyle.border}` }}
                  onClick={() => setExpandedId(expandedId === drop.id ? null : drop.id)}
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">{getUrgencyEmoji(drop.urgency)}</span>
                        <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{drop.topic}</h3>
                      </div>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{drop.summary}</p>
                    </div>
                    <span className="text-2xl" style={{ color: 'var(--text-tertiary)' }}>
                      {expandedId === drop.id ? '▼' : '▶'}
                    </span>
                  </div>

                  {expandedId === drop.id && (
                    <div className="mt-6 pt-6 space-y-6" style={{ borderTop: '1px solid var(--border-default)' }}>
                      {drop.key_findings && drop.key_findings.length > 0 && (
                        <div>
                          <h4 className="label-uppercase mb-3">KEY FINDINGS</h4>
                          <div className="flex flex-wrap gap-2">
                            {drop.key_findings.map((tag, idx) => (
                              <span key={idx} className="px-2 py-0.5 rounded-full text-xs" style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)' }}>
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {drop.suggested_angles && drop.suggested_angles.length > 0 && (
                        <div>
                          <h4 className="label-uppercase mb-3">SUGGESTED VIDEO ANGLES</h4>
                          <div className="space-y-2">
                            {drop.suggested_angles.map((angle, idx) => (
                              <div key={idx} className="rounded-lg p-3 text-sm" style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)' }}>
                                {angle}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {drop.partner_fit && drop.partner_fit.length > 0 && (
                        <div>
                          <h4 className="label-uppercase mb-3">PARTNER FIT</h4>
                          <div className="flex flex-wrap gap-2">
                            {drop.partner_fit.map((partner) => (
                              <span key={partner} className="px-3 py-1 rounded-full text-sm" style={{ background: 'var(--accent-glow)', color: 'var(--accent-primary)' }}>
                                🤝 {partner}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-4 text-sm pt-4" style={{ borderTop: '1px solid var(--border-default)', color: 'var(--text-tertiary)' }}>
                        <span>📤 {drop.agent_origin}</span>
                        <span>📅 {new Date(drop.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

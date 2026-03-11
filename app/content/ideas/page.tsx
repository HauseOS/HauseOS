'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { VideoIdea } from '@/app/mock-data';
import IdeaCard from '@/app/editorial/components/IdeaCard';
import FilterBar from '@/app/editorial/components/FilterBar';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

export default function ContentIdeasPage() {
  const [ideas, setIdeas] = useState<VideoIdea[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchIdeas = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/editorial/ideas`);
      if (!res.ok) throw new Error('Failed to fetch ideas');
      const data = await res.json();
      setIdeas(data.ideas || []);
      setTotalCount(data.total || data.ideas?.length || 0);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
      const { mockIdeas } = await import('@/app/mock-data');
      setIdeas(mockIdeas);
      setTotalCount(mockIdeas.length);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchIdeas(); }, [fetchIdeas]);

  const filteredIdeas = useMemo(() => {
    return ideas.filter((idea) => {
      if (selectedStatus !== 'All') {
        const statusMap: { [key: string]: string } = {
          'Brainstorm': 'brainstorm',
          'Under Review': 'under_review',
          'Feedback Pending': 'feedback_pending',
          'Greenlit': 'greenlit',
          'In Production': 'in_production',
          'Published': 'published',
        };
        if (idea.status !== statusMap[selectedStatus]) return false;
      }
      if (selectedTags.length > 0) {
        if (!selectedTags.some((tag) => idea.tags?.includes(tag))) return false;
      }
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!idea.title.toLowerCase().includes(query) && !idea.angle.toLowerCase().includes(query)) return false;
      }
      return true;
    });
  }, [ideas, selectedStatus, selectedTags, searchQuery]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-4"></div>
          <p style={{ color: 'var(--text-secondary)' }}>Loading ideas...</p>
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
              <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Idea Board</h1>
              <p className="mt-1" style={{ color: 'var(--text-secondary)' }}>All video concepts and content ideas</p>
              {error && <p className="text-xs text-amber-500 mt-1">Using cached data — API unavailable</p>}
            </div>
            <button className="btn-primary">+ New Idea</button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <FilterBar
          onStatusChange={setSelectedStatus}
          onTagChange={(tag) => setSelectedTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag])}
          onSearchChange={setSearchQuery}
        />

        {filteredIdeas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIdeas.map((idea) => (
              <IdeaCard key={idea.id} idea={idea} onClick={() => {}} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg" style={{ color: 'var(--text-tertiary)' }}>No ideas match your filters</p>
            <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>Try adjusting your search criteria</p>
          </div>
        )}

        <div className="mt-8 text-center text-sm" style={{ color: 'var(--text-tertiary)' }}>
          Showing {filteredIdeas.length} of {totalCount} ideas
        </div>
      </div>
    </div>
  );
}

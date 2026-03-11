'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { VideoIdea } from '@/app/mock-data';
import IdeaCard from '../components/IdeaCard';
import FilterBar from '../components/FilterBar';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

export default function IdeaBoard() {
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
      // Fallback to mock data
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
        if (
          !idea.title.toLowerCase().includes(query) &&
          !idea.angle.toLowerCase().includes(query)
        ) {
          return false;
        }
      }

      return true;
    });
  }, [ideas, selectedStatus, selectedTags, searchQuery]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff4e64] mx-auto mb-4"></div>
          <p className="text-gray-500">Loading ideas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 sticky top-0 z-10 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Idea Board</h1>
              <p className="text-gray-600 mt-1">All video concepts and content ideas</p>
              {error && (
                <p className="text-xs text-amber-600 mt-1">Using cached data — API unavailable</p>
              )}
            </div>
            <button className="px-4 py-2 bg-[#ff4e64] text-white rounded-lg hover:bg-[#ff3a52] transition-colors font-medium">
              + New Idea
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters */}
        <FilterBar
          onStatusChange={setSelectedStatus}
          onTagChange={(tag) => {
            setSelectedTags((prev) =>
              prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
            );
          }}
          onSearchChange={setSearchQuery}
        />

        {/* Ideas Grid */}
        {filteredIdeas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIdeas.map((idea) => (
              <IdeaCard
                key={idea.id}
                idea={idea}
                onClick={() => {
                  console.log('Navigate to idea:', idea.id);
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No ideas match your filters</p>
            <p className="text-gray-600 mt-2">Try adjusting your search criteria</p>
          </div>
        )}

        {/* Results Count */}
        <div className="mt-8 text-center text-sm text-gray-500">
          Showing {filteredIdeas.length} of {totalCount} ideas
        </div>
      </div>
    </div>
  );
}

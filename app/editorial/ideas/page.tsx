'use client';

import React, { useState, useMemo } from 'react';
import { mockIdeas } from '@/app/mock-data';
import IdeaCard from '../components/IdeaCard';
import FilterBar from '../components/FilterBar';

export default function IdeaBoard() {
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredIdeas = useMemo(() => {
    return mockIdeas.filter((idea) => {
      // Status filter
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

      // Tag filter
      if (selectedTags.length > 0) {
        if (!selectedTags.some((tag) => idea.tags.includes(tag))) return false;
      }

      // Search filter
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
  }, [selectedStatus, selectedTags, searchQuery]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">📝 Idea Board</h1>
              <p className="text-gray-400 mt-1">All video concepts and content ideas</p>
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
                  // Would navigate to detail page
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
          Showing {filteredIdeas.length} of {mockIdeas.length} ideas
        </div>
      </div>
    </div>
  );
}

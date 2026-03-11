import React, { useState } from 'react';
import TagPill from './TagPill';

interface FilterBarProps {
  onStatusChange?: (status: string) => void;
  onTagChange?: (tag: string) => void;
  onSearchChange?: (search: string) => void;
}

const statuses = [
  'All',
  'Brainstorm',
  'Under Review',
  'Feedback Pending',
  'Greenlit',
  'In Production',
  'Published',
];

const tags = [
  'ai-tool',
  'workflow',
  'business',
  'tutorial',
  'technical',
  'case-study',
  'review',
];

const FilterBar: React.FC<FilterBarProps> = ({
  onStatusChange,
  onTagChange,
  onSearchChange,
}) => {
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleStatusClick = (status: string) => {
    setSelectedStatus(status);
    onStatusChange?.(status);
  };

  const handleTagClick = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(newTags);
    onTagChange?.(tag);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    onSearchChange?.(e.target.value);
  };

  return (
    <div className="surface-card p-6 mb-6 space-y-4">
      {/* Search */}
      <div>
        <label className="label-uppercase block mb-2">Search</label>
        <input
          type="text"
          placeholder="Search ideas by title or angle..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full rounded-lg px-4 py-2 text-sm focus:outline-none transition-colors"
          style={{
            background: 'var(--bg-elevated)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-default)',
          }}
        />
      </div>

      {/* Status Filter */}
      <div>
        <label className="label-uppercase block mb-2">Status</label>
        <div className="flex flex-wrap gap-2">
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => handleStatusClick(status)}
              className="px-4 py-2 rounded-full text-sm font-medium transition-colors"
              style={{
                background: selectedStatus === status ? 'var(--accent-primary)' : 'var(--bg-elevated)',
                color: selectedStatus === status ? '#fff' : 'var(--text-secondary)',
              }}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Tag Filter */}
      <div>
        <label className="label-uppercase block mb-2">Tags</label>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <TagPill
              key={tag}
              label={tag}
              selected={selectedTags.includes(tag)}
              onClick={() => handleTagClick(tag)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;

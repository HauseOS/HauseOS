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
    <div className="space-y-4 bg-gray-900/30 border border-gray-800 rounded-lg p-6 mb-6">
      {/* Search */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Search</label>
        <input
          type="text"
          placeholder="Search ideas by title or angle..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#ff4e64] transition-colors"
        />
      </div>

      {/* Status Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
        <div className="flex flex-wrap gap-2">
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => handleStatusClick(status)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedStatus === status
                  ? 'bg-[#ff4e64] text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Tag Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Tags</label>
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

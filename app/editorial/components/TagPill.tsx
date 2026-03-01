import React from 'react';

interface TagPillProps {
  label: string;
  onClick?: () => void;
  selected?: boolean;
}

const TagPill: React.FC<TagPillProps> = ({ label, onClick, selected = false }) => {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
        selected
          ? 'bg-[#ff4e64] text-white'
          : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
      }`}
    >
      {label}
    </button>
  );
};

export default TagPill;

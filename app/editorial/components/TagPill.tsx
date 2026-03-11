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
      className="px-3 py-1 rounded-full text-xs font-medium transition-colors"
      style={{
        background: selected ? 'var(--accent-primary)' : 'var(--bg-elevated)',
        color: selected ? '#fff' : 'var(--text-secondary)',
      }}
    >
      {label}
    </button>
  );
};

export default TagPill;

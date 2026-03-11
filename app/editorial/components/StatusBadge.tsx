import React from 'react';

interface StatusBadgeProps {
  status: 'brainstorm' | 'under_review' | 'feedback_pending' | 'greenlit' | 'in_production' | 'published' | 'rejected' | 'archived';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const statusConfig: {
    [key: string]: {
      icon: string;
      label: string;
      bg: string;
      text: string;
    };
  } = {
    brainstorm: { icon: '💡', label: 'Brainstorm', bg: 'rgba(234,179,8,0.15)', text: '#EAB308' },
    under_review: { icon: '👀', label: 'Under Review', bg: 'rgba(59,130,246,0.15)', text: '#3B82F6' },
    feedback_pending: { icon: '💬', label: 'Feedback Pending', bg: 'rgba(249,115,22,0.15)', text: '#F97316' },
    greenlit: { icon: '✅', label: 'Greenlit', bg: 'rgba(16,185,129,0.15)', text: '#10B981' },
    in_production: { icon: '🎬', label: 'In Production', bg: 'rgba(139,92,246,0.15)', text: '#8B5CF6' },
    published: { icon: '📺', label: 'Published', bg: 'rgba(52,211,153,0.15)', text: '#34D399' },
    rejected: { icon: '❌', label: 'Rejected', bg: 'rgba(239,68,68,0.15)', text: '#EF4444' },
    archived: { icon: '📦', label: 'Archived', bg: 'var(--bg-elevated)', text: 'var(--text-tertiary)' },
  };

  const config = statusConfig[status] || statusConfig.brainstorm;

  return (
    <div
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium"
      style={{ background: config.bg, color: config.text }}
    >
      <span>{config.icon}</span>
      <span>{config.label}</span>
    </div>
  );
};

export default StatusBadge;

import React from 'react';

interface StatusBadgeProps {
  status: 'brainstorm' | 'under_review' | 'feedback_pending' | 'greenlit' | 'in_production' | 'published' | 'rejected' | 'archived';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const statusConfig: {
    [key: string]: {
      icon: string;
      label: string;
      bgColor: string;
      textColor: string;
    };
  } = {
    brainstorm: {
      icon: '💡',
      label: 'Brainstorm',
      bgColor: 'bg-yellow-100/20',
      textColor: 'text-yellow-300',
    },
    under_review: {
      icon: '👀',
      label: 'Under Review',
      bgColor: 'bg-blue-100/20',
      textColor: 'text-blue-300',
    },
    feedback_pending: {
      icon: '💬',
      label: 'Feedback Pending',
      bgColor: 'bg-orange-100/20',
      textColor: 'text-orange-300',
    },
    greenlit: {
      icon: '✅',
      label: 'Greenlit',
      bgColor: 'bg-green-100/20',
      textColor: 'text-green-300',
    },
    in_production: {
      icon: '🎬',
      label: 'In Production',
      bgColor: 'bg-purple-100/20',
      textColor: 'text-purple-300',
    },
    published: {
      icon: '📺',
      label: 'Published',
      bgColor: 'bg-green-100/20',
      textColor: 'text-green-200',
    },
    rejected: {
      icon: '❌',
      label: 'Rejected',
      bgColor: 'bg-red-100/20',
      textColor: 'text-red-300',
    },
    archived: {
      icon: '📦',
      label: 'Archived',
      bgColor: 'bg-gray-100/20',
      textColor: 'text-gray-400',
    },
  };

  const config = statusConfig[status] || statusConfig.brainstorm;

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${config.bgColor} ${config.textColor}`}>
      <span>{config.icon}</span>
      <span>{config.label}</span>
    </div>
  );
};

export default StatusBadge;

import React from 'react';
import { Project } from '@/app/config/projects';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live':
        return { bg: 'bg-green-100/10', border: 'border-green-700/30', badge: '✅ Live' };
      case 'in-dev':
        return { bg: 'bg-yellow-100/10', border: 'border-yellow-700/30', badge: '🔨 In Dev' };
      case 'maintenance':
        return { bg: 'bg-orange-100/10', border: 'border-orange-700/30', badge: '🚧 Maintenance' };
      case 'backlog':
        return { bg: 'bg-gray-100/10', border: 'border-gray-700/30', badge: '📋 Backlog' };
      default:
        return { bg: 'bg-gray-100/10', border: 'border-gray-700/30', badge: status };
    }
  };

  const getTimeSince = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Today';
    if (diffHours < 24) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const colors = getStatusColor(project.status);

  return (
    <div
      className={`border rounded-lg p-6 transition-all hover:border-[#ff4e64] hover:shadow-lg ${colors.bg} ${colors.border}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-start gap-3">
          <span className="text-3xl">{project.emoji}</span>
          <div>
            <h3 className="text-lg font-bold text-white">{project.name}</h3>
            <p className="text-gray-400 text-sm">{project.tagline}</p>
          </div>
        </div>
      </div>

      {/* Meta */}
      <div className="flex items-center gap-4 mb-4 text-xs text-gray-500">
        <span className={`px-2 py-1 rounded-full ${
          project.status === 'live'
            ? 'bg-green-100/20 text-green-300'
            : project.status === 'in-dev'
            ? 'bg-yellow-100/20 text-yellow-300'
            : 'bg-gray-100/20 text-gray-400'
        }`}>
          {colors.badge}
        </span>
        {project.owner && <span>👤 {project.owner}</span>}
        <span>📅 {getTimeSince(project.lastUpdated)}</span>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        {project.actions.map((action, idx) => (
          <a
            key={idx}
            href={action.url}
            target={action.url.startsWith('http') ? '_blank' : undefined}
            rel={action.url.startsWith('http') ? 'noopener noreferrer' : undefined}
            className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
              action.isPrimary
                ? 'bg-[#ff4e64] text-white hover:bg-[#ff3a52]'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {action.label}
          </a>
        ))}
      </div>
    </div>
  );
};

export default ProjectCard;

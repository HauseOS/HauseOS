import React from 'react';
import { Project } from '@/app/config/projects';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'live':
        return '✅ Live';
      case 'in-dev':
        return '🔨 In Dev';
      case 'maintenance':
        return '🚧 Maintenance';
      case 'backlog':
        return '📋 Backlog';
      default:
        return status;
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

  return (
    <div className="border border-gray-200 rounded-lg p-6 transition-all hover:border-[#ff4e64] hover:shadow-md bg-white">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-start gap-3">
          <span className="text-3xl">{project.emoji}</span>
          <div>
            <h3 className="text-lg font-bold text-gray-900">{project.name}</h3>
            <p className="text-gray-600 text-sm">{project.tagline}</p>
          </div>
        </div>
      </div>

      {/* Meta */}
      <div className="flex items-center gap-4 mb-4 text-xs text-gray-500">
        <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-700">
          {getStatusBadge(project.status)}
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
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
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

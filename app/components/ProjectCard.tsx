import React from 'react';
import { Project } from '@/app/config/projects';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'live': return '✅ Live';
      case 'in-dev': return '🔨 In Dev';
      case 'maintenance': return '🚧 Maintenance';
      case 'backlog': return '📋 Backlog';
      default: return status;
    }
  };

  const getTimeSince = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 24) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="surface-card-hover p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-start gap-3">
          <span className="text-3xl">{project.emoji}</span>
          <div>
            <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{project.name}</h3>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{project.tagline}</p>
          </div>
        </div>
      </div>

      {/* Meta */}
      <div className="flex items-center gap-4 mb-4 text-xs" style={{ color: 'var(--text-tertiary)' }}>
        <span
          className="px-2 py-1 rounded-full"
          style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)' }}
        >
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
              action.isPrimary ? 'btn-primary' : 'btn-secondary'
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

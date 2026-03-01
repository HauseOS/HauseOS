import React from 'react';
import { VideoIdea } from '@/app/mock-data';
import StatusBadge from './StatusBadge';
import TagPill from './TagPill';

interface IdeaCardProps {
  idea: VideoIdea;
  onClick?: () => void;
}

const IdeaCard: React.FC<IdeaCardProps> = ({ idea, onClick }) => {
  const createdDate = new Date(idea.created_at);
  const formattedDate = createdDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <div
      onClick={onClick}
      className="bg-white border border-gray-200 rounded-lg p-6 hover:border-[#ff4e64] hover:shadow-md transition-all cursor-pointer group"
    >
      {/* Header: Title + Status */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#ff4e64] transition-colors line-clamp-2">
            {idea.title}
          </h3>
        </div>
        <StatusBadge status={idea.status} />
      </div>

      {/* Angle */}
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {idea.angle}
      </p>

      {/* Meta Info */}
      <div className="flex items-center gap-4 mb-4 text-xs text-gray-500">
        <span>📤 {idea.submitted_by_name}</span>
        <span>📅 {formattedDate}</span>
        {idea.estimated_production_hours && (
          <span>⏱️ {idea.estimated_production_hours}h</span>
        )}
      </div>

      {/* Tags */}
      {idea.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {idea.tags.slice(0, 3).map((tag) => (
            <TagPill key={tag} label={tag} />
          ))}
          {idea.tags.length > 3 && (
            <span className="text-xs text-gray-500 px-2 py-1">+{idea.tags.length - 3}</span>
          )}
        </div>
      )}

      {/* Footer: Priority + Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200/50">
        <div className="flex items-center gap-2">
          {idea.priority === 'high' && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-red-100/10 text-red-400">
              🔴 HIGH
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {idea.likes && idea.likes > 0 && (
            <span className="text-sm text-gray-400">❤️ {idea.likes}</span>
          )}
          <button className="text-gray-400 hover:text-[#ff4e64] transition-colors opacity-0 group-hover:opacity-100">
            →
          </button>
        </div>
      </div>
    </div>
  );
};

export default IdeaCard;

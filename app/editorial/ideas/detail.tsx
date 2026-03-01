'use client';

import React, { useState } from 'react';
import { mockIdeas, mockNotes } from '@/app/mock-data';
import StatusBadge from '../components/StatusBadge';
import TagPill from '../components/TagPill';
import NoteThread from '../components/NoteThread';

interface IdeaDetailProps {
  id: string;
}

export default function IdeaDetail({ id }: IdeaDetailProps) {
  const idea = mockIdeas.find((i) => i.id === id);
  const notes = mockNotes[id] || [];
  const [newNote, setNewNote] = useState('');

  if (!idea) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <p>Idea not found</p>
      </div>
    );
  }

  const createdDate = new Date(idea.created_at);
  const formattedDate = createdDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/50 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <button className="text-gray-400 hover:text-white transition-colors mb-4">
            ← Back to Ideas
          </button>
          <h1 className="text-3xl font-bold">{idea.title}</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        {/* Main Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left column - Main content */}
          <div className="md:col-span-2 space-y-6">
            {/* Status & Meta */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-gray-400 text-sm">Status</p>
                  <StatusBadge status={idea.status} />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Submitted</p>
                  <p className="text-white font-medium">{formattedDate}</p>
                </div>
              </div>
            </div>

            {/* Angle */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
              <h3 className="text-sm font-semibold text-gray-400 mb-3">ANGLE</h3>
              <p className="text-white text-lg leading-relaxed">{idea.angle}</p>
            </div>

            {/* Audience Hook */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
              <h3 className="text-sm font-semibold text-gray-400 mb-3">AUDIENCE HOOK</h3>
              <p className="text-white leading-relaxed">{idea.audience_hook}</p>
            </div>

            {/* Description */}
            {idea.description && (
              <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
                <h3 className="text-sm font-semibold text-gray-400 mb-3">DESCRIPTION</h3>
                <p className="text-gray-300 leading-relaxed">{idea.description}</p>
              </div>
            )}

            {/* Tags & Partner Fit */}
            <div className="grid grid-cols-2 gap-6">
              {idea.tags.length > 0 && (
                <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
                  <h3 className="text-sm font-semibold text-gray-400 mb-3">TAGS</h3>
                  <div className="flex flex-wrap gap-2">
                    {idea.tags.map((tag) => (
                      <TagPill key={tag} label={tag} />
                    ))}
                  </div>
                </div>
              )}

              {idea.partner_fit.length > 0 && (
                <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
                  <h3 className="text-sm font-semibold text-gray-400 mb-3">PARTNER FIT</h3>
                  <div className="space-y-2">
                    {idea.partner_fit.map((partner) => (
                      <p key={partner} className="text-white text-sm">
                        🤝 {partner}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Feedback & Notes */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-bold mb-6">💬 Feedback</h3>
              <NoteThread notes={notes} />

              {/* Add Note Form */}
              {(idea.status === 'brainstorm' ||
                idea.status === 'under_review' ||
                idea.status === 'feedback_pending') && (
                <div className="mt-6 pt-6 border-t border-gray-700">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Add Feedback
                  </label>
                  <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Share your thoughts..."
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#ff4e64] transition-colors resize-none"
                    rows={3}
                  />
                  <button className="mt-3 px-4 py-2 bg-[#ff4e64] text-white rounded-lg hover:bg-[#ff3a52] transition-colors font-medium">
                    Post Feedback
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right column - Sidebar */}
          <div className="space-y-6">
            {/* Agent Info */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
              <p className="text-gray-400 text-sm mb-2">SUBMITTED BY</p>
              <p className="text-white font-bold text-lg">{idea.submitted_by_name}</p>
            </div>

            {/* Production Time */}
            {idea.estimated_production_hours && (
              <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
                <p className="text-gray-400 text-sm mb-2">EST. PRODUCTION</p>
                <p className="text-white font-bold text-lg">
                  {idea.estimated_production_hours} hours
                </p>
              </div>
            )}

            {/* Priority */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
              <p className="text-gray-400 text-sm mb-2">PRIORITY</p>
              <p className="text-white font-bold text-lg capitalize">{idea.priority}</p>
            </div>

            {/* Likes */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
              <p className="text-gray-400 text-sm mb-2">REACTIONS</p>
              <p className="text-white font-bold text-lg">❤️ {idea.likes || 0}</p>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button className="w-full px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors font-medium">
                Like
              </button>
              {idea.status !== 'greenlit' && (
                <button className="w-full px-4 py-2 bg-[#ff4e64] hover:bg-[#ff3a52] text-white rounded-lg transition-colors font-medium">
                  Change Status
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

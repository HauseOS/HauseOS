'use client';

import React from 'react';
import { PROJECTS, BACKLOG_PROJECTS } from '@/app/config/projects';
import ProjectCard from '@/app/components/ProjectCard';

export default function ProjectsPage() {
  const activeProjects = PROJECTS.filter((p) => p.status !== 'backlog');
  const backlogProjects = PROJECTS.filter((p) => p.status === 'backlog');

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 sticky top-0 z-10 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">HauseOS</h1>
              <p className="text-gray-600 mt-1">Operational hub for Hause Collective</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-16 space-y-16">
        {/* Active Projects */}
        <section>
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Active Projects</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {activeProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>

        {/* Backlog */}
        {(backlogProjects.length > 0 || BACKLOG_PROJECTS.length > 0) && (
          <section className="border-t border-gray-200 pt-16">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Planned</h2>
            </div>
            <div className="space-y-3">
              {[...backlogProjects, ...BACKLOG_PROJECTS].map((project: any, idx: number) => (
                <div
                  key={idx}
                  className="border border-gray-200 bg-gray-50 rounded-lg p-4 hover:border-[#ff4e64] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{project.emoji}</span>
                    <div>
                      <h3 className="font-bold text-gray-900">{project.name}</h3>
                      <p className="text-gray-600 text-sm">{project.description || project.tagline || ''}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

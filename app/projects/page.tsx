'use client';

import React from 'react';
import { PROJECTS, BACKLOG_PROJECTS } from '@/app/config/projects';
import ProjectCard from '@/app/components/ProjectCard';

export default function ProjectsPage() {
  const activeProjects = PROJECTS.filter((p) => p.status !== 'backlog');
  const backlogProjects = PROJECTS.filter((p) => p.status === 'backlog');

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold">🏢 HauseOS Projects</h1>
              <p className="text-gray-400 mt-2">All active and upcoming projects</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Operational Hub</p>
              <p className="text-lg font-semibold text-[#ff4e64]">Hause Collective</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
        {/* Active Projects */}
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-bold">✅ Active Projects</h2>
            <p className="text-gray-400 text-sm mt-1">
              {activeProjects.length} live and in-development
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>

        {/* Backlog */}
        <section className="border-t border-gray-800 pt-12">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">📋 Backlog / Planned</h2>
            <p className="text-gray-400 text-sm mt-1">Coming soon</p>
          </div>
          <div className="space-y-3">
            {[...backlogProjects, ...BACKLOG_PROJECTS].map((project: any, idx: number) => (
              <div
                key={idx}
                className="border border-gray-700/50 bg-gray-800/20 rounded-lg p-4 hover:border-gray-600 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{project.emoji}</span>
                  <div>
                    <h3 className="font-bold text-white">{project.name}</h3>
                    <p className="text-gray-400 text-sm">{project.description || project.tagline || ''}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer Stats */}
        <section className="border-t border-gray-800 pt-12 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
              <p className="text-gray-400 text-sm mb-2">LIVE PROJECTS</p>
              <p className="text-4xl font-bold text-green-400">
                {PROJECTS.filter((p) => p.status === 'live').length}
              </p>
            </div>
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
              <p className="text-gray-400 text-sm mb-2">IN DEVELOPMENT</p>
              <p className="text-4xl font-bold text-yellow-400">
                {PROJECTS.filter((p) => p.status === 'in-dev').length}
              </p>
            </div>
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
              <p className="text-gray-400 text-sm mb-2">PLANNED</p>
              <p className="text-4xl font-bold text-gray-400">
                {backlogProjects.length + BACKLOG_PROJECTS.length}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

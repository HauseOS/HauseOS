'use client';

import React from 'react';
import { PROJECTS, BACKLOG_PROJECTS } from '@/app/config/projects';
import ProjectCard from '@/app/components/ProjectCard';

export default function ProjectsPage() {
  const activeProjects = PROJECTS.filter((p) => p.status !== 'backlog');
  const backlogProjects = PROJECTS.filter((p) => p.status === 'backlog');

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      {/* Header */}
      <div className="border-b sticky top-14 z-10" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-default)' }}>
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Projects</h1>
          <p className="mt-1" style={{ color: 'var(--text-secondary)' }}>All Hause project status</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-12">
        {/* Active Projects */}
        <section>
          <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Active Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>

        {/* Backlog */}
        {(backlogProjects.length > 0 || BACKLOG_PROJECTS.length > 0) && (
          <section className="pt-8" style={{ borderTop: '1px solid var(--border-default)' }}>
            <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Planned</h2>
            <div className="space-y-3">
              {[...backlogProjects, ...BACKLOG_PROJECTS].map((project: any, idx: number) => (
                <div key={idx} className="surface-card-hover p-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{project.emoji}</span>
                    <div>
                      <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>{project.name}</h3>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{project.description || project.tagline || ''}</p>
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

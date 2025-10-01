"use client";

import { ProjectCard } from './ProjectCard';
import type { Project } from '@/types/project';

interface ProjectsGridProps {
  projects: Project[];
}

export function ProjectsGrid({ projects }: ProjectsGridProps) {
  return (
    <div className="container mx-auto px-4 py-16">
      {projects.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl text-muted-foreground">No projects found. Check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {projects.map((project) => (
            <ProjectCard
              key={project.slug}
              project={project}
              featured={project.featured}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// src/app/projects/page.tsx
import { getProjects } from '@/lib/projects';
import { ProjectsGrid } from '@/components/features/projects/ProjectsGrid';

export const metadata = {
  title: 'Projects | Ollie Does',
  description: 'Explore my portfolio of web development projects built with modern technologies like Next.js, React, TypeScript, and more.',
};

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <div className="bg-gradient-to-b from-primary-50/50 to-transparent dark:from-primary-950/20 border-b border-border/50">
        <div className="container mx-auto px-4 py-16 sm:py-20">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Projects
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
              A collection of web development projects showcasing modern technologies,
              clean code practices, and creative problem-solving.
            </p>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <ProjectsGrid projects={projects} />
    </div>
  );
}

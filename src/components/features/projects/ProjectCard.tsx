// src/components/features/projects/ProjectCard.tsx
import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink, Github, Calendar, Star, GitFork, Eye } from 'lucide-react';
import type { Project } from '@/types/project';

interface ProjectCardProps {
  project: Project;
  featured?: boolean;
  className?: string;
}

export function ProjectCard({ project, featured = false, className = '' }: ProjectCardProps) {
  const cardClasses = featured
    ? 'lg:col-span-2 lg:row-span-2'
    : 'col-span-1';

  return (
    <div className={`group relative bg-gradient-to-br from-dark-blue to-dark-blue-light border-2 border-white rounded-xl shadow-2xl hover:shadow-white/20 hover:scale-[1.02] transition-all duration-300 ${cardClasses} ${className}`}>
      {/* Project Image */}
      <div className="relative aspect-video overflow-hidden rounded-t-xl">
        <Image
          src={project.image || '/images/projects/placeholder.png'}
          alt={`${project.title} screenshot`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-all duration-500 group-hover:scale-110"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/images/projects/placeholder.png';
          }}
        />

        {/* Modern Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
        <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-all duration-500 mix-blend-multiply" />

        {/* Quick Actions */}
        <div className="absolute top-4 right-4 flex gap-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-100">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-background/90 backdrop-blur-sm rounded-xl hover:bg-background hover:scale-110 transition-all duration-200 shadow-medium"
              aria-label="View on GitHub"
            >
              <Github className="w-4 h-4 text-foreground" />
            </a>
          )}
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-background/90 backdrop-blur-sm rounded-xl hover:bg-background hover:scale-110 transition-all duration-200 shadow-medium"
              aria-label="View live demo"
            >
              <ExternalLink className="w-4 h-4 text-foreground" />
            </a>
          )}
        </div>

        {/* Status Badge */}
        {project.status && (
          <div className="absolute top-4 left-4">
            <span className={`px-3 py-1 text-xs font-medium rounded-full border backdrop-blur-sm ${
              project.status === 'completed'
                ? 'bg-success/10 text-success-700 border-success/20'
                : project.status === 'in-progress'
                ? 'bg-primary/10 text-primary-700 border-primary/20'
                : 'bg-muted/10 text-muted-foreground border-border'
            }`}>
              {project.status.replace('-', ' ')}
            </span>
          </div>
        )}

        {/* Featured Badge */}
        {featured && (
          <div className="absolute bottom-4 left-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-200">
            <span className="px-3 py-1 text-sm font-medium bg-warning/10 text-warning-700 rounded-full border border-warning/20 backdrop-blur-sm">
              ⭐ Featured
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h3 className={`font-bold text-carolina mb-3 group-hover:text-carolina/80 transition-colors ${
            featured ? 'text-2xl' : 'text-xl'
          }`}>
            <Link href={`/projects/${project.slug}`} className="hover:underline decoration-2 underline-offset-4 decoration-carolina">
              {project.title}
            </Link>
          </h3>

          <p className={`text-gray-300 leading-relaxed ${
            featured ? 'text-base' : 'text-sm'
          }`}>
            {project.description}
          </p>
        </div>

        {/* Tech Stack */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {project.tech.slice(0, featured ? 6 : 4).map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 text-xs font-medium rounded-full bg-carolina/20 text-carolina border border-carolina/30 hover:bg-carolina/30 transition-all duration-200 hover:scale-105"
              >
                {tech}
              </span>
            ))}
            {project.tech.length > (featured ? 6 : 4) && (
              <span className="px-3 py-1 text-xs font-medium bg-white/10 text-gray-300 border border-white/20 rounded-full">
                +{project.tech.length - (featured ? 6 : 4)} more
              </span>
            )}
          </div>
        </div>

        {/* GitHub Stats (if available) */}
        {project.githubStats && (
          <div className="flex items-center gap-6 text-sm text-gray-300 mb-6 p-3 bg-dark-blue-light/50 rounded-lg">
            <span className="flex items-center gap-2">
              <Star className="w-4 h-4 text-carolina" />
              <span className="font-medium">{project.githubStats.stars}</span>
            </span>
            <span className="flex items-center gap-2">
              <GitFork className="w-4 h-4 text-carolina" />
              <span className="font-medium">{project.githubStats.forks}</span>
            </span>
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-carolina" />
              <span className="font-medium">{project.githubStats.lastUpdated}</span>
            </span>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-white/20">
          <Link
            href={`/projects/${project.slug}`}
            className="inline-flex items-center text-sm text-carolina hover:text-carolina/80 transition-colors group/link"
          >
            <Eye className="w-4 h-4 mr-2 group-hover/link:scale-110 transition-transform" />
            View Details
          </Link>

          <div className="flex items-center gap-2">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-300 hover:text-carolina hover:bg-carolina/10 rounded-lg transition-all duration-200 hover:scale-110"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
            )}
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-300 hover:text-carolina hover:bg-carolina/10 rounded-lg transition-all duration-200 hover:scale-110"
                aria-label="Live Demo"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
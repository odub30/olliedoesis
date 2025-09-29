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
    <div className={`group relative bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-xl ${cardClasses} ${className}`}>
      {/* Project Image */}
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={project.image || '/images/projects/placeholder.png'}
          alt={`${project.title} screenshot`}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/images/projects/placeholder.png';
          }}
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Quick Actions */}
        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
              aria-label="View on GitHub"
            >
              <Github className="w-4 h-4 text-gray-700" />
            </a>
          )}
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
              aria-label="View live demo"
            >
              <ExternalLink className="w-4 h-4 text-gray-700" />
            </a>
          )}
        </div>

        {/* Status Badge */}
        {project.status && (
          <div className="absolute top-4 left-4">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              project.status === 'completed' 
                ? 'bg-green-100 text-green-800' 
                : project.status === 'in-progress'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {project.status.replace('-', ' ')}
            </span>
          </div>
        )}

        {/* Featured Badge */}
        {featured && (
          <div className="absolute bottom-4 left-4">
            <span className="px-3 py-1 text-sm font-medium bg-yellow-100 text-yellow-800 rounded-full border border-yellow-200">
              ⭐ Featured
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Header */}
        <div className="mb-4">
          <h3 className={`font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors ${
            featured ? 'text-2xl' : 'text-xl'
          }`}>
            <Link href={`/projects/${project.slug}`}>
              {project.title}
            </Link>
          </h3>
          
          <p className={`text-gray-600 leading-relaxed ${
            featured ? 'text-base' : 'text-sm'
          }`}>
            {project.description}
          </p>
        </div>

        {/* Tech Stack */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {project.tech.slice(0, featured ? 6 : 4).map((tech) => (
              <span
                key={tech}
                className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-md"
              >
                {tech}
              </span>
            ))}
            {project.tech.length > (featured ? 6 : 4) && (
              <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-500 rounded-md">
                +{project.tech.length - (featured ? 6 : 4)} more
              </span>
            )}
          </div>
        </div>

        {/* GitHub Stats (if available) */}
        {project.githubStats && (
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
            <span className="flex items-center gap-1">
              <Star className="w-4 h-4" />
              {project.githubStats.stars}
            </span>
            <span className="flex items-center gap-1">
              <GitFork className="w-4 h-4" />
              {project.githubStats.forks}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {project.githubStats.lastUpdated}
            </span>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href={`/projects/${project.slug}`}
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              <Eye className="w-4 h-4 mr-1" />
              View Details
            </Link>
          </div>
          
          <div className="flex items-center gap-2">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
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
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
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
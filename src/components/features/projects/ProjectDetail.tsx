"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Github, ExternalLink, Calendar, ArrowLeft, CheckCircle2 } from 'lucide-react';
import type { Project } from '@/types/project';

interface ProjectDetailProps {
  project: Project;
  htmlContent: string;
}

export function ProjectDetail({ project, htmlContent }: ProjectDetailProps) {
  return (
    <div className="min-h-screen">
      {/* Back Button */}
      <div className="border-b border-border/50">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Projects
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-b from-primary-50/50 to-transparent dark:from-primary-950/20 border-b border-border/50">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            {/* Status & Featured Badges */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              {project.status && (
                <span className={`px-4 py-1.5 text-sm font-medium rounded-full border ${
                  project.status === 'completed'
                    ? 'bg-success/10 text-success-700 border-success/20'
                    : project.status === 'in-progress'
                    ? 'bg-primary/10 text-primary-700 border-primary/20'
                    : 'bg-muted/10 text-muted-foreground border-border'
                }`}>
                  {project.status === 'completed' && <CheckCircle2 className="w-4 h-4 inline mr-1" />}
                  {project.status.replace('-', ' ').charAt(0).toUpperCase() + project.status.slice(1).replace('-', ' ')}
                </span>
              )}
              {project.featured && (
                <span className="px-4 py-1.5 text-sm font-medium bg-warning/10 text-warning-700 rounded-full border border-warning/20">
                  ⭐ Featured Project
                </span>
              )}
              {project.category && (
                <span className="px-4 py-1.5 text-sm font-medium bg-primary/10 text-primary-700 rounded-full border border-primary/20">
                  {project.category}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              {project.title}
            </h1>

            {/* Description */}
            <p className="text-xl text-muted-foreground leading-relaxed mb-8">
              {project.description}
            </p>

            {/* Meta Info & Actions */}
            <div className="flex flex-wrap items-center gap-4 mb-8">
              {project.date && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">
                    {new Date(project.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              )}

              <div className="flex-1" />

              {/* Action Buttons */}
              <div className="flex gap-3">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-all hover:scale-105 font-medium"
                  >
                    <Github className="w-4 h-4" />
                    View Code
                  </a>
                )}
                {project.live && (
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all hover:scale-105 font-medium"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Live Demo
                  </a>
                )}
              </div>
            </div>

            {/* Tech Stack */}
            {project.tech && project.tech.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {project.tech.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1.5 text-sm font-medium bg-background/80 backdrop-blur-sm text-foreground rounded-lg border border-border hover:border-primary/50 transition-colors"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content Column */}
            <div className="lg:col-span-2 space-y-12">
              {/* Project Image */}
              {project.image && (
                <div className="relative aspect-video rounded-2xl overflow-hidden shadow-strong border border-border">
                  <Image
                    src={project.image}
                    alt={`${project.title} screenshot`}
                    fill
                    className="object-cover"
                    priority
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/images/projects/placeholder.png';
                    }}
                  />
                </div>
              )}

              {/* Project Description (Markdown) */}
              <div
                className="prose prose-lg dark:prose-invert max-w-none
                  prose-headings:font-bold prose-headings:text-foreground
                  prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-4
                  prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-3
                  prose-p:text-muted-foreground prose-p:leading-relaxed
                  prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-foreground prose-strong:font-semibold
                  prose-ul:my-6 prose-li:my-2
                  prose-code:text-primary prose-code:bg-primary/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
              />
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-8">
              {/* Highlights */}
              {project.highlights && project.highlights.length > 0 && (
                <div className="card p-6 bg-card border-border">
                  <h3 className="text-lg font-bold text-foreground mb-4">Highlights</h3>
                  <ul className="space-y-3">
                    {project.highlights.map((highlight, index) => (
                      <li key={index} className="flex gap-3 text-sm text-muted-foreground">
                        <span className="text-success mt-0.5">✓</span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Learning Objectives */}
              {project.learningObjectives && project.learningObjectives.length > 0 && (
                <div className="card p-6 bg-card border-border">
                  <h3 className="text-lg font-bold text-foreground mb-4">Learning Objectives</h3>
                  <ul className="space-y-3">
                    {project.learningObjectives.map((objective, index) => (
                      <li key={index} className="flex gap-3 text-sm text-muted-foreground">
                        <span className="text-primary mt-0.5">→</span>
                        <span>{objective}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Challenges */}
              {project.challenges && project.challenges.length > 0 && (
                <div className="card p-6 bg-card border-border">
                  <h3 className="text-lg font-bold text-foreground mb-4">Challenges</h3>
                  <ul className="space-y-3">
                    {project.challenges.map((challenge, index) => (
                      <li key={index} className="flex gap-3 text-sm text-muted-foreground">
                        <span className="text-warning mt-0.5">!</span>
                        <span>{challenge}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Solutions */}
              {project.solutions && project.solutions.length > 0 && (
                <div className="card p-6 bg-card border-border">
                  <h3 className="text-lg font-bold text-foreground mb-4">Solutions</h3>
                  <ul className="space-y-3">
                    {project.solutions.map((solution, index) => (
                      <li key={index} className="flex gap-3 text-sm text-muted-foreground">
                        <span className="text-success mt-0.5">✓</span>
                        <span>{solution}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Next Steps */}
              {project.nextSteps && project.nextSteps.length > 0 && (
                <div className="card p-6 bg-card border-border">
                  <h3 className="text-lg font-bold text-foreground mb-4">Next Steps</h3>
                  <ul className="space-y-3">
                    {project.nextSteps.map((step, index) => (
                      <li key={index} className="flex gap-3 text-sm text-muted-foreground">
                        <span className="text-primary mt-0.5">→</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

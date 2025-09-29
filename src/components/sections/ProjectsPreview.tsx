// src/components/sections/ProjectsPreview.tsx
import Link from 'next/link';
import { ArrowRight, Code, Rocket } from 'lucide-react';
import { ProjectCard } from '@/components/features/projects/ProjectCard';
import { getProjects } from '@/lib/projects';

export async function ProjectsPreview() {
  const projects = await getProjects();
  const featuredProject = projects.find(p => p.featured) || projects[0];
  const recentProjects = projects.filter(p => !p.featured).slice(0, 4);

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
            <Code className="w-4 h-4 mr-2" />
            My Work
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Featured Projects
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A showcase of my latest work in web development, security, and creative problem-solving.
            Each project represents a step in my learning journey.
          </p>
        </div>

        {/* Featured Project */}
        {featuredProject && (
          <div className="mb-16">
            <div className="flex items-center gap-2 mb-6">
              <Rocket className="w-5 h-5 text-yellow-500" />
              <h3 className="text-xl font-semibold text-gray-900">Featured Project</h3>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              <div className="lg:col-span-2">
                <ProjectCard project={featuredProject} featured />
              </div>
              
              {/* Featured Project Details */}
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Project Highlights</h4>
                  <ul className="space-y-2 text-gray-600">
                    {featuredProject.highlights?.map((highlight, index) => (
                      <li key={index} className="flex items-start">
                        <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0" />
                        {highlight}
                      </li>
                    )) || [
                      <li key="1" className="flex items-start">
                        <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0" />
                        Modern React architecture with TypeScript
                      </li>,
                      <li key="2" className="flex items-start">
                        <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0" />
                        Responsive design with Tailwind CSS
                      </li>,
                      <li key="3" className="flex items-start">
                        <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0" />
                        GitHub API integration for live data
                      </li>
                    ]}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Learning Outcomes</h4>
                  <div className="flex flex-wrap gap-2">
                    {(featuredProject.learningObjectives || [
                      'Next.js App Router',
                      'TypeScript',
                      'API Integration',
                      'Security Best Practices'
                    ]).map((objective) => (
                      <span
                        key={objective}
                        className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full"
                      >
                        {objective}
                      </span>
                    ))}
                  </div>
                </div>

                <Link
                  href={`/projects/${featuredProject.slug}`}
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Explore This Project
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Recent Projects Grid */}
        <div className="mb-12">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent Projects</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
            {recentProjects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/projects"
            className="inline-flex items-center px-8 py-4 bg-white text-gray-900 rounded-lg border border-gray-200 hover:border-blue-300 hover:text-blue-600 transition-all duration-300 font-medium shadow-sm hover:shadow-md"
          >
            View All Projects
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
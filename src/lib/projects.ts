// src/lib/projects.ts
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { Project, ProjectFilters } from '@/types/project';
const projectsDirectory = path.join(process.cwd(), 'src/data/projects');

export async function getProjects(): Promise<Project[]> {
  try {
    const fileNames = fs.readdirSync(projectsDirectory);
    const projects = await Promise.all(
      fileNames
        .filter(name => name.endsWith('.md'))
        .map(async (fileName) => {
          const fullPath = path.join(projectsDirectory, fileName);
          const fileContents = fs.readFileSync(fullPath, 'utf8');
          const { data, content } = matter(fileContents);
          
          const slug = fileName.replace(/\.md$/, '');
          
          return {
            slug,
            title: data.title || slug,
            description: data.description || '',
            longDescription: content,
            image: data.image,
            images: data.images || [],
            tech: data.tech || [],
            github: data.github,
            live: data.live,
            featured: data.featured || false,
            status: data.status || 'completed',
            date: data.date || new Date().toISOString(),
            category: data.category,
            highlights: data.highlights || [],
            learningObjectives: data.learning_objectives || [],
            challenges: data.challenges || [],
            solutions: data.solutions || [],
            nextSteps: data.next_steps || [],
          } as Project;
        })
    );

    // Sort by date (newest first) and featured projects first
    return projects.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  } catch (error) {
    console.error('Error loading projects:', error);
    return [];
  }
}

export async function getProject(slug: string): Promise<Project | null> {
  try {
    const fullPath = path.join(projectsDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    
    return {
      slug,
      title: data.title || slug,
      description: data.description || '',
      longDescription: content,
      image: data.image,
      images: data.images || [],
      tech: data.tech || [],
      github: data.github,
      live: data.live,
      featured: data.featured || false,
      status: data.status || 'completed',
      date: data.date || new Date().toISOString(),
      category: data.category,
      highlights: data.highlights || [],
      learningObjectives: data.learning_objectives || [],
      challenges: data.challenges || [],
      solutions: data.solutions || [],
      nextSteps: data.next_steps || [],
    } as Project;
  } catch (error) {
    console.error(`Error loading project ${slug}:`, error);
    return null;
  }
}

export function getProjectCategories(projects: Project[]): string[] {
  const categories = projects
    .map(project => project.category)
    .filter((category): category is string => !!category);
  
  return Array.from(new Set(categories));
}

export function getTechnologies(projects: Project[]): string[] {
  const techs = projects.flatMap(project => project.tech);
  return Array.from(new Set(techs)).sort();
}

export function filterProjects(projects: Project[], filters: ProjectFilters): Project[] {
  return projects.filter(project => {
    if (filters.category && project.category !== filters.category) {
      return false;
    }
    
    if (filters.tech && !project.tech.includes(filters.tech)) {
      return false;
    }
    
    if (filters.status && project.status !== filters.status) {
      return false;
    }
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        project.title.toLowerCase().includes(searchLower) ||
        project.description.toLowerCase().includes(searchLower) ||
        project.tech.some(tech => tech.toLowerCase().includes(searchLower))
      );
    }
    
    return true;
  });
}
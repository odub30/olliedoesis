// src/lib/projects.ts
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { Project } from '@/types/project';

const projectsDirectory = path.join(process.cwd(), 'src/data/projects');

export async function getProjects(): Promise<Project[]> {
  try {
    if (!fs.existsSync(projectsDirectory)) {
      console.warn('Projects directory does not exist');
      return [];
    }

    const fileNames = fs.readdirSync(projectsDirectory);
    const projects = fileNames
      .filter(name => name.endsWith('.md'))
      .map((fileName) => {
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
        } as Project;
      });

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
      tech: data.tech || [],
      github: data.github,
      live: data.live,
      featured: data.featured || false,
      status: data.status || 'completed',
      date: data.date || new Date().toISOString(),
    } as Project;
  } catch (error) {
    console.error(`Error loading project ${slug}:`, error);
    return null;
  }
}
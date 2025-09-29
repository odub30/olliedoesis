// src/types/project.ts
export interface Project {
  slug: string;
  title: string;
  description: string;
  longDescription?: string;
  image?: string;
  images?: string[];
  tech: string[];
  github?: string;
  live?: string;
  featured: boolean;
  status: 'completed' | 'in-progress' | 'archived';
  date: string;
  category?: string;
  highlights?: string[];
  learningObjectives?: string[];
  challenges?: string[];
  solutions?: string[];
  nextSteps?: string[];
  githubStats?: {
    stars: number;
    forks: number;
    lastUpdated: string;
    language?: string;
  };
}

export interface ProjectFilters {
  category?: string;
  tech?: string;
  status?: string;
  search?: string;
}
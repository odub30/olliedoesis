// src/types/db.ts
// Shared lightweight DB/result types used across the app for stricter typing

export interface TagEntry {
  id: string;
  name: string;
  slug?: string;
}

export interface AuthorEntry {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export interface AdminBlog {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  published: boolean;
  featured?: boolean | null;
  views: number;
  readTime?: number | null;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt?: string;
  tags: TagEntry[];
  author?: AuthorEntry | null;
  _count?: { images?: number };
}

export interface AdminProject {
  id: string;
  slug: string;
  title: string;
  description?: string | null;
  technologies: string[];
  featured?: boolean | null;
  published?: boolean | null;
  views: number;
  updatedAt?: string;
  tags?: TagEntry[];
}

export interface SearchAnalyticsEntry {
  query: string;
  searchCount: number;
  clickCount: number;
}

export interface ProjectResultRaw {
  id: string;
  title: string;
  slug: string;
  description?: string;
  content?: string;
  technologies: string[];
  featured?: boolean;
  views: number;
  createdAt: Date;
  tags?: Array<{ name: string }>;
}

export interface BlogResultRaw {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content?: string;
  featured?: boolean;
  views: number;
  readTime?: number | null;
  publishedAt?: Date | null;
  createdAt: Date;
  tags?: Array<{ name: string }>;
}

export interface ImageResultRaw {
  id: string;
  url: string;
  alt: string;
  caption?: string | null;
  width?: number | null;
  height?: number | null;
  createdAt: Date;
  tags?: Array<{ name: string }>;
}

export interface TagResultRaw {
  id: string;
  name: string;
  slug: string;
  count: number;
  createdAt: Date;
}

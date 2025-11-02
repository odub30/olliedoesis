// src/app/sitemap.ts
import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';
import { logError } from '@/lib/logger';
import { getSiteUrl } from '@/lib/utils/canonical';

// Force dynamic rendering since this requires database access
export const dynamic = 'force-dynamic';

/**
 * Dynamic Sitemap Generation
 *
 * Automatically includes:
 * - Static pages (home, about, contact, etc.)
 * - All published projects
 * - All published blog posts
 *
 * Revalidates every 24 hours to keep search engines updated
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blogs`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/web-development`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/cybersecurity`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  try {
    // Fetch published projects
    const projects = await prisma.project.findMany({
      where: { published: true },
      select: {
        slug: true,
        updatedAt: true,
        featured: true,
      },
      orderBy: { updatedAt: 'desc' },
    });

    type ProjectEntry = typeof projects[number]
    const projectRoutes: MetadataRoute.Sitemap = projects.map((project: ProjectEntry) => ({
      url: `${baseUrl}/projects/${project.slug}`,
      lastModified: project.updatedAt,
      changeFrequency: 'monthly',
      priority: project.featured ? 0.8 : 0.7, // Featured projects get higher priority
    }));

    // Fetch published blogs
    const blogs = await prisma.blog.findMany({
      where: { published: true },
      select: {
        slug: true,
        updatedAt: true,
        publishedAt: true,
        featured: true,
      },
      orderBy: { publishedAt: 'desc' },
    });

    type BlogEntry = typeof blogs[number]
    const blogRoutes: MetadataRoute.Sitemap = blogs.map((blog: BlogEntry) => ({
      url: `${baseUrl}/blogs/${blog.slug}`,
      lastModified: blog.updatedAt,
      changeFrequency: 'monthly',
      priority: blog.featured ? 0.9 : 0.8, // Blog posts are high priority
    }));

    // Combine all routes
    return [...staticRoutes, ...projectRoutes, ...blogRoutes];
  } catch (error) {
    logError('Failed to generate sitemap', error);
    // Return at least static routes if database query fails
    return staticRoutes;
  }
}

// Revalidate sitemap every 24 hours
export const revalidate = 86400; // 24 hours in seconds

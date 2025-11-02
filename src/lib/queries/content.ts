// src/lib/queries/content.ts
import { prisma } from "@/lib/prisma";

export interface ContentByTag {
  tag: {
    id: string;
    name: string;
    slug: string;
    color: string | null;
  };
  blogs: Array<{
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    publishedAt: Date | null;
    readTime: number | null;
    views: number;
    featured: boolean;
    coverImage: string | null;
    author: {
      name: string | null;
      image: string | null;
    };
    tags: Array<{ name: string; slug: string }>;
  }>;
  projects: Array<{
    id: string;
    title: string;
    slug: string;
    description: string;
    coverImage: string | null;
    thumbnail: string | null;
    demoUrl: string | null;
    githubUrl: string | null;
    featured: boolean;
    views: number;
    techStack: string[];
    tags: Array<{ name: string; slug: string }>;
  }>;
  images: Array<{
    id: string;
    url: string;
    alt: string | null;
    caption: string | null;
    width: number | null;
    height: number | null;
    format: string | null;
    size: number | null;
    createdAt: Date;
    tags: Array<{ id: string; name: string; slug: string }>;
  }>;
}

export interface ContentByCategory {
  category: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    color: string | null;
    icon: string | null;
  };
  blogs: Array<{
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    publishedAt: Date | null;
    readTime: number | null;
    views: number;
    featured: boolean;
    coverImage: string | null;
    author: {
      name: string | null;
      image: string | null;
    };
    tags: Array<{ name: string; slug: string }>;
  }>;
  projects: Array<{
    id: string;
    title: string;
    slug: string;
    description: string;
    coverImage: string | null;
    thumbnail: string | null;
    demoUrl: string | null;
    githubUrl: string | null;
    featured: boolean;
    views: number;
    techStack: string[];
    tags: Array<{ name: string; slug: string }>;
  }>;
}

/**
 * Get all content (blogs, projects, images) associated with a specific tag
 */
export async function getContentByTag(slug: string): Promise<ContentByTag | null> {
  // Find the tag
  const tag = await prisma.tag.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      slug: true,
      color: true,
    },
  });

  if (!tag) {
    return null;
  }

  // Fetch all content types in parallel for performance
  const [blogs, projects, images] = await Promise.all([
    // Get blogs with this tag
    prisma.blog.findMany({
      where: {
        published: true,
        tags: {
          some: { slug },
        },
      },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        publishedAt: true,
        readTime: true,
        views: true,
        featured: true,
        coverImage: true,
        author: {
          select: {
            name: true,
            image: true,
          },
        },
        tags: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
      orderBy: [
        { featured: "desc" },
        { publishedAt: "desc" },
      ],
    }),

    // Get projects with this tag
    prisma.project.findMany({
      where: {
        published: true,
        tags: {
          some: { slug },
        },
      },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        coverImage: true,
        thumbnail: true,
        demoUrl: true,
        githubUrl: true,
        featured: true,
        views: true,
        techStack: true,
        tags: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
      orderBy: [
        { featured: "desc" },
        { createdAt: "desc" },
      ],
    }),

    // Get images with this tag
    prisma.image.findMany({
      where: {
        tags: {
          some: { slug },
        },
      },
      select: {
        id: true,
        url: true,
        alt: true,
        caption: true,
        width: true,
        height: true,
        format: true,
        size: true,
        createdAt: true,
        tags: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
  ]);

  return {
    tag,
    blogs,
    projects,
    images,
  };
}

/**
 * Get all content (blogs, projects) associated with a specific category
 * Note: Images don't have categories in the schema
 */
export async function getContentByCategory(slug: string): Promise<ContentByCategory | null> {
  // Find the category
  const category = await prisma.category.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      color: true,
      icon: true,
    },
  });

  if (!category) {
    return null;
  }

  // Fetch blogs and projects in parallel
  const [blogs, projects] = await Promise.all([
    // Get blogs with this category
    prisma.blog.findMany({
      where: {
        published: true,
        categoryId: category.id,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        publishedAt: true,
        readTime: true,
        views: true,
        featured: true,
        coverImage: true,
        author: {
          select: {
            name: true,
            image: true,
          },
        },
        tags: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
      orderBy: [
        { featured: "desc" },
        { publishedAt: "desc" },
      ],
    }),

    // Get projects with this category
    prisma.project.findMany({
      where: {
        published: true,
        categoryId: category.id,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        coverImage: true,
        thumbnail: true,
        demoUrl: true,
        githubUrl: true,
        featured: true,
        views: true,
        techStack: true,
        tags: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
      orderBy: [
        { featured: "desc" },
        { createdAt: "desc" },
      ],
    }),
  ]);

  return {
    category,
    blogs,
    projects,
  };
}

/**
 * Get all tags with their usage counts for sitemap/listing
 */
export async function getAllTags() {
  const tags = await prisma.tag.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      color: true,
      _count: {
        select: {
          blogs: true,
          projects: true,
          images: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  return tags.map(tag => ({
    ...tag,
    totalCount: tag._count.blogs + tag._count.projects + tag._count.images,
  }));
}

/**
 * Get all categories with their usage counts for sitemap/listing
 */
export async function getAllCategories() {
  const categories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      color: true,
      icon: true,
      _count: {
        select: {
          blogs: true,
          projects: true,
        },
      },
    },
    orderBy: {
      order: "asc",
    },
  });

  return categories.map(category => ({
    ...category,
    totalCount: category._count.blogs + category._count.projects,
  }));
}

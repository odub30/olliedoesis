// src/app/blogs/page.tsx
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import { BlogsList } from "@/components/blog/blogs-list";

// Force dynamic rendering since this page requires database access
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Blog | Ollie Doesis",
  description: "Articles and insights on web development, cybersecurity, and technology.",
};

type BlogTag = {
  name: string;
  slug: string;
};

type Blog = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  featured: boolean;
  publishedAt: Date | null;
  readTime: number | null;
  views: number;
  tags: BlogTag[];
};

async function getPublishedBlogs() {
  const blogs = await prisma.blog.findMany({
    where: {
      published: true,
    },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      featured: true,
      publishedAt: true,
      views: true,
      readTime: true,
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
    take: 50, // Limit results for better performance
  }) as unknown as Blog[];

  return blogs;
}

export default async function BlogsPage() {
  const blogs = await getPublishedBlogs();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary-800 to-accent-900">
      {/* Header */}
      <section className="pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Blog
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Articles and insights on web development, cybersecurity, and technology
          </p>
        </div>
      </section>

      {/* Blog List with Search & Filters */}
      <section className="py-12 px-4">
        <BlogsList blogs={blogs} />
      </section>
    </div>
  );
}

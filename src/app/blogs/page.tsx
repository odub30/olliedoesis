// src/app/blogs/page.tsx
import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import { Calendar, Clock, Eye, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

const prisma = new PrismaClient();

export const metadata: Metadata = {
  title: "Blog | Ollie Doesis",
  description: "Articles and insights on web development, cybersecurity, and technology.",
};

async function getPublishedBlogs() {
  const blogs = await prisma.blog.findMany({
    where: {
      published: true,
    },
    include: {
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
  });

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

      {/* Blog Grid */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {blogs.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
              <p className="text-gray-500 text-lg">
                No blog posts published yet. Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog) => (
                <Link
                  key={blog.id}
                  href={`/blogs/${blog.slug}`}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col"
                >
                  {/* Featured Badge */}
                  {blog.featured && (
                    <div className="bg-gradient-to-r from-accent-500 to-accent-600 text-white text-xs font-bold px-4 py-2">
                      ⭐ FEATURED
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    {/* Title */}
                    <h2 className="text-2xl font-bold text-foreground mb-3 group-hover:text-accent-600 transition-colors line-clamp-2">
                      {blog.title}
                    </h2>

                    {/* Excerpt */}
                    {blog.excerpt && (
                      <p className="text-muted-foreground mb-4 line-clamp-3 flex-1">
                        {blog.excerpt}
                      </p>
                    )}

                    {/* Tags */}
                    {blog.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {blog.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag.slug}
                            className="px-3 py-1 bg-accent-50 text-accent-700 text-xs font-medium rounded-full"
                          >
                            {tag.name}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-sm text-muted-foreground pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-4">
                        {blog.publishedAt && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {new Date(blog.publishedAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                        )}

                        {blog.readTime && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{blog.readTime} min read</span>
                          </div>
                        )}
                      </div>

                      {blog.views > 0 && (
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          <span>{blog.views}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Read More Footer */}
                  <div className="px-6 py-4 bg-gray-50 group-hover:bg-accent-50 transition-colors">
                    <div className="flex items-center justify-between text-accent-600 font-medium">
                      <span>Read Article</span>
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

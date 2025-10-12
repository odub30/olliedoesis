// src/app/blogs/[slug]/page.tsx
import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, Clock, Eye, ArrowLeft, User } from "lucide-react";
import { marked } from "marked";
import type { Metadata } from "next";
import { getBlogFAQs } from "@/data/blog-faqs";
import { BlogFAQSection } from "@/components/blog/BlogFAQSection";

const prisma = new PrismaClient();

// Configure marked for safe HTML rendering
marked.setOptions({
  gfm: true,
  breaks: true,
});

interface BlogPageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getBlog(slug: string) {
  const blog = await prisma.blog.findUnique({
    where: {
      slug,
      published: true,
    },
    include: {
      author: {
        select: {
          name: true,
          email: true,
          image: true,
        },
      },
      tags: {
        select: {
          name: true,
          slug: true,
        },
      },
      images: {
        select: {
          url: true,
          alt: true,
          caption: true,
        },
      },
    },
  });

  if (!blog) {
    return null;
  }

  // Increment view count
  await prisma.blog.update({
    where: { id: blog.id },
    data: { views: { increment: 1 } },
  });

  return blog;
}

async function getRelatedBlogs(currentBlogId: string, tags: string[], limit = 3) {
  if (tags.length === 0) return [];

  const relatedBlogs = await prisma.blog.findMany({
    where: {
      AND: [
        { published: true },
        { id: { not: currentBlogId } },
        {
          tags: {
            some: {
              slug: {
                in: tags,
              },
            },
          },
        },
      ],
    },
    include: {
      tags: {
        select: {
          name: true,
          slug: true,
        },
      },
    },
    take: limit,
    orderBy: {
      views: "desc",
    },
  });

  return relatedBlogs;
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog) {
    return {
      title: "Blog Not Found",
    };
  }

  return {
    title: `${blog.title} | Ollie Doesis`,
    description: blog.excerpt || blog.title,
    openGraph: {
      title: blog.title,
      description: blog.excerpt || blog.title,
      type: "article",
      publishedTime: blog.publishedAt?.toISOString(),
    },
  };
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog) {
    notFound();
  }

  // Convert markdown to HTML
  const contentHtml = marked(blog.content) as string;

  // Get related blogs
  const relatedBlogs = await getRelatedBlogs(
    blog.id,
    blog.tags.map((tag) => tag.slug)
  );

  // Get FAQs for this blog post if they exist
  const faqs = getBlogFAQs(slug);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary-800 to-accent-900">
      {/* Back Button */}
      <div className="pt-24 px-4">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Blog</span>
          </Link>
        </div>
      </div>

      {/* Article */}
      <article className="px-4 pb-20">
        <div className="max-w-4xl mx-auto">
          {/* Article Header */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Header Content */}
            <div className="p-8 md:p-12">
              {/* Featured Badge */}
              {blog.featured && (
                <div className="inline-block bg-gradient-to-r from-accent-500 to-accent-600 text-white text-xs font-bold px-4 py-1 rounded-full mb-4">
                  ⭐ FEATURED
                </div>
              )}

              {/* Title */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                {blog.title}
              </h1>

              {/* Excerpt */}
              {blog.excerpt && (
                <p className="text-xl text-muted-foreground mb-8">{blog.excerpt}</p>
              )}

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground pb-8 border-b border-gray-200">
                {/* Author */}
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{blog.author.name || "Anonymous"}</span>
                </div>

                {/* Published Date */}
                {blog.publishedAt && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(blog.publishedAt).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                )}

                {/* Read Time */}
                {blog.readTime && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{blog.readTime} min read</span>
                  </div>
                )}

                {/* Views */}
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  <span>{blog.views} views</span>
                </div>
              </div>

              {/* Tags */}
              {blog.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-6">
                  {blog.tags.map((tag) => (
                    <span
                      key={tag.slug}
                      className="px-4 py-2 bg-accent-50 text-accent-700 text-sm font-medium rounded-full"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Article Content */}
            <div className="px-8 md:px-12 pb-12">
              <div
                className="prose prose-lg max-w-none
                  prose-headings:font-bold prose-headings:text-foreground
                  prose-p:text-muted-foreground prose-p:leading-relaxed
                  prose-a:text-accent-600 prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-foreground prose-strong:font-semibold
                  prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm
                  prose-pre:bg-gray-900 prose-pre:text-gray-100
                  prose-ul:text-muted-foreground prose-ol:text-muted-foreground
                  prose-img:rounded-xl prose-img:shadow-lg"
                dangerouslySetInnerHTML={{ __html: contentHtml }}
              />

              {/* FAQ Section */}
              {faqs && faqs.length > 0 && (
                <BlogFAQSection
                  faqs={faqs}
                  heading="Frequently Asked Questions"
                  description="Common questions about building high-performance portfolios"
                />
              )}
            </div>
          </div>

          {/* Related Blogs */}
          {relatedBlogs.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-white mb-6">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedBlogs.map((relatedBlog) => (
                  <Link
                    key={relatedBlog.id}
                    href={`/blogs/${relatedBlog.slug}`}
                    className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all p-6 group"
                  >
                    <h3 className="font-bold text-foreground mb-2 group-hover:text-accent-600 transition-colors line-clamp-2">
                      {relatedBlog.title}
                    </h3>
                    {relatedBlog.excerpt && (
                      <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                        {relatedBlog.excerpt}
                      </p>
                    )}
                    {relatedBlog.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {relatedBlog.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag.slug}
                            className="px-2 py-1 bg-accent-50 text-accent-700 text-xs font-medium rounded-full"
                          >
                            {tag.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
    </div>
  );
}

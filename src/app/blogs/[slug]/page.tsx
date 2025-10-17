// src/app/blogs/[slug]/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, Clock, Eye, ArrowLeft, User, Github } from "lucide-react";
import { marked } from "marked";
import DOMPurify from "isomorphic-dompurify";
import type { Metadata } from "next";
import { getBlogFAQs } from "@/data/blog-faqs";
import { BlogFAQSection } from "@/components/blog/BlogFAQSection";
import { CodeExamplesSection } from "@/components/blog/CodeExamplesSection";
import { MetricsDisplay } from "@/components/blog/MetricsDisplay";
import { RelatedPosts } from "@/components/blog/RelatedPosts";
import type { TagEntry } from '@/types/db'

// Force dynamic rendering since this page requires database access
export const dynamic = 'force-dynamic';

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
      codeExamples: {
        orderBy: {
          order: "asc",
        },
      },
      faqs: {
        orderBy: {
          order: "asc",
        },
      },
      metrics: true,
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

async function getRelatedBlogs(currentBlogId: string, relatedPostIds: string[], tags: string[], limit = 3) {
  // First, try to get explicitly related posts
  if (relatedPostIds && relatedPostIds.length > 0) {
    const explicitRelated = await prisma.blog.findMany({
      where: {
        id: { in: relatedPostIds },
        published: true,
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
    });

    if (explicitRelated.length >= limit) {
      return explicitRelated;
    }

    // If we don't have enough, supplement with tag-based recommendations
    const remaining = limit - explicitRelated.length;
    if (tags.length > 0) {
      const tagBased = await prisma.blog.findMany({
        where: {
          AND: [
            { published: true },
            { id: { not: currentBlogId } },
            { id: { notIn: relatedPostIds } },
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
        take: remaining,
        orderBy: {
          views: "desc",
        },
      });

      return [...explicitRelated, ...tagBased];
    }

    return explicitRelated;
  }

  // Fall back to tag-based recommendations
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
    keywords: blog.keywords && blog.keywords.length > 0 ? blog.keywords : undefined,
    authors: blog.author.name ? [{ name: blog.author.name }] : undefined,
    category: blog.category || undefined,
    openGraph: {
      title: blog.title,
      description: blog.excerpt || blog.title,
      type: "article",
      publishedTime: blog.publishedAt?.toISOString(),
      modifiedTime: blog.lastUpdated?.toISOString() || blog.updatedAt.toISOString(),
      authors: blog.author.name ? [blog.author.name] : undefined,
      tags: blog.tags.map((tag) => tag.name),
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description: blog.excerpt || blog.title,
    },
    alternates: {
      canonical: `https://olliedoesis.dev/blogs/${blog.slug}`,
    },
  };
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog) {
    notFound();
  }

  // Convert markdown to HTML and sanitize for XSS protection
  const rawHtml = marked(blog.content) as string;
  const contentHtml = DOMPurify.sanitize(rawHtml);

  // Get related blogs
  const relatedBlogs = await getRelatedBlogs(
    blog.id,
    blog.relatedPostIds || [],
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

              {/* Tags & Category */}
              <div className="mt-6 space-y-3">
                {blog.category && (
                  <div>
                    <span className="text-xs text-muted-foreground mr-2">Category:</span>
                    <span className="px-4 py-2 bg-primary/10 text-primary-700 text-sm font-semibold rounded-full">
                      {blog.category}
                    </span>
                  </div>
                )}
                {blog.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-xs text-muted-foreground">Tags:</span>
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
                {blog.githubRepo && (
                  <div>
                    <a
                      href={blog.githubRepo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-full transition-colors"
                    >
                      <Github className="h-4 w-4" />
                      <span>View on GitHub</span>
                    </a>
                  </div>
                )}
              </div>
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

              {/* Code Examples Section */}
              {blog.codeExamples && blog.codeExamples.length > 0 && (
                <div className="mt-16">
                  <CodeExamplesSection examples={blog.codeExamples} />
                </div>
              )}

              {/* Performance Metrics */}
              {blog.metrics && (
                <div className="mt-16">
                  <MetricsDisplay metrics={blog.metrics} />
                </div>
              )}

              {/* FAQ Section */}
              {faqs && faqs.length > 0 && (
                <div className="mt-16">
                  <BlogFAQSection
                    faqs={faqs}
                    heading="Frequently Asked Questions"
                    description="Common questions about building high-performance portfolios"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Related Posts */}
          {relatedBlogs.length > 0 && (
            <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 mt-16">
              <RelatedPosts posts={relatedBlogs} currentPostId={blog.id} />
            </div>
          )}
        </div>
      </article>
    </div>
  );
}

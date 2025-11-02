// src/app/(public)/tags/[slug]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Tag, FileText, Briefcase, Image as ImageIcon } from "lucide-react";
import type { Metadata } from "next";
import { getContentByTag } from "@/lib/queries/content";
import { TagBadge } from "@/components/ui/tag-badge";
import { MediaCard } from "@/components/media/MediaCard";
import { getCanonicalUrl } from "@/lib/utils/canonical";

// Force dynamic rendering since this page requires database access
export const dynamic = 'force-dynamic';

interface TagPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { slug } = await params;
  const content = await getContentByTag(slug);

  if (!content) {
    return {
      title: "Tag Not Found",
    };
  }

  const totalItems = content.blogs.length + content.projects.length + content.images.length;
  const canonicalUrl = getCanonicalUrl(`tags/${slug}`);

  return {
    title: `${content.tag.name} - All Content | Ollie Doesis`,
    description: `Explore ${totalItems} pieces of content tagged with "${content.tag.name}": ${content.blogs.length} blog posts, ${content.projects.length} projects, and ${content.images.length} media items.`,
    keywords: content.tag.name,
    openGraph: {
      title: `${content.tag.name} - All Content`,
      description: `${totalItems} blog posts, projects, and media items tagged with ${content.tag.name}`,
      type: "website",
      url: canonicalUrl,
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const { slug } = await params;
  const content = await getContentByTag(slug);

  if (!content) {
    notFound();
  }

  const totalItems = content.blogs.length + content.projects.length + content.images.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary-800 to-accent-900">
      {/* Header */}
      <div className="pt-24 px-4 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Blog</span>
          </Link>

          {/* Page Title */}
          <div className="flex items-start gap-4 mb-6">
            <div className="flex-shrink-0 w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
              <Tag className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {content.tag.name}
              </h1>
              <p className="text-xl text-white/90">
                {totalItems} {totalItems === 1 ? "item" : "items"} tagged with {content.tag.name}
              </p>
            </div>
          </div>

          {/* Content Type Counts */}
          <div className="flex flex-wrap gap-4">
            {content.blogs.length > 0 && (
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2 flex items-center gap-2">
                <FileText className="h-4 w-4 text-white" />
                <span className="text-white font-medium">
                  {content.blogs.length} {content.blogs.length === 1 ? "Blog Post" : "Blog Posts"}
                </span>
              </div>
            )}
            {content.projects.length > 0 && (
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2 flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-white" />
                <span className="text-white font-medium">
                  {content.projects.length} {content.projects.length === 1 ? "Project" : "Projects"}
                </span>
              </div>
            )}
            {content.images.length > 0 && (
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2 flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-white" />
                <span className="text-white font-medium">
                  {content.images.length} {content.images.length === 1 ? "Media Item" : "Media Items"}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="px-4 pb-20">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Blog Posts Section */}
          {content.blogs.length > 0 && (
            <section>
              <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
                <div className="flex items-center gap-3 mb-8">
                  <FileText className="h-6 w-6 text-primary" />
                  <h2 className="text-3xl font-bold text-foreground">
                    Blog Posts ({content.blogs.length})
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {content.blogs.map((blog) => (
                    <Link
                      key={blog.id}
                      href={`/blogs/${blog.slug}`}
                      className="group bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:bg-white border border-gray-100"
                    >
                      {blog.featured && (
                        <div className="inline-block bg-gradient-to-r from-accent-500 to-accent-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
                          ⭐ FEATURED
                        </div>
                      )}
                      <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-accent-600 transition-colors line-clamp-2">
                        {blog.title}
                      </h3>
                      {blog.excerpt && (
                        <p className="text-muted-foreground mb-4 line-clamp-3">
                          {blog.excerpt}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {blog.tags.slice(0, 3).map((tag) => (
                          <TagBadge
                            key={tag.slug}
                            name={tag.name}
                            slug={tag.slug}
                            size="sm"
                            onClick={(e) => e.preventDefault()}
                          />
                        ))}
                      </div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground pt-4 border-t border-gray-200">
                        <span>
                          {blog.publishedAt &&
                            new Date(blog.publishedAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                        </span>
                        {blog.readTime && <span>{blog.readTime} min read</span>}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Projects Section */}
          {content.projects.length > 0 && (
            <section>
              <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
                <div className="flex items-center gap-3 mb-8">
                  <Briefcase className="h-6 w-6 text-primary" />
                  <h2 className="text-3xl font-bold text-foreground">
                    Projects ({content.projects.length})
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {content.projects.map((project) => (
                    <Link
                      key={project.id}
                      href={`/projects/${project.slug}`}
                      className="group bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:bg-white border border-gray-100"
                    >
                      {project.featured && (
                        <div className="inline-block bg-gradient-to-r from-accent-500 to-accent-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
                          ⭐ FEATURED
                        </div>
                      )}
                      <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-accent-600 transition-colors line-clamp-2">
                        {project.title}
                      </h3>
                      <p className="text-muted-foreground mb-4 line-clamp-3">
                        {project.description}
                      </p>
                      {project.techStack.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.techStack.slice(0, 4).map((tech) => (
                            <span
                              key={tech}
                              className="px-3 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded-full"
                            >
                              {tech}
                            </span>
                          ))}
                          {project.techStack.length > 4 && (
                            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                              +{project.techStack.length - 4}
                            </span>
                          )}
                        </div>
                      )}
                      <div className="flex gap-3 pt-4 border-t border-gray-200">
                        {project.demoUrl && (
                          <span className="text-xs text-accent-600 font-medium">Live Demo</span>
                        )}
                        {project.githubUrl && (
                          <span className="text-xs text-muted-foreground font-medium">GitHub</span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Media Section */}
          {content.images.length > 0 && (
            <section>
              <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
                <div className="flex items-center gap-3 mb-8">
                  <ImageIcon className="h-6 w-6 text-primary" />
                  <h2 className="text-3xl font-bold text-foreground">
                    Media ({content.images.length})
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {content.images.map((image) => (
                    <MediaCard key={image.id} image={image} />
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Empty State */}
          {totalItems === 0 && (
            <div className="bg-white rounded-2xl shadow-2xl p-12 text-center">
              <Tag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-foreground mb-2">No content found</h3>
              <p className="text-muted-foreground mb-6">
                There are no published items with the tag "{content.tag.name}" yet.
              </p>
              <Link
                href="/blogs"
                className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Browse All Posts
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

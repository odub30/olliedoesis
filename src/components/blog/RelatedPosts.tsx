// src/components/blog/RelatedPosts.tsx
import Link from "next/link";
import { ArrowRight, Calendar, Clock, Eye } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface RelatedBlog {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  publishedAt: Date | null;
  readTime: number | null;
  views: number;
  tags: Array<{ name: string; slug: string }>;
}

interface RelatedPostsProps {
  posts: RelatedBlog[];
  currentPostId: string;
}

export function RelatedPosts({ posts, currentPostId }: RelatedPostsProps) {
  // Filter out current post
  const relatedPosts = posts.filter((post) => post.id !== currentPostId);

  if (!relatedPosts || relatedPosts.length === 0) return null;

  return (
    <section className="mb-16">
      <h2 className="text-3xl font-bold tracking-tight mb-6">Related Articles</h2>
      <p className="text-lg leading-relaxed text-muted-foreground mb-6">
        Continue learning with these related posts
      </p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {relatedPosts.slice(0, 3).map((post) => (
          <Card key={post.id} className="group hover:shadow-lg transition-all hover:scale-[1.02]">
            <CardHeader>
              <CardTitle className="text-lg group-hover:text-accent-600 transition-colors">
                <Link href={`/blogs/${post.slug}`} className="hover:underline">
                  {post.title}
                </Link>
              </CardTitle>
              <CardDescription className="line-clamp-2">{post.excerpt}</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Meta info */}
              <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-4">
                {post.publishedAt && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                  </div>
                )}
                {post.readTime && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{post.readTime} min read</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Eye className="h-3.5 w-3.5" />
                  <span>{post.views} views</span>
                </div>
              </div>

              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag.slug}
                      className="px-2 py-1 bg-accent-50 dark:bg-accent-900/30 text-accent-700 dark:text-accent-400 text-xs font-medium rounded-full"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Read more link */}
              <Link
                href={`/blogs/${post.slug}`}
                className="inline-flex items-center gap-2 text-accent-600 hover:text-accent-700 font-medium text-sm group/link"
              >
                <span>Read article</span>
                <ArrowRight className="h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

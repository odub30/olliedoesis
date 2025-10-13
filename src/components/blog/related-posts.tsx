import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BlogPost, allPosts, getPostBySlug } from "@/lib/blogMetadata";
import { getSimilarPosts } from "@/lib/searchUtils";
import { ArrowRight, Clock } from "lucide-react";

interface RelatedPostsProps {
  currentPostSlug: string;
  limit?: number;
  title?: string;
  useMetadataRelated?: boolean;
}

export function RelatedPosts({
  currentPostSlug,
  limit = 3,
  title = "Related Posts",
  useMetadataRelated = true
}: RelatedPostsProps) {
  const currentPost = getPostBySlug(currentPostSlug);

  if (!currentPost) return null;

  // Get related posts - prefer metadata-defined related posts, fallback to similarity algorithm
  let relatedPosts: BlogPost[] = [];

  if (useMetadataRelated && currentPost.relatedPosts.length > 0) {
    relatedPosts = currentPost.relatedPosts
      .map(slug => getPostBySlug(slug))
      .filter((post): post is BlogPost => post !== undefined)
      .slice(0, limit);
  }

  // Fallback to similarity algorithm if not enough related posts
  if (relatedPosts.length < limit) {
    const similarPosts = getSimilarPosts(currentPost, allPosts, limit);
    relatedPosts = [...relatedPosts, ...similarPosts].slice(0, limit);
  }

  if (relatedPosts.length === 0) return null;

  return (
    <section className="mt-12 pt-8 border-t">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>

      <div className="grid gap-6 md:grid-cols-3">
        {relatedPosts.map((post) => (
          <Link key={post.slug} href={`/articles/${post.slug}`} className="group">
            <Card className="h-full transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:border-primary/50">
              <CardHeader>
                <Badge variant="secondary" className="w-fit mb-2 text-xs">
                  {post.category}
                </Badge>
                <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </CardTitle>
                <CardDescription className="flex items-center gap-2 text-xs">
                  <Clock className="w-3 h-3" />
                  {post.readTime} min read
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {post.description}
                </p>
                <div className="flex items-center text-primary text-sm font-medium group-hover:underline">
                  Read more
                  <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}

// Compact version for sidebars
export function RelatedPostsCompact({ currentPostSlug, limit = 3 }: RelatedPostsProps) {
  const currentPost = getPostBySlug(currentPostSlug);

  if (!currentPost) return null;

  let relatedPosts: BlogPost[] = [];

  if (currentPost.relatedPosts.length > 0) {
    relatedPosts = currentPost.relatedPosts
      .map(slug => getPostBySlug(slug))
      .filter((post): post is BlogPost => post !== undefined)
      .slice(0, limit);
  }

  if (relatedPosts.length < limit) {
    const similarPosts = getSimilarPosts(currentPost, allPosts, limit);
    relatedPosts = [...relatedPosts, ...similarPosts].slice(0, limit);
  }

  if (relatedPosts.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Related Posts</h3>
      <div className="space-y-3">
        {relatedPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/articles/${post.slug}`}
            className="block p-3 rounded-lg border bg-card hover:bg-accent transition-colors group"
          >
            <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors mb-1">
              {post.title}
            </h4>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Badge variant="outline" className="text-xs py-0">
                {post.category}
              </Badge>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {post.readTime} min
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

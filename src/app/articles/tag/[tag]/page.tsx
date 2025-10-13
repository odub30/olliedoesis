import { notFound } from "next/navigation";
import { Metadata } from "next";
import { allPosts, allTags, getPostsByTag } from "@/lib/blogMetadata";
import { BlogCard } from "@/components/blog/blog-card";
import { Breadcrumb } from "@/components/blog/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Tag } from "lucide-react";

interface TagPageProps {
  params: {
    tag: string;
  };
}

// Helper to convert slug to tag name
function slugToTag(slug: string): string {
  return slug
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// Helper to convert tag name to slug
function tagToSlug(tag: string): string {
  return tag.toLowerCase().replace(/\s+/g, "-");
}

// Generate static params for all tags
export async function generateStaticParams() {
  return allTags.map(tag => ({
    tag: tagToSlug(tag)
  }));
}

// Generate metadata
export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const tagName = slugToTag(params.tag);
  const posts = getPostsByTag(tagName);

  return {
    title: `${tagName} - Article Tags`,
    description: `Explore ${posts.length} articles tagged with ${tagName}. Find tutorials, guides, and insights.`,
    openGraph: {
      title: `${tagName} - Article Tags`,
      description: `Explore ${posts.length} articles tagged with ${tagName}.`,
      type: "website"
    }
  };
}

export default function TagPage({ params }: TagPageProps) {
  const tagName = slugToTag(params.tag);

  // Check if tag exists
  if (!allTags.includes(tagName)) {
    notFound();
  }

  const posts = getPostsByTag(tagName);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[{ label: "Articles", href: "/articles" }]}
          currentPage={`Posts tagged: ${tagName}`}
        />

        {/* Tag Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Tag className="w-8 h-8 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Posts tagged: <span className="text-primary">{tagName}</span>
            </h1>
          </div>
          <p className="text-xl text-muted-foreground mb-4">
            {posts.length} {posts.length === 1 ? "post" : "posts"} with this tag
          </p>

          {/* Popular tags navigation */}
          <div className="flex flex-wrap gap-2 pt-6 border-t">
            <span className="text-sm text-muted-foreground mr-2">Browse other popular tags:</span>
            {allTags
              .filter(tag => tag !== tagName)
              .slice(0, 10)
              .map(tag => (
                <a key={tag} href={`/articles/tag/${tagToSlug(tag)}`}>
                  <Badge variant="outline" className="hover:bg-accent cursor-pointer">
                    {tag}
                  </Badge>
                </a>
              ))}
            <a href="/articles">
              <Badge variant="secondary" className="hover:bg-accent cursor-pointer">
                View all tags
              </Badge>
            </a>
          </div>
        </div>

        {/* Posts Grid */}
        {posts.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map(post => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">
              No posts found with this tag yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

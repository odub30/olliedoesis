import { notFound } from "next/navigation";
import { Metadata } from "next";
import { allPosts, getPostsByCategory, allCategories, PrimaryCategory } from "@/lib/blogMetadata";
import { BlogCard } from "@/components/blog/blog-card";
import { Breadcrumb } from "@/components/blog/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Folder } from "lucide-react";

interface CategoryPageProps {
  params: {
    category: string;
  };
}

// Helper to convert slug to category name
function slugToCategory(slug: string): PrimaryCategory | null {
  const categoryMap: Record<string, PrimaryCategory> = {
    "frontend-development": "Frontend Development",
    "backend-development": "Backend Development",
    "performance-optimization": "Performance Optimization",
    "design-ux": "Design & UX",
    "devops-deployment": "DevOps & Deployment",
    "tools-workflow": "Tools & Workflow"
  };

  return categoryMap[slug] || null;
}

// Helper to convert category name to slug
function categoryToSlug(category: PrimaryCategory): string {
  return category
    .toLowerCase()
    .replace(/\s+&\s+/g, "-")
    .replace(/\s+/g, "-");
}

// Generate static params for all categories
export async function generateStaticParams() {
  return allCategories.map(category => ({
    category: categoryToSlug(category)
  }));
}

// Generate metadata
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = slugToCategory(params.category);

  if (!category) {
    return {
      title: "Category Not Found"
    };
  }

  const posts = getPostsByCategory(category);

  return {
    title: `${category} - Articles`,
    description: `Explore ${posts.length} articles about ${category}. Learn from tutorials, guides, and insights.`,
    openGraph: {
      title: `${category} - Articles`,
      description: `Explore ${posts.length} articles about ${category}.`,
      type: "website"
    }
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const category = slugToCategory(params.category);

  if (!category) {
    notFound();
  }

  const posts = getPostsByCategory(category);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[{ label: "Articles", href: "/articles" }]}
          currentPage={category}
        />

        {/* Category Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Folder className="w-8 h-8 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              {category}
            </h1>
          </div>
          <p className="text-xl text-muted-foreground mb-4">
            {posts.length} {posts.length === 1 ? "post" : "posts"} in this category
          </p>

          {/* All categories navigation */}
          <div className="flex flex-wrap gap-2 pt-6 border-t">
            <span className="text-sm text-muted-foreground mr-2">Browse other categories:</span>
            {allCategories
              .filter(cat => cat !== category)
              .map(cat => (
                <a key={cat} href={`/articles/category/${categoryToSlug(cat)}`}>
                  <Badge variant="outline" className="hover:bg-accent cursor-pointer">
                    {cat}
                  </Badge>
                </a>
              ))}
          </div>
        </div>

        {/* Posts Grid */}
        {posts.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map(post => (
              <BlogCard key={post.slug} post={post} featured />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">
              No posts found in this category yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState, useMemo } from "react";
import { allPosts, allCategories, getFeaturedPosts, PrimaryCategory } from "@/lib/blogMetadata";
import { applyFilters, sortPosts, SortOption } from "@/lib/searchUtils";
import { BlogCard } from "@/components/blog/blog-card";
import { SearchBar } from "@/components/blog/search-bar";
import { CategoryFilter } from "@/components/blog/category-filter";
import { TagCloud } from "@/components/blog/tag-cloud";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, Filter, SortAsc } from "lucide-react";

export default function ArticlesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<PrimaryCategory | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);

  // Apply filters and sorting
  const filteredPosts = useMemo(() => {
    const filtered = applyFilters(allPosts, {
      query: searchQuery,
      category: selectedCategory || undefined,
      tags: selectedTags,
      featured: showFeaturedOnly ? true : undefined
    });

    return sortPosts(filtered, sortBy);
  }, [searchQuery, selectedCategory, selectedTags, sortBy, showFeaturedOnly]);

  const featuredPosts = getFeaturedPosts();

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory(null);
    setSelectedTags([]);
    setShowFeaturedOnly(false);
    setSortBy("recent");
  };

  const hasActiveFilters = searchQuery || selectedCategory || selectedTags.length > 0 || showFeaturedOnly;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-br from-primary/10 via-primary/5 to-background pt-24 pb-12 px-4 border-b">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-10 h-10 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Articles
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Articles and insights on web development, performance optimization, and modern tech stacks
          </p>

          {/* Stats */}
          <div className="flex flex-wrap gap-6 mt-8">
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-primary">{allPosts.length}</span>
              <span className="text-muted-foreground">Total Posts</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-primary">{allCategories.length}</span>
              <span className="text-muted-foreground">Categories</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-primary">{featuredPosts.length}</span>
              <span className="text-muted-foreground">Featured</span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Filters */}
          <aside className="lg:col-span-1 space-y-8">
            <div className="sticky top-4 space-y-6">
              {/* Filter Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-muted-foreground" />
                  <h2 className="text-lg font-semibold">Filters</h2>
                </div>
                {hasActiveFilters && (
                  <button
                    onClick={handleResetFilters}
                    className="text-sm text-primary hover:underline font-medium"
                  >
                    Reset
                  </button>
                )}
              </div>

              {/* Featured Toggle */}
              <div className="flex items-center gap-2 p-3 rounded-lg border bg-card">
                <input
                  type="checkbox"
                  id="featured-only"
                  checked={showFeaturedOnly}
                  onChange={(e) => setShowFeaturedOnly(e.target.checked)}
                  className="w-4 h-4 text-primary bg-background border-gray-300 rounded focus:ring-primary"
                />
                <label htmlFor="featured-only" className="text-sm font-medium cursor-pointer">
                  Show Featured Only
                </label>
                <Badge variant="secondary" className="ml-auto">
                  {featuredPosts.length}
                </Badge>
              </div>

              {/* Category Filter */}
              <div className="p-4 rounded-lg border bg-card">
                <CategoryFilter
                  posts={allPosts}
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                />
              </div>

              {/* Tag Cloud */}
              <div className="p-4 rounded-lg border bg-card">
                <TagCloud
                  posts={allPosts}
                  selectedTags={selectedTags}
                  onTagsChange={setSelectedTags}
                  maxTags={20}
                />
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3 space-y-8">
            {/* Search and Sort */}
            <div className="space-y-4">
              <SearchBar
                onSearchChange={setSearchQuery}
                placeholder="Search articles by title, description, or tags..."
                resultCount={filteredPosts.length}
              />

              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <SortAsc className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm font-medium">Sort by:</span>
                </div>
                <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Most Recent</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="title-asc">Title (A-Z)</SelectItem>
                    <SelectItem value="title-desc">Title (Z-A)</SelectItem>
                    <SelectItem value="read-time">Read Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active Filters Summary */}
            {hasActiveFilters && (
              <div className="flex items-center gap-2 p-4 bg-muted/50 rounded-lg border">
                <span className="text-sm font-medium">Active filters:</span>
                {searchQuery && (
                  <Badge variant="secondary">
                    Search: {searchQuery}
                  </Badge>
                )}
                {selectedCategory && (
                  <Badge variant="secondary">
                    Category: {selectedCategory}
                  </Badge>
                )}
                {selectedTags.length > 0 && (
                  <Badge variant="secondary">
                    {selectedTags.length} tag{selectedTags.length > 1 ? "s" : ""}
                  </Badge>
                )}
                {showFeaturedOnly && (
                  <Badge variant="secondary">
                    Featured only
                  </Badge>
                )}
              </div>
            )}

            {/* Results Count */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing <span className="font-medium text-foreground">{filteredPosts.length}</span> of{" "}
                <span className="font-medium text-foreground">{allPosts.length}</span> posts
              </p>
            </div>

            {/* Blog Grid */}
            {filteredPosts.length > 0 ? (
              <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                {filteredPosts.map(post => (
                  <BlogCard key={post.slug} post={post} featured />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 px-4">
                <div className="max-w-md mx-auto space-y-4">
                  <div className="text-6xl">🔍</div>
                  <h3 className="text-2xl font-bold">No posts found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your filters or search query to find what you're looking for.
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    Clear all filters
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

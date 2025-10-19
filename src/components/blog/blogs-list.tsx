"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Calendar, Clock, Eye, ArrowRight, Search, Filter, SortAsc } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

// Memoized Blog Card Component for optimal performance
const BlogCard = React.memo(({ blog }: { blog: Blog }) => {
  return (
    <Link
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
  );
});

BlogCard.displayName = 'BlogCard';

type SortOption = "recent" | "oldest" | "title-asc" | "title-desc" | "popular";

export function BlogsList({ blogs }: { blogs: Blog[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("recent");

  // Get all unique tags
  const allTags = useMemo(() => {
    const tagMap = new Map<string, BlogTag>();
    blogs.forEach(blog => {
      blog.tags.forEach(tag => {
        if (!tagMap.has(tag.slug)) {
          tagMap.set(tag.slug, tag);
        }
      });
    });
    return Array.from(tagMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [blogs]);

  // Apply filters and sorting
  const filteredBlogs = useMemo(() => {
    let filtered = [...blogs];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(blog =>
        blog.title.toLowerCase().includes(query) ||
        blog.excerpt?.toLowerCase().includes(query) ||
        blog.tags.some(tag => tag.name.toLowerCase().includes(query))
      );
    }

    // Tag filter
    if (selectedTag) {
      filtered = filtered.filter(blog =>
        blog.tags.some(tag => tag.slug === selectedTag)
      );
    }

    // Featured filter
    if (showFeaturedOnly) {
      filtered = filtered.filter(blog => blog.featured);
    }

    // Sort
    switch (sortBy) {
      case "recent":
        filtered.sort((a, b) => {
          if (!a.publishedAt) return 1;
          if (!b.publishedAt) return -1;
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
        });
        break;
      case "oldest":
        filtered.sort((a, b) => {
          if (!a.publishedAt) return 1;
          if (!b.publishedAt) return -1;
          return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
        });
        break;
      case "title-asc":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "title-desc":
        filtered.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "popular":
        filtered.sort((a, b) => b.views - a.views);
        break;
    }

    return filtered;
  }, [blogs, searchQuery, selectedTag, showFeaturedOnly, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedTag(null);
    setShowFeaturedOnly(false);
    setSortBy("recent");
  };

  const hasActiveFilters = searchQuery || selectedTag || showFeaturedOnly;
  const featuredCount = blogs.filter(b => b.featured).length;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Search and Filters */}
      <div className="mb-8 space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/60" />
          <Input
            type="text"
            placeholder="Search articles by title, description, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20"
          />
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-3 items-center">
            {/* Featured Toggle */}
            <label className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white cursor-pointer hover:bg-white/20 transition-colors">
              <input
                type="checkbox"
                checked={showFeaturedOnly}
                onChange={(e) => setShowFeaturedOnly(e.target.checked)}
                className="w-4 h-4 text-accent bg-white/20 border-white/30 rounded focus:ring-accent"
              />
              <span className="text-sm font-medium">Featured Only</span>
              <Badge variant="secondary" className="ml-1">
                {featuredCount}
              </Badge>
            </label>

            {/* Tag Filter */}
            {allTags.length > 0 && (
              <Select value={selectedTag || "all"} onValueChange={(value) => setSelectedTag(value === "all" ? null : value)}>
                <SelectTrigger className="w-[180px] bg-white/10 border-white/20 text-white">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="All Tags" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tags</SelectItem>
                  {allTags.map(tag => (
                    <SelectItem key={tag.slug} value={tag.slug}>
                      {tag.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {/* Sort */}
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
              <SelectTrigger className="w-[180px] bg-white/10 border-white/20 text-white">
                <SortAsc className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="title-asc">Title (A-Z)</SelectItem>
                <SelectItem value="title-desc">Title (Z-A)</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="text-sm text-white/80 hover:text-white underline font-medium"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between text-white/80 text-sm">
          <p>
            Showing <span className="font-medium text-white">{filteredBlogs.length}</span> of{" "}
            <span className="font-medium text-white">{blogs.length}</span> posts
          </p>
        </div>
      </div>

      {/* Blog Grid */}
      {filteredBlogs.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
          <div className="max-w-md mx-auto space-y-4">
            <div className="text-6xl">🔍</div>
            <h3 className="text-2xl font-bold">No posts found</h3>
            <p className="text-muted-foreground">
              {hasActiveFilters
                ? "Try adjusting your filters or search query to find what you're looking for."
                : "No blog posts published yet. Check back soon!"}
            </p>
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBlogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  );
}

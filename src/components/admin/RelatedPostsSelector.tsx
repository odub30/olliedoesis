// src/components/admin/RelatedPostsSelector.tsx
"use client";

import { useState, useEffect } from "react";
import { X, Search, Loader2 } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
}

interface RelatedPostsSelectorProps {
  selectedPostIds: string[];
  currentBlogId?: string;
  onChange: (postIds: string[]) => void;
}

export function RelatedPostsSelector({ selectedPostIds, currentBlogId, onChange }: RelatedPostsSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [availablePosts, setAvailablePosts] = useState<BlogPost[]>([]);
  const [selectedPosts, setSelectedPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Fetch all published blogs
  useEffect(() => {
    async function fetchBlogs() {
      setIsLoading(true);
      try {
        const response = await fetch("/api/admin/blogs");
        if (response.ok) {
          const data = await response.json();
          const posts = data.blogs
            .filter((blog: BlogPost) => blog.id !== currentBlogId)
            .map((blog: BlogPost) => ({
              id: blog.id,
              title: blog.title,
              slug: blog.slug,
            }));
          setAvailablePosts(posts);

          // Load selected posts based on IDs
          const selected = posts.filter((post: BlogPost) => selectedPostIds.includes(post.id));
          setSelectedPosts(selected);
        }
      } catch {
        // Silent fail - not critical
      } finally {
        setIsLoading(false);
      }
    }
    fetchBlogs();
  }, [currentBlogId, selectedPostIds]);

  const filteredPosts = availablePosts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !selectedPostIds.includes(post.id)
  );

  const handleSelect = (post: BlogPost) => {
    const newSelected = [...selectedPosts, post];
    setSelectedPosts(newSelected);
    onChange(newSelected.map(p => p.id));
    setSearchQuery("");
    setShowDropdown(false);
  };

  const handleRemove = (postId: string) => {
    const newSelected = selectedPosts.filter(p => p.id !== postId);
    setSelectedPosts(newSelected);
    onChange(newSelected.map(p => p.id));
  };

  return (
    <div className="space-y-2">
      {/* Selected Posts */}
      {selectedPosts.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedPosts.map((post) => (
            <span
              key={post.id}
              className="inline-flex items-center gap-2 px-3 py-1 bg-accent-100 text-accent-700 rounded-full text-sm"
            >
              {post.title}
              <button
                type="button"
                onClick={() => handleRemove(post.id)}
                className="hover:bg-accent-200 rounded-full p-0.5 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Search Input */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none"
            placeholder="Search for related posts..."
          />
          {isLoading && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 animate-spin" />
          )}
        </div>

        {/* Dropdown */}
        {showDropdown && searchQuery && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {filteredPosts.length > 0 ? (
              filteredPosts.slice(0, 10).map((post) => (
                <button
                  key={post.id}
                  type="button"
                  onClick={() => handleSelect(post)}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
                >
                  <div className="font-medium text-foreground">{post.title}</div>
                  <div className="text-xs text-muted-foreground">/blogs/{post.slug}</div>
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-sm text-muted-foreground text-center">
                No matching posts found
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

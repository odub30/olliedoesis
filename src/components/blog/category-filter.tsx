"use client";

import { Badge } from "@/components/ui/badge";
import { PrimaryCategory, allCategories } from "@/lib/blogMetadata";
import { getCategoryCounts } from "@/lib/searchUtils";
import { BlogPost } from "@/lib/blogMetadata";
import { Layers } from "lucide-react";

interface CategoryFilterProps {
  posts: BlogPost[];
  selectedCategory: PrimaryCategory | null;
  onCategoryChange: (category: PrimaryCategory | null) => void;
}

export function CategoryFilter({ posts, selectedCategory, onCategoryChange }: CategoryFilterProps) {
  const categoryCounts = getCategoryCounts(posts);

  const handleCategoryClick = (category: PrimaryCategory | null) => {
    // If clicking the same category, deselect it
    if (selectedCategory === category) {
      onCategoryChange(null);
    } else {
      onCategoryChange(category);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Layers className="w-5 h-5 text-muted-foreground" />
        <h3 className="text-lg font-semibold">Filter by Category</h3>
      </div>

      <div className="flex flex-wrap gap-2">
        {/* "All" button */}
        <button
          onClick={() => onCategoryChange(null)}
          className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-200 px-4 py-2 border ${
            selectedCategory === null
              ? "bg-primary text-primary-foreground border-primary shadow-sm"
              : "bg-background text-foreground border-input hover:bg-accent hover:text-accent-foreground"
          }`}
        >
          All Posts
          <span className="ml-2 text-xs opacity-75">({posts.length})</span>
        </button>

        {/* Category buttons */}
        {allCategories.map((category) => {
          const count = categoryCounts.get(category) || 0;
          const isSelected = selectedCategory === category;

          return (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              disabled={count === 0}
              className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-200 px-4 py-2 border ${
                isSelected
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : count === 0
                  ? "bg-muted text-muted-foreground border-muted cursor-not-allowed opacity-50"
                  : "bg-background text-foreground border-input hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              {category}
              <span className="ml-2 text-xs opacity-75">({count})</span>
            </button>
          );
        })}
      </div>

      {selectedCategory && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Showing posts in</span>
          <Badge variant="secondary">{selectedCategory}</Badge>
          <button
            onClick={() => onCategoryChange(null)}
            className="text-primary hover:underline font-medium"
          >
            Clear filter
          </button>
        </div>
      )}
    </div>
  );
}

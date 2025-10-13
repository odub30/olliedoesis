"use client";

import { Badge } from "@/components/ui/badge";
import { BlogPost } from "@/lib/blogMetadata";
import { getTagCounts } from "@/lib/searchUtils";
import { Tags, X } from "lucide-react";

interface TagCloudProps {
  posts: BlogPost[];
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  maxTags?: number;
}

export function TagCloud({ posts, selectedTags, onTagsChange, maxTags }: TagCloudProps) {
  const tagCounts = getTagCounts(posts);

  // Sort tags by count descending
  const sortedTags = Array.from(tagCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxTags);

  // Calculate size classes based on frequency
  const getTagSize = (count: number) => {
    const maxCount = Math.max(...Array.from(tagCounts.values()));
    const percentage = count / maxCount;

    if (percentage > 0.7) return "text-xl font-bold";
    if (percentage > 0.4) return "text-lg font-semibold";
    if (percentage > 0.2) return "text-base font-medium";
    return "text-sm";
  };

  const handleTagClick = (tag: string) => {
    if (selectedTags.includes(tag)) {
      // Remove tag
      onTagsChange(selectedTags.filter(t => t !== tag));
    } else {
      // Add tag
      onTagsChange([...selectedTags, tag]);
    }
  };

  const clearAllTags = () => {
    onTagsChange([]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Tags className="w-5 h-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold">Filter by Tags</h3>
        </div>
        {selectedTags.length > 0 && (
          <button
            onClick={clearAllTags}
            className="text-sm text-primary hover:underline font-medium flex items-center gap-1"
          >
            <X className="w-4 h-4" />
            Clear all
          </button>
        )}
      </div>

      {/* Selected tags display */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 bg-muted/50 rounded-lg border">
          <span className="text-sm font-medium text-muted-foreground">Active filters:</span>
          {selectedTags.map(tag => (
            <Badge
              key={tag}
              variant="default"
              className="cursor-pointer hover:bg-primary/80"
              onClick={() => handleTagClick(tag)}
            >
              {tag}
              <X className="w-3 h-3 ml-1" />
            </Badge>
          ))}
        </div>
      )}

      {/* Tag cloud */}
      <div className="flex flex-wrap gap-3 items-center">
        {sortedTags.map(([tag, count]) => {
          const isSelected = selectedTags.includes(tag);
          const sizeClass = getTagSize(count);

          return (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className={`transition-all duration-200 hover:scale-110 ${sizeClass} ${
                isSelected
                  ? "text-primary font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tag}
              <span className="text-xs ml-1 opacity-60">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Alternative badge view */}
      <div className="pt-4 border-t">
        <p className="text-sm text-muted-foreground mb-3">Or browse all tags:</p>
        <div className="flex flex-wrap gap-2">
          {sortedTags.map(([tag, count]) => {
            const isSelected = selectedTags.includes(tag);

            return (
              <Badge
                key={tag}
                variant={isSelected ? "default" : "outline"}
                className="cursor-pointer hover:shadow-md transition-all"
                onClick={() => handleTagClick(tag)}
              >
                {tag}
                <span className="ml-1 text-xs opacity-75">({count})</span>
              </Badge>
            );
          })}
        </div>
      </div>
    </div>
  );
}

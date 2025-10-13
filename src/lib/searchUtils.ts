// src/lib/searchUtils.ts
// Search and filter utilities for blog posts

import { BlogPost, PrimaryCategory } from "./blogMetadata";

export interface SearchFilters {
  query?: string;
  category?: PrimaryCategory;
  tags?: string[];
  featured?: boolean;
}

export type SortOption = "recent" | "oldest" | "title-asc" | "title-desc" | "read-time";

/**
 * Search posts by query string (searches title, description, and tags)
 */
export function searchPosts(posts: BlogPost[], query: string): BlogPost[] {
  if (!query || query.trim() === "") return posts;

  const normalizedQuery = query.toLowerCase().trim();

  return posts.filter(post => {
    const searchableContent = [
      post.title,
      post.description,
      post.category,
      ...post.tags,
      post.author
    ].join(" ").toLowerCase();

    return searchableContent.includes(normalizedQuery);
  });
}

/**
 * Filter posts by category
 */
export function filterByCategory(posts: BlogPost[], category: PrimaryCategory): BlogPost[] {
  return posts.filter(post => post.category === category);
}

/**
 * Filter posts by tags (posts must have at least one of the specified tags)
 */
export function filterByTags(posts: BlogPost[], tags: string[]): BlogPost[] {
  if (tags.length === 0) return posts;

  return posts.filter(post =>
    tags.some(tag => post.tags.includes(tag))
  );
}

/**
 * Filter posts by featured status
 */
export function filterByFeatured(posts: BlogPost[], featured: boolean): BlogPost[] {
  return posts.filter(post => post.featured === featured);
}

/**
 * Apply all filters at once
 */
export function applyFilters(posts: BlogPost[], filters: SearchFilters): BlogPost[] {
  let filteredPosts = [...posts];

  // Apply search query
  if (filters.query) {
    filteredPosts = searchPosts(filteredPosts, filters.query);
  }

  // Apply category filter
  if (filters.category) {
    filteredPosts = filterByCategory(filteredPosts, filters.category);
  }

  // Apply tags filter
  if (filters.tags && filters.tags.length > 0) {
    filteredPosts = filterByTags(filteredPosts, filters.tags);
  }

  // Apply featured filter
  if (filters.featured !== undefined) {
    filteredPosts = filterByFeatured(filteredPosts, filters.featured);
  }

  return filteredPosts;
}

/**
 * Sort posts by specified option
 */
export function sortPosts(posts: BlogPost[], sortBy: SortOption): BlogPost[] {
  const sortedPosts = [...posts];

  switch (sortBy) {
    case "recent":
      return sortedPosts.sort((a, b) =>
        new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
      );

    case "oldest":
      return sortedPosts.sort((a, b) =>
        new Date(a.publishedDate).getTime() - new Date(b.publishedDate).getTime()
      );

    case "title-asc":
      return sortedPosts.sort((a, b) => a.title.localeCompare(b.title));

    case "title-desc":
      return sortedPosts.sort((a, b) => b.title.localeCompare(a.title));

    case "read-time":
      return sortedPosts.sort((a, b) => a.readTime - b.readTime);

    default:
      return sortedPosts;
  }
}

/**
 * Get tag counts from array of posts
 */
export function getTagCounts(posts: BlogPost[]): Map<string, number> {
  const tagCounts = new Map<string, number>();

  posts.forEach(post => {
    post.tags.forEach(tag => {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    });
  });

  return tagCounts;
}

/**
 * Get category counts from array of posts
 */
export function getCategoryCounts(posts: BlogPost[]): Map<PrimaryCategory, number> {
  const categoryCounts = new Map<PrimaryCategory, number>();

  posts.forEach(post => {
    categoryCounts.set(post.category, (categoryCounts.get(post.category) || 0) + 1);
  });

  return categoryCounts;
}

/**
 * Get posts similar to a given post based on tags and category
 */
export function getSimilarPosts(
  targetPost: BlogPost,
  allPosts: BlogPost[],
  limit: number = 3
): BlogPost[] {
  // Exclude the target post itself
  const otherPosts = allPosts.filter(post => post.slug !== targetPost.slug);

  // Calculate similarity score for each post
  const postsWithScores = otherPosts.map(post => {
    let score = 0;

    // Same category adds significant weight
    if (post.category === targetPost.category) {
      score += 10;
    }

    // Shared tags add weight
    const sharedTags = post.tags.filter(tag => targetPost.tags.includes(tag));
    score += sharedTags.length * 2;

    return { post, score };
  });

  // Sort by score descending and return top results
  return postsWithScores
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.post);
}

/**
 * Debounce function for search input
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

/**
 * Highlight search terms in text
 */
export function highlightSearchTerms(text: string, query: string): string {
  if (!query || query.trim() === "") return text;

  const normalizedQuery = query.trim();
  const regex = new RegExp(`(${normalizedQuery})`, "gi");

  return text.replace(regex, "<mark>$1</mark>");
}

/**
 * Calculate reading time estimate
 */
export function calculateReadTime(wordCount: number): number {
  const wordsPerMinute = 200;
  return Math.ceil(wordCount / wordsPerMinute);
}

/**
 * Format date for display
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

/**
 * Get relative time string (e.g., "2 months ago")
 */
export function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return "Today";
  if (diffInDays === 1) return "Yesterday";
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
  return `${Math.floor(diffInDays / 365)} years ago`;
}

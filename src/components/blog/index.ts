// src/components/blog/index.ts
// Export all blog components for easier imports

export { BlogHeader } from './blog-header';
export { TechStackOverview } from './tech-stack-overview';
export { FrameworkComparison } from './framework-comparison';
export { BundleSizeChart } from './bundle-size-chart';
export { CoreWebVitals } from './core-web-vitals';
export { FAQSection } from './faq-section';

// Blog Enhancement Components
export { DemoEmbed } from './DemoEmbed';
export type { DemoEmbedProps } from './DemoEmbed';

export { DemoGrid, DemoList, DemoTabs } from './DemoGrid';
export type { Demo, DemoGridProps } from './DemoGrid';

export { GitHubRepoCard } from './GitHubRepoCard';
export type { GitHubRepoCardProps } from './GitHubRepoCard';

export { SocialShare } from './SocialShare';
export type { SocialShareProps } from './SocialShare';

export { ReadingProgress } from './ReadingProgress';
export type { ReadingProgressProps } from './ReadingProgress';

export {
  ViewCounter,
  ViewCounterBadge,
  ViewCounterCard,
} from './ViewCounter';
export type {
  ViewCounterProps,
  ViewCounterBadgeProps,
  ViewCounterCardProps,
} from './ViewCounter';

export { BlogFAQSection } from './BlogFAQSection';

// TODO: Create these components when needed
// export { BlogCard } from './blog-card';
// export { SearchBar } from './search-bar';
// export { CategoryFilter } from './category-filter';
// export { TagCloud } from './tag-cloud';
// export { RelatedPosts, RelatedPostsCompact } from './related-posts';
// export { Breadcrumb } from './breadcrumb';
// export { RecentPosts } from './recent-posts';
// export { CategoryTagNav, CategoryTagNavCompact } from './category-tag-nav';

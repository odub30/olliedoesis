# Blog Tagging & Search System Documentation

Complete documentation for the metadata-based blog tagging, categorization, and search system.

## Overview

This system provides a comprehensive blog/article management solution with:
- ✅ 10 pre-configured blog posts with complete metadata
- ✅ 6 primary categories with intelligent filtering
- ✅ Multi-level tag taxonomy with tag cloud visualization
- ✅ Full-text search with debouncing
- ✅ Related posts algorithm
- ✅ Dynamic category and tag routes
- ✅ SEO optimization with JSON-LD schema
- ✅ Breadcrumb navigation
- ✅ Multiple sorting options

## Routes

### Main Routes
- `/articles` - Main articles listing with search and filters
- `/articles/[slug]` - Individual article page (placeholder for your content)
- `/articles/category/[category]` - Category-specific listings
- `/articles/tag/[tag]` - Tag-specific listings

### Existing Routes (Unchanged)
- `/blogs` - Your existing database-driven blog system
- `/blog` - Tech stack showcase page

## File Structure

```
src/
├── app/
│   ├── articles/
│   │   ├── page.tsx                          # Main articles listing
│   │   ├── category/[category]/page.tsx      # Category pages
│   │   └── tag/[tag]/page.tsx                # Tag pages
│   └── blogs/                                 # Your existing blog (unchanged)
│
├── components/blog/
│   ├── blog-card.tsx                         # Article card component
│   ├── search-bar.tsx                        # Search with debouncing
│   ├── category-filter.tsx                   # Category filter buttons
│   ├── tag-cloud.tsx                         # Interactive tag cloud
│   ├── related-posts.tsx                     # Related posts section
│   ├── breadcrumb.tsx                        # Breadcrumb with schema
│   └── index.ts                              # Component exports
│
└── lib/
    ├── blogMetadata.ts                       # Blog posts data & interfaces
    ├── searchUtils.ts                        # Search/filter utilities
    └── seoHelpers.ts                         # SEO metadata generators
```

## Core Files

### 1. `blogMetadata.ts`

Central metadata file containing all blog post data.

**Key Exports:**
- `BlogPost` interface - TypeScript interface for blog posts
- `PrimaryCategory` type - 6 primary categories
- `allPosts` - Array of all 10 blog posts
- `allCategories` - List of all categories
- `allTags` - List of all unique tags
- Helper functions: `getPostsByCategory()`, `getPostsByTag()`, `getFeaturedPosts()`, etc.

**Adding a New Blog Post:**

```typescript
// Add to allPosts array in blogMetadata.ts
{
  slug: "your-post-slug",
  title: "Your Post Title",
  publishedDate: "2025-04-15",
  lastUpdated: "2025-04-15",
  readTime: 10,
  author: "Ollie",
  category: "Frontend Development",
  tags: ["React", "TypeScript", "Performance"],
  description: "Brief description for SEO and preview...",
  featured: false,
  githubRepo: "https://github.com/...",  // Optional
  relatedPosts: ["slug-1", "slug-2"],    // Optional
}
```

### 2. `searchUtils.ts`

Utility functions for searching, filtering, and sorting blog posts.

**Key Functions:**
- `searchPosts()` - Full-text search
- `applyFilters()` - Apply all filters at once
- `sortPosts()` - Sort by various criteria
- `getSimilarPosts()` - Related posts algorithm
- `debounce()` - Debounce function for search
- `formatDate()` - Date formatting
- `getTagCounts()` / `getCategoryCounts()` - Get frequency counts

### 3. `seoHelpers.ts`

SEO optimization utilities.

**Key Functions:**
- `generateBlogPostMetadata()` - Generate Next.js Metadata object
- `generateArticleSchema()` - Generate JSON-LD Article schema
- `generateArticlesListingMetadata()` - Metadata for listing page
- `generateSitemapEntry()` - Sitemap generation
- `generateRSSItem()` - RSS feed generation

## Components

### BlogCard

Displays an article card with title, excerpt, tags, and metadata.

```tsx
import { BlogCard } from "@/components/blog/blog-card";

<BlogCard
  post={post}
  showExcerpt={true}  // Show description
  featured={true}     // Show featured badge
/>
```

### SearchBar

Search input with keyboard shortcuts (Ctrl+K) and debouncing.

```tsx
import { SearchBar } from "@/components/blog/search-bar";

<SearchBar
  onSearchChange={(query) => setSearchQuery(query)}
  placeholder="Search articles..."
  debounceMs={300}
  resultCount={filteredPosts.length}
/>
```

### CategoryFilter

Category filter buttons with counts.

```tsx
import { CategoryFilter } from "@/components/blog/category-filter";

<CategoryFilter
  posts={allPosts}
  selectedCategory={selectedCategory}
  onCategoryChange={(category) => setSelectedCategory(category)}
/>
```

### TagCloud

Interactive tag cloud with frequency-based sizing.

```tsx
import { TagCloud } from "@/components/blog/tag-cloud";

<TagCloud
  posts={allPosts}
  selectedTags={selectedTags}
  onTagsChange={(tags) => setSelectedTags(tags)}
  maxTags={20}
/>
```

### RelatedPosts

Show related posts based on metadata or similarity algorithm.

```tsx
import { RelatedPosts } from "@/components/blog/related-posts";

// On blog post page
<RelatedPosts
  currentPostSlug="your-post-slug"
  limit={3}
  useMetadataRelated={true}
/>

// Compact version for sidebar
<RelatedPostsCompact
  currentPostSlug="your-post-slug"
  limit={3}
/>
```

### Breadcrumb

Breadcrumb navigation with JSON-LD schema.

```tsx
import { Breadcrumb } from "@/components/blog/breadcrumb";

<Breadcrumb
  items={[
    { label: "Articles", href: "/articles" },
    { label: "Frontend Development", href: "/articles/category/frontend-development" }
  ]}
  currentPage="Your Post Title"
/>
```

## Categories

### Primary Categories (6)

1. **Frontend Development** - React, Next.js, TypeScript, UI frameworks
2. **Backend Development** - APIs, databases, server-side logic
3. **Performance Optimization** - Core Web Vitals, bundle size, loading speed
4. **Design & UX** - UI/UX, component libraries, design systems
5. **DevOps & Deployment** - CI/CD, hosting, deployment strategies
6. **Tools & Workflow** - Development tools, Git, productivity

### Category URL Format

```
/articles/category/[slug]

Examples:
- /articles/category/frontend-development
- /articles/category/performance-optimization
- /articles/category/design-ux
```

## Tags

### Tag Taxonomy

**Secondary Tags (Frameworks/Technologies):**
- Next.js, React, TypeScript, Tailwind CSS
- Node.js, Prisma, PostgreSQL
- Vercel, GitHub, Docker

**Tertiary Tags (Concepts/Features):**
- Performance, SEO, Accessibility
- Authentication, API Design
- Testing, CI/CD, Monitoring

### Tag URL Format

```
/articles/tag/[slug]

Examples:
- /articles/tag/nextjs
- /articles/tag/performance
- /articles/tag/tailwind-css
```

## Search & Filter Features

### Search Functionality

- **Full-text search** across title, description, category, tags, and author
- **Debounced input** (300ms default) for performance
- **Real-time results** with count display
- **Keyboard shortcut**: Ctrl+K (Cmd+K on Mac) to focus search
- **Highlight search terms** in results (available via utility)

### Filter Options

1. **Category Filter** - Select one category at a time
2. **Tag Filter** - Select multiple tags (posts matching ANY tag)
3. **Featured Toggle** - Show only featured posts
4. **Combined Filters** - All filters work together (AND logic)

### Sort Options

- **Most Recent** - Sort by publication date (newest first)
- **Oldest First** - Sort by publication date (oldest first)
- **Title (A-Z)** - Alphabetical ascending
- **Title (Z-A)** - Alphabetical descending
- **Read Time** - Sort by estimated reading time

## SEO Features

### Metadata Generation

Each blog post includes:
- **Title & Description** - Optimized for search engines
- **Open Graph tags** - Facebook, LinkedIn previews
- **Twitter Card tags** - Twitter previews
- **Canonical URLs** - Prevent duplicate content issues
- **Keywords** - Derived from tags and category

### JSON-LD Schema

- **Article Schema** - For individual blog posts
- **BreadcrumbList Schema** - For navigation
- **ItemList Schema** - For article listings
- **Organization Schema** - For publisher information

### Example: Using SEO Helpers

```tsx
// In your blog post page
import { generateBlogPostMetadata, generateArticleSchema } from "@/lib/seoHelpers";
import { getPostBySlug } from "@/lib/blogMetadata";

export async function generateMetadata({ params }): Promise<Metadata> {
  const post = getPostBySlug(params.slug);
  return generateBlogPostMetadata(post);
}

export default function BlogPostPage({ params }) {
  const post = getPostBySlug(params.slug);
  const schema = generateArticleSchema(post);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      {/* Your blog post content */}
    </>
  );
}
```

## Related Posts Algorithm

The system uses a similarity algorithm based on:

1. **Same Category** (+10 points)
2. **Shared Tags** (+2 points per tag)
3. **Score Ranking** - Highest scoring posts are shown

**Fallback**: If metadata-defined related posts exist, they take priority.

```typescript
// Automatic related posts
const related = getSimilarPosts(currentPost, allPosts, 3);

// Or use metadata-defined related posts
{
  slug: "your-post",
  relatedPosts: ["post-1", "post-2", "post-3"]
}
```

## Configuration

### Site Configuration

Update `SITE_CONFIG` in `seoHelpers.ts`:

```typescript
const SITE_CONFIG = {
  name: "Your Site Name",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://yoursite.com",
  author: "Your Name",
  description: "Your site description",
  social: {
    twitter: "@yourhandle",
  }
};
```

### Environment Variables

Add to `.env.local`:

```bash
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

## Common Tasks

### Add a New Blog Post

1. Open `src/lib/blogMetadata.ts`
2. Add new entry to `allPosts` array
3. Choose appropriate category
4. Add 5-10 relevant tags
5. Specify related posts (optional)

### Add a New Category

1. Update `PrimaryCategory` type in `blogMetadata.ts`
2. Add to `allCategories` array
3. Update slug conversion in category page
4. Blog posts can now use the new category

### Add a New Tag

Simply add the tag to any blog post's `tags` array. Tags are automatically extracted and available in the tag cloud.

### Customize Styling

All components use shadcn/ui and Tailwind CSS. Customize in:
- Individual component files
- `tailwind.config.ts` for global theme
- shadcn/ui components in `src/components/ui/`

### Change Article Links

Currently links to `/articles/[slug]`. To link to `/blogs/[slug]` instead:

1. Update `BlogCard.tsx` - change Link href
2. Update `RelatedPosts.tsx` - change Link hrefs
3. Update SEO helpers - change URL generation

## Performance Optimizations

### Implemented

- ✅ Debounced search input (reduces renders)
- ✅ `useMemo` for filtered results
- ✅ Static route generation for categories/tags
- ✅ Optimized re-renders with proper state management

### Recommendations

- Consider adding pagination for 50+ posts
- Implement virtual scrolling for very large lists
- Add loading states for better UX
- Cache search results in localStorage

## Accessibility Features

- ✅ Semantic HTML structure
- ✅ ARIA labels on interactive elements
- ✅ Keyboard navigation (Ctrl+K for search)
- ✅ Focus management
- ✅ Screen reader friendly breadcrumbs

## Future Enhancements

### Potential Additions

1. **Reading Progress Indicator** - Show scroll progress
2. **Table of Contents** - Auto-generated from headings
3. **Code Syntax Highlighting** - For technical posts
4. **Comments System** - User engagement
5. **Social Sharing Buttons** - Easy sharing
6. **Newsletter Signup** - Build audience
7. **View Counter** - Track popularity
8. **Reading History** - Track what user has read
9. **Bookmarking** - Save for later
10. **Print Stylesheet** - Printer-friendly version

### Advanced Features

- **Full MDX Support** - Rich content with components
- **Draft/Scheduled Posts** - Publishing workflow
- **Multi-author Support** - Team blogs
- **Series/Collections** - Group related posts
- **Translations** - Multi-language support

## Troubleshooting

### Issue: Posts not showing up

**Check:**
1. Post added to `allPosts` array?
2. Date format correct (YYYY-MM-DD)?
3. Category matches a `PrimaryCategory` value?
4. No TypeScript errors?

### Issue: Tags not working

**Check:**
1. Tags array populated?
2. Tag names match exactly (case-sensitive)?
3. Tag slugs generated correctly (lowercase, hyphens)?

### Issue: Search not working

**Check:**
1. `SearchBar` `onSearchChange` prop connected?
2. State updates triggering re-renders?
3. Filter function receiving search query?

### Issue: Related posts empty

**Check:**
1. Related post slugs match existing posts?
2. Posts have matching tags/categories?
3. Current post excluded from results?

## Support

For questions or issues:
1. Check this documentation
2. Review component props and TypeScript types
3. Check browser console for errors
4. Verify data in `blogMetadata.ts`

## License

Part of your Next.js portfolio project.

---

**Last Updated**: 2025-10-12
**Version**: 1.0.0

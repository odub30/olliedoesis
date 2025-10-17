# Blog Enhancement Components

A collection of reusable React components to enhance blog posts with interactive features, social sharing, and better user experience.

## Components Overview

### 1. DemoEmbed
Embed interactive demos from CodeSandbox, StackBlitz, or GitHub Pages with lazy loading.

**Features:**
- Lazy loading (click to load)
- Platform-specific icons and styling
- Sandbox security attributes
- Responsive design
- External link to open in new tab

**Usage:**
```tsx
import { DemoEmbed } from '@/components/blog';

<DemoEmbed
  src="https://codesandbox.io/embed/..."
  title="Interactive React Demo"
  platform="codesandbox"
  height="600px"
  description="Try this live demo to see the concept in action"
/>
```

**Props:**
- `src` (required): The embed URL
- `title` (required): Demo title
- `platform`: 'codesandbox' | 'stackblitz' | 'github-pages' (default: 'codesandbox')
- `height`: CSS height value (default: '600px')
- `description`: Optional description shown above the demo

---

### 2. GitHubRepoCard
Showcase GitHub repositories with star count, clone commands, and quick actions.

**Features:**
- Displays repo info with stars/forks
- Copy git clone command to clipboard
- Quick start terminal commands
- Links to view, star, and report issues
- Copy confirmation feedback

**Usage:**
```tsx
import { GitHubRepoCard } from '@/components/blog';

<GitHubRepoCard
  repoUrl="https://github.com/username/repo-name"
  description="All code examples from this article"
  stars={142}
  forks={23}
/>
```

**Props:**
- `repoUrl` (required): Full GitHub repository URL
- `description`: Custom description (optional)
- `stars`: Star count (optional)
- `forks`: Fork count (optional)

---

### 3. SocialShare
Social media sharing buttons with native Web Share API support.

**Features:**
- Native Web Share API on mobile
- Desktop: Direct share buttons for Twitter, LinkedIn, Facebook
- Copy link to clipboard
- Dropdown menu fallback
- Reddit sharing option

**Usage:**
```tsx
import { SocialShare } from '@/components/blog';

<SocialShare
  title="My Awesome Blog Post"
  url="https://yourdomain.com/blog/post-slug"
  description="Check out this amazing article about..."
/>
```

**Props:**
- `title` (required): Post title for sharing
- `url` (required): Post URL to share
- `description`: Optional description for share text

---

### 4. ReadingProgress
Fixed progress bar showing reading position in the article.

**Features:**
- Tracks scroll progress through article
- Fixed at top of viewport
- Customizable color and height
- Optional percentage indicator
- Auto-detects article element

**Usage:**
```tsx
import { ReadingProgress } from '@/components/blog';

// Basic usage (auto-detects article)
<ReadingProgress />

// With custom options
<ReadingProgress
  target="#blog-content"
  color="#3b82f6"
  height={4}
  showPercentage
/>
```

**Props:**
- `target`: CSS selector for element to track (optional, auto-detects article/main)
- `color`: Progress bar color (default: 'rgb(var(--accent-600))')
- `height`: Height in pixels (default: 3)
- `showPercentage`: Show percentage badge (default: false)

---

### 5. ViewCounter
Display view counts with optional animation and multiple variants.

**Features:**
- Animated counting on mount
- Compact number formatting (15k, 1.2M)
- Multiple size variants (sm, md, lg)
- Badge and Card variants
- Icon display toggle

**Usage:**
```tsx
import {
  ViewCounter,
  ViewCounterBadge,
  ViewCounterCard
} from '@/components/blog';

// Basic usage
<ViewCounter views={1234} />

// With animation
<ViewCounter views={1234} animate />

// Compact format
<ViewCounter views={15000} format="compact" />
// Output: "15k views"

// Badge variant
<ViewCounterBadge views={1234} variant="accent" />

// Card variant
<ViewCounterCard
  views={12345}
  title="Total Views"
  subtitle="Last updated today"
/>
```

**Props:**
- `views` (required): View count number
- `animate`: Animate count from 0 (default: false)
- `showIcon`: Display eye icon (default: true)
- `size`: 'sm' | 'md' | 'lg' (default: 'md')
- `format`: 'full' | 'compact' (default: 'full')
- `className`: Additional CSS classes

---

### 6. BlogFAQSection
Render FAQ sections with JSON-LD schema for SEO.

**Usage:**
```tsx
import { BlogFAQSection } from '@/components/blog';

<BlogFAQSection
  faqs={[
    {
      question: "What is Next.js?",
      answer: "Next.js is a React framework..."
    }
  ]}
  heading="Frequently Asked Questions"
  description="Common questions about this topic"
/>
```

---

## Complete Blog Post Example

Here's how to use all components together in a blog post:

```tsx
import {
  ReadingProgress,
  SocialShare,
  GitHubRepoCard,
  DemoEmbed,
  ViewCounter,
  BlogFAQSection,
} from '@/components/blog';

export default function BlogPost() {
  const postUrl = 'https://yourdomain.com/blog/post-slug';
  const postTitle = 'Building a Modern Portfolio with Next.js';

  return (
    <>
      {/* Reading progress bar */}
      <ReadingProgress showPercentage />

      <article id="blog-content">
        <header>
          <h1>{postTitle}</h1>
          <ViewCounter views={1234} animate />
        </header>

        {/* Main content */}
        <div className="prose">
          <p>Your blog content here...</p>

          {/* Embed a demo */}
          <DemoEmbed
            src="https://codesandbox.io/embed/..."
            title="Live Demo"
            platform="codesandbox"
            description="Try this interactive example"
          />

          <p>More content...</p>

          {/* Showcase the repo */}
          <GitHubRepoCard
            repoUrl="https://github.com/username/project"
            description="Complete source code for this tutorial"
            stars={142}
            forks={23}
          />
        </div>

        {/* FAQ Section */}
        <BlogFAQSection
          faqs={[
            {
              question: "How do I get started?",
              answer: "First, clone the repository and run npm install..."
            }
          ]}
        />

        {/* Social sharing */}
        <footer>
          <h3>Share this article</h3>
          <SocialShare
            title={postTitle}
            url={postUrl}
            description="Learn how to build a modern portfolio"
          />
        </footer>
      </article>
    </>
  );
}
```

---

## Integration with Database-Driven Blogs

For Prisma-based blog posts, add these components to your blog page template:

```tsx
// src/app/blogs/[slug]/page.tsx
import { ReadingProgress, SocialShare, ViewCounter } from '@/components/blog';

export default async function BlogPage({ params }: BlogPageProps) {
  const { slug } = await params;
  const blog = await getBlog(slug);
  const currentUrl = `${process.env.NEXT_PUBLIC_URL}/blogs/${slug}`;

  return (
    <>
      <ReadingProgress />

      <article>
        <header>
          <h1>{blog.title}</h1>
          <div className="flex items-center gap-4">
            <ViewCounter views={blog.views} />
            <SocialShare title={blog.title} url={currentUrl} />
          </div>
        </header>

        <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
      </article>
    </>
  );
}
```

---

## Styling Notes

All components use Tailwind CSS and follow your existing design system:
- Primary color: `accent-*` classes
- Consistent spacing and rounded corners
- Hover effects and transitions
- Responsive design with mobile-first approach
- Dark mode ready (uses `text-*` classes)

---

## Accessibility

All components follow accessibility best practices:
- Semantic HTML elements
- ARIA labels and attributes
- Keyboard navigation support
- Screen reader friendly
- Focus indicators

---

## Performance

- **Lazy Loading**: DemoEmbed loads on demand
- **Client Components**: Interactive features use 'use client'
- **Server Components**: Static content remains server-rendered
- **Optimized Animations**: Use CSS transforms and opacity
- **Small Bundle**: Tree-shakeable exports

---

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Web Share API (mobile) with fallback
- Clipboard API with fallback
- Responsive design for all screen sizes

---

## Future Enhancements

Potential additions:
- Table of contents generator
- Code syntax highlighting
- Image zoom/lightbox
- Audio/video embeds
- Comment section
- Reading time estimator
- Print-friendly styles

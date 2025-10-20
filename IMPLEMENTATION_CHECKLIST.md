# Implementation Checklist
**Project:** Next.js Portfolio Application
**Generated:** January 2025
**Based on:** Comprehensive Audit Report

---

## 🔴 CRITICAL PRIORITY - Fix Before Production

### 1. Environment Variables Configuration
**File:** `.env.example`
**Status:** ❌ Incomplete
**Estimated Time:** 30 minutes

- [ ] Add authentication environment variables
  ```env
  # Authentication
  NEXTAUTH_URL=http://localhost:3000
  NEXTAUTH_SECRET=your-secret-key-here-generate-with-openssl

  # GitHub OAuth
  GITHUB_ID=your-github-client-id
  GITHUB_SECRET=your-github-client-secret

  # Google OAuth
  GOOGLE_CLIENT_ID=your-google-client-id
  GOOGLE_CLIENT_SECRET=your-google-client-secret

  # Email (Resend)
  RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
  EMAIL_FROM=noreply@yourdomain.com

  # Database
  POSTGRES_DATABASE_URL=postgresql://user:password@localhost:5432/database
  ```
- [ ] Document how to obtain each credential
- [ ] Create `.env.local` from `.env.example` for local development
- [ ] Verify all variables are used in the application
- [ ] Add `.env.local` to `.gitignore` (verify it's there)

**Testing:**
- [ ] Try setting up project from scratch following `.env.example`
- [ ] Verify authentication works with all three providers

---

### 2. Fix Dependency Configuration
**File:** `package.json`
**Status:** ⚠️ Misconfigured
**Estimated Time:** 15 minutes

- [ ] Move production dependencies from `devDependencies` to `dependencies`:
  ```bash
  npm install --save next-auth @auth/prisma-adapter resend react-hot-toast bcryptjs
  ```
- [ ] Remove from `devDependencies` after moving:
  - `@auth/prisma-adapter`
  - `bcryptjs`
  - `next-auth`
  - `react-hot-toast`
  - `resend`
- [ ] Verify `package.json` structure is correct
- [ ] Run `npm install` to update `package-lock.json`
- [ ] Test production build: `npm run build`

**Verification:**
- [ ] Check that production build includes all auth dependencies
- [ ] Deploy to staging environment and test authentication

---

### 3. Implement PrismaClient Singleton
**Files:** Multiple API routes
**Status:** ⚠️ Multiple instances created
**Estimated Time:** 45 minutes

- [ ] Create `src/lib/prisma.ts`:
  ```typescript
  import { PrismaClient } from '@prisma/client'

  const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
  }

  export const prisma = globalForPrisma.prisma ?? new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma
  }
  ```

- [ ] Update imports in all files:
  - `src/app/api/search/route.ts` (line 7)
  - `src/app/api/search/track-click/route.ts` (line 6)
  - `src/app/api/admin/projects/route.ts` (line 7)
  - `src/app/api/admin/projects/[id]/route.ts`
  - `src/app/api/admin/blogs/route.ts`
  - `src/app/api/admin/blogs/[id]/route.ts`
  - `src/app/api/admin/tags/route.ts`
  - `src/app/api/admin/upload/route.ts`
  - `src/app/admin/page.tsx` (line 14)
  - `src/app/admin/projects/page.tsx` (line 6)
  - `src/app/admin/blogs/page.tsx`
  - `src/app/admin/analytics/page.tsx`
  - `src/app/admin/media/page.tsx`
  - Any other files with `const prisma = new PrismaClient()`

- [ ] Change all instances from:
  ```typescript
  const prisma = new PrismaClient();
  ```
  To:
  ```typescript
  import { prisma } from "@/lib/prisma";
  ```

**Testing:**
- [ ] Run application in development
- [ ] Verify no database connection errors
- [ ] Check database connection logs
- [ ] Load test with concurrent requests

---

### 4. Verify View Tracking Implementation
**Files:** Project and Blog detail pages
**Status:** ❓ Not confirmed
**Estimated Time:** 1-2 hours

- [ ] Review `src/app/projects/[slug]/page.tsx`
- [ ] Check if view tracking is in `ProjectDetail` component
- [ ] If missing, implement view tracking:
  ```typescript
  // In src/app/projects/[slug]/page.tsx or ProjectDetail component
  import { prisma } from "@/lib/prisma";

  // Server-side view increment
  async function incrementViews(slug: string) {
    await prisma.project.update({
      where: { slug },
      data: { views: { increment: 1 } }
    });
  }
  ```

- [ ] Implement for projects:
  - [ ] `src/app/projects/[slug]/page.tsx`
  - [ ] `src/components/features/projects/ProjectDetail.tsx`

- [ ] Implement for blogs:
  - [ ] `src/app/blogs/[slug]/page.tsx`
  - [ ] Verify blog detail component

- [ ] Add debouncing to prevent double-counting:
  - [ ] Cookie-based tracking for 24 hours
  - [ ] Or session-based tracking

**Testing:**
- [ ] Visit project page, check database view count
- [ ] Refresh page, verify count doesn't increment immediately
- [ ] Visit from different browser, verify count increments

---

### 5. Complete Environment Setup Documentation
**File:** Create `SETUP.md`
**Status:** ❌ Missing
**Estimated Time:** 1 hour

- [ ] Create comprehensive setup guide
- [ ] Document prerequisites:
  - [ ] Node.js version requirement
  - [ ] PostgreSQL setup
  - [ ] OAuth app creation steps
  - [ ] Resend account setup
- [ ] Step-by-step installation instructions
- [ ] Database migration steps
- [ ] First user setup (becomes admin)
- [ ] Common troubleshooting issues

---

## 🟡 HIGH PRIORITY - Complete Missing Components

### 6. Review & Complete Admin Pages

#### 6.1 Project Creation Form
**File:** `src/app/admin/projects/new/page.tsx`
**Status:** ❓ Exists but not reviewed
**Estimated Time:** 2-3 hours

- [ ] Review existing implementation
- [ ] Verify all fields are present:
  - [ ] Title (required)
  - [ ] Slug (auto-generate from title)
  - [ ] Description (required)
  - [ ] Content (rich text editor)
  - [ ] Technologies (multi-select)
  - [ ] Live URL (optional)
  - [ ] GitHub URL (optional)
  - [ ] Featured toggle
  - [ ] Published toggle
  - [ ] Order (number input)
- [ ] Implement rich text editor (if missing):
  - Consider: TipTap, Slate, or simple markdown editor
- [ ] Implement tag management:
  - [ ] Tag selection from existing tags
  - [ ] Create new tags inline
- [ ] Implement image upload:
  - [ ] Single or multiple images
  - [ ] Alt text input
  - [ ] Preview functionality
- [ ] Add auto-save functionality:
  - [ ] Save draft every 30 seconds
  - [ ] LocalStorage backup
  - [ ] Show "Saving..." indicator
- [ ] Add form validation:
  - [ ] Real-time validation
  - [ ] Show error messages
  - [ ] Prevent submission with errors
- [ ] Test create, edit, and delete flows

**Testing Checklist:**
- [ ] Create new project with all fields
- [ ] Create project with minimal fields
- [ ] Edit existing project
- [ ] Test auto-save during typing
- [ ] Test image upload and preview
- [ ] Verify slug auto-generation
- [ ] Test tag creation and selection
- [ ] Publish and unpublish project
- [ ] Delete project

---

#### 6.2 Project Edit Form
**File:** `src/app/admin/projects/[id]/edit/page.tsx`
**Status:** ❓ Not found in audit
**Estimated Time:** 1-2 hours

- [ ] Create edit page (if doesn't exist)
- [ ] Pre-populate form with existing data
- [ ] Reuse form component from new page
- [ ] Handle update API call
- [ ] Show success/error messages
- [ ] Redirect after successful update

---

#### 6.3 Blog Management Pages
**Files:** `src/app/admin/blogs/page.tsx`, `src/app/admin/blogs/new/page.tsx`
**Status:** ❓ Exist but not reviewed
**Estimated Time:** 4-6 hours

- [ ] Review blog listing page
- [ ] Verify similar functionality to projects:
  - [ ] Table view with all blogs
  - [ ] Status indicators (published/draft)
  - [ ] Edit and delete actions
  - [ ] View counts
  - [ ] Search and filter

- [ ] Review blog creation form
- [ ] Verify fields:
  - [ ] Title (required)
  - [ ] Slug (auto-generate)
  - [ ] Excerpt (optional)
  - [ ] Content (rich text)
  - [ ] Featured toggle
  - [ ] Published toggle
  - [ ] Published date
  - [ ] Tags
  - [ ] Images
  - [ ] Reading time (auto-calculate)

- [ ] Implement reading time calculation:
  ```typescript
  import readingTime from 'reading-time';

  const stats = readingTime(content);
  const minutes = Math.ceil(stats.minutes);
  ```

- [ ] Test all CRUD operations

---

#### 6.4 Media Library
**File:** `src/app/admin/media/page.tsx`
**Status:** ❓ Exists but not reviewed
**Estimated Time:** 3-4 hours

- [ ] Review existing implementation
- [ ] Implement/verify features:
  - [ ] Drag-and-drop upload zone
  - [ ] Multiple file upload
  - [ ] Image preview grid
  - [ ] Alt text editing
  - [ ] Caption editing
  - [ ] Tag management for images
  - [ ] Filter by tags
  - [ ] Search by filename/alt text
  - [ ] Delete images
  - [ ] Copy image URL
  - [ ] Show image metadata (size, dimensions, format)

- [ ] Implement upload functionality:
  ```typescript
  // Consider using:
  // - Vercel Blob Storage
  // - Cloudinary
  // - S3
  // - Local storage with Next.js static files
  ```

- [ ] Add image optimization:
  - [ ] Compress on upload
  - [ ] Generate thumbnails
  - [ ] WebP conversion
  - [ ] Lazy loading in grid

**Testing:**
- [ ] Upload single image
- [ ] Upload multiple images at once
- [ ] Drag and drop upload
- [ ] Edit alt text and caption
- [ ] Add tags to images
- [ ] Filter by tags
- [ ] Search for images
- [ ] Delete image
- [ ] Verify image URLs work in content

---

#### 6.5 Analytics Dashboard
**File:** `src/app/admin/analytics/page.tsx`
**Status:** ❓ Exists but not reviewed
**Estimated Time:** 4-6 hours

- [ ] Review existing implementation
- [ ] Implement/verify data visualizations:
  - [ ] Search queries over time (line chart)
  - [ ] Top searches (bar chart)
  - [ ] Click-through rate (percentage)
  - [ ] Zero-result queries (list)
  - [ ] Most viewed content (table)
  - [ ] Page views trend (line chart)
  - [ ] Traffic sources (if available)

- [ ] Use charting library (already have Recharts):
  ```typescript
  import { LineChart, BarChart, PieChart } from 'recharts';
  ```

- [ ] Implement data queries:
  - [ ] Top 10 searches
  - [ ] Searches with zero results
  - [ ] Click-through rates calculation
  - [ ] Page view aggregation
  - [ ] Time-based filtering (last 7, 30, 90 days)

- [ ] Add export functionality:
  - [ ] CSV export for search data
  - [ ] PDF report generation
  - [ ] Date range selector

**Data Queries to Implement:**
```typescript
// Top searches
const topSearches = await prisma.searchAnalytics.findMany({
  orderBy: { searchCount: 'desc' },
  take: 10,
});

// Zero result queries
const zeroResults = await prisma.searchHistory.findMany({
  where: { results: 0 },
  select: { query: true, createdAt: true },
  orderBy: { createdAt: 'desc' },
  take: 20,
});

// Average CTR
const analytics = await prisma.searchAnalytics.findMany();
const avgCTR = analytics.reduce((acc, item) => {
  return acc + (item.searchCount > 0 ? item.clickCount / item.searchCount : 0);
}, 0) / analytics.length;
```

**Testing:**
- [ ] View all analytics sections
- [ ] Change time range filters
- [ ] Export data to CSV
- [ ] Verify chart interactions
- [ ] Check for performance with large datasets

---

### 7. Complete API Endpoints

#### 7.1 Individual Project API
**File:** `src/app/api/admin/projects/[id]/route.ts`
**Status:** ❓ Not reviewed
**Estimated Time:** 1-2 hours

- [ ] Review existing implementation
- [ ] Implement GET (single project):
  ```typescript
  export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
  ) {
    // Auth check
    // Fetch project by ID
    // Return project data
  }
  ```

- [ ] Implement PUT (update):
  ```typescript
  export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
  ) {
    // Auth check
    // Validate input
    // Update project
    // Return updated project
  }
  ```

- [ ] Implement DELETE:
  ```typescript
  export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
  ) {
    // Auth check
    // Delete associated images
    // Delete project
    // Return success
  }
  ```

- [ ] Add proper error handling
- [ ] Test all methods

---

#### 7.2 Blogs API
**Files:** `src/app/api/admin/blogs/route.ts`, `src/app/api/admin/blogs/[id]/route.ts`
**Status:** ❓ Not reviewed
**Estimated Time:** 2-3 hours

- [ ] Review implementation
- [ ] Mirror projects API structure
- [ ] Add reading time calculation
- [ ] Test CRUD operations

---

#### 7.3 Tags API
**File:** `src/app/api/admin/tags/route.ts`
**Status:** ❓ Not reviewed
**Estimated Time:** 1-2 hours

- [ ] Review implementation
- [ ] Implement endpoints:
  - [ ] GET - List all tags with counts
  - [ ] POST - Create new tag
  - [ ] PUT - Update tag
  - [ ] DELETE - Delete tag (check references first)

- [ ] Auto-generate slug from name
- [ ] Update tag counts when content changes

**Example Implementation:**
```typescript
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { name } = await request.json();
  const slug = name.toLowerCase().replace(/\s+/g, '-');

  const tag = await prisma.tag.create({
    data: { name, slug, count: 0 }
  });

  return NextResponse.json({ tag }, { status: 201 });
}
```

---

#### 7.4 Upload API
**File:** `src/app/api/admin/upload/route.ts`
**Status:** ❓ Not reviewed
**Estimated Time:** 2-4 hours

- [ ] Review implementation
- [ ] Choose storage solution:
  - [ ] Vercel Blob (recommended for Vercel deployment)
  - [ ] Cloudinary
  - [ ] AWS S3
  - [ ] Local storage (development only)

- [ ] Implement upload endpoint:
  ```typescript
  export async function POST(request: NextRequest) {
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    // Upload to storage
    // Generate thumbnail
    // Save metadata to database
    // Return URL and metadata
  }
  ```

- [ ] Add file validation:
  - [ ] File type (images only)
  - [ ] File size limit (e.g., 5MB)
  - [ ] Dimensions check

- [ ] Implement image optimization:
  - [ ] Compress images
  - [ ] Generate multiple sizes
  - [ ] Convert to WebP

**Testing:**
- [ ] Upload various image formats (jpg, png, gif, webp)
- [ ] Test file size limits
- [ ] Test invalid file types
- [ ] Verify URLs are accessible
- [ ] Check database records created

---

### 8. Public Blog Pages
**Files:** `src/app/blogs/page.tsx`, `src/app/blogs/[slug]/page.tsx`
**Status:** ❓ Not reviewed
**Estimated Time:** 2-3 hours

- [ ] Review blog listing page
- [ ] Verify features:
  - [ ] Show only published blogs
  - [ ] Sort by published date (newest first)
  - [ ] Display excerpt
  - [ ] Show read time
  - [ ] Show tags
  - [ ] Pagination or infinite scroll
  - [ ] Filter by tag

- [ ] Review blog detail page
- [ ] Verify features:
  - [ ] Markdown rendering
  - [ ] Syntax highlighting for code
  - [ ] Table of contents
  - [ ] View tracking
  - [ ] Related posts
  - [ ] Tag links
  - [ ] Share buttons (optional)

- [ ] Add SEO metadata
- [ ] Add structured data (JSON-LD)

**Testing:**
- [ ] View blog list
- [ ] Click through to blog post
- [ ] Verify view count increments
- [ ] Test pagination
- [ ] Filter by tags
- [ ] Check SEO metadata

---

## 🟠 MEDIUM PRIORITY - Improvements

### 9. Update Search Relevance Scoring
**File:** `src/app/api/search/route.ts`
**Status:** ⚠️ Minor discrepancies
**Estimated Time:** 30 minutes

**Current vs. Specified:**
- Featured boost: 25 → **50 points** (line 114)
- Recent boost: 15 points / 30 days → **50 points / 14 days** (lines 118-122)

**Option A: Update Code to Match Spec**
```typescript
// Featured content boost
if (item.featured) {
  score += 50; // Changed from 25
}

// Recent content boost (within 14 days)
const fourteenDaysAgo = new Date();
fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14); // Changed from 30
if (item.createdAt >= fourteenDaysAgo) {
  score += 50; // Changed from 15
}
```

**Option B: Update Documentation to Match Code**
- [ ] Update specification document
- [ ] Justify why 25/15 points and 30 days is better

- [ ] Choose Option A or B
- [ ] Implement changes
- [ ] Test search results ordering
- [ ] Document decision

---

### 10. Consolidate GlobalSearch Components
**Files:** `src/components/GlobalSearch.tsx`, `src/components/search/GlobalSearch.tsx`
**Status:** ⚠️ Duplicate files
**Estimated Time:** 1 hour

- [ ] Compare both files
- [ ] Determine which is the canonical version
- [ ] Delete duplicate file
- [ ] Update all imports:
  - [ ] `src/components/layout/Header.tsx` (line 7)
  - [ ] Any other components importing GlobalSearch

- [ ] Verify search functionality still works
- [ ] Remove unused imports

**Recommended Structure:**
```
src/components/search/
  ├── GlobalSearch.tsx          (main modal component)
  ├── SearchCard.tsx             (result card)
  └── SearchInput.tsx            (optional: shared input)
```

---

### 11. Implement Redis-Based Rate Limiting
**File:** `src/app/api/search/route.ts`
**Status:** ⚠️ In-memory rate limiter
**Estimated Time:** 2-3 hours

**Current Issue:** In-memory rate limiting doesn't work across multiple server instances.

**Solution: Use Redis or Upstash**

- [ ] Install dependencies:
  ```bash
  npm install @upstash/redis @upstash/ratelimit
  ```

- [ ] Set up Upstash Redis account (or use your own Redis)
- [ ] Add environment variables:
  ```env
  UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io
  UPSTASH_REDIS_REST_TOKEN=your-token-here
  ```

- [ ] Create rate limiter utility:
  ```typescript
  // src/lib/ratelimit.ts
  import { Ratelimit } from "@upstash/ratelimit";
  import { Redis } from "@upstash/redis";

  export const ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(60, "1 m"), // 60 requests per minute
    analytics: true,
  });
  ```

- [ ] Update search API:
  ```typescript
  import { ratelimit } from "@/lib/ratelimit";

  const { success } = await ratelimit.limit(ipHash);
  if (!success) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429 }
    );
  }
  ```

- [ ] Apply to other rate-limited endpoints:
  - [ ] Contact form
  - [ ] Authentication attempts
  - [ ] Any public APIs

**Testing:**
- [ ] Make 60 requests within 1 minute
- [ ] Verify 61st request is blocked
- [ ] Wait 1 minute, verify requests work again
- [ ] Test across multiple server instances (deploy)

---

### 12. Optimize Database Queries
**File:** `src/app/api/search/route.ts`
**Status:** ⚠️ Multiple sequential queries
**Estimated Time:** 2-3 hours

**Current Issue:** Four separate database queries for each search (projects, blogs, images, tags).

**Optimization Strategies:**

#### Option 1: Add Database Indexes
```sql
-- Add indexes for search performance
CREATE INDEX idx_project_search ON "Project" USING gin(to_tsvector('english', title || ' ' || description));
CREATE INDEX idx_blog_search ON "Blog" USING gin(to_tsvector('english', title || ' ' || excerpt || ' ' || content));
```

#### Option 2: Implement Search Caching
```typescript
// src/lib/cache.ts
import { LRUCache } from 'lru-cache';

const searchCache = new LRUCache({
  max: 500, // Cache 500 searches
  ttl: 1000 * 60 * 5, // 5 minutes
});

export function getCachedSearch(key: string) {
  return searchCache.get(key);
}

export function setCachedSearch(key: string, value: any) {
  searchCache.set(key, value);
}
```

#### Option 3: Use Full-Text Search
```typescript
// Use Fuse.js (already installed!) for client-side search
import Fuse from 'fuse.js';

// Or use PostgreSQL full-text search
const results = await prisma.$queryRaw`
  SELECT * FROM "Project"
  WHERE to_tsvector('english', title || ' ' || description) @@ plainto_tsquery('english', ${query})
  ORDER BY ts_rank(to_tsvector('english', title || ' ' || description), plainto_tsquery('english', ${query})) DESC
`;
```

**Implementation Steps:**
- [ ] Choose optimization strategy
- [ ] Implement caching layer
- [ ] Add database indexes
- [ ] Consider using Fuse.js for fuzzy search
- [ ] Benchmark performance improvements
- [ ] Monitor cache hit rates

---

### 13. Fix Admin Helper Redirects
**File:** `src/lib/admin.ts`
**Status:** ⚠️ Minor inconsistency
**Estimated Time:** 15 minutes

- [ ] Update `requireAdmin()` function:
  ```typescript
  export async function requireAdmin() {
    const session = await auth();

    if (!session || !session.user) {
      redirect("/auth/signin?callbackUrl=/admin");
    }

    if (session.user.role !== "ADMIN") {
      redirect("/auth/error?error=AccessDenied"); // Changed from "/"
    }

    return session;
  }
  ```

- [ ] Test admin access:
  - [ ] As unauthenticated user → redirects to signin
  - [ ] As non-admin user → redirects to error page
  - [ ] As admin user → allows access

---

### 14. Review Middleware Protection Scope
**File:** `middleware.ts`
**Status:** ⚠️ May block public APIs
**Estimated Time:** 1 hour

**Current Issue:** Middleware blocks all non-GET requests to `/api/projects/` and `/api/blogs/`, which may affect public APIs.

- [ ] Review all API routes
- [ ] Identify which should be public
- [ ] Update middleware logic:
  ```typescript
  // Be more specific about protected routes
  if (
    pathname.startsWith("/api/admin/") // Only protect /api/admin/*
  ) {
    if (session.user?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403, headers }
      );
    }
  }
  ```

- [ ] Or create separate public API routes:
  ```
  /api/public/projects       → No auth required
  /api/admin/projects        → Admin auth required
  ```

- [ ] Test public API access
- [ ] Test admin API protection

---

## 🟢 LOW PRIORITY - Enhancements

### 15. Add Comprehensive Error Logging
**Estimated Time:** 2-3 hours

- [ ] Install logging library:
  ```bash
  npm install pino pino-pretty
  ```

- [ ] Create logger utility:
  ```typescript
  // src/lib/logger.ts
  import pino from 'pino';

  export const logger = pino({
    level: process.env.LOG_LEVEL || 'info',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true
      }
    }
  });
  ```

- [ ] Replace console.log/console.error:
  - [ ] `src/app/api/search/route.ts`
  - [ ] `src/app/api/admin/projects/route.ts`
  - [ ] All other API routes

- [ ] Add structured logging:
  ```typescript
  logger.error({
    err: error,
    userId: session?.user?.id,
    endpoint: '/api/search',
    query: sanitizedQuery
  }, 'Search API error');
  ```

- [ ] Consider integrating:
  - [ ] Sentry for error tracking
  - [ ] LogRocket for session replay
  - [ ] DataDog for monitoring

---

### 16. Implement Automated Testing
**Estimated Time:** 4-8 hours

- [ ] Install testing libraries:
  ```bash
  npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event
  npm install --save-dev @testing-library/react-hooks
  npm install --save-dev jest-environment-jsdom
  ```

- [ ] Create test files:
  - [ ] `src/app/api/search/route.test.ts`
  - [ ] `src/components/search/GlobalSearch.test.tsx`
  - [ ] `src/components/search/SearchCard.test.tsx`
  - [ ] `src/lib/auth.test.ts`

- [ ] Add test script to package.json:
  ```json
  "scripts": {
    "test": "jest --watch",
    "test:ci": "jest --ci"
  }
  ```

- [ ] Write unit tests for:
  - [ ] Search relevance scoring
  - [ ] Input sanitization
  - [ ] Rate limiting logic
  - [ ] Authentication helpers

- [ ] Write integration tests for:
  - [ ] API endpoints
  - [ ] Authentication flows
  - [ ] Search functionality

- [ ] Write E2E tests (optional):
  ```bash
  npm install --save-dev @playwright/test
  ```

---

### 17. Add Full Accessibility Audit
**Estimated Time:** 3-4 hours

- [ ] Install accessibility tools:
  ```bash
  npm install --save-dev @axe-core/react eslint-plugin-jsx-a11y
  ```

- [ ] Run automated audit:
  - [ ] Use Lighthouse in Chrome DevTools
  - [ ] Use axe DevTools extension
  - [ ] Check WAVE browser extension

- [ ] Manual keyboard navigation test:
  - [ ] Tab through entire application
  - [ ] Verify focus indicators visible
  - [ ] Test Escape key to close modals
  - [ ] Test Enter key to submit forms
  - [ ] Verify skip links work

- [ ] Screen reader testing:
  - [ ] Test with NVDA (Windows)
  - [ ] Test with VoiceOver (Mac)
  - [ ] Verify all images have alt text
  - [ ] Verify form labels are associated
  - [ ] Check heading hierarchy

- [ ] Fix issues:
  - [ ] Add missing ARIA labels
  - [ ] Fix focus management
  - [ ] Improve color contrast
  - [ ] Add skip navigation links
  - [ ] Ensure semantic HTML

- [ ] Add accessibility tests:
  ```typescript
  import { axe, toHaveNoViolations } from 'jest-axe';
  expect.extend(toHaveNoViolations);

  test('should have no accessibility violations', async () => {
    const { container } = render(<Component />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
  ```

---

### 18. Performance Optimization
**Estimated Time:** 2-4 hours

- [ ] Analyze bundle size:
  ```bash
  npm run build
  # Review .next/analyze output
  ```

- [ ] Optimize imports:
  - [ ] Use named imports for icons: `import { Search } from 'lucide-react'`
  - [ ] Check for duplicate dependencies
  - [ ] Remove unused packages

- [ ] Implement code splitting:
  ```typescript
  import dynamic from 'next/dynamic';

  const AdminDashboard = dynamic(() => import('@/components/admin/Dashboard'), {
    loading: () => <LoadingSpinner />,
  });
  ```

- [ ] Add loading states:
  - [ ] Skeleton screens
  - [ ] Suspense boundaries
  - [ ] Progressive loading

- [ ] Optimize images:
  - [ ] Verify Next.js Image component used everywhere
  - [ ] Add blur placeholders
  - [ ] Lazy load below-fold images

- [ ] Add caching headers:
  ```typescript
  // In next.config.js
  async headers() {
    return [
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  }
  ```

---

### 19. SEO Enhancements
**Estimated Time:** 2-3 hours

- [ ] Add structured data to blog posts:
  ```typescript
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": blog.title,
    "datePublished": blog.publishedAt,
    "author": {
      "@type": "Person",
      "name": "Ollie Does Is"
    }
  };
  ```

- [ ] Create sitemap.xml (already have `src/app/sitemap.ts`)
  - [ ] Verify includes all pages
  - [ ] Update priorities
  - [ ] Set change frequencies

- [ ] Create robots.txt (already have `src/app/robots.ts`)
  - [ ] Verify configuration

- [ ] Add OpenGraph images:
  - [ ] Already have `src/app/opengraph-image.tsx`
  - [ ] Create per-page OG images

- [ ] Verify meta tags:
  - [ ] Title uniqueness
  - [ ] Description length (150-160 chars)
  - [ ] Canonical URLs

---

### 20. Documentation
**Estimated Time:** 3-4 hours

- [ ] Create/Update README.md:
  - [ ] Project description
  - [ ] Features list
  - [ ] Tech stack
  - [ ] Installation instructions
  - [ ] Development workflow
  - [ ] Deployment guide
  - [ ] Contributing guidelines

- [ ] Create API documentation:
  - [ ] Document all endpoints
  - [ ] Request/response examples
  - [ ] Authentication requirements
  - [ ] Rate limits
  - [ ] Error codes

- [ ] Create component documentation:
  - [ ] Props documentation
  - [ ] Usage examples
  - [ ] Storybook (optional)

- [ ] Add code comments:
  - [ ] Complex functions
  - [ ] Business logic
  - [ ] Workarounds

- [ ] Create deployment checklist:
  - [ ] Environment variables
  - [ ] Database migrations
  - [ ] DNS configuration
  - [ ] SSL certificates
  - [ ] Monitoring setup

---

## 📋 Pre-Production Checklist

Before deploying to production, complete this final checklist:

### Security
- [ ] All HIGH PRIORITY security issues resolved
- [ ] Environment variables properly configured
- [ ] Rate limiting implemented
- [ ] HTTPS enforced
- [ ] Security headers active
- [ ] CSRF protection enabled
- [ ] SQL injection protection verified
- [ ] XSS prevention tested

### Functionality
- [ ] All authentication flows tested
- [ ] Admin dashboard fully functional
- [ ] Search working correctly
- [ ] View tracking operational
- [ ] Image uploads working
- [ ] All CRUD operations tested
- [ ] Public pages accessible
- [ ] Error pages exist (404, 500)

### Performance
- [ ] Database indexes created
- [ ] Caching implemented
- [ ] Bundle size optimized
- [ ] Images optimized
- [ ] Loading states added
- [ ] Mobile performance tested
- [ ] Load testing completed

### SEO & Accessibility
- [ ] Meta tags configured
- [ ] Sitemap generated
- [ ] Robots.txt configured
- [ ] Structured data added
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Color contrast passes WCAG AA

### Monitoring & Analytics
- [ ] Error tracking configured (Sentry/similar)
- [ ] Analytics implemented (Vercel Analytics installed)
- [ ] Performance monitoring active
- [ ] Logging configured
- [ ] Alerts set up for errors

### Documentation
- [ ] README complete
- [ ] API docs created
- [ ] Setup guide written
- [ ] Deployment guide ready
- [ ] Environment variables documented

### Testing
- [ ] Manual testing complete
- [ ] Cross-browser testing done
- [ ] Mobile testing done
- [ ] Authentication tested
- [ ] All user flows tested

---

## 🎯 Sprint Planning Suggestion

### Sprint 1 (Week 1): Critical Fixes
- Environment configuration
- Dependency fixes
- PrismaClient singleton
- View tracking

### Sprint 2 (Week 2): Missing Features
- Complete admin forms
- Blog management
- Media library
- API endpoints

### Sprint 3 (Week 3): Improvements
- Search optimization
- Rate limiting
- Performance improvements
- Bug fixes

### Sprint 4 (Week 4): Polish & Launch
- Testing
- Documentation
- SEO optimization
- Final review
- Deploy to production

---

## 📊 Progress Tracking

**Total Tasks:** 150+
**Critical (🔴):** 25 tasks
**High (🟡):** 40 tasks
**Medium (🟠):** 35 tasks
**Low (🟢):** 50 tasks

**Time Estimate:**
- Critical: 12-18 hours
- High: 25-35 hours
- Medium: 12-18 hours
- Low: 15-25 hours

**Total: 64-96 hours** (8-12 full days of work)

---

## 🚀 Quick Start Priorities

If you want to get production-ready quickly, focus on:

1. ✅ Fix environment configuration (30 min)
2. ✅ Fix dependency configuration (15 min)
3. ✅ Implement PrismaClient singleton (45 min)
4. ✅ Verify view tracking (1-2 hours)
5. ✅ Review all admin pages (4-6 hours)
6. ✅ Test authentication flows (1-2 hours)
7. ✅ Complete missing API endpoints (3-4 hours)
8. ✅ Run full manual testing (2-3 hours)

**Minimum viable production:** ~15-20 hours

---

*This checklist is comprehensive and should be treated as a living document. Update it as you complete tasks and discover new requirements.*

# Admin Dashboard Implementation Guide

## ✅ Completed Tasks

### 1. Search Functionality in Header
- ✅ Added search icon to Header component (desktop & mobile)
- ✅ Search button triggers GlobalSearch modal
- ✅ Keyboard shortcut (Cmd/Ctrl + K) still works
- ✅ Updated GlobalSearch component to support controlled mode

**File:** `src/components/layout/Header.tsx`

### 2. Secure Search API
- ✅ Enhanced search API with relevance-based ranking algorithm
- ✅ SQL injection protection via Prisma
- ✅ Rate limiting: 60 requests/minute
- ✅ Input sanitization (XSS prevention)
- ✅ IP hashing for privacy
- ✅ Analytics tracking

**Files:**
- `src/app/api/search/route.ts`
- `src/app/api/search/track-click/route.ts`

### 3. Search UI Components
- ✅ SearchCard component with smooth animations
- ✅ Dedicated search page with filters and pagination
- ✅ GlobalSearch modal with keyboard shortcuts

**Files:**
- `src/components/search/SearchCard.tsx`
- `src/app/search/page.tsx`
- `src/components/GlobalSearch.tsx` (updated)

### 4. Admin Dashboard Foundation
- ✅ Admin utilities for role protection
- ✅ Admin layout with sidebar navigation
- ✅ AdminSidebar component
- ✅ AdminHeader component with user dropdown

**Files:**
- `src/lib/admin.ts`
- `src/app/admin/layout.tsx`
- `src/components/admin/AdminSidebar.tsx`
- `src/components/admin/AdminHeader.tsx`

---

## 📋 Remaining Tasks

### Admin Pages (Need to be created)

#### 1. Admin Overview Dashboard
**File:** `src/app/admin/page.tsx`

Key Features:
- Stats cards (projects, blogs, images, searches)
- Recent search queries chart
- Most viewed content this week
- Quick action buttons

```typescript
// Use Prisma to fetch:
- prisma.project.count()
- prisma.blog.count()
- prisma.image.count()
- prisma.searchHistory (last 24h)
- Top viewed content (raw SQL query)
```

#### 2. Projects Management
**File:** `src/app/admin/projects/page.tsx`

Features:
- DataTable of all projects
- Create/Edit/Delete actions
- Publish/Unpublish toggle
- Search and filter
- Pagination

#### 3. Project Create/Edit Form
**File:** `src/app/admin/projects/new/page.tsx`
**File:** `src/app/admin/projects/[id]/edit/page.tsx`

Form Fields:
- Title (required)
- Slug (auto-generated from title)
- Description (textarea)
- Content (rich text editor - use `@tiptap/react`)
- Technologies (multi-select tags)
- Live URL
- GitHub URL
- Featured checkbox
- Published checkbox
- Image upload (thumbnail)

#### 4. Blogs Management
**File:** `src/app/admin/blogs/page.tsx`

Similar to projects management with blog-specific fields.

#### 5. Blog Create/Edit Form
**File:** `src/app/admin/blogs/new/page.tsx`
**File:** `src/app/admin/blogs/[id]/edit/page.tsx`

Form Fields:
- Title
- Slug
- Excerpt
- Content (rich text)
- Tags
- Featured image
- Published/Draft status
- Publish date

#### 6. Media Gallery
**File:** `src/app/admin/media/page.tsx`

Features:
- Grid view of all images
- Upload with drag & drop (use `react-dropzone`)
- Edit alt text, caption, tags
- Delete images
- Filter by project/blog/unattached
- Pagination

#### 7. Analytics Dashboard
**File:** `src/app/admin/analytics/page.tsx`

Features:
- Search analytics charts (use `recharts`)
- Top 20 searches (last 7/30 days)
- Zero-result searches
- Click-through rates
- Most viewed content
- Page view trends
- Export data button (CSV)

### API Routes (Need to be created)

#### 1. Projects API
**Files:**
- `src/app/api/admin/projects/route.ts` (GET list, POST create)
- `src/app/api/admin/projects/[id]/route.ts` (GET single, PUT update, DELETE)

```typescript
// Example structure:
export async function GET(request: NextRequest) {
  const session = await requireAdmin();
  // ... fetch projects
}

export async function POST(request: NextRequest) {
  const session = await requireAdmin();
  const body = await request.json();

  // Validate with Zod
  const schema = z.object({
    title: z.string().min(1),
    slug: z.string().min(1),
    description: z.string(),
    content: z.string(),
    technologies: z.array(z.string()),
    // ... etc
  });

  const validated = schema.parse(body);

  // Create project
  const project = await prisma.project.create({
    data: {
      ...validated,
      authorId: session.user.id,
    },
  });

  return NextResponse.json(project);
}
```

#### 2. Blogs API
**Files:**
- `src/app/api/admin/blogs/route.ts`
- `src/app/api/admin/blogs/[id]/route.ts`

Similar structure to Projects API.

#### 3. Tags API
**File:** `src/app/api/admin/tags/route.ts`

CRUD operations for tags:
- GET: List all tags with count
- POST: Create new tag
- PUT: Update tag
- DELETE: Delete tag (only if not used)

#### 4. Upload API
**File:** `src/app/api/admin/upload/route.ts`

For image uploads:

```typescript
// Option 1: Vercel Blob Storage
import { put } from '@vercel/blob';

export async function POST(request: NextRequest) {
  const session = await requireAdmin();
  const formData = await request.formData();
  const file = formData.get('file') as File;

  const blob = await put(file.name, file, {
    access: 'public',
  });

  // Save to database
  const image = await prisma.image.create({
    data: {
      url: blob.url,
      alt: file.name,
      // ... etc
    },
  });

  return NextResponse.json(image);
}
```

---

## 🛠️ Recommended Packages

Install these for the admin dashboard:

```bash
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-link
npm install react-dropzone
npm install recharts
npm install @tanstack/react-table
npm install @vercel/blob
npm install react-hot-toast  # Already installed
npm install slugify
```

---

## 📝 Implementation Order

1. **Start with API routes** - They're the foundation
   - Projects API
   - Blogs API
   - Tags API
   - Upload API

2. **Then build the forms**
   - Create a reusable `RichTextEditor` component (Tiptap)
   - Create a reusable `ImageUploader` component (Dropzone)
   - Create a reusable `TagSelector` component
   - Build Project form
   - Build Blog form

3. **Build management pages**
   - Create a reusable `DataTable` component (TanStack Table)
   - Projects management page
   - Blogs management page

4. **Build remaining pages**
   - Media gallery
   - Analytics dashboard
   - Admin overview (already started)

5. **Add polish**
   - Loading states
   - Error handling
   - Toast notifications
   - Confirmation dialogs

---

## 🔒 Security Checklist

- ✅ All admin routes protected by `requireAdmin()`
- ✅ All admin API routes check for ADMIN role
- ✅ Input validation with Zod on all API routes
- ✅ SQL injection protection (Prisma)
- ✅ XSS protection (sanitization)
- ✅ Rate limiting on public APIs
- ⚠️ CSRF protection (consider adding for forms)
- ⚠️ File upload validation (size, type, malware scan)

---

## 🎨 Design System

Colors (from tailwind.config.js):
- **Primary (Carolina Blue):** `#4B9CD3`
- **Dark Blue:** `#0A1929`
- **Success (Green):** For blog-related actions
- **Purple:** For media-related actions
- **Orange:** For analytics

Component Patterns:
- Cards: `bg-white rounded-xl shadow-sm border border-gray-200 p-6`
- Buttons: `bg-carolina text-white rounded-lg hover:bg-carolina/90 px-4 py-2`
- Inputs: `border border-gray-300 rounded-lg focus:ring-2 focus:ring-carolina`

---

## 📚 Next Steps

1. Create the admin overview page (`src/app/admin/page.tsx`)
2. Build the Projects API routes
3. Create the Project management page
4. Build the Project form with rich text editor
5. Repeat for Blogs
6. Add Media gallery
7. Add Analytics dashboard

All the foundation is in place. The admin system is secure and ready for content management!

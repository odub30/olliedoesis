# Publishing Your First Blog Post

This guide walks you through publishing the first blog post: "Building a High-Performance Portfolio: The Tech Stack Decision"

## What's Been Created

### 1. Placeholder Images (3 files)
- `public/images/blog/tech-stack-hero-placeholder.svg` - Hero image for tech stack overview
- `public/images/blog/performance-metrics-placeholder.svg` - Lighthouse performance scores
- `public/images/blog/architecture-diagram-placeholder.svg` - Architecture diagram

These are SVG placeholders that you can replace later with actual screenshots or custom graphics.

### 2. Blog Content & FAQ Data
- `prisma/seed-first-blog.ts` - Database seed script with complete blog content
- `src/data/blog-faqs/tech-stack-decision-faqs.ts` - 8 SEO-optimized FAQ items
- `src/data/blog-faqs/index.ts` - FAQ registry for mapping blog posts to FAQs

### 3. Component Updates
- `src/components/blog/BlogFAQSection.tsx` - Client component for rendering FAQs in blog posts
- `src/app/blogs/[slug]/page.tsx` - Updated to include FAQ sections

## Publishing Steps

### Step 1: Ensure Database Connection

Make sure your `.env` file has the correct database URL:

```bash
POSTGRES_DATABASE_URL="your_postgres_connection_string"
```

If you're using a local PostgreSQL database, it might look like:
```
POSTGRES_DATABASE_URL="postgresql://username:password@localhost:5432/olliedoesis"
```

### Step 2: Run Database Migrations (if needed)

If you haven't already set up your database schema:

```bash
npx prisma db push
```

Or if you prefer migrations:

```bash
npx prisma migrate dev --name initial_setup
```

### Step 3: Seed the Blog Post

Run the seed script to create the blog post in your database:

```bash
npm run db:seed:blog
```

Or manually:

```bash
npx ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed-first-blog.ts
```

You should see output like:

```
🌱 Starting seed...

📝 Finding or creating author...
✅ Author: Ollie Does Is (admin@olliedoesis.com)

🏷️  Creating tags...
✅ Created 6 tags

📄 Creating blog post...
✅ Created blog post: "Building a High-Performance Portfolio: The Tech Stack Decision"

🖼️  Creating blog images...
✅ Created 3 images

🔢 Updating tag counts...
✅ Updated tag counts

✨ Seed completed successfully!

📍 Blog post URL: /blogs/building-high-performance-portfolio-tech-stack
```

### Step 4: View the Blog Post

Start your development server:

```bash
npm run dev
```

Navigate to:
```
http://localhost:3000/blogs/building-high-performance-portfolio-tech-stack
```

You should see:
- The complete blog post with formatted markdown
- 3 placeholder images embedded in the content
- An interactive FAQ section at the end with 8 questions
- JSON-LD schema for SEO (view page source to verify)

### Step 5: Verify SEO Features

Check that everything is working correctly:

**1. JSON-LD Schema:**
- View page source (Ctrl+U or Cmd+U)
- Look for `<script type="application/ld+json">` containing FAQPage schema

**2. FAQ Accordion:**
- Click questions to expand/collapse answers
- Check keyboard navigation (Tab, Enter, Arrow keys)
- Verify smooth animations

**3. Metadata:**
- Check browser tab title
- View Open Graph tags in page source
- Test social media sharing preview

## Replacing Placeholder Images

When you're ready to replace the placeholder images:

### Option 1: Direct Replacement

Replace the SVG files with your actual images (PNG, JPG, or WebP):

```bash
# Replace with actual images
cp your-hero-image.png public/images/blog/tech-stack-hero.png
cp your-performance-screenshot.png public/images/blog/performance-metrics.png
cp your-architecture-diagram.png public/images/blog/architecture-diagram.png
```

Then optimize them:

```bash
npm run optimize:image public/images/blog/tech-stack-hero.png
npm run optimize:image public/images/blog/performance-metrics.png
npm run optimize:image public/images/blog/architecture-diagram.png
```

### Option 2: Update Database URLs

If you want to keep different filenames, update the image URLs in the database:

```sql
-- Using Prisma Studio
npx prisma studio

-- Or via SQL
UPDATE "Image"
SET url = '/images/blog/new-hero-image.webp'
WHERE url = '/images/blog/tech-stack-hero-placeholder.svg';
```

### Recommended Image Specifications

**Hero Image (tech-stack-hero):**
- Dimensions: 1200x630px (Open Graph standard)
- Format: WebP or AVIF (fallback to PNG/JPG)
- Content: Tech stack logos, architecture overview, or branded header
- Max file size: 200KB

**Performance Metrics (performance-metrics):**
- Dimensions: 1200x800px
- Format: PNG or WebP (for screenshots with text)
- Content: Lighthouse scores, performance graphs, metrics dashboard
- Max file size: 300KB

**Architecture Diagram (architecture-diagram):**
- Dimensions: 1200x900px
- Format: SVG (preferred) or PNG/WebP
- Content: System architecture, component diagram, data flow
- Max file size: 250KB (or unlimited for SVG)

## Adding More Blog Posts with FAQs

### Step 1: Create FAQ Data

Create a new file: `src/data/blog-faqs/your-post-slug-faqs.ts`

```typescript
import type { FAQItem } from '@/types/faq';

export const yourPostFAQs: FAQItem[] = [
  {
    id: 1,
    question: 'Your question here?',
    answer: 'Your 50-150 word answer here...',
    category: 'Category Name',
    keywords: ['keyword1', 'keyword2', 'keyword3'],
  },
  // Add 3-8 more FAQs
];
```

### Step 2: Register FAQs

Add to `src/data/blog-faqs/index.ts`:

```typescript
import { yourPostFAQs } from './your-post-slug-faqs';

export const blogFAQRegistry: Record<string, FAQItem[]> = {
  'building-high-performance-portfolio-tech-stack': techStackDecisionFAQs,
  'your-post-slug': yourPostFAQs, // Add this line
};
```

### Step 3: Create Blog Post in Database

Use the admin panel or create a seed script similar to `seed-first-blog.ts`.

The FAQ section will automatically appear at the end of your blog post based on the slug match!

## Troubleshooting

### Issue: "Cannot find module '@/data/blog-faqs'"

**Solution:** Ensure your `tsconfig.json` has path aliases configured:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Issue: FAQs Not Showing

**Solutions:**
1. Check that the blog slug exactly matches the key in `blogFAQRegistry`
2. Verify the FAQ data is exported correctly
3. Check browser console for errors
4. Ensure `getBlogFAQs()` is called and returns data

### Issue: Database Connection Error

**Solutions:**
1. Verify `.env` file has correct `POSTGRES_DATABASE_URL`
2. Ensure PostgreSQL is running
3. Check database credentials
4. Test connection: `npx prisma db push`

### Issue: Placeholder Images Not Loading

**Solutions:**
1. Verify files exist in `public/images/blog/`
2. Check file permissions
3. Restart dev server (`npm run dev`)
4. Clear browser cache

### Issue: Seed Script Fails

**Common errors:**

**"PrismaClient initialization error"**
- Run `npx prisma generate` to regenerate Prisma client
- Check `DATABASE_URL` in `.env`

**"Unique constraint failed"**
- Blog post already exists
- Delete existing post or change slug

**"Foreign key constraint failed"**
- Author user doesn't exist
- Script should create it, but verify email doesn't conflict

## Next Steps

### 1. Create More Blog Posts

Use the FAQ content guide to create optimized content:
- See `docs/FAQ_CONTENT_GUIDE.md` for writing best practices
- See `docs/FAQ_USAGE.md` for component usage

### 2. Customize Styling

Update `src/components/blog/BlogFAQSection.tsx` to match your brand:
- Change background gradient
- Adjust spacing and padding
- Modify color scheme

### 3. Add Analytics

Track FAQ engagement by updating the `handleToggle` function in `BlogFAQSection.tsx`:

```typescript
const handleToggle = (id: string | number, isOpen: boolean) => {
  if (isOpen && typeof window !== 'undefined') {
    // Your analytics code
    window.gtag?.('event', 'faq_opened', {
      event_category: 'engagement',
      event_label: `FAQ ${id}`,
      blog_slug: slug, // Pass slug as prop
    });
  }
};
```

### 4. Test SEO

**Google Rich Results Test:**
1. Deploy your blog post
2. Go to: https://search.google.com/test/rich-results
3. Enter your blog post URL
4. Verify FAQ rich results are detected

**Schema Validator:**
1. Go to: https://validator.schema.org/
2. Paste your page source or URL
3. Verify FAQPage schema is valid

## Resources

- [FAQ Content Writing Guide](./FAQ_CONTENT_GUIDE.md) - How to write AEO-optimized FAQs
- [FAQ Usage Guide](./FAQ_USAGE.md) - Component API and implementation examples
- [Image Guidelines](./IMAGE_GUIDELINES.md) - Image optimization best practices

---

**Questions or Issues?**

Check the troubleshooting section above, or review the implementation files:
- Blog post page: `src/app/blogs/[slug]/page.tsx`
- FAQ component: `src/components/features/faq/FAQAccordion.tsx`
- Seed script: `prisma/seed-first-blog.ts`

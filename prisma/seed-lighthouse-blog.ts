import * as dotenv from "dotenv"
import { PrismaClient } from "@prisma/client"

// Load environment variables
dotenv.config({ path: ".env.local" })

const prisma = new PrismaClient()

async function main() {
  console.log("🚀 Starting blog seed...")

  // First, get or create an admin user
  let user = await prisma.user.findFirst({
    where: { role: "ADMIN" },
  })

  if (!user) {
    console.log("⚠️  No admin user found. Creating one...")
    user = await prisma.user.create({
      data: {
        name: "Ollie Does Is",
        email: "admin@olliedoesis.dev",
        role: "ADMIN",
      },
    })
    console.log("✅ Admin user created")
  }

  console.log(`👤 Using user: ${user.name} (${user.email})`)

  // Create or get tags
  const tagNames = [
    "Performance",
    "Lighthouse",
    "Web Development",
    "Optimization",
    "Core Web Vitals",
    "Image Optimization",
    "JavaScript",
    "Next.js",
    "SEO",
    "Web Performance",
  ]

  const tags = []
  for (const tagName of tagNames) {
    const slug = tagName.toLowerCase().replace(/\s+/g, "-")

    // Try to find existing tag by slug or name
    let tag = await prisma.tag.findFirst({
      where: {
        OR: [{ slug }, { name: tagName }],
      },
    })

    if (!tag) {
      // Only create if doesn't exist
      tag = await prisma.tag.create({
        data: {
          name: tagName,
          slug,
          count: 0,
        },
      })
    }

    tags.push(tag)
  }

  console.log(`✅ Created/found ${tags.length} tags`)

  // Create the blog post
  const blogContent = `
# Achieving 100/100 Lighthouse Scores: A Complete Performance Optimization Guide

This comprehensive guide walks you through achieving perfect Lighthouse scores through systematic optimization of images, JavaScript, CSS, and Core Web Vitals.

## What You'll Learn

- **Image Optimization**: Reduce image weight by 83% using modern formats (AVIF/WebP), lazy loading, and responsive images
- **JavaScript Bundle Optimization**: Achieve 74% reduction through code splitting, tree shaking, and minification
- **Core Web Vitals**: Optimize FCP, LCP, TBT, and CLS to pass all thresholds
- **Performance Budgets**: Set and monitor resource budgets to maintain optimal performance

## Key Results

Starting from baseline scores of 55/88/92/95, we achieved perfect 100/100/100/100 scores across all Lighthouse categories:

- **Performance**: 100 (+45 points)
- **Accessibility**: 100 (+12 points)
- **Best Practices**: 100 (+8 points)
- **SEO**: 100 (+5 points)

## Image Optimization Strategy

Reduced total image weight from 12.5 MB to 2.1 MB (83% reduction):

- Converted all images to WebP/AVIF formats
- Implemented lazy loading for off-screen images
- Used responsive images with proper srcset
- Applied lossless and lossy compression

**Impact**: LCP improved from 4.2s to 1.2s (71% improvement)

## JavaScript Bundle Optimization

Achieved 74% reduction in JavaScript bundle size:

- **Code Splitting**: Split bundles by route and component (850 KB → 245 KB, 71% reduction)
- **Tree Shaking**: Removed unused code (650 KB → 420 KB, 35% reduction)
- **Minification**: Compressed bundles (420 KB → 180 KB, 57% reduction)
- **Third-Party Scripts**: Optimized external dependencies (320 KB → 95 KB, 70% reduction)

**Impact**:
- FCP improved from 2.4s to 0.8s (67% improvement)
- TBT improved from 380ms to 50ms (87% improvement)

## Core Web Vitals Optimization

All Core Web Vitals now pass Google's thresholds:

- **First Contentful Paint**: 0.8s (target: < 1.8s) ✓
- **Largest Contentful Paint**: 1.2s (target: < 2.5s) ✓
- **Total Blocking Time**: 50ms (target: < 300ms) ✓
- **Cumulative Layout Shift**: 0.02 (target: < 0.1) ✓
- **Speed Index**: 1.5s (target: < 3.4s) ✓

## Performance Budgets

Set strict budgets to maintain performance:

- JavaScript: 180 KB / 300 KB (60% usage) ✓
- CSS: 32 KB / 50 KB (64% usage) ✓
- Images: 245 KB / 500 KB (49% usage) ✓
- Fonts: 45 KB / 100 KB (45% usage) ✓
- Total Page Weight: 502 KB / 1000 KB (50% usage) ✓
- Request Count: 28 / 50 requests (56% usage) ✓

## Implementation Tips

1. **Use Next.js Image Component**: Automatic format detection, lazy loading, and responsive images
2. **Dynamic Imports**: Split code at route and component boundaries
3. **Webpack Bundle Analyzer**: Monitor bundle size regularly
4. **Lighthouse CI**: Automate performance testing in your CI/CD pipeline
5. **Performance Budgets**: Fail builds when budgets are exceeded

## Tools Used

- **Next.js 15**: For automatic optimizations and code splitting
- **Sharp**: Server-side image optimization
- **Webpack Bundle Analyzer**: Bundle size monitoring
- **Lighthouse CI**: Automated performance testing
- **Chrome DevTools**: Performance profiling

## Results Summary

Through systematic optimization, we achieved:

- **+70 points** improvement across all Lighthouse categories
- **83% reduction** in image weight
- **74% reduction** in JavaScript bundle size
- **Perfect 100/100** scores across Performance, Accessibility, Best Practices, and SEO

Visit the full blog post to see detailed charts, comparisons, and implementation guides for each optimization technique.
`

  const excerpt = "Learn how to achieve perfect 100/100 Lighthouse scores through systematic optimization of images, JavaScript, CSS, and Core Web Vitals. Includes charts, data, and real-world results from a complete website optimization."

  const blog = await prisma.blog.upsert({
    where: { slug: "achieving-100-lighthouse-scores" },
    update: {},
    create: {
      title: "Achieving 100/100 Lighthouse Scores: A Complete Performance Optimization Guide",
      slug: "achieving-100-lighthouse-scores",
      excerpt,
      content: blogContent,
      published: true,
      featured: true,
      views: 0,
      readTime: 15,
      publishedAt: new Date("2025-10-11"),
      authorId: user.id,
      tags: {
        connect: tags.map((tag) => ({ id: tag.id })),
      },
    },
  })

  // Update tag counts
  await Promise.all(
    tags.map((tag) =>
      prisma.tag.update({
        where: { id: tag.id },
        data: { count: { increment: 1 } },
      })
    )
  )

  console.log("✅ Blog post created/updated:", blog.title)
  console.log(`📝 Slug: ${blog.slug}`)
  console.log(`🏷️  Tags: ${tags.map((t) => t.name).join(", ")}`)
  console.log(`✨ Featured: ${blog.featured}`)
  console.log(`📅 Published: ${blog.publishedAt?.toLocaleDateString()}`)
  console.log("\n🎉 Blog seeding complete!")
}

main()
  .catch((e) => {
    console.error("❌ Error seeding blog:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

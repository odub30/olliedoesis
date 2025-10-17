// scripts/migrate-blog-content.ts
/**
 * Migration script to enhance existing blog posts with new schema fields
 *
 * This script will:
 * 1. Generate categories based on existing tags
 * 2. Extract keywords from title, excerpt, and tags
 * 3. Auto-detect GitHub repository links from content
 * 4. Suggest related posts based on tag similarity
 *
 * Usage: npx ts-node scripts/migrate-blog-content.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Common category mappings based on tags
const CATEGORY_MAPPINGS: Record<string, string> = {
  'nextjs': 'Frontend Development',
  'react': 'Frontend Development',
  'typescript': 'Frontend Development',
  'javascript': 'Frontend Development',
  'css': 'Frontend Development',
  'tailwind': 'Frontend Development',
  'performance': 'Performance Optimization',
  'seo': 'SEO & Marketing',
  'security': 'Security',
  'database': 'Backend Development',
  'prisma': 'Backend Development',
  'nodejs': 'Backend Development',
  'api': 'Backend Development',
  'testing': 'Testing & Quality',
  'deployment': 'DevOps',
  'docker': 'DevOps',
  'aws': 'Cloud & Infrastructure',
};

/**
 * Extract potential keywords from text
 */
function extractKeywords(title: string, excerpt: string | null, tags: string[]): string[] {
  const keywords = new Set<string>();

  // Add tags as keywords
  tags.forEach(tag => keywords.add(tag.toLowerCase()));

  // Extract important words from title (3+ characters)
  const titleWords = title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length >= 3 && !isCommonWord(word));

  titleWords.forEach(word => keywords.add(word));

  // Extract from excerpt (limit to avoid too many keywords)
  if (excerpt) {
    const excerptWords = excerpt
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length >= 4 && !isCommonWord(word))
      .slice(0, 5); // Limit to 5 words from excerpt

    excerptWords.forEach(word => keywords.add(word));
  }

  // Return top keywords (max 10)
  return Array.from(keywords).slice(0, 10);
}

/**
 * Check if word is a common stop word
 */
function isCommonWord(word: string): boolean {
  const stopWords = new Set([
    'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'her',
    'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how',
    'its', 'may', 'new', 'now', 'old', 'see', 'two', 'who', 'boy', 'did',
    'use', 'way', 'with', 'from', 'have', 'this', 'that', 'will', 'your',
  ]);
  return stopWords.has(word);
}

/**
 * Determine category from tags
 */
function determineCategoryFromTags(tags: string[]): string | null {
  for (const tag of tags) {
    const category = CATEGORY_MAPPINGS[tag.toLowerCase()];
    if (category) return category;
  }
  return null;
}

/**
 * Extract GitHub URL from markdown content
 */
function extractGitHubUrl(content: string): string | null {
  // Match GitHub URLs in markdown links or plain text
  const githubRegex = /https?:\/\/github\.com\/[\w-]+\/[\w-]+/i;
  const match = content.match(githubRegex);
  return match ? match[0] : null;
}

/**
 * Find related posts based on tag overlap
 */
async function findRelatedPosts(
  blogId: string,
  tagSlugs: string[],
  limit: number = 3
): Promise<string[]> {
  if (tagSlugs.length === 0) return [];

  const relatedBlogs = await prisma.blog.findMany({
    where: {
      AND: [
        { id: { not: blogId } },
        { published: true },
        {
          tags: {
            some: {
              slug: {
                in: tagSlugs,
              },
            },
          },
        },
      ],
    },
    select: {
      id: true,
      tags: {
        select: {
          slug: true,
        },
      },
    },
  });

  // Sort by number of matching tags
  const scored = relatedBlogs.map(blog => {
    const matchingTags = blog.tags.filter(t => tagSlugs.includes(t.slug)).length;
    return { id: blog.id, score: matchingTags };
  });

  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map(item => item.id);
}

/**
 * Main migration function
 */
async function migrateBlogs() {
  console.log('🚀 Starting blog content migration...\n');

  try {
    // Fetch all blogs with their tags
    const blogs = await prisma.blog.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        excerpt: true,
        category: true,
        keywords: true,
        githubRepo: true,
        relatedPostIds: true,
        lastUpdated: true,
        tags: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
    });

    console.log(`📊 Found ${blogs.length} blog posts to process\n`);

    let updatedCount = 0;
    let skippedCount = 0;

    for (const blog of blogs) {
      const tagSlugs = blog.tags.map(t => t.slug);
      const tagNames = blog.tags.map(t => t.name);

      // Skip if already has category and keywords
      const hasEnhancements = blog.category && blog.keywords && blog.keywords.length > 0;

      if (hasEnhancements) {
        console.log(`⏭️  Skipping "${blog.title}" - already enhanced`);
        skippedCount++;
        continue;
      }

      console.log(`📝 Processing: "${blog.title}"`);

      // Determine category
      let category = blog.category;
      if (!category) {
        category = determineCategoryFromTags(tagSlugs);
        if (category) {
          console.log(`   ✓ Category: ${category}`);
        }
      }

      // Extract keywords
      let keywords = blog.keywords || [];
      if (keywords.length === 0) {
        keywords = extractKeywords(blog.title, blog.excerpt, tagSlugs);
        console.log(`   ✓ Keywords: ${keywords.join(', ')}`);
      }

      // Extract GitHub URL
      let githubRepo = blog.githubRepo;
      if (!githubRepo && blog.content) {
        githubRepo = extractGitHubUrl(blog.content);
        if (githubRepo) {
          console.log(`   ✓ GitHub: ${githubRepo}`);
        }
      }

      // Find related posts
      let relatedPostIds = blog.relatedPostIds || [];
      if (relatedPostIds.length === 0) {
        relatedPostIds = await findRelatedPosts(blog.id, tagSlugs, 3);
        if (relatedPostIds.length > 0) {
          console.log(`   ✓ Related: ${relatedPostIds.length} posts`);
        }
      }

      // Update the blog
      await prisma.blog.update({
        where: { id: blog.id },
        data: {
          category: category || blog.category,
          keywords: keywords.length > 0 ? keywords : blog.keywords,
          githubRepo: githubRepo || blog.githubRepo,
          relatedPostIds: relatedPostIds.length > 0 ? relatedPostIds : blog.relatedPostIds,
          lastUpdated: new Date(), // Mark as updated
        },
      });

      console.log(`   ✅ Updated successfully\n`);
      updatedCount++;
    }

    console.log('\n✨ Migration complete!');
    console.log(`   Updated: ${updatedCount} blog posts`);
    console.log(`   Skipped: ${skippedCount} blog posts (already enhanced)`);
    console.log(`   Total: ${blogs.length} blog posts\n`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run migration
migrateBlogs()
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });

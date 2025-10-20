// src/app/api/search/route.ts - Enhanced Search API with Relevance Ranking
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import crypto from "crypto";
import { logError } from "@/lib/logger";
import type { ProjectResultRaw, BlogResultRaw, ImageResultRaw, TagResultRaw } from '@/types/db'

/**
 * Enhanced Search API with:
 * - Relevance-based ranking algorithm
 * - SQL injection protection via Prisma
 * - Comprehensive input validation
 * - Rate limiting (60 requests/minute)
 * - Search analytics tracking
 * - XSS prevention and sanitization
 * - IP hashing for privacy
 */

// Validation schema for search query
const searchSchema = z.object({
  query: z
    .string()
    .min(1, "Query must be at least 1 character")
    .max(200, "Query must be less than 200 characters")
    .trim(),
  category: z.enum(["all", "projects", "blogs", "images", "tags"]).default("all"),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(20),
});

// Rate limiter configuration
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 60; // 60 requests per minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const userLimit = rateLimitMap.get(ip);

  if (!userLimit || now > userLimit.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (userLimit.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }

  userLimit.count++;
  return true;
}

// Hash IP for privacy compliance
function hashIP(ip: string): string {
  return crypto.createHash("sha256").update(ip).digest("hex").substring(0, 16);
}

// Sanitization: Remove SQL special characters and HTML entities
function sanitizeQuery(query: string): string {
  return query
    .replace(/[<>'"\\;]/g, "") // Remove dangerous characters
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .trim();
}

// Calculate relevance score for search results
interface SearchResult {
  id: string;
  title: string;
  description?: string;
  excerpt?: string;
  content?: string;
  featured?: boolean;
  createdAt: Date;
  tags?: Array<{ name: string }>;
  type: string;
}

function calculateRelevance(item: SearchResult, query: string): number {
  let score = 0;
  const lowerQuery = query.toLowerCase();
  const lowerTitle = item.title.toLowerCase();

  // Title scoring
  if (lowerTitle === lowerQuery) {
    score += 100; // Exact title match
  } else if (lowerTitle.startsWith(lowerQuery)) {
    score += 80; // Title starts with query
  } else if (lowerTitle.includes(lowerQuery)) {
    score += 60; // Title contains query
  }

  // Description/excerpt scoring
  const description = (item.description || item.excerpt || "").toLowerCase();
  if (description.includes(lowerQuery)) {
    score += 40;
  }

  // Content scoring (if available)
  if (item.content && item.content.toLowerCase().includes(lowerQuery)) {
    score += 20;
  }

  // Tag matching
  if (item.tags && item.tags.some(tag => tag.name.toLowerCase().includes(lowerQuery))) {
    score += 50;
  }

  // Featured content boost
  if (item.featured) {
    score += 25;
  }

  // Recent content boost (within 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  if (item.createdAt >= thirtyDaysAgo) {
    score += 15;
  }

  return score;
}

export async function GET(request: NextRequest) {
  try {
    // Get IP for rate limiting
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const ipHash = hashIP(ip);

    // Rate limiting
    if (!checkRateLimit(ipHash)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    // Parse and validate query parameters
    const searchParams = request.nextUrl.searchParams;
    const validationResult = searchSchema.safeParse({
      query: searchParams.get("q") || searchParams.get("query"),
      category: searchParams.get("category"),
      page: searchParams.get("page"),
      limit: searchParams.get("limit"),
    });

    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid search parameters", details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const { query, category, page, limit } = validationResult.data;

    // Sanitize query
    const sanitizedQuery = sanitizeQuery(query);
    const lowerQuery = sanitizedQuery.toLowerCase();

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Initialize results
    const allResults: Array<SearchResult & { score: number; url: string }> = [];

    // Search Projects
    if (category === "all" || category === "projects") {
      const projects = await prisma.project.findMany({
        where: {
          published: true,
          OR: [
            { title: { contains: sanitizedQuery, mode: "insensitive" } },
            { description: { contains: sanitizedQuery, mode: "insensitive" } },
            { content: { contains: sanitizedQuery, mode: "insensitive" } },
            { techStack: { hasSome: [sanitizedQuery] } },
          ],
        },
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
          content: true,
          techStack: true,
          featured: true,
          views: true,
          createdAt: true,
          tags: { select: { name: true } },
        },
        take: limit * 2, // Get more for ranking
      });

      const projectResults = projects.map((p) => {
        const result = {
          ...p,
          type: "project" as const,
        };
        return {
          ...p,
          type: "project" as const,
          url: `/projects/${p.slug}`,
          score: calculateRelevance(result as any, lowerQuery),
        };
      });

      allResults.push(...(projectResults as any));
    }

    // Search Blogs
    if (category === "all" || category === "blogs") {
      const blogs = await prisma.blog.findMany({
        where: {
          published: true,
          OR: [
            { title: { contains: sanitizedQuery, mode: "insensitive" } },
            { excerpt: { contains: sanitizedQuery, mode: "insensitive" } },
            { content: { contains: sanitizedQuery, mode: "insensitive" } },
          ],
        },
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          content: true,
          featured: true,
          views: true,
          readTime: true,
          publishedAt: true,
          createdAt: true,
          tags: { select: { name: true } },
        },
        take: limit * 2,
      });

      const blogResults = blogs.map((b: BlogResultRaw) => {
        const result: SearchResult = {
          ...b,
          excerpt: b.excerpt || undefined,
          type: "blog",
        };
        return {
          ...b,
          excerpt: b.excerpt || undefined,
          type: "blog",
          url: `/blogs/${b.slug}`,
          score: calculateRelevance(result, lowerQuery),
        };
      });

      allResults.push(...blogResults);
    }

    // Search Images
    if (category === "all" || category === "images") {
      const images = await prisma.image.findMany({
        where: {
          OR: [
            { alt: { contains: sanitizedQuery, mode: "insensitive" } },
            { caption: { contains: sanitizedQuery, mode: "insensitive" } },
          ],
        },
        select: {
          id: true,
          url: true,
          alt: true,
          caption: true,
          width: true,
          height: true,
          createdAt: true,
        },
        take: limit,
      });

      const imageResults = images.map((i) => ({
        ...i,
        title: i.alt,
        description: i.caption || undefined,
        type: "image",
        url: i.url,
        score: calculateRelevance({
          id: i.id,
          title: i.alt || "",
          description: i.caption || undefined,
          createdAt: i.createdAt,
          type: "image",
        } as any, lowerQuery),
      }));

      allResults.push(...(imageResults as any));
    }

    // Search Tags
    if (category === "all" || category === "tags") {
      const tags = await prisma.tag.findMany({
        where: {
          OR: [
            { name: { contains: sanitizedQuery, mode: "insensitive" } },
            { slug: { contains: sanitizedQuery, mode: "insensitive" } },
          ],
        },
        select: {
          id: true,
          name: true,
          slug: true,
          createdAt: true,
        },
        take: limit,
      });

      const tagResults = tags.map((t) => ({
        ...t,
        title: t.name,
        type: "tag",
        url: `/tags/${t.slug}`,
        score: calculateRelevance({
          id: t.id,
          title: t.name,
          createdAt: t.createdAt,
          type: "tag",
        }, lowerQuery),
      }));

      allResults.push(...(tagResults as any));
    }

    // Sort by relevance score (highest first)
    allResults.sort((a, b) => b.score - a.score);

    // Apply pagination
    const total = allResults.length;
    const paginatedResults = allResults.slice(skip, skip + limit);

    // Group results by type for response
      // Helper to omit fields without leaving unused bindings
      function omit<T extends Record<string, unknown>, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
        const copy: Record<string, unknown> = { ...obj }
        for (const k of keys) delete copy[k as string]
        return copy as Omit<T, K>
      }

      const results = {
        projects: paginatedResults
          .filter((r) => r.type === "project")
          .map((r) => omit(r as unknown as Record<string, unknown>, ["score", "content"])),
        blogs: paginatedResults
          .filter((r) => r.type === "blog")
          .map((r) => omit(r as unknown as Record<string, unknown>, ["score", "content"])),
        images: paginatedResults
          .filter((r) => r.type === "image")
          .map((r) => omit(r as unknown as Record<string, unknown>, ["score"])),
        tags: paginatedResults
          .filter((r) => r.type === "tag")
          .map((r) => omit(r as unknown as Record<string, unknown>, ["score"])),
      };

    // Log search analytics asynchronously
    prisma.searchHistory
      .create({
        data: {
          query: sanitizedQuery,
          results: total,
        },
      })
      .then(async () => {
        // Update aggregated search analytics
        await prisma.searchAnalytics.upsert({
          where: { query: sanitizedQuery },
          update: {
            searchCount: { increment: 1 },
            lastSearched: new Date(),
            avgResults: {
              set: (await prisma.searchHistory.aggregate({
                where: { query: sanitizedQuery },
                _avg: { results: true },
              }))._avg.results || 0,
            },
          },
          create: {
            query: sanitizedQuery,
            searchCount: 1,
            lastSearched: new Date(),
            avgResults: total,
          },
        });
      })
  .catch((err: unknown) => logError("Failed to log search analytics", err));

    return NextResponse.json({
      results,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      category,
    });
  } catch (error) {
    logError("Search API error occurred", error);
    return NextResponse.json(
      { error: "An error occurred while searching. Please try again." },
      { status: 500 }
    );
  }
}

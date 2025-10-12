// src/app/api/admin/blogs/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/lib/auth";
import { z } from "zod";

const prisma = new PrismaClient();

/**
 * Admin API for Blog Management
 *
 * Security:
 * - Protected by middleware (ADMIN role required)
 * - Input validation with Zod
 * - Automatic reading time calculation
 */

// Validation schema for blog creation/update
const blogSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: z.string().min(1, "Slug is required").max(200).regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  excerpt: z.string().max(500).optional().or(z.literal("")),
  content: z.string().min(1, "Content is required"),
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
  publishedAt: z.string().datetime().optional().or(z.literal("")),
  readTime: z.number().int().positive().optional(),
});

// Calculate reading time from content (rough estimate: 200 words per minute)
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

/**
 * GET /api/admin/blogs
 * List all blogs (admin view with drafts)
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 }
      );
    }

    // Get query parameters for filtering/sorting
    const searchParams = request.nextUrl.searchParams;
    const published = searchParams.get("published");
    const featured = searchParams.get("featured");
    const search = searchParams.get("search");

    // Build where clause
    const where: any = {};

    if (published === "true") where.published = true;
    if (published === "false") where.published = false;
    if (featured === "true") where.featured = true;
    if (featured === "false") where.featured = false;

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { excerpt: { contains: search, mode: "insensitive" } },
      ];
    }

    const blogs = await prisma.blog.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        tags: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        _count: {
          select: {
            images: true,
          },
        },
      },
      orderBy: [
        { publishedAt: "desc" },
        { createdAt: "desc" },
      ],
    });

    return NextResponse.json({
      blogs,
      total: blogs.length,
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json(
      { error: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/blogs
 * Create a new blog post
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Validate input
    const validation = blogSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.issues },
        { status: 400 }
      );
    }

    const data = validation.data;

    // Check if slug already exists
    const existingBlog = await prisma.blog.findUnique({
      where: { slug: data.slug },
    });

    if (existingBlog) {
      return NextResponse.json(
        { error: "A blog post with this slug already exists" },
        { status: 409 }
      );
    }

    // Calculate reading time if not provided
    const readTime = data.readTime || calculateReadingTime(data.content);

    // Set publishedAt date if publishing for the first time
    const publishedAt = data.published && !data.publishedAt
      ? new Date()
      : data.publishedAt
      ? new Date(data.publishedAt)
      : null;

    // Create blog
    const blog = await prisma.blog.create({
      data: {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt || null,
        content: data.content,
        published: data.published,
        featured: data.featured,
        readTime,
        publishedAt,
        authorId: session.user.id,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        tags: true,
      },
    });

    return NextResponse.json(
      {
        message: "Blog post created successfully",
        blog,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating blog:", error);
    return NextResponse.json(
      { error: "Failed to create blog post" },
      { status: 500 }
    );
  }
}

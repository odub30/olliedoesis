// src/app/api/admin/blogs/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";
import { logError } from "@/lib/logger";

// Validation schema for blog updates
const blogUpdateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/).optional(),
  excerpt: z.string().max(500).optional().or(z.literal("")).or(z.null()),
  content: z.string().min(1).optional(),
  published: z.boolean().optional(),
  featured: z.boolean().optional(),
  publishedAt: z.string().datetime().optional().or(z.literal("")).or(z.null()),
  readTime: z.number().int().positive().optional(),
  tagIds: z.array(z.string()).optional(),
});

// Calculate reading time from content
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

/**
 * GET /api/admin/blogs/[id]
 * Get a single blog post by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 }
      );
    }

    const { id } = await params;

    const blog = await prisma.blog.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        tags: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        images: {
          select: {
            id: true,
            url: true,
            alt: true,
            caption: true,
          },
        },
      },
    });

    if (!blog) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ blog });
  } catch (error) {
    logError("Failed to fetch blog post by ID in admin API", error);
    return NextResponse.json(
      { error: "Failed to fetch blog post" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/blogs/[id]
 * Update a blog post
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 }
      );
    }

    const { id } = await params;

    // Check if blog exists
    const existingBlog = await prisma.blog.findUnique({
      where: { id },
    });

    if (!existingBlog) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    const body = await request.json();

    // Validate input
    const validation = blogUpdateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.issues },
        { status: 400 }
      );
    }

    const data = validation.data;

    // If slug is being updated, check for conflicts
    if (data.slug && data.slug !== existingBlog.slug) {
      const slugConflict = await prisma.blog.findUnique({
        where: { slug: data.slug },
      });

      if (slugConflict) {
        return NextResponse.json(
          { error: "A blog post with this slug already exists" },
          { status: 409 }
        );
      }
    }

    // Recalculate reading time if content is being updated
    const readTime = data.content
      ? data.readTime || calculateReadingTime(data.content)
      : data.readTime;

    // Handle publishedAt logic
    let publishedAt = existingBlog.publishedAt;

    // If publishing for the first time
    if (data.published && !existingBlog.published && !data.publishedAt) {
      publishedAt = new Date();
    }
    // If unpublishing
    else if (data.published === false) {
      publishedAt = null;
    }
    // If custom publishedAt provided
    else if (data.publishedAt) {
      publishedAt = data.publishedAt === "" ? null : new Date(data.publishedAt);
    }

    // Convert empty strings to null
    const updateData: Record<string, unknown> = { ...data };
    if (updateData.excerpt === "") updateData.excerpt = null;
    if (updateData.publishedAt === "") updateData.publishedAt = null;
    if (readTime) updateData.readTime = readTime;
    if (publishedAt !== undefined) updateData.publishedAt = publishedAt;

    // Remove fields that shouldn't be sent to Prisma as-is
    delete updateData.publishedAt;
    delete updateData.tagIds;

    // Build tag update if tagIds provided
    const tagUpdate = data.tagIds
      ? {
          set: data.tagIds.map((id) => ({ id })),
        }
      : undefined;

    // Update blog
    const blog = await prisma.blog.update({
      where: { id },
      data: {
        ...updateData,
        publishedAt,
        ...(tagUpdate && { tags: tagUpdate }),
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
        images: true,
      },
    });

    return NextResponse.json({
      message: "Blog post updated successfully",
      blog,
    });
  } catch (error) {
    logError("Failed to update blog post in admin API", error);
    return NextResponse.json(
      { error: "Failed to update blog post" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/blogs/[id]
 * Delete a blog post
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 }
      );
    }

    const { id } = await params;

    // Check if blog exists
    const existingBlog = await prisma.blog.findUnique({
      where: { id },
    });

    if (!existingBlog) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    // Delete blog (images will be cascade deleted due to Prisma schema)
    await prisma.blog.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Blog post deleted successfully",
    });
  } catch (error) {
    logError("Failed to delete blog post in admin API", error);
    return NextResponse.json(
      { error: "Failed to delete blog post" },
      { status: 500 }
    );
  }
}

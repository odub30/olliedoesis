// src/app/api/admin/tags/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";
import { logError } from "@/lib/logger";

/**
 * Admin API for Tag Management
 *
 * Security:
 * - Protected by middleware (ADMIN role required)
 * - Input validation with Zod
 * - Automatic slug generation
 * - Count updating for tag usage
 */

// Validation schema for tag creation
const tagSchema = z.object({
  name: z.string().min(1, "Name is required").max(50),
  slug: z.string().min(1, "Slug is required").max(50).regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
});

// Validation schema for tag updates
const tagUpdateSchema = z.object({
  name: z.string().min(1).max(50).optional(),
  slug: z.string().min(1).max(50).regex(/^[a-z0-9-]+$/).optional(),
});

/**
 * GET /api/admin/tags
 * List all tags with usage counts
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

    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search");

    // Build where clause
    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" as const } },
        { slug: { contains: search, mode: "insensitive" as const } },
      ];
    }

    const tags = await prisma.tag.findMany({
      where,
      include: {
        _count: {
          select: {
            projects: true,
            blogs: true,
            images: true,
          },
        },
      },
      orderBy: [
        { count: "desc" },
        { name: "asc" },
      ],
    });

    // Calculate total usage count for each tag
    type TagEntry = typeof tags[number]
    const tagsWithUsage = tags.map((tag: TagEntry) => ({
      ...tag,
      totalUsage: tag._count.projects + tag._count.blogs + tag._count.images,
    }));

    return NextResponse.json({
      tags: tagsWithUsage,
      total: tags.length,
    });
  } catch (error) {
    logError("Failed to fetch tags in admin API", error);
    return NextResponse.json(
      { error: "Failed to fetch tags" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/tags
 * Create a new tag
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
    const validation = tagSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.issues },
        { status: 400 }
      );
    }

    const data = validation.data;

    // Check if tag with this name or slug already exists
    const existingTag = await prisma.tag.findFirst({
      where: {
        OR: [
          { name: { equals: data.name, mode: "insensitive" } },
          { slug: data.slug },
        ],
      },
    });

    if (existingTag) {
      return NextResponse.json(
        { error: "A tag with this name or slug already exists" },
        { status: 409 }
      );
    }

    // Create tag
    const tag = await prisma.tag.create({
      data: {
        name: data.name,
        slug: data.slug,
        count: 0,
      },
    });

    return NextResponse.json(
      {
        message: "Tag created successfully",
        tag,
      },
      { status: 201 }
    );
  } catch (error) {
    logError("Failed to create tag in admin API", error);
    return NextResponse.json(
      { error: "Failed to create tag" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/tags/[id]
 * Update a tag
 */
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Tag ID is required" },
        { status: 400 }
      );
    }

    // Validate input
    const validation = tagUpdateSchema.safeParse(updateData);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.issues },
        { status: 400 }
      );
    }

    // Check if tag exists
    const existingTag = await prisma.tag.findUnique({
      where: { id },
    });

    if (!existingTag) {
      return NextResponse.json(
        { error: "Tag not found" },
        { status: 404 }
      );
    }

    const data = validation.data;

    // Check for conflicts if name or slug is being updated
    if (data.name || data.slug) {
      const orConditions: Array<Record<string, unknown>> = [];

      if (data.name) {
        orConditions.push({ name: { equals: data.name, mode: "insensitive" as const } });
      }

      if (data.slug) {
        orConditions.push({ slug: data.slug });
      }

      const conflict = await prisma.tag.findFirst({
        where: {
          AND: [
            { id: { not: id } },
            { OR: orConditions },
          ],
        },
      });

      if (conflict) {
        return NextResponse.json(
          { error: "A tag with this name or slug already exists" },
          { status: 409 }
        );
      }
    }

    // Update tag
    const tag = await prisma.tag.update({
      where: { id },
      data,
    });

    return NextResponse.json({
      message: "Tag updated successfully",
      tag,
    });
  } catch (error) {
    logError("Failed to update tag in admin API", error);
    return NextResponse.json(
      { error: "Failed to update tag" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/tags/[id]
 * Delete a tag
 */
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Tag ID is required" },
        { status: 400 }
      );
    }

    // Check if tag exists
    const existingTag = await prisma.tag.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            projects: true,
            blogs: true,
            images: true,
          },
        },
      },
    });

    if (!existingTag) {
      return NextResponse.json(
        { error: "Tag not found" },
        { status: 404 }
      );
    }

    // Check if tag is in use
    const totalUsage = existingTag._count.projects + existingTag._count.blogs + existingTag._count.images;

    if (totalUsage > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete tag. It is currently used by ${totalUsage} item(s).`,
          usage: existingTag._count,
        },
        { status: 409 }
      );
    }

    // Delete tag
    await prisma.tag.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Tag deleted successfully",
    });
  } catch (error) {
    logError("Failed to delete tag in admin API", error);
    return NextResponse.json(
      { error: "Failed to delete tag" },
      { status: 500 }
    );
  }
}

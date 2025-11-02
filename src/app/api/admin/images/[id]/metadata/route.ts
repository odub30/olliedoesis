import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";
import { logError } from "@/lib/logger";
import { rateLimit, RATE_LIMITS } from "@/lib/rate-limit";

/**
 * API Route for updating image metadata
 *
 * PUT /api/admin/images/[id]/metadata
 * - Updates metadata fields like title, alt, description, caption, and tags
 *
 * GET /api/admin/images/[id]/metadata
 * - Fetches a single image with all metadata
 */

// Validation schema for metadata updates
const metadataSchema = z.object({
  title: z.string().max(200).optional().nullable(),
  alt: z.string().min(1, "Alt text is required").max(200),
  description: z.string().optional().nullable(),
  caption: z.string().max(500).optional().nullable(),
  tagIds: z.array(z.string()).optional(),
  categoryId: z.string().optional().nullable(),
});

/**
 * PUT - Update image metadata
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Apply rate limiting
  const rateLimitResponse = rateLimit(request, RATE_LIMITS.api);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    // Await params in Next.js 15+
    const { id } = await params;

    // Check authentication
    const session = await auth();

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 }
      );
    }

    // Validate request body
    const body = await request.json();
    const validatedData = metadataSchema.parse(body);

    // Check if image exists
    const existingImage = await prisma.image.findUnique({
      where: { id },
    });

    if (!existingImage) {
      return NextResponse.json(
        { error: "Image not found" },
        { status: 404 }
      );
    }

    // Update image metadata
    const image = await prisma.image.update({
      where: { id },
      data: {
        title: validatedData.title,
        alt: validatedData.alt,
        description: validatedData.description,
        caption: validatedData.caption,
        categoryId: validatedData.categoryId,
        ...(validatedData.tagIds && {
          tags: {
            set: [], // Clear existing tags
            connect: validatedData.tagIds.map((id) => ({ id })),
          },
        }),
      },
      include: {
        tags: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: "Image metadata updated successfully",
      image,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Invalid data",
          details: error.issues,
        },
        { status: 400 }
      );
    }

    logError("Failed to update image metadata", error);
    return NextResponse.json(
      { error: "Failed to update metadata" },
      { status: 500 }
    );
  }
}

/**
 * GET - Fetch single image with metadata
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Apply rate limiting
  const rateLimitResponse = rateLimit(request, RATE_LIMITS.api);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    // Await params in Next.js 15+
    const { id } = await params;

    // Check authentication (optional - you might want public access to view metadata)
    const session = await auth();

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 }
      );
    }

    const image = await prisma.image.findUnique({
      where: { id },
      include: {
        tags: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        blog: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
        project: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    });

    if (!image) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    return NextResponse.json(image);
  } catch (error) {
    logError("Failed to fetch image metadata", error);
    return NextResponse.json(
      { error: "Failed to fetch image" },
      { status: 500 }
    );
  }
}

// src/app/api/admin/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";
import { logError } from "@/lib/logger";
import { put, del } from "@vercel/blob";
import { rateLimit, RATE_LIMITS } from "@/lib/rate-limit";

/**
 * Admin API for Image Upload Management
 *
 * Security:
 * - Protected by middleware (ADMIN role required)
 * - Rate limited to prevent abuse (60 requests/minute)
 * - File type validation
 * - File size limits (4.5MB max)
 * - Metadata storage in database
 *
 * Storage: Vercel Blob Storage
 */

// Constants
// Note: Vercel server uploads are limited to 4.5MB
// For larger files, use client-side upload (presigned URLs)
const MAX_FILE_SIZE = 4.5 * 1024 * 1024; // 4.5MB (Vercel limit for server uploads)
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif", ".webp"];

// Validation schema for image metadata
const imageMetadataSchema = z.object({
  url: z.string().url("Valid URL is required"),
  alt: z.string().min(1, "Alt text is required").max(200),
  caption: z.string().max(500).optional().or(z.literal("")),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  format: z.string().max(10).optional(),
  size: z.number().int().positive().optional(),
  projectId: z.string().optional().or(z.literal("")),
  blogId: z.string().optional().or(z.literal("")),
});

/**
 * POST /api/admin/upload
 * Upload image file to Vercel Blob and store metadata in database
 *
 * Accepts FormData with:
 * - file: The image file
 * - alt: Alt text for accessibility (optional, defaults to filename)
 * - caption: Image caption (optional)
 * - projectId: Associated project ID (optional)
 * - blogId: Associated blog ID (optional)
 */
export async function POST(request: NextRequest) {
  // Apply rate limiting for file uploads
  const rateLimitResponse = rateLimit(request, RATE_LIMITS.api);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    const session = await auth();

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 }
      );
    }

    // Parse FormData
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error: "Invalid file type",
          details: `Allowed types: ${ALLOWED_EXTENSIONS.join(", ")}`
        },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: "File too large",
          details: `Maximum file size is 4.5MB (Vercel server upload limit)`
        },
        { status: 400 }
      );
    }

    // Upload to Vercel Blob
    const blob = await put(file.name, file, {
      access: "public",
      addRandomSuffix: true,
    });

    // Get optional metadata from form
    const alt = (formData.get("alt") as string) || file.name;
    const caption = (formData.get("caption") as string) || null;
    const projectId = (formData.get("projectId") as string) || undefined;
    const blogId = (formData.get("blogId") as string) || undefined;

    // Get file extension for format
    const format = file.name.split(".").pop()?.toLowerCase() || null;

    // Prepare data for database
    const imageData: {
      url: string;
      alt: string;
      caption: string | null;
      width: number | null;
      height: number | null;
      format: string | null;
      size: number;
      projectId?: string;
      blogId?: string;
    } = {
      url: blob.url,
      alt,
      caption,
      width: null, // Could be extracted from image metadata if needed
      height: null, // Could be extracted from image metadata if needed
      format,
      size: file.size,
    };

    // Connect to project or blog if provided
    if (projectId && projectId !== "") {
      imageData.projectId = projectId;
    }

    if (blogId && blogId !== "") {
      imageData.blogId = blogId;
    }

    // Create image record in database
    const image = await prisma.image.create({
      data: imageData,
    });

    return NextResponse.json(
      {
        message: "Image uploaded successfully",
        image,
        blob: {
          url: blob.url,
          pathname: blob.pathname,
          contentType: blob.contentType,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    logError("Failed to upload image in admin API", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/upload
 * List all images
 */
export async function GET(request: NextRequest) {
  // Apply rate limiting
  const rateLimitResponse = rateLimit(request, RATE_LIMITS.api);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    const session = await auth();

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const projectId = searchParams.get("projectId");
    const blogId = searchParams.get("blogId");
    const unattached = searchParams.get("unattached");

    // Build where clause
    const where: {
      projectId?: string | null;
      blogId?: string | null;
      AND?: Array<{ projectId: null } | { blogId: null }>;
    } = {};

    if (projectId) {
      where.projectId = projectId;
    }

    if (blogId) {
      where.blogId = blogId;
    }

    // Get only unattached images (not linked to any project or blog)
    if (unattached === "true") {
      where.AND = [
        { projectId: null },
        { blogId: null },
      ];
    }

    const images = await prisma.image.findMany({
      where,
      include: {
        project: {
          select: {
            id: true,
            title: true,
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
        tags: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      images,
      total: images.length,
    });
  } catch (error) {
    logError("Failed to fetch images in admin API", error);
    return NextResponse.json(
      { error: "Failed to fetch images" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/upload
 * Update image metadata (alt text, caption, tags)
 */
export async function PUT(request: NextRequest) {
  // Apply rate limiting
  const rateLimitResponse = rateLimit(request, RATE_LIMITS.api);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    const session = await auth();

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { id, alt, caption, tagIds } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Image ID is required" },
        { status: 400 }
      );
    }

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

    // Prepare update data
    const updateData: {
      alt?: string;
      caption?: string | null;
      tags?: { set: Array<{ id: string }> };
    } = {};

    if (alt !== undefined) {
      updateData.alt = alt;
    }

    if (caption !== undefined) {
      updateData.caption = caption || null;
    }

    // Handle tags
    if (tagIds !== undefined && Array.isArray(tagIds)) {
      updateData.tags = {
        set: tagIds.map((tagId: string) => ({ id: tagId })),
      };
    }

    // Update image
    const image = await prisma.image.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      message: "Image updated successfully",
      image,
    });
  } catch (error) {
    logError("Failed to update image in admin API", error);
    return NextResponse.json(
      { error: "Failed to update image" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/upload
 * Delete an image from Vercel Blob storage and database
 */
export async function DELETE(request: NextRequest) {
  // Apply stricter rate limiting for deletions
  const rateLimitResponse = rateLimit(request, RATE_LIMITS.strict);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

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
        { error: "Image ID is required" },
        { status: 400 }
      );
    }

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

    // Delete file from Vercel Blob storage
    try {
      await del(existingImage.url);
    } catch (blobError) {
      // Log the error but continue with database deletion
      // The file might already be deleted or the URL might be invalid
      logError("Failed to delete file from Blob storage", blobError);
    }

    // Delete image record from database
    await prisma.image.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Image deleted successfully",
    });
  } catch (error) {
    logError("Failed to delete image in admin API", error);
    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500 }
    );
  }
}

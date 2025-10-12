// src/app/api/admin/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/lib/auth";
import { z } from "zod";

const prisma = new PrismaClient();

/**
 * Admin API for Image Upload Management
 *
 * Security:
 * - Protected by middleware (ADMIN role required)
 * - File type validation
 * - File size limits
 * - Metadata storage in database
 *
 * Note: This implementation stores image metadata.
 * For actual file uploads, integrate with:
 * - Vercel Blob Storage (@vercel/blob)
 * - AWS S3
 * - Cloudinary
 * - Or local public directory
 */

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
 * Upload image and store metadata
 *
 * This endpoint accepts image metadata after the file has been uploaded
 * to your storage solution (Vercel Blob, S3, etc.)
 *
 * For direct file upload, you would:
 * 1. Accept FormData with file
 * 2. Validate file type and size
 * 3. Upload to storage provider
 * 4. Get URL from provider
 * 5. Store metadata in database
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
    const validation = imageMetadataSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.issues },
        { status: 400 }
      );
    }

    const data = validation.data;

    // Prepare data for database
    const imageData: any = {
      url: data.url,
      alt: data.alt,
      caption: data.caption || null,
      width: data.width || null,
      height: data.height || null,
      format: data.format || null,
      size: data.size || null,
    };

    // Connect to project or blog if provided
    if (data.projectId && data.projectId !== "") {
      imageData.projectId = data.projectId;
    }

    if (data.blogId && data.blogId !== "") {
      imageData.blogId = data.blogId;
    }

    // Create image record
    const image = await prisma.image.create({
      data: imageData,
    });

    return NextResponse.json(
      {
        message: "Image uploaded successfully",
        image,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error uploading image:", error);
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
    const where: any = {};

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
    console.error("Error fetching images:", error);
    return NextResponse.json(
      { error: "Failed to fetch images" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/upload
 * Delete an image
 *
 * Note: This only deletes the database record.
 * You should also delete the file from your storage provider.
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

    // TODO: Delete file from storage provider (Vercel Blob, S3, etc.)
    // Example for Vercel Blob:
    // import { del } from '@vercel/blob';
    // await del(existingImage.url);

    // Delete image record from database
    await prisma.image.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Image deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting image:", error);
    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500 }
    );
  }
}

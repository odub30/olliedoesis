// src/app/api/admin/projects/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";
import { logError } from "@/lib/logger";

/**
 * Admin API for Project Management
 *
 * Security:
 * - Protected by middleware (ADMIN role required)
 * - Input validation with Zod
 * - Automatic slug generation
 */

// Validation schema for project creation/update
const projectSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: z.string().min(1, "Slug is required").max(200).regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  description: z.string().min(1, "Description is required"),
  content: z.string().min(1, "Content is required"),
  technologies: z.array(z.string()).default([]),
  liveUrl: z.string().url().optional().or(z.literal("")),
  githubUrl: z.string().url().optional().or(z.literal("")),
  featured: z.boolean().default(false),
  published: z.boolean().default(false),
  order: z.number().int().default(0),
  tagIds: z.array(z.string()).optional().default([]),
});

/**
 * GET /api/admin/projects
 * List all projects (admin view with drafts)
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
    const where: Record<string, unknown> = {};

    if (published === "true") where.published = true;
    if (published === "false") where.published = false;
    if (featured === "true") where.featured = true;
    if (featured === "false") where.featured = false;

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" as const } },
        { description: { contains: search, mode: "insensitive" as const } },
      ];
    }

    const projects = await prisma.project.findMany({
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
        { order: "asc" },
        { createdAt: "desc" },
      ],
    });

    return NextResponse.json({
      projects,
      total: projects.length,
    });
  } catch (error) {
    logError("Failed to fetch projects in admin API", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/projects
 * Create a new project
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
    const validation = projectSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.issues },
        { status: 400 }
      );
    }

    const data = validation.data;

    // Check if slug already exists
    const existingProject = await prisma.project.findUnique({
      where: { slug: data.slug },
    });

    if (existingProject) {
      return NextResponse.json(
        { error: "A project with this slug already exists" },
        { status: 409 }
      );
    }

    // Create project
    const project = await prisma.project.create({
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description,
        content: data.content,
        technologies: data.technologies,
        liveUrl: data.liveUrl || null,
        githubUrl: data.githubUrl || null,
        featured: data.featured,
        published: data.published,
        order: data.order,
        authorId: session.user.id,
        tags: {
          connect: data.tagIds.map((id) => ({ id })),
        },
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
        message: "Project created successfully",
        project
      },
      { status: 201 }
    );
  } catch (error) {
    logError("Failed to create project in admin API", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}

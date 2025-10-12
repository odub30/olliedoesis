// src/app/api/search/track-click/route.ts - Click Tracking API
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

/**
 * Click Tracking API
 * Monitors which search results users find most valuable
 * Updates SearchAnalytics with click data
 */

const trackClickSchema = z.object({
  query: z.string().min(1).max(200).trim(),
  clickedResult: z.string().min(1).max(500),
  resultType: z.enum(["project", "blog", "image", "tag"]).optional(),
  resultId: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validationResult = trackClickSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid parameters", details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const { query, clickedResult, resultType, resultId } = validationResult.data;

    // Sanitize query
    const sanitizedQuery = query.replace(/[<>'"\\;]/g, "").trim();

    // Update click count in SearchAnalytics
    try {
      await prisma.searchAnalytics.update({
        where: { query: sanitizedQuery },
        data: { clickCount: { increment: 1 } },
      });
    } catch (error) {
      // If the query doesn't exist in analytics yet, create it
      await prisma.searchAnalytics.upsert({
        where: { query: sanitizedQuery },
        update: { clickCount: { increment: 1 } },
        create: {
          query: sanitizedQuery,
          searchCount: 0,
          clickCount: 1,
          lastSearched: new Date(),
          avgResults: 0,
        },
      });
    }

    // Update SearchHistory with clicked result
    await prisma.searchHistory.updateMany({
      where: {
        query: sanitizedQuery,
        clickedResult: null,
      },
      data: {
        clickedResult: clickedResult,
      },
    });

    // Optionally increment view count for the clicked content
    if (resultId && resultType) {
      try {
        switch (resultType) {
          case "project":
            await prisma.project.update({
              where: { id: resultId },
              data: { views: { increment: 1 } },
            });
            break;
          case "blog":
            await prisma.blog.update({
              where: { id: resultId },
              data: { views: { increment: 1 } },
            });
            break;
          // Images and tags don't have view counts in the schema
          default:
            break;
        }
      } catch (error) {
        // Silently fail if the content doesn't exist
        console.error("Failed to update view count:", error);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Search click tracking error:", error);
    return NextResponse.json(
      { error: "Failed to track click" },
      { status: 500 }
    );
  }
}

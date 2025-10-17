// src/app/api/search/track-click/route.ts - Click Tracking API
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { logError } from "@/lib/logger";

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
    } catch {
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
        logError("Failed to update view count in track-click API", error);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    logError("Search click tracking error occurred", error);
    return NextResponse.json(
      { error: "Failed to track click" },
      { status: 500 }
    );
  }
}

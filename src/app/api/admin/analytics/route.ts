// src/app/api/admin/analytics/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { logError } from "@/lib/logger";

/**
 * GET /api/admin/analytics
 * Fetch analytics data with optional time range filtering
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
    const days = searchParams.get("days");

    // Calculate date filter
    let dateFilter: { searchedAt?: { gte: Date } } = {};
    if (days && days !== "all") {
      const daysAgo = parseInt(days);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysAgo);
      dateFilter = {
        searchedAt: {
          gte: startDate,
        },
      };
    }

    const [
      totalSearches,
      uniqueQueries,
      totalClicks,
      topSearches,
      zeroResultSearches,
      recentSearches,
      topViewedProjects,
      topViewedBlogs,
    ] = await Promise.all([
      // Total search count
      prisma.searchHistory.count({
        where: dateFilter,
      }),

      // Unique search queries
      prisma.searchAnalytics.count(),

      // Total clicks
      prisma.searchAnalytics.aggregate({
        _sum: { clickCount: true },
      }),

      // Top 10 searches
      prisma.searchAnalytics.findMany({
        take: 15,
        orderBy: { searchCount: "desc" },
      }),

      // Searches with zero results
      prisma.searchHistory.findMany({
        where: {
          results: 0,
          ...dateFilter,
        },
        select: { query: true, searchedAt: true },
        take: 10,
        orderBy: { searchedAt: "desc" },
        distinct: ["query"],
      }),

      // Recent searches
      prisma.searchHistory.findMany({
        where: dateFilter,
        take: 20,
        orderBy: { searchedAt: "desc" },
      }),

      // Top viewed projects
      prisma.project.findMany({
        where: { published: true },
        take: 5,
        orderBy: { views: "desc" },
        select: {
          id: true,
          title: true,
          slug: true,
          views: true,
        },
      }),

      // Top viewed blogs
      prisma.blog.findMany({
        where: { published: true },
        take: 5,
        orderBy: { views: "desc" },
        select: {
          id: true,
          title: true,
          slug: true,
          views: true,
        },
      }),
    ]);

    // Calculate average CTR
    type TopSearch = typeof topSearches[number]

    const averageCTR =
      topSearches.length > 0
        ? (topSearches.reduce((acc: number, s: TopSearch) => acc + (s.clickCount / s.searchCount), 0) /
            topSearches.length) *
          100
        : 0;

    // Generate search trend data (last 7/30/90 days)
    let searchTrend: Array<{ date: string; count: number }> = [];
    if (days && days !== "all") {
      const daysAgo = parseInt(days);
      const trendDays = Math.min(daysAgo, 30); // Limit to 30 days for chart readability

      // Get searches grouped by date
      const searchesByDate = await prisma.searchHistory.groupBy({
        by: ["searchedAt"],
        where: dateFilter,
        _count: {
          _all: true,
        },
      });

      // Create a map of dates with counts
      const dateMap = new Map<string, number>();
      for (let i = trendDays - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split("T")[0];
        dateMap.set(dateStr, 0);
      }

      // Fill in actual counts
      searchesByDate.forEach((item: any) => {
        const dateStr = new Date(item.searchedAt).toISOString().split("T")[0];
        if (dateMap.has(dateStr)) {
          dateMap.set(dateStr, (dateMap.get(dateStr) || 0) + item._count._all);
        }
      });

      // Convert to array
      searchTrend = Array.from(dateMap.entries())
        .map(([date, count]) => ({
          date: new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          count,
        }))
        .slice(-trendDays);
    }

    return NextResponse.json({
      totalSearches,
      uniqueQueries,
      totalClicks: totalClicks._sum.clickCount || 0,
      averageCTR,
      topSearches,
      zeroResultSearches,
      recentSearches,
      topViewedProjects,
      topViewedBlogs,
      searchTrend: searchTrend.length > 0 ? searchTrend : undefined,
    });
  } catch (error) {
    logError("Failed to fetch admin analytics", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}

// src/app/admin/analytics/page.tsx
import { PrismaClient } from "@prisma/client";
import { TrendingUp, Search as SearchIcon, MousePointer, Eye, FileText, FolderKanban } from "lucide-react";

const prisma = new PrismaClient();

async function getAnalyticsData() {
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
    prisma.searchHistory.count(),

    // Unique search queries
    prisma.searchAnalytics.count(),

    // Total clicks
    prisma.searchAnalytics.aggregate({
      _sum: { clickCount: true },
    }),

    // Top 10 searches
    prisma.searchAnalytics.findMany({
      take: 10,
      orderBy: { searchCount: "desc" },
    }),

    // Searches with zero results
    prisma.searchHistory.findMany({
      where: { results: 0 },
      select: { query: true, createdAt: true },
      take: 10,
      orderBy: { createdAt: "desc" },
      distinct: ["query"],
    }),

    // Recent searches (last 24 hours)
    prisma.searchHistory.findMany({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
      },
      take: 20,
      orderBy: { createdAt: "desc" },
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

  const averageCTR =
    topSearches.length > 0
      ? (topSearches.reduce((acc, s) => acc + (s.clickCount / s.searchCount), 0) /
          topSearches.length) *
        100
      : 0;

  return {
    totalSearches,
    uniqueQueries,
    totalClicks: totalClicks._sum.clickCount || 0,
    averageCTR,
    topSearches,
    zeroResultSearches,
    recentSearches,
    topViewedProjects,
    topViewedBlogs,
  };
}

export default async function AnalyticsPage() {
  const analytics = await getAnalyticsData();

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Analytics Dashboard</h1>
        <p className="text-muted-foreground">
          Search performance, content metrics, and user behavior insights
        </p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Total Searches</h3>
            <div className="p-2 bg-blue-100 rounded-lg">
              <SearchIcon className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-foreground">{analytics.totalSearches.toLocaleString()}</p>
          <p className="text-xs text-green-600 mt-1">All time</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Unique Queries</h3>
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-foreground">{analytics.uniqueQueries.toLocaleString()}</p>
          <p className="text-xs text-green-600 mt-1">Distinct searches</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Total Clicks</h3>
            <div className="p-2 bg-green-100 rounded-lg">
              <MousePointer className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-foreground">{analytics.totalClicks.toLocaleString()}</p>
          <p className="text-xs text-green-600 mt-1">Search result clicks</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Avg CTR</h3>
            <div className="p-2 bg-orange-100 rounded-lg">
              <Eye className="h-5 w-5 text-orange-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-foreground">{analytics.averageCTR.toFixed(1)}%</p>
          <p className="text-xs text-muted-foreground mt-1">Click-through rate</p>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Searches */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-accent-600" />
            Top Search Queries
          </h2>
          <div className="space-y-3">
            {analytics.topSearches.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No search data yet
              </p>
            ) : (
              analytics.topSearches.map((search, index) => (
                <div
                  key={search.query}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <span className="flex items-center justify-center w-8 h-8 bg-accent-100 text-accent-700 rounded-full text-sm font-bold">
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{search.query}</p>
                      <p className="text-xs text-muted-foreground">
                        {search.searchCount} searches • {search.clickCount} clicks
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-foreground">
                      {search.searchCount > 0
                        ? `${Math.round((search.clickCount / search.searchCount) * 100)}%`
                        : "0%"}
                    </p>
                    <p className="text-xs text-muted-foreground">CTR</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Zero Result Searches */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <SearchIcon className="h-5 w-5 text-red-600" />
            Zero Result Searches
          </h2>
          <div className="space-y-2">
            {analytics.zeroResultSearches.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No zero-result searches
              </p>
            ) : (
              analytics.zeroResultSearches.map((search, index) => (
                <div
                  key={index}
                  className="p-3 bg-red-50 rounded-lg border border-red-100"
                >
                  <p className="font-medium text-foreground">{search.query}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(search.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              ))
            )}
          </div>
          {analytics.zeroResultSearches.length > 0 && (
            <p className="text-xs text-muted-foreground mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              💡 Consider creating content for these popular search terms with no results
            </p>
          )}
        </div>
      </div>

      {/* Top Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Projects */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <FolderKanban className="h-5 w-5 text-blue-600" />
            Top Viewed Projects
          </h2>
          <div className="space-y-2">
            {analytics.topViewedProjects.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No project views yet
              </p>
            ) : (
              analytics.topViewedProjects.map((project, index) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="flex items-center justify-center w-6 h-6 bg-blue-200 text-blue-800 rounded text-xs font-bold">
                      {index + 1}
                    </span>
                    <p className="font-medium text-foreground truncate">{project.title}</p>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Eye className="h-4 w-4" />
                    <span className="text-sm font-semibold">{project.views}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top Blogs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-green-600" />
            Top Viewed Blogs
          </h2>
          <div className="space-y-2">
            {analytics.topViewedBlogs.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No blog views yet
              </p>
            ) : (
              analytics.topViewedBlogs.map((blog, index) => (
                <div
                  key={blog.id}
                  className="flex items-center justify-between p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="flex items-center justify-center w-6 h-6 bg-green-200 text-green-800 rounded text-xs font-bold">
                      {index + 1}
                    </span>
                    <p className="font-medium text-foreground truncate">{blog.title}</p>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Eye className="h-4 w-4" />
                    <span className="text-sm font-semibold">{blog.views}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Searches */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-foreground mb-4">
          Recent Searches (Last 24 Hours)
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
                  Query
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
                  Category
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
                  Results
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
                  Time
                </th>
              </tr>
            </thead>
            <tbody>
              {analytics.recentSearches.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-sm text-muted-foreground">
                    No recent searches
                  </td>
                </tr>
              ) : (
                analytics.recentSearches.map((search, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-foreground">{search.query}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">
                      {search.category || "all"}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          search.results === 0
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {search.results}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">
                      {new Date(search.createdAt).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

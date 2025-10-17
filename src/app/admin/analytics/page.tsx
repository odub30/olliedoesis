// src/app/admin/analytics/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { TrendingUp, Search as SearchIcon, MousePointer, Eye, FileText, FolderKanban, Download, Calendar } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import toast, { Toaster } from "react-hot-toast";
import { logError } from "@/lib/logger";

interface AnalyticsData {
  totalSearches: number;
  uniqueQueries: number;
  totalClicks: number;
  averageCTR: number;
  topSearches: Array<{
    query: string;
    searchCount: number;
    clickCount: number;
  }>;
  zeroResultSearches: Array<{
    query: string;
    createdAt: Date;
  }>;
  recentSearches: Array<{
    query: string;
    category: string | null;
    results: number;
    createdAt: Date;
  }>;
  topViewedProjects: Array<{
    id: string;
    title: string;
    slug: string;
    views: number;
  }>;
  topViewedBlogs: Array<{
    id: string;
    title: string;
    slug: string;
    views: number;
  }>;
  searchTrend?: Array<{
    date: string;
    count: number;
  }>;
}

type TimeRange = "7" | "30" | "90" | "all";

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRange>("30");

  const fetchAnalytics = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/analytics?days=${timeRange}`);
      if (!response.ok) throw new Error("Failed to fetch analytics");

      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      logError("Error fetching analytics", error);
      toast.error("Failed to load analytics");
    } finally {
      setIsLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const exportToCSV = () => {
    if (!analytics) return;

    const csvData: string[] = [];

    // Header
    csvData.push("Analytics Export - " + new Date().toLocaleDateString());
    csvData.push("");

    // Summary
    csvData.push("Summary");
    csvData.push("Total Searches," + analytics.totalSearches);
    csvData.push("Unique Queries," + analytics.uniqueQueries);
    csvData.push("Total Clicks," + analytics.totalClicks);
    csvData.push("Average CTR," + analytics.averageCTR.toFixed(2) + "%");
    csvData.push("");

    // Top Searches
    csvData.push("Top Searches");
    csvData.push("Query,Search Count,Click Count,CTR");
    analytics.topSearches.forEach(search => {
      const ctr = search.searchCount > 0
        ? ((search.clickCount / search.searchCount) * 100).toFixed(1)
        : "0";
      csvData.push(`"${search.query}",${search.searchCount},${search.clickCount},${ctr}%`);
    });
    csvData.push("");

    // Zero Result Searches
    csvData.push("Zero Result Searches");
    csvData.push("Query,Date");
    analytics.zeroResultSearches.forEach(search => {
      csvData.push(`"${search.query}",${new Date(search.createdAt).toLocaleDateString()}`);
    });

    const csv = csvData.join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analytics-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast.success("Analytics exported to CSV!");
  };

  if (isLoading || !analytics) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Toaster position="top-center" />

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Search performance, content metrics, and user behavior insights
          </p>
        </div>
        <button
          onClick={exportToCSV}
          className="flex items-center gap-2 px-4 py-2 bg-accent-600 hover:bg-accent-700 text-white rounded-lg transition-colors font-medium"
        >
          <Download className="h-5 w-5" />
          Export CSV
        </button>
      </div>

      {/* Time Range Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <Calendar className="h-5 w-5 text-gray-400" />
          <span className="text-sm font-medium text-foreground">Time Range:</span>
          <div className="flex gap-2">
            {[
              { value: "7" as TimeRange, label: "Last 7 Days" },
              { value: "30" as TimeRange, label: "Last 30 Days" },
              { value: "90" as TimeRange, label: "Last 90 Days" },
              { value: "all" as TimeRange, label: "All Time" },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setTimeRange(option.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  timeRange === option.value
                    ? "bg-accent-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
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
          <p className="text-xs text-green-600 mt-1">
            {timeRange === "all" ? "All time" : `Last ${timeRange} days`}
          </p>
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

      {/* Charts */}
      {analytics.searchTrend && analytics.searchTrend.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">Search Activity Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.searchTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#0066CC" strokeWidth={2} name="Searches" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Top Searches Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-foreground mb-4">Top Search Queries</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={analytics.topSearches.slice(0, 10)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="query" angle={-45} textAnchor="end" height={100} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="searchCount" fill="#0066CC" name="Searches" />
            <Bar dataKey="clickCount" fill="#82ca9d" name="Clicks" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Searches Table */}
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
              Consider creating content for these popular search terms with no results
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
          Recent Searches
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

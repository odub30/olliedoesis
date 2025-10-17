// src/app/admin/page.tsx
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  FolderKanban,
  FileText,
  Image as ImageIcon,
  Eye,
  TrendingUp,
  Plus,
} from "lucide-react";

async function getDashboardStats() {
  const [
    projectsCount,
    publishedProjects,
    blogsCount,
    publishedBlogs,
    imagesCount,
    totalViews,
    recentProjects,
    recentBlogs,
    topSearches,
  ] = await Promise.all([
    prisma.project.count(),
    prisma.project.count({ where: { published: true } }),
    prisma.blog.count(),
    prisma.blog.count({ where: { published: true } }),
    prisma.image.count(),
  prisma.project.aggregate({ _sum: { views: true } }).then((res: { _sum: { views?: number | null } }) => res._sum.views || 0),
    prisma.project.findMany({
      take: 5,
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        title: true,
        published: true,
        updatedAt: true,
      },
    }),
    prisma.blog.findMany({
      take: 5,
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        title: true,
        published: true,
        updatedAt: true,
      },
    }),
    prisma.searchAnalytics.findMany({
      take: 5,
      orderBy: { searchCount: "desc" },
      select: {
        query: true,
        searchCount: true,
        clickCount: true,
      },
    }),
  ]);

  return {
    projectsCount,
    publishedProjects,
    blogsCount,
    publishedBlogs,
    imagesCount,
    totalViews,
    recentProjects,
    recentBlogs,
    topSearches,
  };
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  const statCards = [
    {
      name: "Total Projects",
      value: stats.projectsCount,
      published: stats.publishedProjects,
      icon: FolderKanban,
      color: "bg-blue-500",
      link: "/admin/projects",
    },
    {
      name: "Total Blogs",
      value: stats.blogsCount,
      published: stats.publishedBlogs,
      icon: FileText,
      color: "bg-green-500",
      link: "/admin/blogs",
    },
    {
      name: "Media Files",
      value: stats.imagesCount,
      published: stats.imagesCount,
      icon: ImageIcon,
      color: "bg-purple-500",
      link: "/admin/media",
    },
    {
      name: "Total Views",
      value: stats.totalViews,
      published: stats.totalViews,
      icon: Eye,
      color: "bg-orange-500",
      link: "/admin",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard Overview</h1>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s what&apos;s happening with your content.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Link
            key={stat.name}
            href={stat.link}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.name}</p>
              {stat.name !== "Total Views" && stat.name !== "Media Files" && (
                <p className="text-xs text-green-600 font-medium">
                  {stat.published} published
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-foreground mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/projects/new"
            className="flex items-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-accent-500 hover:bg-accent-50 transition-all group"
          >
            <div className="bg-accent-100 p-2 rounded-lg group-hover:bg-accent-200 transition-colors">
              <Plus className="h-5 w-5 text-accent-600" />
            </div>
            <div>
              <p className="font-semibold text-foreground">New Project</p>
              <p className="text-xs text-muted-foreground">Create a new project</p>
            </div>
          </Link>

          <Link
            href="/admin/blogs/new"
            className="flex items-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-accent-500 hover:bg-accent-50 transition-all group"
          >
            <div className="bg-accent-100 p-2 rounded-lg group-hover:bg-accent-200 transition-colors">
              <Plus className="h-5 w-5 text-accent-600" />
            </div>
            <div>
              <p className="font-semibold text-foreground">New Blog Post</p>
              <p className="text-xs text-muted-foreground">Write a new article</p>
            </div>
          </Link>

          <Link
            href="/admin/media"
            className="flex items-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-accent-500 hover:bg-accent-50 transition-all group"
          >
            <div className="bg-accent-100 p-2 rounded-lg group-hover:bg-accent-200 transition-colors">
              <Plus className="h-5 w-5 text-accent-600" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Upload Media</p>
              <p className="text-xs text-muted-foreground">Add images or files</p>
            </div>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground">Recent Projects</h2>
            <Link
              href="/admin/projects"
              className="text-sm text-accent-600 hover:text-accent-700 font-medium"
            >
              View All →
            </Link>
          </div>
          <div className="space-y-3">
            {stats.recentProjects.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No projects yet. Create your first project!
              </p>
            ) : (
            stats.recentProjects.map((project) => (
                <Link
                  key={project.id}
                  href={`/admin/projects/${project.id}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate group-hover:text-accent-600 transition-colors">
                      {project.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Updated {new Date(project.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      project.published
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {project.published ? "Published" : "Draft"}
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Recent Blogs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground">Recent Blogs</h2>
            <Link
              href="/admin/blogs"
              className="text-sm text-accent-600 hover:text-accent-700 font-medium"
            >
              View All →
            </Link>
          </div>
          <div className="space-y-3">
            {stats.recentBlogs.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No blog posts yet. Write your first post!
              </p>
            ) : (
              stats.recentBlogs.map((blog) => (
                <Link
                  key={blog.id}
                  href={`/admin/blogs/${blog.id}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate group-hover:text-accent-600 transition-colors">
                      {blog.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Updated {new Date(blog.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      blog.published
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {blog.published ? "Published" : "Draft"}
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Top Searches */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground">Top Search Queries</h2>
          <Link
            href="/admin/search"
            className="text-sm text-accent-600 hover:text-accent-700 font-medium"
          >
            View Analytics →
          </Link>
        </div>
        <div className="space-y-2">
          {stats.topSearches.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No search data yet. Searches will appear here once users start searching.
            </p>
          ) : (
            stats.topSearches.map((search, index) => (
              <div
                key={search.query}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent-100 text-accent-600 text-xs font-bold">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-medium text-foreground">{search.query}</p>
                    <p className="text-xs text-muted-foreground">
                      {search.searchCount} searches • {search.clickCount} clicks
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground">
                    {search.clickCount > 0
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
    </div>
  );
}

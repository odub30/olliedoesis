// src/app/admin/blogs/page.tsx
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Eye, Edit, Trash2, ExternalLink, Clock } from "lucide-react";

// Force dynamic rendering for admin pages
export const dynamic = 'force-dynamic';

async function getBlogs() {
  return await prisma.blog.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      author: {
        select: {
          name: true,
          email: true,
        },
      },
      tags: {
        select: {
          id: true,
          name: true,
        },
      },
      _count: {
        select: {
          images: true,
        },
      },
    },
  });
}

export default async function AdminBlogsPage() {
  const blogs = await getBlogs();

  type BlogType = Awaited<ReturnType<typeof getBlogs>>[number]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Blog Posts</h1>
          <p className="text-muted-foreground mt-1">
            Manage your blog articles
          </p>
        </div>
        <Link
          href="/admin/blogs/new"
          className="flex items-center gap-2 px-4 py-2 bg-accent-500 text-white rounded-lg hover:bg-accent-600 transition-colors"
        >
          <Plus className="h-5 w-5" />
          New Post
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-muted-foreground">Total Posts</p>
          <p className="text-2xl font-bold text-foreground">{blogs.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-muted-foreground">Published</p>
          <p className="text-2xl font-bold text-green-600">
            {blogs.filter((b: BlogType) => b.published).length}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-muted-foreground">Drafts</p>
          <p className="text-2xl font-bold text-orange-600">
            {blogs.filter((b: BlogType) => !b.published).length}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-muted-foreground">Total Views</p>
          <p className="text-2xl font-bold text-blue-600">
            {blogs.reduce((acc: number, b: BlogType) => acc + b.views, 0)}
          </p>
        </div>
      </div>

      {/* Blogs Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Post
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tags
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Views
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Published
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {blogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="text-muted-foreground">
                      <p className="text-lg font-medium mb-2">No blog posts yet</p>
                      <p className="text-sm mb-4">
                        Write your first blog post to share your knowledge
                      </p>
                      <Link
                        href="/admin/blogs/new"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-accent-500 text-white rounded-lg hover:bg-accent-600 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                        Create Post
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : (
                blogs.map((blog: BlogType) => (
                  <tr key={blog.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground truncate">
                            {blog.title}
                          </p>
                          <p className="text-sm text-muted-foreground truncate">
                            {blog.excerpt || "No excerpt"}
                          </p>
                          <div className="flex items-center gap-3 mt-1">
                            {blog.featured && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded">
                                ⭐ Featured
                              </span>
                            )}
                            {blog.readTime && (
                              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                {blog.readTime} min read
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          blog.published
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {blog.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {blog.tags.slice(0, 2).map((tag: { id: string; name: string }) => (
                          <span
                            key={tag.id}
                            className="px-2 py-0.5 text-xs bg-purple-100 text-purple-700 rounded"
                          >
                            {tag.name}
                          </span>
                        ))}
                        {blog.tags.length > 2 && (
                          <span className="px-2 py-0.5 text-xs text-muted-foreground">
                            +{blog.tags.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {blog.views}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {blog.publishedAt
                        ? new Date(blog.publishedAt).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <div className="flex items-center justify-end gap-2">
                        {blog.published && (
                          <Link
                            href={`/blogs/${blog.slug}`}
                            target="_blank"
                            className="p-2 text-muted-foreground hover:text-accent-600 hover:bg-accent-50 rounded-lg transition-colors"
                            title="View live"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                        )}
                        <Link
                          href={`/admin/blogs/${blog.id}/edit`}
                          className="p-2 text-muted-foreground hover:text-accent-600 hover:bg-accent-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          className="p-2 text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
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

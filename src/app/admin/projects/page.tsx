// src/app/admin/projects/page.tsx
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Eye, Edit, Trash2, ExternalLink } from "lucide-react";

// Force dynamic rendering for admin pages
export const dynamic = 'force-dynamic';

async function getProjects() {
  return await prisma.project.findMany({
    orderBy: [{ order: "asc" }, { updatedAt: "desc" }],
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

export default async function AdminProjectsPage() {
  const projects = await getProjects();

  type ProjectType = Awaited<ReturnType<typeof getProjects>>[number]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Projects</h1>
          <p className="text-muted-foreground mt-1">
            Manage your portfolio projects
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="flex items-center gap-2 px-4 py-2 bg-accent-500 text-white rounded-lg hover:bg-accent-600 transition-colors"
        >
          <Plus className="h-5 w-5" />
          New Project
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-muted-foreground">Total Projects</p>
          <p className="text-2xl font-bold text-foreground">{projects.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-muted-foreground">Published</p>
          <p className="text-2xl font-bold text-green-600">
            {projects.filter((p: ProjectType) => p.published).length}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-muted-foreground">Drafts</p>
          <p className="text-2xl font-bold text-orange-600">
            {projects.filter((p: ProjectType) => !p.published).length}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-muted-foreground">Featured</p>
          <p className="text-2xl font-bold text-blue-600">
            {projects.filter((p: ProjectType) => p.featured).length}
          </p>
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Technologies
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Views
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Updated
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {projects.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="text-muted-foreground">
                      <p className="text-lg font-medium mb-2">No projects yet</p>
                      <p className="text-sm mb-4">
                        Create your first project to showcase your work
                      </p>
                      <Link
                        href="/admin/projects/new"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-accent-500 text-white rounded-lg hover:bg-accent-600 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                        Create Project
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : (
                projects.map((project: ProjectType) => (
                  <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground truncate">
                            {project.title}
                          </p>
                          <p className="text-sm text-muted-foreground truncate">
                            {project.description}
                          </p>
                          {project.featured && (
                            <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded">
                              ⭐ Featured
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          project.published
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {project.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {project.techStack.slice(0, 3).map((tech: string) => (
                          <span
                            key={tech}
                            className="px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.techStack.length > 3 && (
                          <span className="px-2 py-0.5 text-xs text-muted-foreground">
                            +{project.techStack.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {project.views}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {project.updatedAt ? new Date(project.updatedAt).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <div className="flex items-center justify-end gap-2">
                        {project.published && (
                          <Link
                            href={`/projects/${project.slug}`}
                            target="_blank"
                            className="p-2 text-muted-foreground hover:text-accent-600 hover:bg-accent-50 rounded-lg transition-colors"
                            title="View live"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                        )}
                        <Link
                          href={`/admin/projects/${project.id}/edit`}
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

// src/app/admin/projects/[id]/edit/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2, Trash2 } from "lucide-react";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import { use } from "react";
import { TagSelector, type Tag } from "@/components/admin/TagSelector";
import { logError } from "@/lib/logger";

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  technologies: string[];
  liveUrl: string | null;
  githubUrl: string | null;
  featured: boolean;
  published: boolean;
  order: number;
  tags?: Array<{ id: string; name: string; slug: string }>;
  images?: Array<{ id: string; url: string; alt: string; caption?: string | null }>;
}

export default function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    content: "",
    technologies: "",
    liveUrl: "",
    githubUrl: "",
    featured: false,
    published: false,
    order: 0,
  });

  // Fetch existing project data
  useEffect(() => {
    async function fetchProject() {
      try {
        const response = await fetch(`/api/admin/projects/${resolvedParams.id}`);

        if (response.status === 404) {
          setNotFound(true);
          setIsLoading(false);
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to fetch project");
        }

        const data = await response.json();
        const project: Project = data.project;

        // Populate form with existing data
        setFormData({
          title: project.title,
          slug: project.slug,
          description: project.description,
          content: project.content,
          technologies: project.technologies.join(", "),
          liveUrl: project.liveUrl || "",
          githubUrl: project.githubUrl || "",
          featured: project.featured,
          published: project.published,
          order: project.order,
        });

        // Set selected tags
        if (project.tags) {
          setSelectedTags(project.tags);
        }
      } catch (error) {
        logError("Error fetching project", error);
        toast.error("Failed to load project");
      } finally {
        setIsLoading(false);
      }
    }

    fetchProject();
  }, [resolvedParams.id]);

  // Auto-generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const technologiesArray = formData.technologies
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      const response = await fetch(`/api/admin/projects/${resolvedParams.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          technologies: technologiesArray,
          tagIds: selectedTags.map(tag => tag.id),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update project");
      }

  // response body not needed here
  toast.success('Project updated successfully!');

      // Redirect to projects list after short delay
      setTimeout(() => {
        router.push("/admin/projects");
      }, 1000);
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      logError('Error updating project', err);
      toast.error(err.message || 'Failed to update project');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/admin/projects/${resolvedParams.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete project");
      }

      toast.success("Project deleted successfully!");

      // Redirect to projects list after short delay
      setTimeout(() => {
        router.push("/admin/projects");
      }, 1000);
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      logError('Error deleting project', err);
      toast.error(err.message || 'Failed to delete project');
      setIsDeleting(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-accent-600" />
          <span className="ml-3 text-muted-foreground">Loading project...</span>
        </div>
      </div>
    );
  }

  // 404 state
  if (notFound) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center py-20">
          <h1 className="text-3xl font-bold text-foreground mb-4">Project Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The project you&apos;re looking for doesn&apos;t exist or has been deleted.
          </p>
          <Link
            href="/admin/projects"
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Toaster position="top-center" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/admin/projects"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Projects
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Edit Project</h1>
          <p className="text-muted-foreground mt-2">
            Update project details and content
          </p>
        </div>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isDeleting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Deleting...
            </>
          ) : (
            <>
              <Trash2 className="h-5 w-5" />
              Delete
            </>
          )}
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Main Content Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none"
              placeholder="My Awesome Project"
              required
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Slug *
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none font-mono text-sm"
              placeholder="my-awesome-project"
              pattern="^[a-z0-9-]+$"
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              URL-friendly version of the title (lowercase, hyphens only)
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none resize-none"
              rows={3}
              placeholder="A brief description of your project..."
              required
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Content (Markdown) *
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none resize-none font-mono text-sm"
              rows={15}
              placeholder="# Project Overview&#10;&#10;Full project details in Markdown format..."
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              Supports Markdown formatting
            </p>
          </div>

          {/* Technologies */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Technologies
            </label>
            <input
              type="text"
              value={formData.technologies}
              onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none"
              placeholder="React, TypeScript, Node.js, PostgreSQL"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Comma-separated list of technologies used
            </p>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Tags
            </label>
            <TagSelector
              selectedTags={selectedTags}
              onChange={setSelectedTags}
              placeholder="Search or create tags..."
            />
            <p className="text-xs text-muted-foreground mt-1">
              Add tags to categorize your project (separate from technologies)
            </p>
          </div>

          {/* URLs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Live URL
              </label>
              <input
                type="url"
                value={formData.liveUrl}
                onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none"
                placeholder="https://example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                GitHub URL
              </label>
              <input
                type="url"
                value={formData.githubUrl}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none"
                placeholder="https://github.com/username/repo"
              />
            </div>
          </div>

          {/* Order */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Display Order
            </label>
            <input
              type="number"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none"
              placeholder="0"
              min="0"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Lower numbers appear first (0 = default)
            </p>
          </div>
        </div>

        {/* Settings Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Settings</h2>

          {/* Featured Toggle */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="w-5 h-5 rounded border-gray-300 text-accent-600 focus:ring-accent-500"
            />
            <div>
              <span className="font-medium text-foreground">Featured Project</span>
              <p className="text-sm text-muted-foreground">
                Display prominently on the homepage
              </p>
            </div>
          </label>

          {/* Published Toggle */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.published}
              onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
              className="w-5 h-5 rounded border-gray-300 text-accent-600 focus:ring-accent-500"
            />
            <div>
              <span className="font-medium text-foreground">Published</span>
              <p className="text-sm text-muted-foreground">
                Make this project visible to the public
              </p>
            </div>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <Link
            href="/admin/projects"
            className="px-6 py-2 border border-gray-300 text-foreground rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-accent-600 hover:bg-accent-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                Update Project
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

// src/app/admin/projects/new/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import { TagSelector, type Tag } from "@/components/admin/TagSelector";
import { logError } from "@/lib/logger";

export default function NewProjectPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
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

      const response = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          technologies: technologiesArray,
          tagIds: selectedTags.map(tag => tag.id),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create project");
      }

  // response body not required here
  toast.success('Project created successfully!');

      // Redirect to projects list after short delay
      setTimeout(() => {
        router.push("/admin/projects");
      }, 1000);
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      logError('Error creating project', err);
      toast.error(err.message || 'Failed to create project');
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <h1 className="text-3xl font-bold text-foreground">Create New Project</h1>
          <p className="text-muted-foreground mt-2">
            Add a new project to your portfolio
          </p>
        </div>
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
                Creating...
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                Create Project
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

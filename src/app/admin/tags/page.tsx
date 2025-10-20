// src/app/admin/tags/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Search, Edit2, Trash2, Save, X, Tag as TagIcon } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { logError } from "@/lib/logger";
import { generateSlug } from "@/lib/utils";

interface Tag {
  id: string;
  name: string;
  slug: string;
  count: number;
  _count: {
    projects: number;
    blogs: number;
    images: number;
  };
  totalUsage: number;
}

export default function TagsManagementPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: "", slug: "" });
  const [isCreating, setIsCreating] = useState(false);
  const [createForm, setCreateForm] = useState({ name: "", slug: "" });

  // Fetch tags
  const fetchTags = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);

      const response = await fetch(`/api/admin/tags?${params}`);
      if (!response.ok) throw new Error("Failed to fetch tags");

      const data = await response.json();
      setTags(data.tags);
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      logError('Error fetching tags', err);
      toast.error('Failed to load tags');
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  // Handle create tag
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!createForm.name.trim()) {
      toast.error("Tag name is required");
      return;
    }

    try {
      const response = await fetch("/api/admin/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createForm),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create tag");
      }

      toast.success("Tag created successfully!");
      setIsCreating(false);
      setCreateForm({ name: "", slug: "" });
      fetchTags();
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      logError('Error creating tag', err);
      toast.error(err.message || 'Failed to create tag');
    }
  };

  // Handle edit tag
  const handleEdit = async (id: string) => {
    try {
      const response = await fetch("/api/admin/tags", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...editForm }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update tag");
      }

      toast.success("Tag updated successfully!");
      setEditingId(null);
      fetchTags();
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      logError('Error updating tag', err);
      toast.error(err.message || 'Failed to update tag');
    }
  };

  // Handle delete tag
  const handleDelete = async (tag: Tag) => {
    if (tag.totalUsage > 0) {
      toast.error(
        `Cannot delete tag. It is used by ${tag.totalUsage} item(s).`,
        { duration: 4000 }
      );
      return;
    }

    if (!confirm(`Are you sure you want to delete the tag "${tag.name}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/tags?id=${tag.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete tag");
      }

      toast.success("Tag deleted successfully!");
      fetchTags();
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      logError('Error deleting tag', err);
      toast.error(err.message || 'Failed to delete tag');
    }
  };

  // Start editing a tag
  const startEdit = (tag: Tag) => {
    setEditingId(tag.id);
    setEditForm({ name: tag.name, slug: tag.slug });
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ name: "", slug: "" });
  };

  return (
    <div className="space-y-6">
      <Toaster position="top-center" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tag Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage tags for organizing your content
          </p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="px-4 py-2 bg-accent-600 hover:bg-accent-700 text-white rounded-lg transition-colors font-medium flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          New Tag
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tags..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none"
          />
        </div>
      </div>

      {/* Create Tag Form */}
      {isCreating && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Create New Tag</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Tag Name *
                </label>
                <input
                  type="text"
                  value={createForm.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setCreateForm({
                      name,
                      slug: generateSlug(name),
                    });
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none"
                  placeholder="React"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Slug *
                </label>
                <input
                  type="text"
                  value={createForm.slug}
                  onChange={(e) => setCreateForm({ ...createForm, slug: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none font-mono text-sm"
                  placeholder="react"
                  pattern="^[a-z0-9-]+$"
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Lowercase letters, numbers, and hyphens only
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="submit"
                className="px-4 py-2 bg-accent-600 hover:bg-accent-700 text-white rounded-lg transition-colors font-medium flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Create Tag
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsCreating(false);
                  setCreateForm({ name: "", slug: "" });
                }}
                className="px-4 py-2 border border-gray-300 text-foreground rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tags List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading tags...</p>
          </div>
        ) : tags.length === 0 ? (
          <div className="text-center py-12">
            <TagIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-muted-foreground">
              {searchQuery ? "No tags found matching your search" : "No tags yet. Create your first tag!"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tag
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Slug
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Projects
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Blogs
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Images
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tags.map((tag) => (
                  <tr key={tag.id} className="hover:bg-gray-50">
                    {editingId === tag.id ? (
                      <>
                        <td className="px-6 py-4">
                          <input
                            type="text"
                            value={editForm.name}
                            onChange={(e) => {
                              const name = e.target.value;
                              setEditForm({
                                name,
                                slug: generateSlug(name),
                              });
                            }}
                            className="w-full px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <input
                            type="text"
                            value={editForm.slug}
                            onChange={(e) => setEditForm({ ...editForm, slug: e.target.value })}
                            className="w-full px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none font-mono text-sm"
                            pattern="^[a-z0-9-]+$"
                          />
                        </td>
                        <td className="px-6 py-4 text-center text-sm text-gray-500">
                          {tag._count.projects}
                        </td>
                        <td className="px-6 py-4 text-center text-sm text-gray-500">
                          {tag._count.blogs}
                        </td>
                        <td className="px-6 py-4 text-center text-sm text-gray-500">
                          {tag._count.images}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent-100 text-accent-800">
                            {tag.totalUsage}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button
                            onClick={() => handleEdit(tag.id)}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded text-green-700 bg-green-100 hover:bg-green-200 transition-colors"
                          >
                            <Save className="h-4 w-4 mr-1" />
                            Save
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                          >
                            <X className="h-4 w-4 mr-1" />
                            Cancel
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <span className="font-medium text-foreground">{tag.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <code className="text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded">
                            {tag.slug}
                          </code>
                        </td>
                        <td className="px-6 py-4 text-center text-sm text-gray-500">
                          {tag._count.projects}
                        </td>
                        <td className="px-6 py-4 text-center text-sm text-gray-500">
                          {tag._count.blogs}
                        </td>
                        <td className="px-6 py-4 text-center text-sm text-gray-500">
                          {tag._count.images}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent-100 text-accent-800">
                            {tag.totalUsage}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button
                            onClick={() => startEdit(tag)}
                            className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                          >
                            <Edit2 className="h-4 w-4 mr-1" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(tag)}
                            disabled={tag.totalUsage > 0}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title={tag.totalUsage > 0 ? "Cannot delete tags that are in use" : "Delete tag"}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Stats Summary */}
      {tags.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Tags</p>
              <p className="text-2xl font-bold text-foreground">{tags.length}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">In Projects</p>
              <p className="text-2xl font-bold text-accent-600">
                {tags.reduce((sum, tag) => sum + tag._count.projects, 0)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">In Blogs</p>
              <p className="text-2xl font-bold text-accent-600">
                {tags.reduce((sum, tag) => sum + tag._count.blogs, 0)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">In Images</p>
              <p className="text-2xl font-bold text-accent-600">
                {tags.reduce((sum, tag) => sum + tag._count.images, 0)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

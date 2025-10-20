// src/app/admin/media/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Upload, Image as ImageIcon, Trash2, Edit2, X, Loader2, AlertCircle, Copy, Check, Search } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { TagSelector, type Tag } from "@/components/admin/TagSelector";
import { logError } from "@/lib/logger";

interface Image {
  id: string;
  url: string;
  alt: string;
  caption: string | null;
  width: number | null;
  height: number | null;
  format: string | null;
  size: number | null;
  createdAt: Date;
  project: { id: string; title: string; slug: string } | null;
  blog: { id: string; title: string; slug: string } | null;
  tags: Array<{ id: string; name: string; slug: string }>;
}

export default function MediaLibraryPage() {
  const [images, setImages] = useState<Image[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "projects" | "blogs" | "unattached">("all");
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({ alt: "", caption: "" });
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Upload states
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

  const fetchImages = useCallback(async () => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (filter === "unattached") queryParams.set("unattached", "true");

      const response = await fetch(`/api/admin/upload?${queryParams.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch images");

      const data = await response.json();
      setImages(data.images || []);
    } catch (error) {
      logError("Error fetching images", error);
      toast.error("Failed to load images");
    } finally {
      setIsLoading(false);
    }
  }, [filter]);

  // Fetch images
  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const handleDelete = async (imageId: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    try {
      const response = await fetch(`/api/admin/upload?id=${imageId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete image");

      toast.success("Image deleted successfully");
      fetchImages();
    } catch (error) {
      logError("Error deleting image", error);
      toast.error("Failed to delete image");
    }
  };

  const openEditModal = (image: Image) => {
    setSelectedImage(image);
    setEditForm({
      alt: image.alt,
      caption: image.caption || "",
    });
    setSelectedTags(image.tags);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedImage(null);
    setEditForm({ alt: "", caption: "" });
    setSelectedTags([]);
    setIsSaving(false);
  };

  const handleSave = async () => {
    if (!selectedImage) return;

    setIsSaving(true);

    try {
      const response = await fetch("/api/admin/upload", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedImage.id,
          alt: editForm.alt,
          caption: editForm.caption,
          tagIds: selectedTags.map(tag => tag.id),
        }),
      });

      if (!response.ok) throw new Error("Failed to update image");

      toast.success("Image updated successfully!");
      closeEditModal();
      fetchImages();
    } catch (error) {
      logError("Error updating image", error);
      toast.error("Failed to update image");
    } finally {
      setIsSaving(false);
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopiedUrl(url);
      toast.success("URL copied to clipboard!");
      setTimeout(() => setCopiedUrl(null), 2000);
    });
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return "Unknown";
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  // Upload handlers
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    validateAndSetFiles(files);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    validateAndSetFiles(files);
  };

  const validateAndSetFiles = (files: File[]) => {
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
    const maxSize = 4.5 * 1024 * 1024; // 4.5MB (Vercel server upload limit)

    const validFiles = files.filter((file) => {
      if (!validTypes.includes(file.type)) {
        toast.error(`${file.name}: Invalid file type`);
        return false;
      }
      if (file.size > maxSize) {
        toast.error(`${file.name}: File too large (max 4.5MB)`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      setSelectedFiles((prev) => [...prev, ...validFiles]);
      setIsUploadModalOpen(true);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setIsUploading(true);
    let successCount = 0;
    let failCount = 0;

    for (const file of selectedFiles) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("alt", file.name.replace(/\.[^/.]+$/, "")); // Remove extension for alt text

        const response = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Failed to upload");
        }

        successCount++;
        setUploadProgress((prev) => ({ ...prev, [file.name]: 100 }));
      } catch (error) {
        logError(`Error uploading ${file.name}`, error);
        failCount++;
      }
    }

    // Show results
    if (successCount > 0) {
      toast.success(`Successfully uploaded ${successCount} image${successCount > 1 ? "s" : ""}`);
    }
    if (failCount > 0) {
      toast.error(`Failed to upload ${failCount} image${failCount > 1 ? "s" : ""}`);
    }

    // Reset and refresh
    setIsUploading(false);
    setIsUploadModalOpen(false);
    setSelectedFiles([]);
    setUploadProgress({});
    fetchImages();
  };

  const filteredImages = images.filter((img) => {
    // Apply category filter
    let passesFilter = true;
    if (filter === "all") passesFilter = true;
    else if (filter === "projects") passesFilter = img.project !== null;
    else if (filter === "blogs") passesFilter = img.blog !== null;
    else if (filter === "unattached") passesFilter = img.project === null && img.blog === null;

    if (!passesFilter) return false;

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesAlt = img.alt.toLowerCase().includes(query);
      const matchesCaption = img.caption?.toLowerCase().includes(query);
      const matchesTags = img.tags.some(tag => tag.name.toLowerCase().includes(query));

      return matchesAlt || matchesCaption || matchesTags;
    }

    return true;
  });

  return (
    <div className="space-y-8">
      <Toaster position="top-center" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Media Library</h1>
          <p className="text-muted-foreground">
            Manage images used across your portfolio ({images.length} total)
          </p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-accent-600 hover:bg-accent-700 text-white rounded-lg transition-colors font-medium"
          onClick={() => setIsUploadModalOpen(true)}
        >
          <Upload className="h-5 w-5" />
          Upload Images
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by alt text, caption, or tags..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {[
          { value: "all", label: "All Images" },
          { value: "projects", label: "Projects" },
          { value: "blogs", label: "Blogs" },
          { value: "unattached", label: "Unattached" },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value as 'all' | 'projects' | 'blogs' | 'unattached')}
            className={`px-4 py-2 font-medium transition-colors border-b-2 ${
              filter === tab.value
                ? "border-accent-600 text-accent-600"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-accent-600" />
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredImages.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <ImageIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No images found</h3>
          <p className="text-muted-foreground mb-4">
            {filter === "all"
              ? "Upload your first image to get started"
              : `No images in ${filter} category`}
          </p>
        </div>
      )}

      {/* Image Grid */}
      {!isLoading && filteredImages.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredImages.map((image) => (
            <div
              key={image.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group hover:shadow-lg transition-shadow"
            >
              {/* Image Preview */}
              <div className="relative aspect-video bg-gray-100 overflow-hidden">
                <Image
                  src={image.url}
                  alt={image.alt}
                  fill
                  className="object-cover"
                  unoptimized
                />
                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => copyToClipboard(image.url)}
                    className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                    title="Copy URL"
                  >
                    {copiedUrl === image.url ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4 text-gray-700" />
                    )}
                  </button>
                  <button
                    onClick={() => openEditModal(image)}
                    className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="h-4 w-4 text-gray-700" />
                  </button>
                  <button
                    onClick={() => handleDelete(image.id)}
                    className="p-2 bg-white rounded-lg hover:bg-red-50 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </button>
                </div>
              </div>

              {/* Image Info */}
              <div className="p-4">
                <p className="font-medium text-foreground text-sm mb-1 truncate" title={image.alt}>
                  {image.alt}
                </p>
                {image.caption && (
                  <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                    {image.caption}
                  </p>
                )}

                {/* Meta Info */}
                <div className="flex items-center justify-between text-xs text-muted-foreground mt-2 pt-2 border-t border-gray-100">
                  <span>
                    {image.width && image.height
                      ? `${image.width}×${image.height}`
                      : "No dimensions"}
                  </span>
                  <span>{formatFileSize(image.size)}</span>
                </div>

                {/* Tags */}
                {image.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2 pt-2 border-t border-gray-100">
                    {image.tags.map(tag => (
                      <span key={tag.id} className="inline-block px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">
                        {tag.name}
                      </span>
                    ))}
                  </div>
                )}

                {/* Attachments */}
                {(image.project || image.blog) && (
                  <div className="mt-2 pt-2 border-t border-gray-100 flex flex-wrap gap-1">
                    {image.project && (
                      <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                        Project: {image.project.title}
                      </span>
                    )}
                    {image.blog && (
                      <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                        Blog: {image.blog.title}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && selectedImage && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-foreground">Edit Image</h2>
              <button
                onClick={closeEditModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              {/* Image Preview */}
              <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={selectedImage.url}
                  alt={selectedImage.alt}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>

              {/* Edit Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Alt Text *
                  </label>
                  <input
                    type="text"
                    value={editForm.alt}
                    onChange={(e) => setEditForm({ ...editForm, alt: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none"
                    placeholder="Descriptive alt text for accessibility"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Caption
                  </label>
                  <textarea
                    value={editForm.caption}
                    onChange={(e) => setEditForm({ ...editForm, caption: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none resize-none"
                    rows={3}
                    placeholder="Optional caption"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Tags
                  </label>
                  <TagSelector
                    selectedTags={selectedTags}
                    onChange={setSelectedTags}
                    placeholder="Add tags to categorize this image..."
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Tags help organize and filter images
                  </p>
                </div>

                {/* Image Details */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Dimensions:</span>{" "}
                    {selectedImage.width && selectedImage.height
                      ? `${selectedImage.width} × ${selectedImage.height}`
                      : "Unknown"}
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Format:</span>{" "}
                    {selectedImage.format || "Unknown"}
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Size:</span>{" "}
                    {formatFileSize(selectedImage.size)}
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">URL:</span>{" "}
                    <a
                      href={selectedImage.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent-600 hover:underline truncate block"
                    >
                      {selectedImage.url}
                    </a>
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => copyToClipboard(selectedImage.url)}
                className="mr-auto px-4 py-2 border border-gray-300 text-foreground rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center gap-2"
              >
                {copiedUrl === selectedImage.url ? (
                  <>
                    <Check className="h-4 w-4 text-green-600" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy URL
                  </>
                )}
              </button>
              <button
                onClick={closeEditModal}
                disabled={isSaving}
                className="px-4 py-2 border border-gray-300 text-foreground rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving || !editForm.alt.trim()}
                className="px-6 py-2 bg-accent-600 hover:bg-accent-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-foreground">Upload Images</h2>
              <button
                onClick={() => {
                  setIsUploadModalOpen(false);
                  setSelectedFiles([]);
                  setUploadProgress({});
                }}
                disabled={isUploading}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              {/* Drag and Drop Zone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragging
                    ? "border-accent-500 bg-accent-50"
                    : "border-gray-300 hover:border-accent-400"
                }`}
              >
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-foreground mb-2">
                  Drag and drop images here
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  or click to browse your computer
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                  onChange={handleFileSelect}
                  disabled={isUploading}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-block px-6 py-2 bg-accent-600 hover:bg-accent-700 text-white rounded-lg cursor-pointer transition-colors font-medium disabled:opacity-50"
                >
                  Select Files
                </label>
                <p className="text-xs text-muted-foreground mt-4">
                  Supported: JPG, PNG, GIF, WebP • Max 4.5MB per file
                </p>
              </div>

              {/* Selected Files List */}
              {selectedFiles.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-medium text-foreground">
                    Selected Files ({selectedFiles.length})
                  </h3>
                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {selectedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <ImageIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm text-foreground truncate">
                              {file.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatFileSize(file.size)}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFile(index)}
                          disabled={isUploading}
                          className="p-1 hover:bg-gray-200 rounded transition-colors disabled:opacity-50"
                        >
                          <X className="h-4 w-4 text-gray-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setIsUploadModalOpen(false);
                  setSelectedFiles([]);
                  setUploadProgress({});
                }}
                disabled={isUploading}
                className="px-4 py-2 border border-gray-300 text-foreground rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={isUploading || selectedFiles.length === 0}
                className="px-6 py-2 bg-accent-600 hover:bg-accent-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    Upload {selectedFiles.length} {selectedFiles.length === 1 ? "Image" : "Images"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

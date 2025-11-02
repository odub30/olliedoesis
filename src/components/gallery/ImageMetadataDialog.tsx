"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

interface ImageMetadataDialogProps {
  image: {
    id: string;
    url: string;
    filename?: string | null;
    title?: string | null;
    description?: string | null;
    alt?: string | null;
    caption?: string | null;
    width?: number | null;
    height?: number | null;
    size?: number | null;
    format?: string | null;
    tags?: Array<{ id: string; name: string }>;
  } | null;
  open: boolean;
  onClose: () => void;
  onSave: (imageId: string, metadata: ImageMetadata) => Promise<void>;
}

export interface ImageMetadata {
  title: string;
  alt: string;
  description: string;
  caption: string;
  tagIds?: string[];
}

export function ImageMetadataDialog({
  image,
  open,
  onClose,
  onSave,
}: ImageMetadataDialogProps) {
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<ImageMetadata>({
    title: "",
    alt: "",
    description: "",
    caption: "",
    tagIds: [],
  });

  // Update form data when image changes
  useEffect(() => {
    if (image) {
      setFormData({
        title: image.title || "",
        alt: image.alt || "",
        description: image.description || "",
        caption: image.caption || "",
        tagIds: image.tags?.map((t) => t.id) || [],
      });
    }
  }, [image]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) return;

    setSaving(true);

    try {
      await onSave(image.id, formData);
      onClose();
    } catch (error) {
      console.error("Failed to save metadata:", error);
      alert("Failed to save metadata. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  if (!image) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Image Metadata</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Preview */}
          <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
            <Image
              src={image.url}
              alt={formData.alt || image.filename || "Image preview"}
              fill
              className="object-contain"
              unoptimized
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">
                Title <span className="text-muted-foreground">(optional)</span>
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Enter a descriptive title"
              />
              <p className="text-xs text-muted-foreground">
                User-friendly title for this image
              </p>
            </div>

            {/* Alt Text */}
            <div className="space-y-2">
              <Label htmlFor="alt">
                Alt Text <span className="text-red-500">*</span>
              </Label>
              <Input
                id="alt"
                value={formData.alt}
                onChange={(e) =>
                  setFormData({ ...formData, alt: e.target.value })
                }
                placeholder="Describe the image for accessibility"
                required
              />
              <p className="text-xs text-muted-foreground">
                Required for accessibility
              </p>
            </div>
          </div>

          {/* Caption */}
          <div className="space-y-2">
            <Label htmlFor="caption">
              Caption <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Input
              id="caption"
              value={formData.caption}
              onChange={(e) =>
                setFormData({ ...formData, caption: e.target.value })
              }
              placeholder="Short caption for the image"
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground">
              Brief caption (max 500 characters)
            </p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">
              Description <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Add a detailed description or context"
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              Detailed description or context for the image
            </p>
          </div>

          {/* File Info (read-only) */}
          <div className="space-y-2 p-4 bg-gray-50 rounded-lg border">
            <h4 className="font-medium text-sm text-gray-900">
              File Information
            </h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {image.filename && (
                <div>
                  <span className="text-muted-foreground">Filename:</span>
                  <p className="font-mono text-xs break-all mt-0.5">
                    {image.filename}
                  </p>
                </div>
              )}
              {image.format && (
                <div>
                  <span className="text-muted-foreground">Format:</span>
                  <p className="uppercase mt-0.5">{image.format}</p>
                </div>
              )}
              {image.width && image.height && (
                <div>
                  <span className="text-muted-foreground">Dimensions:</span>
                  <p className="mt-0.5">
                    {image.width} × {image.height} px
                  </p>
                </div>
              )}
              {image.size && (
                <div>
                  <span className="text-muted-foreground">File Size:</span>
                  <p className="mt-0.5">{formatFileSize(image.size)}</p>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving || !formData.alt}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

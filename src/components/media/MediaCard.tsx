// src/components/media/MediaCard.tsx
"use client";

import Image from "next/image";
import { FileImage, Calendar, HardDrive } from "lucide-react";
import { TagBadge } from "@/components/ui/tag-badge";

interface MediaCardProps {
  image: {
    id: string;
    url: string;
    alt: string | null;
    caption: string | null;
    width: number | null;
    height: number | null;
    format: string | null;
    size: number | null;
    createdAt: Date;
    tags: Array<{ id: string; name: string; slug: string }>;
  };
  onClick?: () => void;
}

function formatFileSize(bytes: number | null): string {
  if (!bytes) return "Unknown size";
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(1)} MB`;
}

export function MediaCard({ image, onClick }: MediaCardProps) {
  return (
    <div
      className="group bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer"
      onClick={onClick}
    >
      {/* Image */}
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        <Image
          src={image.url}
          alt={image.alt || "Media item"}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          unoptimized
        />
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <p className="font-semibold text-lg mb-1 line-clamp-2">
              {image.alt || "Untitled"}
            </p>
            {image.caption && (
              <p className="text-sm text-gray-200 line-clamp-2">
                {image.caption}
              </p>
            )}
          </div>
        </div>
        {/* Format Badge */}
        {image.format && (
          <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded uppercase">
            {image.format}
          </div>
        )}
      </div>

      {/* Meta Info */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-accent-600 transition-colors">
          {image.alt || "Untitled Image"}
        </h3>

        {/* Details */}
        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
          {/* Date */}
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>
              {new Date(image.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>

          {/* Dimensions */}
          {image.width && image.height && (
            <div className="flex items-center gap-1">
              <FileImage className="h-3 w-3" />
              <span>
                {image.width} × {image.height}
              </span>
            </div>
          )}

          {/* File Size */}
          {image.size && (
            <div className="flex items-center gap-1">
              <HardDrive className="h-3 w-3" />
              <span>{formatFileSize(image.size)}</span>
            </div>
          )}
        </div>

        {/* Tags */}
        {image.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
            {image.tags.slice(0, 3).map((tag) => (
              <TagBadge
                key={tag.id}
                name={tag.name}
                slug={tag.slug}
                size="sm"
                variant="accent"
                onClick={(e) => e.stopPropagation()}
              />
            ))}
            {image.tags.length > 3 && (
              <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                +{image.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

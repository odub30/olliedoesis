"use client";

import { useState } from "react";
import Image from "next/image";
import { m } from "framer-motion";
import { Edit, ExternalLink, Calendar, Maximize2 } from "lucide-react";

interface GalleryImageCardProps {
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
    createdAt: string;
    tags?: Array<{ id: string; name: string; slug: string }>;
  };
  onEdit?: (image: GalleryImageCardProps['image']) => void;
  onView?: () => void;
  gridSize?: 2 | 3;
  isAdmin?: boolean;
  index?: number;
}

export function GalleryImageCard({
  image,
  onEdit,
  onView,
  gridSize = 3,
  isAdmin = false,
  index = 0,
}: GalleryImageCardProps) {
  // Use title if available, otherwise fall back to alt, caption, or filename
  const displayTitle =
    image.title || image.alt || image.caption || image.filename || "Untitled";
  const displayAlt = image.alt || image.title || image.filename || "Image";

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  // Format date
  const formatDate = (dateString: string): string => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(dateString));
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15,
      },
    },
  } as const;

  return (
    <m.div
      variants={itemVariants}
      whileHover={{
        y: -8,
        transition: { duration: 0.3 },
      }}
      className="group relative bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transition-shadow duration-300 hover:shadow-2xl"
      onClick={onView}
    >
      {/* Image */}
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        <m.div
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.4 }}
          className="w-full h-full"
        >
          <Image
            src={image.url}
            alt={displayAlt}
            fill
            className="object-cover"
            sizes={
              gridSize === 2
                ? "(max-width: 640px) 100vw, 50vw"
                : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            }
            unoptimized
          />
        </m.div>

        {/* Overlay on hover */}
        <m.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
        >
          {/* Image Info */}
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            {/* Title */}
            <m.h3
              initial={{ y: 20, opacity: 0 }}
              whileHover={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.05 }}
              className="font-semibold text-lg mb-1 line-clamp-2"
            >
              {displayTitle}
            </m.h3>

            {/* Description */}
            {image.description && (
              <m.p
                initial={{ y: 20, opacity: 0 }}
                whileHover={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-sm text-gray-200 line-clamp-2 mb-2"
              >
                {image.description}
              </m.p>
            )}

            {/* Tags */}
            {image.tags && image.tags.length > 0 && (
              <m.div
                initial={{ y: 20, opacity: 0 }}
                whileHover={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.15 }}
                className="flex flex-wrap gap-1 mb-2"
              >
                {image.tags.slice(0, 3).map((tag, tagIndex) => (
                  <span
                    key={tag.id}
                    className="text-xs px-2 py-0.5 bg-white/20 backdrop-blur-sm rounded-full"
                  >
                    {tag.name}
                  </span>
                ))}
                {image.tags.length > 3 && (
                  <span className="text-xs px-2 py-0.5 bg-white/20 backdrop-blur-sm rounded-full">
                    +{image.tags.length - 3}
                  </span>
                )}
              </m.div>
            )}

            {/* Metadata */}
            <m.div
              initial={{ y: 20, opacity: 0 }}
              whileHover={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-3 text-xs text-gray-300"
            >
              {image.width && image.height && (
                <span className="flex items-center gap-1">
                  <Maximize2 className="w-3 h-3" />
                  {image.width} × {image.height}
                </span>
              )}
              {image.size && (
                <span className="flex items-center gap-1">
                  {formatFileSize(image.size)}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatDate(image.createdAt)}
              </span>
            </m.div>
          </div>

          {/* Action buttons (top right) */}
          <div className="absolute top-4 right-4 flex gap-2 scale-0 group-hover:scale-100 transition-transform duration-300 origin-top-right">
            {/* Edit button (if admin) */}
            {isAdmin && onEdit && (
              <m.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(image);
                }}
                className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
                aria-label="Edit image metadata"
              >
                <Edit className="w-5 h-5 text-white" />
              </m.button>
            )}

            {/* View full size icon */}
            <m.div
              whileHover={{ scale: 1.1 }}
              className="p-2 bg-white/20 backdrop-blur-sm rounded-full"
            >
              <ExternalLink className="w-5 h-5 text-white" />
            </m.div>
          </div>
        </m.div>
      </div>
    </m.div>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FolderKanban, FileText, ImageIcon, Tag, Calendar, Eye, Clock } from "lucide-react";

// Simple date formatter
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
};

interface SearchCardProps {
  id: string;
  title: string;
  type: "project" | "blog" | "image" | "tag";
  url: string;
  description?: string;
  excerpt?: string;
  thumbnail?: string;
  tags?: string[];
  technologies?: string[];
  views?: number;
  readTime?: number;
  count?: number;
  publishedAt?: string;
  createdAt?: string;
  featured?: boolean;
  query?: string;
  onClickTrack?: (url: string, type: string, id: string) => void;
}

export default function SearchCard({
  id,
  title,
  type,
  url,
  description,
  excerpt,
  thumbnail,
  tags = [],
  technologies = [],
  views,
  readTime,
  count,
  publishedAt,
  createdAt,
  featured,
  query,
  onClickTrack,
}: SearchCardProps) {
  const handleClick = () => {
    if (onClickTrack) {
      onClickTrack(url, type, id);
    }
  };

  // Get icon based on type
  const getIcon = () => {
    switch (type) {
      case "project":
        return <FolderKanban className="h-5 w-5" />;
      case "blog":
        return <FileText className="h-5 w-5" />;
      case "image":
        return <ImageIcon className="h-5 w-5" />;
      case "tag":
        return <Tag className="h-5 w-5" />;
    }
  };

  // Get badge color based on type
  const getBadgeColor = () => {
    switch (type) {
      case "project":
        return "bg-carolina/10 text-carolina border-carolina/20";
      case "blog":
        return "bg-green-100 text-green-700 border-green-200";
      case "image":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "tag":
        return "bg-orange-100 text-orange-700 border-orange-200";
    }
  };

  // Highlight search terms in text
  const highlightText = (text: string, query?: string) => {
    if (!query || !text) return text;

    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <mark key={i} className="bg-yellow-200 text-gray-900 px-0.5 rounded">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  const contentText = description || excerpt || "";
  const displayDate = publishedAt || createdAt;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
      className="group"
    >
      <Link
        href={url}
        onClick={handleClick}
        className="block h-full bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-carolina hover:shadow-lg transition-all duration-300"
      >
        {/* Thumbnail Image */}
        {thumbnail && (
          <div className="relative w-full h-48 bg-gray-100 overflow-hidden">
            <Image
              src={thumbnail}
              alt={title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {featured && (
              <div className="absolute top-3 right-3 px-2 py-1 bg-carolina text-white text-xs font-semibold rounded">
                Featured
              </div>
            )}
          </div>
        )}

        {/* Card Content */}
        <div className="p-5">
          {/* Type Badge */}
          <div className="flex items-center gap-2 mb-3">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium border rounded-full ${getBadgeColor()}`}>
              {getIcon()}
              <span className="capitalize">{type}</span>
            </span>
            {featured && !thumbnail && (
              <span className="px-2 py-1 bg-carolina/10 text-carolina text-xs font-semibold rounded">
                Featured
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-carolina transition-colors duration-200 line-clamp-2">
            {highlightText(title, query)}
          </h3>

          {/* Description/Excerpt */}
          {contentText && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-3">
              {highlightText(contentText, query)}
            </p>
          )}

          {/* Tags or Technologies */}
          {(tags.length > 0 || technologies.length > 0) && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {(tags.length > 0 ? tags : technologies).slice(0, 4).map((item, index) => (
                <span
                  key={index}
                  className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded hover:bg-gray-200 transition-colors"
                >
                  #{item}
                </span>
              ))}
              {((tags.length > 0 ? tags : technologies).length > 4) && (
                <span className="px-2 py-0.5 text-xs text-gray-500">
                  +{(tags.length > 0 ? tags : technologies).length - 4} more
                </span>
              )}
            </div>
          )}

          {/* Metadata Footer */}
          <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-3">
              {displayDate && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatDate(displayDate)}
                </span>
              )}
              {readTime && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {readTime} min read
                </span>
              )}
              {count !== undefined && (
                <span className="flex items-center gap-1">
                  <Tag className="h-3.5 w-3.5" />
                  {count} posts
                </span>
              )}
            </div>
            {views !== undefined && views > 0 && (
              <span className="flex items-center gap-1 text-carolina">
                <Eye className="h-3.5 w-3.5" />
                {views.toLocaleString()} views
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

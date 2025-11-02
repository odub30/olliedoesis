// src/components/ui/tag-badge.tsx
"use client";

import Link from "next/link";
import { Tag } from "lucide-react";
import { cn } from "@/lib/utils";

interface TagBadgeProps {
  name: string;
  slug: string;
  clickable?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "primary" | "accent" | "outline";
  showIcon?: boolean;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}

const sizeClasses = {
  sm: "px-2 py-1 text-xs",
  md: "px-3 py-1.5 text-sm",
  lg: "px-4 py-2 text-base",
};

const variantClasses = {
  default: "bg-accent-50 text-accent-700 hover:bg-accent-100",
  primary: "bg-primary-50 text-primary-700 hover:bg-primary-100",
  accent: "bg-blue-100 text-blue-700 hover:bg-blue-200",
  outline: "bg-transparent border border-current text-current hover:bg-current/10",
};

export function TagBadge({
  name,
  slug,
  clickable = true,
  size = "md",
  variant = "default",
  showIcon = false,
  className,
  onClick,
}: TagBadgeProps) {
  const baseClasses = cn(
    "inline-flex items-center gap-1.5 font-medium rounded-full transition-all duration-200",
    sizeClasses[size],
    variantClasses[variant],
    clickable && "cursor-pointer hover:shadow-md",
    className
  );

  if (!clickable) {
    return (
      <span className={baseClasses} onClick={onClick}>
        {showIcon && <Tag className="h-3 w-3" />}
        {name}
      </span>
    );
  }

  return (
    <Link
      href={`/tags/${slug}`}
      className={baseClasses}
      onClick={(e) => {
        if (onClick) {
          e.preventDefault();
          onClick(e);
        }
      }}
    >
      {showIcon && <Tag className="h-3 w-3" />}
      {name}
    </Link>
  );
}

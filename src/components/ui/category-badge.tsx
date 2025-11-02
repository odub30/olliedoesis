// src/components/ui/category-badge.tsx
"use client";

import Link from "next/link";
import { Folder } from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoryBadgeProps {
  name: string;
  slug: string;
  clickable?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "primary" | "accent";
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
  default: "bg-primary/10 text-primary-700",
  primary: "bg-primary-100 text-primary-800",
  accent: "bg-accent-100 text-accent-800",
};

export function CategoryBadge({
  name,
  slug,
  clickable = true,
  size = "md",
  variant = "default",
  showIcon = true,
  className,
  onClick,
}: CategoryBadgeProps) {
  const baseClasses = cn(
    "inline-flex items-center gap-1.5 font-semibold rounded-full transition-all duration-200",
    sizeClasses[size],
    variantClasses[variant],
    clickable && "cursor-pointer hover:shadow-md hover:brightness-95",
    className
  );

  if (!clickable) {
    return (
      <span className={baseClasses} onClick={onClick}>
        {showIcon && <Folder className="h-3 w-3" />}
        {name}
      </span>
    );
  }

  return (
    <Link
      href={`/categories/${slug}`}
      className={baseClasses}
      onClick={(e) => {
        if (onClick) {
          e.preventDefault();
          onClick(e);
        }
      }}
    >
      {showIcon && <Folder className="h-3 w-3" />}
      {name}
    </Link>
  );
}

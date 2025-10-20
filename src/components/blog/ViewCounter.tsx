'use client';

import { Eye } from 'lucide-react';
import { useEffect, useState } from 'react';

export interface ViewCounterProps {
  /** Initial view count */
  views: number;
  /** Whether to animate the count on mount */
  animate?: boolean;
  /** Show the eye icon */
  showIcon?: boolean;
  /** Custom className for styling */
  className?: string;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Format style */
  format?: 'full' | 'compact';
}

export function ViewCounter({
  views,
  animate = false,
  showIcon = true,
  className = '',
  size = 'md',
  format = 'full',
}: ViewCounterProps) {
  const [displayCount, setDisplayCount] = useState(animate ? 0 : views);

  useEffect(() => {
    if (!animate || views === 0) {
      setDisplayCount(views);
      return;
    }

    // Animate the counter from 0 to views
    const duration = 1000; // 1 second
    const steps = 30;
    const increment = views / steps;
    const stepDuration = duration / steps;

    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      if (currentStep >= steps) {
        setDisplayCount(views);
        clearInterval(timer);
      } else {
        setDisplayCount(Math.floor(increment * currentStep));
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [views, animate]);

  // Format the number
  const formatNumber = (num: number): string => {
    if (format === 'compact') {
      if (num >= 1000000) {
        return `${(num / 1000000).toFixed(1)}M`;
      }
      if (num >= 1000) {
        return `${(num / 1000).toFixed(1)}k`;
      }
    }
    return num.toLocaleString();
  };

  // Size-based styling
  const sizeStyles = {
    sm: {
      container: 'text-xs gap-1',
      icon: 'h-3 w-3',
    },
    md: {
      container: 'text-sm gap-2',
      icon: 'h-4 w-4',
    },
    lg: {
      container: 'text-base gap-2',
      icon: 'h-5 w-5',
    },
  };

  const styles = sizeStyles[size];

  return (
    <div
      className={`inline-flex items-center ${styles.container} ${className}`}
      aria-label={`${views} views`}
    >
      {showIcon && <Eye className={styles.icon} />}
      <span>{formatNumber(displayCount)} views</span>
    </div>
  );
}

/**
 * ViewCounterBadge - A styled badge variant
 */
export interface ViewCounterBadgeProps {
  views: number;
  animate?: boolean;
  variant?: 'default' | 'accent' | 'success';
}

export function ViewCounterBadge({
  views,
  animate = false,
  variant = 'default',
}: ViewCounterBadgeProps) {
  const variantStyles = {
    default: 'bg-gray-100 text-gray-700 border-gray-200',
    accent: 'bg-accent-50 text-accent-700 border-accent-200',
    success: 'bg-green-50 text-green-700 border-green-200',
  };

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium ${variantStyles[variant]}`}
    >
      <Eye className="h-3 w-3" />
      <ViewCounter
        views={views}
        animate={animate}
        showIcon={false}
        className="text-inherit"
        size="sm"
      />
    </div>
  );
}

/**
 * ViewCounterCard - A card variant with stats
 */
export interface ViewCounterCardProps {
  views: number;
  title?: string;
  subtitle?: string;
  animate?: boolean;
}

export function ViewCounterCard({
  views,
  title = 'Total Views',
  subtitle,
  animate = true,
}: ViewCounterCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-accent-50 rounded-lg">
          <Eye className="h-5 w-5 text-accent-600" />
        </div>
        <div className="flex-1">
          <div className="text-sm text-gray-600">{title}</div>
          <div className="text-2xl font-bold text-gray-900">
            <ViewCounter
              views={views}
              animate={animate}
              showIcon={false}
              format="compact"
            />
          </div>
        </div>
      </div>
      {subtitle && <div className="text-xs text-gray-500 mt-2">{subtitle}</div>}
    </div>
  );
}

/**
 * Usage examples:
 *
 * // Basic usage
 * <ViewCounter views={1234} />
 *
 * // With animation
 * <ViewCounter views={1234} animate />
 *
 * // Compact format
 * <ViewCounter views={15000} format="compact" />
 * // Output: "15k views"
 *
 * // Different sizes
 * <ViewCounter views={500} size="sm" />
 * <ViewCounter views={500} size="lg" />
 *
 * // Badge variant
 * <ViewCounterBadge views={1234} variant="accent" />
 *
 * // Card variant
 * <ViewCounterCard
 *   views={12345}
 *   title="Total Views"
 *   subtitle="Last updated today"
 * />
 *
 * // Custom styling
 * <ViewCounter
 *   views={999}
 *   className="text-blue-600 font-semibold"
 * />
 */

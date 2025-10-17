'use client';

import { useEffect, useState } from 'react';

export interface ReadingProgressProps {
  /** Target element selector to track (defaults to article or main content) */
  target?: string;
  /** Color of the progress bar (defaults to accent color) */
  color?: string;
  /** Height of the progress bar in pixels */
  height?: number;
  /** Show percentage number */
  showPercentage?: boolean;
}

export function ReadingProgress({
  target,
  color = 'rgb(var(--accent-600))',
  height = 3,
  showPercentage = false,
}: ReadingProgressProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const calculateProgress = () => {
      let element: HTMLElement | null = null;

      // If target selector is provided, use that
      if (target) {
        element = document.querySelector(target);
      }

      // Otherwise, try to find the main content area
      if (!element) {
        element = document.querySelector('article') ||
                  document.querySelector('main') ||
                  document.querySelector('[role="main"]');
      }

      // If still no element found, track the entire document
      if (!element) {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrollTop = window.scrollY;
        const scrollPercent = (scrollTop / documentHeight) * 100;
        setProgress(Math.min(Math.max(scrollPercent, 0), 100));
        return;
      }

      // Track the specific element
      const rect = element.getBoundingClientRect();
      const elementTop = rect.top + window.scrollY;
      const elementHeight = element.offsetHeight;
      const windowHeight = window.innerHeight;
      const scrollTop = window.scrollY;

      // Calculate how much of the element has been scrolled past
      const elementBottom = elementTop + elementHeight;
      const viewportBottom = scrollTop + windowHeight;

      if (scrollTop < elementTop) {
        // Haven't reached the element yet
        setProgress(0);
      } else if (viewportBottom > elementBottom) {
        // Scrolled past the element
        setProgress(100);
      } else {
        // Currently reading the element
        const elementVisible = viewportBottom - elementTop;
        const totalScrollable = elementHeight + windowHeight;
        const scrollPercent = (elementVisible / totalScrollable) * 100;
        setProgress(Math.min(Math.max(scrollPercent, 0), 100));
      }
    };

    // Calculate on mount
    calculateProgress();

    // Recalculate on scroll and resize
    window.addEventListener('scroll', calculateProgress, { passive: true });
    window.addEventListener('resize', calculateProgress, { passive: true });

    return () => {
      window.removeEventListener('scroll', calculateProgress);
      window.removeEventListener('resize', calculateProgress);
    };
  }, [target]);

  return (
    <>
      {/* Progress bar */}
      <div
        className="fixed top-0 left-0 right-0 z-50 bg-gray-200"
        style={{ height: `${height}px` }}
        role="progressbar"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Reading progress"
      >
        <div
          className="h-full transition-all duration-150 ease-out"
          style={{
            width: `${progress}%`,
            backgroundColor: color,
          }}
        />
      </div>

      {/* Optional percentage indicator */}
      {showPercentage && progress > 0 && progress < 100 && (
        <div
          className="fixed top-4 right-4 z-50 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full
                   shadow-lg border border-gray-200 text-sm font-medium text-gray-700"
        >
          {Math.round(progress)}%
        </div>
      )}
    </>
  );
}

/**
 * Usage examples:
 *
 * // Basic usage (tracks entire article)
 * <ReadingProgress />
 *
 * // Track specific element
 * <ReadingProgress target="#blog-content" />
 *
 * // Custom styling
 * <ReadingProgress
 *   color="#3b82f6"
 *   height={4}
 *   showPercentage
 * />
 *
 * // With CSS variable
 * <ReadingProgress color="rgb(var(--accent-500))" />
 */

'use client';

import { DemoEmbed } from './DemoEmbed';

export interface Demo {
  title: string;
  url: string;
  type: 'codesandbox' | 'stackblitz' | 'github-pages';
  description?: string;
  height?: string;
}

export interface DemoGridProps {
  demos: Demo[];
  columns?: 1 | 2 | 3;
  showDescription?: boolean;
}

/**
 * DemoGrid Component
 *
 * Display a grid of interactive demo embeds.
 * Perfect for showing multiple code examples in a blog post.
 *
 * Example usage:
 * ```tsx
 * const demos = [
 *   {
 *     title: "Basic Example",
 *     url: "https://codesandbox.io/embed/...",
 *     type: "codesandbox",
 *     description: "A simple demo"
 *   }
 * ];
 *
 * <DemoGrid demos={demos} columns={2} />
 * ```
 */
export function DemoGrid({
  demos,
  columns = 1,
  showDescription = true,
}: DemoGridProps) {
  if (demos.length === 0) {
    return null;
  }

  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 lg:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3',
  };

  return (
    <div className={`grid gap-8 ${gridClasses[columns]}`}>
      {demos.map((demo, index) => (
        <div key={index} className="space-y-2">
          {showDescription && demo.description && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {demo.title}
              </h3>
              <p className="text-sm text-gray-600">{demo.description}</p>
            </div>
          )}

          <DemoEmbed
            src={demo.url}
            title={demo.title}
            platform={demo.type}
            height={demo.height}
          />
        </div>
      ))}
    </div>
  );
}

/**
 * DemoList - Vertical list variant
 */
export function DemoList({ demos }: { demos: Demo[] }) {
  return (
    <div className="space-y-12">
      {demos.map((demo, index) => (
        <div key={index}>
          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {index + 1}. {demo.title}
            </h3>
            {demo.description && (
              <p className="text-gray-600">{demo.description}</p>
            )}
          </div>

          <DemoEmbed
            src={demo.url}
            title={demo.title}
            platform={demo.type}
            height={demo.height}
          />
        </div>
      ))}
    </div>
  );
}

/**
 * DemoTabs - Tabbed interface for multiple demos
 */
import { useState } from 'react';

export function DemoTabs({ demos }: { demos: Demo[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (demos.length === 0) {
    return null;
  }

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      {/* Tab Headers */}
      <div className="bg-gray-50 border-b border-gray-200 overflow-x-auto">
        <div className="flex">
          {demos.map((demo, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`px-6 py-3 text-sm font-medium whitespace-nowrap transition-colors
                ${
                  activeIndex === index
                    ? 'bg-white text-accent-600 border-b-2 border-accent-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
            >
              {demo.title}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-4 bg-white">
        {demos[activeIndex].description && (
          <p className="text-sm text-gray-600 mb-4">
            {demos[activeIndex].description}
          </p>
        )}

        <DemoEmbed
          src={demos[activeIndex].url}
          title={demos[activeIndex].title}
          platform={demos[activeIndex].type}
          height={demos[activeIndex].height || '600px'}
        />
      </div>
    </div>
  );
}

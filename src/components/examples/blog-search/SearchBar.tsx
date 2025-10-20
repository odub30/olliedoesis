'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  initialQuery?: string;
  placeholder?: string;
  onSearch?: (query: string) => void;
}

/**
 * SearchBar Component
 *
 * A client component that provides an interactive search experience with:
 * - URL-based state management (shareable/bookmarkable)
 * - Debounced search (300ms)
 * - useTransition for non-blocking updates
 * - Keyboard shortcuts (⌘K / Ctrl+K)
 * - Loading states
 * - Clear button
 *
 * Example usage:
 * ```tsx
 * <SearchBar initialQuery={searchParams.q} placeholder="Search posts..." />
 * ```
 */
export function SearchBar({
  initialQuery = '',
  placeholder = 'Search posts... (⌘K)',
  onSearch,
}: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState(initialQuery);
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle search with debouncing and transitions
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      startTransition(() => {
        const params = new URLSearchParams(searchParams.toString());

        if (query) {
          params.set('q', query);
        } else {
          params.delete('q');
        }

        // Update URL without full page reload
        const newUrl = `?${params.toString()}`;
        router.push(newUrl);

        // Call optional callback
        if (onSearch) {
          onSearch(query);
        }
      });
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [query, router, searchParams, onSearch]);

  // Keyboard shortcut: Cmd/Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleClear = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  return (
    <div className="w-full">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search
            className={`h-5 w-5 transition-colors ${
              isPending ? 'text-accent-500 animate-pulse' : 'text-gray-400'
            }`}
          />
        </div>

        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg
                   focus:ring-2 focus:ring-accent-500 focus:border-transparent
                   transition-all text-gray-900 placeholder-gray-500"
          aria-label="Search"
        />

        {query && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-gray-50 rounded-r-lg
                     transition-colors"
            aria-label="Clear search"
            type="button"
          >
            <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      {isPending && (
        <p className="mt-2 text-sm text-gray-500 flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-full bg-accent-500 animate-pulse" />
          Searching...
        </p>
      )}
    </div>
  );
}

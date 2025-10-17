// src/components/search/GlobalSearch.tsx
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, Clock, X, Loader2, FileText, FolderKanban, Image as ImageIcon, Tag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { logError } from "@/lib/logger";

interface SearchResult {
  id: string;
  title: string;
  type: "project" | "blog" | "image" | "tag";
  url: string;
  description?: string;
  excerpt?: string;
}

interface SearchResults {
  projects: SearchResult[];
  blogs: SearchResult[];
  images: SearchResult[];
  tags: SearchResult[];
}

export default function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults>({
    projects: [],
    blogs: [],
    images: [],
    tags: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        logError("Failed to parse recent searches", e);
      }
    }
  }, []);

  // Save recent search
  const saveRecentSearch = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setRecentSearches((prev) => {
      const updated = [searchQuery, ...prev.filter((s) => s !== searchQuery)].slice(0, 5);
      localStorage.setItem("recentSearches", JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Keyboard shortcut handler (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }

      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Debounced search
  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults({ projects: [], blogs: [], images: [], tags: [] });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(searchQuery)}&category=all&limit=5`
      );

      if (!response.ok) {
        throw new Error("Search failed");
      }

      const data = await response.json();
      setResults(data.results || { projects: [], blogs: [], images: [], tags: [] });
    } catch (error) {
      logError("Search error", error);
      setResults({ projects: [], blogs: [], images: [], tags: [] });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle input change with debouncing
  const handleInputChange = useCallback(
    (value: string) => {
      setQuery(value);
      setIsLoading(true);

      // Clear previous timer
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      // Set new timer (300ms delay)
      debounceTimer.current = setTimeout(() => {
        performSearch(value);
      }, 300);
    },
    [performSearch]
  );

  // Handle result click
  const handleResultClick = useCallback(
    (url: string) => {
      saveRecentSearch(query);
      setIsOpen(false);
      setQuery("");
      router.push(url);
    },
    [query, router, saveRecentSearch]
  );

  // Handle recent search click
  const handleRecentClick = useCallback(
    (searchQuery: string) => {
      setQuery(searchQuery);
      handleInputChange(searchQuery);
    },
    [handleInputChange]
  );

  // View all results
  const handleViewAll = useCallback(() => {
    if (query.trim()) {
      saveRecentSearch(query);
      setIsOpen(false);
      router.push(`/search?q=${encodeURIComponent(query)}`);
      setQuery("");
    }
  }, [query, router, saveRecentSearch]);

  // Get total results count
  const totalResults =
    results.projects.length + results.blogs.length + results.images.length + results.tags.length;

  // Get icon for result type
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "project":
        return <FolderKanban className="h-4 w-4" />;
      case "blog":
        return <FileText className="h-4 w-4" />;
      case "image":
        return <ImageIcon className="h-4 w-4" />;
      case "tag":
        return <Tag className="h-4 w-4" />;
      default:
        return <Search className="h-4 w-4" />;
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 transition-all group"
      >
        <Search className="h-4 w-4 text-white/80 group-hover:text-white" />
        <span className="text-sm text-white/80 group-hover:text-white hidden sm:inline">
          Search...
        </span>
        <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-white/10 rounded border border-white/20 text-white/60">
          <span className="text-xs">⌘K</span>
        </kbd>
      </button>

      {/* Search Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl bg-white rounded-2xl shadow-2xl z-50 overflow-hidden"
            >
              {/* Search Input */}
              <div className="flex items-center gap-3 p-4 border-b border-gray-200">
                <Search className="h-5 w-5 text-gray-400" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder="Search projects, blogs, images, tags..."
                  className="flex-1 text-base bg-transparent border-none outline-none text-gray-900 placeholder-gray-400"
                />
                {isLoading && <Loader2 className="h-5 w-5 text-accent-500 animate-spin" />}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-400" />
                </button>
              </div>

              {/* Results */}
              <div className="max-h-96 overflow-y-auto">
                {!query.trim() && recentSearches.length > 0 && (
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-gray-500 mb-2 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Recent Searches
                    </h3>
                    <div className="space-y-1">
                      {recentSearches.map((search, index) => (
                        <button
                          key={index}
                          onClick={() => handleRecentClick(search)}
                          className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors text-sm text-gray-700"
                        >
                          {search}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {query.trim() && totalResults === 0 && !isLoading && (
                  <div className="p-8 text-center">
                    <Search className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No results found for &quot;{query}&quot;</p>
                    <p className="text-sm text-gray-400 mt-1">Try a different search term</p>
                  </div>
                )}

                {query.trim() && totalResults > 0 && (
                  <div className="p-4 space-y-4">
                    {/* Projects */}
                    {results.projects.length > 0 && (
                      <div>
                        <h3 className="text-xs font-semibold text-gray-500 mb-2 uppercase">
                          Projects
                        </h3>
                        <div className="space-y-1">
                          {results.projects.map((result) => (
                            <button
                              key={result.id}
                              onClick={() => handleResultClick(result.url)}
                              className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors group"
                            >
                              <div className="flex items-start gap-3">
                                <div className="p-2 bg-blue-50 rounded-lg text-blue-600 group-hover:bg-blue-100 transition-colors">
                                  {getTypeIcon(result.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-gray-900 truncate">
                                    {result.title}
                                  </p>
                                  {result.description && (
                                    <p className="text-sm text-gray-500 truncate">
                                      {result.description}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Blogs */}
                    {results.blogs.length > 0 && (
                      <div>
                        <h3 className="text-xs font-semibold text-gray-500 mb-2 uppercase">
                          Blog Posts
                        </h3>
                        <div className="space-y-1">
                          {results.blogs.map((result) => (
                            <button
                              key={result.id}
                              onClick={() => handleResultClick(result.url)}
                              className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors group"
                            >
                              <div className="flex items-start gap-3">
                                <div className="p-2 bg-green-50 rounded-lg text-green-600 group-hover:bg-green-100 transition-colors">
                                  {getTypeIcon(result.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-gray-900 truncate">
                                    {result.title}
                                  </p>
                                  {result.excerpt && (
                                    <p className="text-sm text-gray-500 truncate">
                                      {result.excerpt}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* View All Button */}
                    <button
                      onClick={handleViewAll}
                      className="w-full py-2 text-center text-sm font-medium text-accent-600 hover:text-accent-700 hover:bg-accent-50 rounded-lg transition-colors"
                    >
                      View all {totalResults} results →
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

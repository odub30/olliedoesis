"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, X, Loader2, FolderKanban, FileText, Image, Tag } from "lucide-react";
import Link from "next/link";

interface GlobalSearchProps {
  onClose?: () => void;
}

export default function GlobalSearch({ onClose }: GlobalSearchProps = {}) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Handle closing the modal
  const handleClose = () => {
    setIsOpen(false);
    if (onClose) {
      onClose();
    }
  };

  // Keyboard shortcut (Cmd+K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === "Escape") {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Open immediately if controlled by parent
  useEffect(() => {
    if (onClose) {
      setIsOpen(true);
    }
  }, [onClose]);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setResults(null);
    }
  }, [isOpen]);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults(null);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(query)}&category=${selectedCategory}&limit=5`
        );
        const data = await response.json();

        // Format results for display
        if (data.results) {
          const formattedResults = {
            projects: data.results.projects || [],
            blogs: data.results.blogs || [],
            images: data.results.images || [],
            tags: data.results.tags || [],
            totalResults: data.total || 0,
          };
          setResults(formattedResults);
        }
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, selectedCategory]);

  const handleResultClick = async (url: string, type: string, id: string) => {
    // Track click
    try {
      await fetch("/api/search/track-click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
          clickedResult: url,
          resultType: type,
          resultId: id,
        }),
      });
    } catch (error) {
      console.error("Failed to track click:", error);
    }
    handleClose();
  };

  const categories = [
    { id: "all", label: "All" },
    { id: "projects", label: "Projects" },
    { id: "blogs", label: "Blogs" },
    { id: "images", label: "Images" },
    { id: "tags", label: "Tags" },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case "project":
        return <FolderKanban className="h-4 w-4" />;
      case "blog":
        return <FileText className="h-4 w-4" />;
      case "image":
        return <Image className="h-4 w-4" />;
      case "tag":
        return <Tag className="h-4 w-4" />;
      default:
        return <Search className="h-4 w-4" />;
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:border-accent-500 transition-colors group"
      >
        <Search className="h-4 w-4 text-muted-foreground group-hover:text-accent-600" />
        <span className="text-sm text-muted-foreground">Search...</span>
        <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium text-muted-foreground bg-gray-100 border border-gray-300 rounded">
          <span>⌘</span>K
        </kbd>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="flex items-start justify-center min-h-screen p-4 pt-[10vh]">
        <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden">
          {/* Search Header */}
          <div className="flex items-center gap-3 p-4 border-b border-gray-200">
            <Search className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            <input
              type="text"
              placeholder="Search projects, blogs, images..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 text-lg outline-none"
              autoFocus
            />
            {isLoading && <Loader2 className="h-5 w-5 text-accent-500 animate-spin" />}
            <button
              onClick={handleClose}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>

          {/* Category Filters */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200 bg-gray-50">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  selectedCategory === cat.id
                    ? "bg-accent-500 text-white"
                    : "bg-white text-muted-foreground hover:bg-gray-100"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Results */}
          <div className="max-h-[60vh] overflow-y-auto">
            {!query && (
              <div className="p-8 text-center text-muted-foreground">
                <Search className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p className="text-sm">Start typing to search...</p>
              </div>
            )}

            {query && !isLoading && results && results.totalResults === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                <p className="text-sm">No results found for &quot;{query}&quot;</p>
              </div>
            )}

            {results && results.totalResults > 0 && (
              <div className="divide-y divide-gray-200">
                {/* Projects */}
                {results.projects.length > 0 && (
                  <div className="p-4">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-3">
                      Projects ({results.projects.length})
                    </h3>
                    <div className="space-y-2">
                      {results.projects.slice(0, 5).map((item: any) => (
                        <Link
                          key={item.id}
                          href={item.url}
                          onClick={() => handleResultClick(item.url, item.type, item.id)}
                          className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent-50 transition-colors group"
                        >
                          <div className="p-2 bg-blue-100 rounded-lg">
                            {getIcon(item.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground group-hover:text-accent-600 transition-colors">
                              {item.title}
                            </p>
                            <p className="text-sm text-muted-foreground truncate">
                              {item.description}
                            </p>
                            {item.technologies && (
                              <div className="flex gap-1 mt-1">
                                {item.technologies.slice(0, 3).map((tech: string) => (
                                  <span
                                    key={tech}
                                    className="px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded"
                                  >
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Blogs */}
                {results.blogs.length > 0 && (
                  <div className="p-4">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-3">
                      Blogs ({results.blogs.length})
                    </h3>
                    <div className="space-y-2">
                      {results.blogs.slice(0, 5).map((item: any) => (
                        <Link
                          key={item.id}
                          href={item.url}
                          onClick={() => handleResultClick(item.url, item.type, item.id)}
                          className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent-50 transition-colors group"
                        >
                          <div className="p-2 bg-green-100 rounded-lg">
                            {getIcon(item.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground group-hover:text-accent-600 transition-colors">
                              {item.title}
                            </p>
                            <p className="text-sm text-muted-foreground truncate">
                              {item.excerpt}
                            </p>
                            {item.readTime && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {item.readTime} min read
                              </p>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tags */}
                {results.tags.length > 0 && (
                  <div className="p-4">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-3">
                      Tags ({results.tags.length})
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {results.tags.slice(0, 5).map((item: any) => (
                        <Link
                          key={item.id}
                          href={item.url}
                          onClick={() => handleResultClick(item.url, item.type, item.id)}
                          className="px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm font-medium"
                        >
                          #{item.name || item.title} ({item.count})
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-4">
                <kbd className="px-2 py-1 bg-white border border-gray-300 rounded">↑↓</kbd>
                <span>Navigate</span>
                <kbd className="px-2 py-1 bg-white border border-gray-300 rounded">Enter</kbd>
                <span>Select</span>
                <kbd className="px-2 py-1 bg-white border border-gray-300 rounded">Esc</kbd>
                <span>Close</span>
              </div>
              {results && results.totalResults > 0 && (
                <Link
                  href={`/search?q=${encodeURIComponent(query)}&category=${selectedCategory}`}
                  onClick={handleClose}
                  className="text-accent-600 hover:text-accent-700 font-medium"
                >
                  View all {results.totalResults} result{results.totalResults !== 1 ? 's' : ''} →
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

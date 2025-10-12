"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, Loader2, FolderKanban, FileText, ImageIcon, Tag, SlidersHorizontal } from "lucide-react";
import SearchCard from "@/components/search/SearchCard";

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialQuery = searchParams.get("q") || "";
  const initialCategory = searchParams.get("category") || "all";
  const initialSort = searchParams.get("sort") || "relevance";
  const initialPage = parseInt(searchParams.get("page") || "1");

  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState(initialSort);
  const [page, setPage] = useState(initialPage);
  const [results, setResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Categories configuration
  const categories = [
    { id: "all", label: "All", icon: Search },
    { id: "projects", label: "Projects", icon: FolderKanban },
    { id: "blogs", label: "Blogs", icon: FileText },
    { id: "images", label: "Images", icon: ImageIcon },
    { id: "tags", label: "Tags", icon: Tag },
  ];

  // Sort options
  const sortOptions = [
    { id: "relevance", label: "Relevance" },
    { id: "recent", label: "Most Recent" },
    { id: "views", label: "Most Viewed" },
  ];

  // Perform search
  const performSearch = useCallback(async (searchQuery: string, searchCategory: string, searchPage: number) => {
    if (!searchQuery.trim()) {
      setResults(null);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(searchQuery)}&category=${searchCategory}&page=${searchPage}&limit=20`
      );
      const data = await response.json();

      if (data.results) {
        // Apply client-side sorting if needed
        let allResults: any[] = [];

        // Combine all results
        if (data.results.projects) allResults.push(...data.results.projects);
        if (data.results.blogs) allResults.push(...data.results.blogs);
        if (data.results.images) allResults.push(...data.results.images);
        if (data.results.tags) allResults.push(...data.results.tags);

        // Sort results based on selected option
        if (sort === "recent") {
          allResults.sort((a, b) => {
            const dateA = new Date(a.publishedAt || a.createdAt || 0).getTime();
            const dateB = new Date(b.publishedAt || b.createdAt || 0).getTime();
            return dateB - dateA;
          });
        } else if (sort === "views") {
          allResults.sort((a, b) => (b.views || 0) - (a.views || 0));
        }
        // For 'relevance', API already sorts by relevance score

        setResults({ all: allResults });
        setTotalResults(data.total || 0);
        setTotalPages(data.totalPages || 0);
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [sort]);

  // Update URL params when search state changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (category !== "all") params.set("category", category);
    if (sort !== "relevance") params.set("sort", sort);
    if (page > 1) params.set("page", page.toString());

    router.push(`/search?${params.toString()}`, { scroll: false });

    if (query) {
      performSearch(query, category, page);
    }
  }, [query, category, page, performSearch, router]);

  // Re-search when sort changes
  useEffect(() => {
    if (query) {
      performSearch(query, category, page);
    }
  }, [sort]);

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    if (query) {
      performSearch(query, category, 1);
    }
  };

  // Track click on search result
  const handleResultClick = async (url: string, type: string, id: string) => {
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
  };

  // Pagination handlers
  const goToPage = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Search</h1>
          <p className="text-gray-600">
            Find projects, blog posts, images, and tags across the site
          </p>
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="relative max-w-3xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for anything..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-carolina focus:border-transparent text-lg"
              autoFocus
            />
            {isLoading && (
              <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-carolina animate-spin" />
            )}
          </div>
        </form>

        {/* Filters Bar */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Category Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
              <SlidersHorizontal className="h-5 w-5 text-gray-400 flex-shrink-0" />
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setCategory(cat.id);
                      setPage(1);
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
                      category === cat.id
                        ? "bg-carolina text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="text-sm font-medium text-gray-700 whitespace-nowrap">
                Sort by:
              </label>
              <select
                id="sort"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-carolina focus:border-transparent"
              >
                {sortOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        {results && totalResults > 0 && (
          <div className="mb-6">
            <p className="text-gray-600">
              Found <span className="font-semibold text-carolina">{totalResults}</span> result
              {totalResults !== 1 ? "s" : ""} for{" "}
              <span className="font-semibold text-gray-900">&ldquo;{query}&rdquo;</span>
            </p>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <Loader2 className="h-12 w-12 text-carolina animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Searching...</p>
            </div>
          </div>
        )}

        {/* Empty State - No Query */}
        {!query && !isLoading && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-200">
            <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Start Your Search
            </h3>
            <p className="text-gray-600 mb-6">
              Enter a search term to find projects, blogs, images, and tags
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <span className="text-sm text-gray-500">Try searching for:</span>
              {["React", "TypeScript", "Next.js", "Design"].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setQuery(suggestion)}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-carolina hover:text-white transition-colors text-sm"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Empty State - No Results */}
        {query && !isLoading && results && totalResults === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-200">
            <div className="max-w-md mx-auto">
              <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Results Found
              </h3>
              <p className="text-gray-600 mb-6">
                We couldn&apos;t find any results for &ldquo;{query}&rdquo;. Try adjusting your search or
                filters.
              </p>
              <div className="space-y-2 text-sm text-gray-500 text-left">
                <p className="font-medium text-gray-700">Suggestions:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Check your spelling</li>
                  <li>Try more general keywords</li>
                  <li>Try different category filters</li>
                  <li>Remove some filters</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Results Grid */}
        {results && totalResults > 0 && !isLoading && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {results.all.map((item: any) => (
                <SearchCard
                  key={`${item.type}-${item.id}`}
                  id={item.id}
                  title={item.title || item.name || item.alt}
                  type={item.type}
                  url={item.url}
                  description={item.description}
                  excerpt={item.excerpt}
                  thumbnail={item.type === "image" ? item.url : undefined}
                  tags={item.tags?.map((t: any) => t.name) || []}
                  technologies={item.technologies || []}
                  views={item.views}
                  readTime={item.readTime}
                  count={item.count}
                  publishedAt={item.publishedAt}
                  createdAt={item.createdAt}
                  featured={item.featured}
                  query={query}
                  onClickTrack={handleResultClick}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => goToPage(page - 1)}
                  disabled={page === 1}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 7) {
                      pageNum = i + 1;
                    } else if (page <= 4) {
                      pageNum = i + 1;
                    } else if (page >= totalPages - 3) {
                      pageNum = totalPages - 6 + i;
                    } else {
                      pageNum = page - 3 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => goToPage(pageNum)}
                        className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                          page === pageNum
                            ? "bg-carolina text-white"
                            : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => goToPage(page + 1)}
                  disabled={page === totalPages}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

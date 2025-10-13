"use client";

import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { debounce } from "@/lib/searchUtils";

interface SearchBarProps {
  onSearchChange: (query: string) => void;
  placeholder?: string;
  debounceMs?: number;
  resultCount?: number;
}

export function SearchBar({
  onSearchChange,
  placeholder = "Search blog posts...",
  debounceMs = 300,
  resultCount
}: SearchBarProps) {
  const [inputValue, setInputValue] = useState("");

  // Create debounced search function
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      onSearchChange(query);
    }, debounceMs),
    [onSearchChange, debounceMs]
  );

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    debouncedSearch(value);
  };

  // Clear search
  const handleClear = () => {
    setInputValue("");
    onSearchChange("");
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Focus search on Ctrl+K or Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        document.getElementById("blog-search")?.focus();
      }

      // Clear on Escape
      if (e.key === "Escape" && document.activeElement?.id === "blog-search") {
        handleClear();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="space-y-2">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          id="blog-search"
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="pl-10 pr-10 h-12 text-base"
          aria-label="Search blog posts"
        />
        {inputValue && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Clear search"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="flex items-center justify-between text-sm">
        <p className="text-muted-foreground">
          {inputValue ? (
            <>
              {resultCount !== undefined && (
                <span className="font-medium text-foreground">
                  {resultCount} {resultCount === 1 ? "result" : "results"}
                </span>
              )}
              {resultCount !== undefined && " found"}
            </>
          ) : (
            <span>
              Press <kbd className="px-2 py-0.5 text-xs border rounded bg-muted">Ctrl+K</kbd> to focus search
            </span>
          )}
        </p>
        {inputValue && (
          <button
            onClick={handleClear}
            className="text-primary hover:underline font-medium"
          >
            Clear search
          </button>
        )}
      </div>
    </div>
  );
}

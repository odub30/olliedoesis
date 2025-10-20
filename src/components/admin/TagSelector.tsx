// src/components/admin/TagSelector.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { X, Plus, Search, Loader2 } from "lucide-react";
import { logError } from "@/lib/logger";

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

interface TagSelectorProps {
  selectedTags: Tag[];
  onChange: (tags: Tag[]) => void;
  placeholder?: string;
  maxTags?: number;
}

export function TagSelector({
  selectedTags,
  onChange,
  placeholder = "Search or create tags...",
  maxTags,
}: TagSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch tags from API
  useEffect(() => {
    async function fetchTags() {
      setIsLoading(true);
      try {
        const response = await fetch("/api/admin/tags");
        if (response.ok) {
          const data = await response.json();
          setAvailableTags(data.tags || []);
        }
      } catch (error) {
        logError("Error fetching tags", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTags();
  }, []);

  // Filter tags based on search query and exclude already selected
  const filteredTags = availableTags.filter(
    (tag) =>
      !selectedTags.some((selected) => selected.id === tag.id) &&
      (tag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tag.slug.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Check if search query matches an existing tag exactly
  const exactMatch = availableTags.find(
    (tag) => tag.name.toLowerCase() === searchQuery.toLowerCase()
  );

  // Check if we can create a new tag
  const canCreateTag =
    searchQuery.trim().length > 0 &&
    !exactMatch &&
    !selectedTags.some(
      (tag) => tag.name.toLowerCase() === searchQuery.toLowerCase()
    );

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Add existing tag
  const addTag = (tag: Tag) => {
    if (maxTags && selectedTags.length >= maxTags) {
      return;
    }
    onChange([...selectedTags, tag]);
    setSearchQuery("");
    setIsOpen(false);
    inputRef.current?.focus();
  };

  // Create and add new tag
  const createTag = async () => {
    if (!canCreateTag || isCreating) return;

    const tagName = searchQuery.trim();
    const tagSlug = tagName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    setIsCreating(true);

    try {
      const response = await fetch("/api/admin/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: tagName,
          slug: tagSlug,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const newTag: Tag = data.tag;

        // Add to available tags
        setAvailableTags([...availableTags, newTag]);

        // Add to selected tags
        onChange([...selectedTags, newTag]);

        setSearchQuery("");
        setIsOpen(false);
        inputRef.current?.focus();
      } else {
        const error = await response.json();
        logError("Error creating tag", error);
        alert(error.error || "Failed to create tag");
      }
    } catch (error) {
      logError("Error creating tag", error);
      alert("Failed to create tag");
    } finally {
      setIsCreating(false);
    }
  };

  // Remove tag
  const removeTag = (tagId: string) => {
    onChange(selectedTags.filter((tag) => tag.id !== tagId));
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (canCreateTag) {
        createTag();
      } else if (filteredTags.length > 0) {
        addTag(filteredTags[0]);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setSearchQuery("");
    } else if (e.key === "Backspace" && searchQuery === "" && selectedTags.length > 0) {
      // Remove last tag when backspace is pressed with empty input
      removeTag(selectedTags[selectedTags.length - 1].id);
    }
  };

  return (
    <div className="relative">
      {/* Selected Tags Display */}
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedTags.map((tag) => (
          <span
            key={tag.id}
            className="inline-flex items-center gap-1 px-3 py-1 bg-accent-100 text-accent-800 rounded-full text-sm font-medium"
          >
            {tag.name}
            <button
              type="button"
              onClick={() => removeTag(tag.id)}
              className="hover:bg-accent-200 rounded-full p-0.5 transition-colors"
              aria-label={`Remove ${tag.name}`}
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>

      {/* Input Field */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {isLoading ? (
            <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />
          ) : (
            <Search className="h-4 w-4 text-gray-400" />
          )}
        </div>
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          disabled={maxTags !== undefined && selectedTags.length >= maxTags}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
          placeholder={
            maxTags !== undefined && selectedTags.length >= maxTags
              ? `Maximum ${maxTags} tags selected`
              : placeholder
          }
        />
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {/* Loading State */}
          {isLoading && (
            <div className="px-4 py-3 text-sm text-muted-foreground text-center">
              Loading tags...
            </div>
          )}

          {/* No Results */}
          {!isLoading && filteredTags.length === 0 && !canCreateTag && (
            <div className="px-4 py-3 text-sm text-muted-foreground text-center">
              {searchQuery ? "No tags found" : "No tags available"}
            </div>
          )}

          {/* Create New Tag Option */}
          {canCreateTag && (
            <button
              type="button"
              onClick={createTag}
              disabled={isCreating}
              className="w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-accent-50 transition-colors border-b border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreating ? (
                <Loader2 className="h-4 w-4 text-accent-600 animate-spin" />
              ) : (
                <Plus className="h-4 w-4 text-accent-600" />
              )}
              <span className="text-sm">
                <span className="text-accent-600 font-medium">Create tag:</span>{" "}
                <span className="text-foreground">{searchQuery}</span>
              </span>
            </button>
          )}

          {/* Existing Tags */}
          {filteredTags.map((tag) => (
            <button
              key={tag.id}
              type="button"
              onClick={() => addTag(tag)}
              className="w-full flex items-center justify-between px-4 py-2 text-left hover:bg-gray-50 transition-colors"
            >
              <span className="text-sm text-foreground font-medium">{tag.name}</span>
              <span className="text-xs text-muted-foreground font-mono">{tag.slug}</span>
            </button>
          ))}
        </div>
      )}

      {/* Helper Text */}
      {maxTags && (
        <p className="text-xs text-muted-foreground mt-1">
          {selectedTags.length}/{maxTags} tags selected
        </p>
      )}
    </div>
  );
}

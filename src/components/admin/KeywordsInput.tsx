// src/components/admin/KeywordsInput.tsx
"use client";

import { useState } from "react";
import { X, Plus } from "lucide-react";

interface KeywordsInputProps {
  keywords: string[];
  onChange: (keywords: string[]) => void;
  placeholder?: string;
}

export function KeywordsInput({ keywords, onChange, placeholder = "Add keyword..." }: KeywordsInputProps) {
  const [inputValue, setInputValue] = useState("");

  const handleAdd = () => {
    const trimmed = inputValue.trim().toLowerCase();
    if (trimmed && !keywords.includes(trimmed)) {
      onChange([...keywords, trimmed]);
      setInputValue("");
    }
  };

  const handleRemove = (keyword: string) => {
    onChange(keywords.filter(k => k !== keyword));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="space-y-2">
      {/* Selected Keywords */}
      {keywords.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {keywords.map((keyword) => (
            <span
              key={keyword}
              className="inline-flex items-center gap-1 px-3 py-1 bg-accent-100 text-accent-700 rounded-full text-sm"
            >
              {keyword}
              <button
                type="button"
                onClick={() => handleRemove(keyword)}
                className="hover:bg-accent-200 rounded-full p-0.5 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none"
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={handleAdd}
          disabled={!inputValue.trim()}
          className="px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add
        </button>
      </div>
    </div>
  );
}

// src/components/admin/CodeExamplesManager.tsx
"use client";

import { useState } from "react";
import { Plus, Trash2, GripVertical } from "lucide-react";

export interface CodeExample {
  id?: string;
  title: string;
  url: string;
  type: string;
  order: number;
}

interface CodeExamplesManagerProps {
  examples: CodeExample[];
  onChange: (examples: CodeExample[]) => void;
}

export function CodeExamplesManager({ examples, onChange }: CodeExamplesManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newExample, setNewExample] = useState<Omit<CodeExample, "order">>({
    title: "",
    url: "",
    type: "github",
  });

  const handleAdd = () => {
    if (newExample.title && newExample.url) {
      onChange([
        ...examples,
        {
          ...newExample,
          order: examples.length,
        },
      ]);
      setNewExample({ title: "", url: "", type: "github" });
      setIsAdding(false);
    }
  };

  const handleRemove = (index: number) => {
    const updated = examples.filter((_, i) => i !== index);
    // Reorder remaining items
    onChange(updated.map((ex, i) => ({ ...ex, order: i })));
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...examples];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    onChange(updated.map((ex, i) => ({ ...ex, order: i })));
  };

  const moveDown = (index: number) => {
    if (index === examples.length - 1) return;
    const updated = [...examples];
    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
    onChange(updated.map((ex, i) => ({ ...ex, order: i })));
  };

  return (
    <div className="space-y-4">
      {/* Existing Examples */}
      {examples.map((example, index) => (
        <div
          key={index}
          className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center gap-3"
        >
          <div className="flex flex-col gap-1">
            <button
              type="button"
              onClick={() => moveUp(index)}
              disabled={index === 0}
              className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
            >
              <GripVertical className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => moveDown(index)}
              disabled={index === examples.length - 1}
              className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
            >
              <GripVertical className="h-4 w-4" />
            </button>
          </div>
          <div className="flex-1">
            <div className="font-medium text-foreground">{example.title}</div>
            <div className="text-sm text-muted-foreground truncate">{example.url}</div>
            <div className="text-xs text-accent-600 mt-1">
              {example.type === "github" && "GitHub"}
              {example.type === "stackblitz" && "StackBlitz"}
              {example.type === "codesandbox" && "CodeSandbox"}
              {example.type === "other" && "Other"}
            </div>
          </div>
          <button
            type="button"
            onClick={() => handleRemove(index)}
            className="text-red-500 hover:text-red-700 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}

      {/* Add New */}
      {isAdding ? (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
          <input
            type="text"
            value={newExample.title}
            onChange={(e) => setNewExample({ ...newExample, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none"
            placeholder="Example title (e.g., 'View on GitHub')"
          />
          <input
            type="url"
            value={newExample.url}
            onChange={(e) => setNewExample({ ...newExample, url: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none"
            placeholder="URL (e.g., https://github.com/...)"
          />
          <select
            value={newExample.type}
            onChange={(e) => setNewExample({ ...newExample, type: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none"
          >
            <option value="github">GitHub</option>
            <option value="stackblitz">StackBlitz</option>
            <option value="codesandbox">CodeSandbox</option>
            <option value="other">Other</option>
          </select>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleAdd}
              className="px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setNewExample({ title: "", url: "", type: "github" });
              }}
              className="px-4 py-2 border border-gray-300 text-foreground rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="w-full px-4 py-3 border-2 border-dashed border-gray-300 text-muted-foreground rounded-lg hover:border-accent-500 hover:text-accent-600 transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Code Example
        </button>
      )}
    </div>
  );
}

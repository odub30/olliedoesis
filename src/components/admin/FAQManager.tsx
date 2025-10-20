// src/components/admin/FAQManager.tsx
"use client";

import { useState } from "react";
import { Plus, Trash2, GripVertical } from "lucide-react";

export interface FAQ {
  id?: string;
  question: string;
  answer: string;
  order: number;
}

interface FAQManagerProps {
  faqs: FAQ[];
  onChange: (faqs: FAQ[]) => void;
}

export function FAQManager({ faqs, onChange }: FAQManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newFAQ, setNewFAQ] = useState<Omit<FAQ, "order">>({
    question: "",
    answer: "",
  });

  const handleAdd = () => {
    if (newFAQ.question && newFAQ.answer) {
      onChange([
        ...faqs,
        {
          ...newFAQ,
          order: faqs.length,
        },
      ]);
      setNewFAQ({ question: "", answer: "" });
      setIsAdding(false);
    }
  };

  const handleRemove = (index: number) => {
    const updated = faqs.filter((_, i) => i !== index);
    // Reorder remaining items
    onChange(updated.map((faq, i) => ({ ...faq, order: i })));
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...faqs];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    onChange(updated.map((faq, i) => ({ ...faq, order: i })));
  };

  const moveDown = (index: number) => {
    if (index === faqs.length - 1) return;
    const updated = [...faqs];
    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
    onChange(updated.map((faq, i) => ({ ...faq, order: i })));
  };

  return (
    <div className="space-y-4">
      {/* Existing FAQs */}
      {faqs.map((faq, index) => (
        <div
          key={index}
          className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-start gap-3"
        >
          <div className="flex flex-col gap-1 pt-1">
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
              disabled={index === faqs.length - 1}
              className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
            >
              <GripVertical className="h-4 w-4" />
            </button>
          </div>
          <div className="flex-1">
            <div className="font-medium text-foreground mb-1">{faq.question}</div>
            <div className="text-sm text-muted-foreground">{faq.answer}</div>
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
            value={newFAQ.question}
            onChange={(e) => setNewFAQ({ ...newFAQ, question: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none"
            placeholder="Question"
          />
          <textarea
            value={newFAQ.answer}
            onChange={(e) => setNewFAQ({ ...newFAQ, answer: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none resize-none"
            rows={4}
            placeholder="Answer"
          />
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
                setNewFAQ({ question: "", answer: "" });
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
          Add FAQ
        </button>
      )}
    </div>
  );
}

'use client';

/**
 * FAQAccordion Component
 *
 * A fully accessible, SEO-optimized FAQ accordion component designed for
 * both traditional search engines and AI-powered answer engines (AEO).
 *
 * Features:
 * - Full keyboard navigation (Tab, Enter, Space, Arrow keys)
 * - ARIA attributes for screen readers (WCAG 2.1 AA compliant)
 * - Smooth animations with Framer Motion
 * - Optional JSON-LD schema markup
 * - Mobile-responsive design
 * - Zero layout shift (CLS optimization)
 */

import { useState, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';
import type { FAQAccordionProps, FAQItem } from '@/types/faq';
import { generateFAQSchemaScript } from '@/lib/faq-schema';

export function FAQAccordion({
  faqs,
  heading = 'Frequently Asked Questions',
  description,
  allowMultiple = false,
  className = '',
  includeSchema = true,
  onToggle,
}: FAQAccordionProps) {
  // Track which FAQ items are open
  const [openItems, setOpenItems] = useState<Set<string | number>>(new Set());

  // Generate unique IDs for accessibility
  const baseId = useId();

  /**
   * Toggle an FAQ item open/closed
   * Implements single or multiple expand behavior
   */
  const toggleItem = (id: string | number) => {
    setOpenItems((prev) => {
      const newSet = allowMultiple ? new Set(prev) : new Set<string | number>();

      if (prev.has(id)) {
        newSet.delete(id);
        onToggle?.(id, false);
      } else {
        newSet.add(id);
        onToggle?.(id, true);
      }

      return newSet;
    });
  };

  /**
   * Handle keyboard navigation
   * - Enter/Space: Toggle item
   * - Arrow Down: Move to next item
   * - Arrow Up: Move to previous item
   * - Home: Focus first item
   * - End: Focus last item
   */
  const handleKeyDown = (
    e: React.KeyboardEvent,
    id: string | number,
    index: number
  ) => {
    const buttons = document.querySelectorAll('[data-faq-button]');

    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        toggleItem(id);
        break;

      case 'ArrowDown':
        e.preventDefault();
        if (index < buttons.length - 1) {
          (buttons[index + 1] as HTMLElement).focus();
        }
        break;

      case 'ArrowUp':
        e.preventDefault();
        if (index > 0) {
          (buttons[index - 1] as HTMLElement).focus();
        }
        break;

      case 'Home':
        e.preventDefault();
        (buttons[0] as HTMLElement).focus();
        break;

      case 'End':
        e.preventDefault();
        (buttons[buttons.length - 1] as HTMLElement).focus();
        break;
    }
  };

  return (
    <>
      {/* JSON-LD Schema for SEO */}
      {includeSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: generateFAQSchemaScript(faqs),
          }}
        />
      )}

      {/* FAQ Section */}
      <section
        className={`faq-section py-16 px-4 ${className}`}
        aria-labelledby={`${baseId}-heading`}
      >
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
              <HelpCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h2
              id={`${baseId}-heading`}
              className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4"
            >
              {heading}
            </h2>
            {description && (
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                {description}
              </p>
            )}
          </div>

          {/* FAQ Items */}
          <div className="space-y-4" role="list">
            {faqs.map((faq, index) => {
              const isOpen = openItems.has(faq.id);
              const itemId = `${baseId}-item-${faq.id}`;
              const buttonId = `${itemId}-button`;
              const panelId = `${itemId}-panel`;

              return (
                <div
                  key={faq.id}
                  role="listitem"
                  className="faq-item bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  {/* Question Button */}
                  <h3>
                    <button
                      id={buttonId}
                      data-faq-button
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => toggleItem(faq.id)}
                      onKeyDown={(e) => handleKeyDown(e, faq.id, index)}
                      className="w-full text-left p-6 flex items-center justify-between gap-4 group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900 rounded-lg transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    >
                      {/* Question Text */}
                      <span className="text-lg font-semibold text-gray-900 dark:text-white pr-4 flex-1">
                        {faq.question}
                      </span>

                      {/* Expand/Collapse Icon */}
                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                        className="flex-shrink-0"
                      >
                        <ChevronDown
                          className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                          aria-hidden="true"
                        />
                      </motion.div>
                    </button>
                  </h3>

                  {/* Answer Panel */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={panelId}
                        role="region"
                        aria-labelledby={buttonId}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{
                          height: 'auto',
                          opacity: 1,
                          transition: {
                            height: {
                              duration: 0.3,
                              ease: [0.4, 0.0, 0.2, 1],
                            },
                            opacity: {
                              duration: 0.25,
                              ease: 'easeIn',
                            },
                          },
                        }}
                        exit={{
                          height: 0,
                          opacity: 0,
                          transition: {
                            height: {
                              duration: 0.3,
                              ease: [0.4, 0.0, 0.2, 1],
                            },
                            opacity: {
                              duration: 0.15,
                              ease: 'easeOut',
                            },
                          },
                        }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 pt-2">
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Optional Helper Text */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Still have questions?{' '}
              <a
                href="/contact"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Get in touch
              </a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

/**
 * FAQ Item Component (Standalone)
 *
 * Use this for embedding single FAQ items within content
 */
export function FAQItem({ faq }: { faq: FAQItem }) {
  const [isOpen, setIsOpen] = useState(false);
  const itemId = useId();

  return (
    <div className="faq-item-standalone my-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
      <button
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left p-4 flex items-center justify-between gap-4 group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg"
      >
        <span className="font-medium text-gray-900 dark:text-white">
          {faq.question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-gray-500" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">
              <p className="text-gray-700 dark:text-gray-300">{faq.answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

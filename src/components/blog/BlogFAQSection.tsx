'use client';

/**
 * Blog FAQ Section Component
 *
 * Client component wrapper for FAQAccordion that can be embedded
 * in blog posts. Handles analytics tracking and provides consistent
 * styling for blog post FAQ sections.
 */

import { FAQAccordion } from '@/components/features/faq/FAQAccordion';
import type { FAQItem } from '@/types/faq';

interface BlogFAQSectionProps {
  faqs: FAQItem[];
  heading?: string;
  description?: string;
}

export function BlogFAQSection({
  faqs,
  heading = 'Frequently Asked Questions',
  description = 'Common questions about this topic',
}: BlogFAQSectionProps) {
  // Optional: Track FAQ interactions for analytics
  const handleToggle = (id: string | number, isOpen: boolean) => {
    if (isOpen && typeof window !== 'undefined') {
      // Track with your analytics (Google Analytics, Plausible, etc.)
      // Use a safe runtime guard instead of @ts-ignore so ESLint/TS can reason about types.
      const anyWindow = window as Window & { gtag?: (...args: unknown[]) => void };
      if (typeof anyWindow.gtag === 'function') {
        anyWindow.gtag('event', 'faq_opened', {
          event_category: 'engagement',
          event_label: `FAQ ${id}`,
        });
      }
    }
  };

  return (
    <div className="my-16 -mx-4 px-4 sm:-mx-6 sm:px-6 md:-mx-12 md:px-12 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 py-16 rounded-2xl">
      <FAQAccordion
        faqs={faqs}
        heading={heading}
        description={description}
        allowMultiple={false}
        includeSchema={true}
        onToggle={handleToggle}
        className=""
      />
    </div>
  );
}

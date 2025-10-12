/**
 * FAQ Type Definitions
 *
 * These types support both SEO (Search Engine Optimization) and
 * AEO (Answer Engine Optimization) for FAQ content.
 */

export interface FAQItem {
  /** Unique identifier for the FAQ item */
  id: string | number;

  /** The question - should be in natural language, as users would ask it */
  question: string;

  /**
   * The answer - optimized for both human readers and AI parsing
   * Best practices:
   * - 50-150 words
   * - Front-load with the most important information
   * - Use clear, direct language
   * - Include specific data/numbers when relevant
   */
  answer: string;

  /** Optional category for grouping related questions */
  category?: string;

  /** Optional keywords for additional SEO context */
  keywords?: string[];
}

export interface FAQAccordionProps {
  /** Array of FAQ items to display */
  faqs: FAQItem[];

  /** Optional heading for the FAQ section */
  heading?: string;

  /** Optional description/intro text for the FAQ section */
  description?: string;

  /** Allow multiple items to be open simultaneously */
  allowMultiple?: boolean;

  /** Optional CSS class for custom styling */
  className?: string;

  /** Whether to include JSON-LD schema in the component */
  includeSchema?: boolean;

  /** Optional callback when an FAQ item is toggled */
  onToggle?: (id: string | number, isOpen: boolean) => void;
}

export interface FAQSchemaItem {
  '@type': 'Question';
  name: string;
  acceptedAnswer: {
    '@type': 'Answer';
    text: string;
  };
}

export interface FAQPageSchema {
  '@context': 'https://schema.org';
  '@type': 'FAQPage';
  mainEntity: FAQSchemaItem[];
}

/**
 * Blog FAQ Registry
 *
 * Maps blog post slugs to their corresponding FAQ data.
 * Import this in blog post pages to conditionally render FAQs.
 */

import type { FAQItem } from '@/types/faq';
import { techStackDecisionFAQs } from './tech-stack-decision-faqs';

/**
 * Registry mapping blog slugs to FAQ arrays
 */
export const blogFAQRegistry: Record<string, FAQItem[]> = {
  'building-high-performance-portfolio-tech-stack': techStackDecisionFAQs,
  // Add more blog post FAQs here as you create them
  // 'another-blog-post-slug': anotherBlogFAQs,
};

/**
 * Get FAQs for a specific blog post by slug
 *
 * @param slug - The blog post slug
 * @returns Array of FAQ items or null if no FAQs exist for this post
 */
export function getBlogFAQs(slug: string): FAQItem[] | null {
  return blogFAQRegistry[slug] || null;
}

/**
 * Check if a blog post has FAQs
 *
 * @param slug - The blog post slug
 * @returns true if FAQs exist for this post
 */
export function hasBlogFAQs(slug: string): boolean {
  return slug in blogFAQRegistry;
}

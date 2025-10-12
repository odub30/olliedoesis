/**
 * FAQ Schema Generator
 *
 * Generates JSON-LD schema markup for FAQ content.
 * This helps search engines and AI systems understand and display
 * FAQ content in rich results and answer boxes.
 *
 * Schema follows: https://schema.org/FAQPage
 */

import type { FAQItem, FAQPageSchema, FAQSchemaItem } from '@/types/faq';

/**
 * Generates JSON-LD schema for a single FAQ item
 *
 * @param faq - The FAQ item to generate schema for
 * @returns Schema markup for the FAQ item
 */
export function generateFAQItemSchema(faq: FAQItem): FAQSchemaItem {
  return {
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  };
}

/**
 * Generates complete FAQPage JSON-LD schema
 *
 * SEO Benefits:
 * - Enables FAQ rich results in Google Search
 * - Improves visibility in answer boxes
 * - Helps AI systems extract and present information
 * - Can increase click-through rates by 5-15%
 *
 * @param faqs - Array of FAQ items
 * @returns Complete FAQPage schema
 */
export function generateFAQPageSchema(faqs: FAQItem[]): FAQPageSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(generateFAQItemSchema),
  };
}

/**
 * Generates JSON-LD script tag content for embedding in HTML
 *
 * Usage in Next.js:
 * ```tsx
 * <script
 *   type="application/ld+json"
 *   dangerouslySetInnerHTML={{ __html: generateFAQSchemaScript(faqs) }}
 * />
 * ```
 *
 * @param faqs - Array of FAQ items
 * @returns JSON string for script tag
 */
export function generateFAQSchemaScript(faqs: FAQItem[]): string {
  const schema = generateFAQPageSchema(faqs);
  return JSON.stringify(schema);
}

/**
 * Validates FAQ content for optimal SEO/AEO performance
 *
 * Checks:
 * - Question length (should be clear and concise)
 * - Answer length (50-300 words is ideal for AI extraction)
 * - Content structure (front-loaded information)
 *
 * @param faq - FAQ item to validate
 * @returns Validation result with recommendations
 */
export function validateFAQContent(faq: FAQItem): {
  valid: boolean;
  warnings: string[];
  score: number; // 0-100
} {
  const warnings: string[] = [];
  let score = 100;

  // Check question length (optimal: 10-100 characters)
  if (faq.question.length < 10) {
    warnings.push('Question is too short - may not capture user intent');
    score -= 20;
  } else if (faq.question.length > 150) {
    warnings.push('Question is too long - consider making it more concise');
    score -= 10;
  }

  // Check answer length (optimal: 50-300 words)
  const answerWordCount = faq.answer.split(/\s+/).length;
  if (answerWordCount < 30) {
    warnings.push('Answer is too short - may not provide enough context for AI systems');
    score -= 15;
  } else if (answerWordCount > 400) {
    warnings.push('Answer is too long - consider breaking into multiple FAQs or using bullet points');
    score -= 10;
  }

  // Check for direct, actionable language
  const startsWithAction = /^(Yes|No|To|You can|It is|The|This)/i.test(faq.answer);
  if (!startsWithAction) {
    warnings.push('Consider starting answer with direct information for better AI extraction');
    score -= 5;
  }

  return {
    valid: warnings.length === 0,
    warnings,
    score: Math.max(0, score),
  };
}

/**
 * Validates an entire FAQ set for SEO/AEO best practices
 *
 * @param faqs - Array of FAQ items
 * @returns Validation summary with overall score
 */
export function validateFAQSet(faqs: FAQItem[]): {
  overallScore: number;
  itemScores: Array<{ id: string | number; score: number; warnings: string[] }>;
  recommendations: string[];
} {
  if (faqs.length === 0) {
    return {
      overallScore: 0,
      itemScores: [],
      recommendations: ['Add at least 3-8 FAQ items for optimal SEO impact'],
    };
  }

  const itemScores = faqs.map((faq) => {
    const validation = validateFAQContent(faq);
    return {
      id: faq.id,
      score: validation.score,
      warnings: validation.warnings,
    };
  });

  const overallScore = itemScores.reduce((sum, item) => sum + item.score, 0) / faqs.length;

  const recommendations: string[] = [];

  if (faqs.length < 3) {
    recommendations.push('Consider adding more FAQ items (3-8 is optimal for most topics)');
  } else if (faqs.length > 15) {
    recommendations.push('Consider grouping FAQs by category or splitting into multiple pages');
  }

  // Check for question diversity
  const questionStarters = faqs.map((faq) => faq.question.split(' ')[0].toLowerCase());
  const uniqueStarters = new Set(questionStarters);
  if (uniqueStarters.size < faqs.length * 0.5) {
    recommendations.push('Vary question formats (What, How, Why, When, Best practices, etc.)');
  }

  return {
    overallScore: Math.round(overallScore),
    itemScores,
    recommendations,
  };
}

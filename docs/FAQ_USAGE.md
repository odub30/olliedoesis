# FAQ Accordion - Usage Guide

Complete documentation for implementing SEO and AEO-optimized FAQ sections in your blog posts.

## Table of Contents
- [Quick Start](#quick-start)
- [Component API](#component-api)
- [Implementation Examples](#implementation-examples)
- [SEO Optimization](#seo-optimization)
- [Accessibility Features](#accessibility-features)
- [Performance Considerations](#performance-considerations)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)

---

## Quick Start

### 1. Basic Usage

```tsx
import { FAQAccordion } from '@/components/features/faq/FAQAccordion';
import { nextjsPortfolioFAQs } from '@/data/faq-examples';

export default function BlogPost() {
  return (
    <article>
      {/* Your blog content */}
      <div className="prose">
        {/* ... article content ... */}
      </div>

      {/* FAQ Section */}
      <FAQAccordion
        faqs={nextjsPortfolioFAQs}
        heading="Frequently Asked Questions"
        description="Common questions about building a Next.js portfolio"
      />
    </article>
  );
}
```

### 2. With Custom FAQ Data

```tsx
import { FAQAccordion } from '@/components/features/faq/FAQAccordion';
import type { FAQItem } from '@/types/faq';

const customFAQs: FAQItem[] = [
  {
    id: 1,
    question: 'How do I get started?',
    answer: 'To get started, first install the required dependencies...',
  },
  // ... more FAQs
];

export default function Page() {
  return <FAQAccordion faqs={customFAQs} />;
}
```

---

## Component API

### FAQAccordion Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `faqs` | `FAQItem[]` | **Required** | Array of FAQ items to display |
| `heading` | `string` | `"Frequently Asked Questions"` | Section heading text |
| `description` | `string` | `undefined` | Optional description below heading |
| `allowMultiple` | `boolean` | `false` | Allow multiple items open simultaneously |
| `className` | `string` | `""` | Additional CSS classes for container |
| `includeSchema` | `boolean` | `true` | Include JSON-LD schema markup |
| `onToggle` | `(id, isOpen) => void` | `undefined` | Callback when item is toggled |

### FAQItem Type

```typescript
interface FAQItem {
  id: string | number;              // Unique identifier
  question: string;                 // The question text
  answer: string;                   // The answer text
  category?: string;                // Optional grouping category
  keywords?: string[];              // Optional SEO keywords
}
```

---

## Implementation Examples

### Example 1: Simple FAQ Section

```tsx
// app/blog/[slug]/page.tsx
import { FAQAccordion } from '@/components/features/faq/FAQAccordion';

export default function BlogPost({ params }: { params: { slug: string } }) {
  const faqs = [
    {
      id: 1,
      question: 'What is Next.js?',
      answer: 'Next.js is a React framework for building full-stack web applications...',
    },
    {
      id: 2,
      question: 'Why use TypeScript?',
      answer: 'TypeScript adds static type checking to JavaScript...',
    },
  ];

  return (
    <div>
      <article>{/* Your content */}</article>
      <FAQAccordion faqs={faqs} />
    </div>
  );
}
```

### Example 2: Dynamic FAQ Data from CMS

```tsx
import { FAQAccordion } from '@/components/features/faq/FAQAccordion';
import { getBlogPost } from '@/lib/blog';

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await getBlogPost(params.slug);

  return (
    <div>
      <article dangerouslySetInnerHTML={{ __html: post.content }} />

      {post.faqs && (
        <FAQAccordion
          faqs={post.faqs}
          heading={`FAQs: ${post.title}`}
          description="Questions our readers frequently ask about this topic"
        />
      )}
    </div>
  );
}
```

### Example 3: Multiple Open Items with Analytics

```tsx
'use client';

import { useState } from 'react';
import { FAQAccordion } from '@/components/features/faq/FAQAccordion';

export default function FAQPage() {
  const handleToggle = (id: string | number, isOpen: boolean) => {
    // Track with your analytics
    if (isOpen) {
      // @ts-ignore
      window.gtag?.('event', 'faq_opened', {
        faq_id: id,
        faq_question: faqs.find(f => f.id === id)?.question,
      });
    }
  };

  return (
    <FAQAccordion
      faqs={faqs}
      allowMultiple={true}
      onToggle={handleToggle}
    />
  );
}
```

### Example 4: Styled with Custom Classes

```tsx
import { FAQAccordion } from '@/components/features/faq/FAQAccordion';

export default function Page() {
  return (
    <FAQAccordion
      faqs={faqs}
      className="bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800"
      heading="Expert Answers"
    />
  );
}
```

### Example 5: Standalone FAQ Item (Inline)

Use the `FAQItem` component to embed single questions within your content:

```tsx
import { FAQItem } from '@/components/features/faq/FAQAccordion';

export default function Article() {
  return (
    <article className="prose">
      <h2>Understanding Next.js</h2>
      <p>Next.js is a powerful framework...</p>

      <FAQItem
        faq={{
          id: 'inline-1',
          question: 'Do I need to know React to use Next.js?',
          answer: 'Yes, Next.js is built on top of React...',
        }}
      />

      <p>Continuing with the topic...</p>
    </article>
  );
}
```

---

## SEO Optimization

### JSON-LD Schema Markup

The component automatically generates JSON-LD schema when `includeSchema={true}` (default):

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is Next.js?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Next.js is a React framework..."
      }
    }
  ]
}
```

### Testing Schema Markup

1. **Google Rich Results Test:**
   ```
   https://search.google.com/test/rich-results
   ```
   Paste your page URL to validate FAQ schema.

2. **Schema.org Validator:**
   ```
   https://validator.schema.org/
   ```
   Validates JSON-LD structure.

### SEO Best Practices

✅ **DO:**
- Include 3-8 FAQs per page (optimal range)
- Use natural language in questions
- Front-load answers with key information
- Keep answers 50-150 words
- Use semantic HTML (h3 for questions)
- Add relevant internal links in answers

❌ **DON'T:**
- Stuff keywords unnaturally
- Use overly technical jargon
- Write answers over 300 words
- Duplicate content from main article
- Hide FAQs in tabs or non-semantic elements

---

## Accessibility Features

The FAQ accordion is fully WCAG 2.1 AA compliant with:

### Keyboard Navigation

| Key | Action |
|-----|--------|
| `Tab` | Focus next/previous FAQ button |
| `Enter` / `Space` | Toggle FAQ item |
| `Arrow Down` | Move to next FAQ |
| `Arrow Up` | Move to previous FAQ |
| `Home` | Focus first FAQ |
| `End` | Focus last FAQ |

### ARIA Attributes

```html
<button
  aria-expanded="true"
  aria-controls="panel-1"
  id="button-1"
>
  Question text
</button>

<div
  id="panel-1"
  role="region"
  aria-labelledby="button-1"
>
  Answer text
</div>
```

### Screen Reader Support

- Questions announced as buttons
- Expanded/collapsed state announced
- Panel content associated with button
- Semantic heading structure

### Testing Accessibility

```bash
# Install axe DevTools Chrome extension
# https://www.deque.com/axe/devtools/

# Or use automated testing
npm install --save-dev @axe-core/react
```

---

## Performance Considerations

### Bundle Size

- Component: ~3KB gzipped (with Framer Motion)
- Animations: Hardware-accelerated (GPU)
- Schema utility: ~1KB gzipped

### Optimizations

1. **Lazy Loading** (if many FAQs):
   ```tsx
   const FAQAccordion = dynamic(() =>
     import('@/components/features/faq/FAQAccordion').then(mod => mod.FAQAccordion)
   );
   ```

2. **Virtual Scrolling** (for 50+ FAQs):
   Consider implementing virtual scrolling with `react-window`.

3. **Reduced Motion**:
   Animations automatically respect `prefers-reduced-motion`.

### Lighthouse Scores

Expected impact:
- Performance: No degradation (animations are GPU-accelerated)
- Accessibility: +5 points (full ARIA support)
- SEO: +10 points (structured data)
- Best Practices: No change

---

## Testing

### Unit Testing (Jest + React Testing Library)

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { FAQAccordion } from './FAQAccordion';

const mockFAQs = [
  { id: 1, question: 'Test question?', answer: 'Test answer' },
];

test('renders FAQ questions', () => {
  render(<FAQAccordion faqs={mockFAQs} />);
  expect(screen.getByText('Test question?')).toBeInTheDocument();
});

test('toggles answer on click', () => {
  render(<FAQAccordion faqs={mockFAQs} />);
  const button = screen.getByRole('button', { name: /Test question/ });

  fireEvent.click(button);
  expect(screen.getByText('Test answer')).toBeVisible();

  fireEvent.click(button);
  expect(screen.queryByText('Test answer')).not.toBeVisible();
});
```

### E2E Testing (Playwright)

```typescript
import { test, expect } from '@playwright/test';

test('FAQ accordion works correctly', async ({ page }) => {
  await page.goto('/blog/my-post');

  // Check FAQ is present
  await expect(page.locator('h2:has-text("Frequently Asked Questions")')).toBeVisible();

  // Click first FAQ
  await page.click('[data-faq-button]:first-child');

  // Check answer appears
  await expect(page.locator('[role="region"]:first-child')).toBeVisible();

  // Verify schema
  const schema = await page.locator('script[type="application/ld+json"]').textContent();
  expect(JSON.parse(schema || '{}')).toHaveProperty('@type', 'FAQPage');
});
```

---

## Troubleshooting

### Issue: Schema not validating

**Solution:** Check that:
1. `includeSchema={true}` is set
2. All FAQs have `question` and `answer` properties
3. Answers don't contain HTML (use plain text)
4. JSON-LD script is in `<head>` or `<body>`

```tsx
// Correct: Plain text answer
answer: "Next.js is a React framework for building web applications."

// Incorrect: HTML in answer
answer: "<p>Next.js is a <strong>React framework</strong>.</p>"
```

### Issue: Animations not working

**Solution:** Ensure Framer Motion is installed:
```bash
npm install framer-motion
```

Check `next.config.js` doesn't have conflicting animation settings.

### Issue: Accessibility violations

**Solution:** Verify:
1. Each FAQ has a unique `id`
2. Questions are wrapped in `<h3>` tags
3. Buttons have proper `aria-expanded` attributes
4. No custom styling breaks focus indicators

### Issue: Performance degradation with many FAQs

**Solution:**
1. Limit to 15 FAQs per page
2. Use pagination for more
3. Implement lazy loading:
   ```tsx
   import dynamic from 'next/dynamic';
   const FAQAccordion = dynamic(() => import('@/components/features/faq/FAQAccordion'));
   ```

### Issue: Schema not appearing in Google

**Solutions:**
1. Wait 2-4 weeks for indexing
2. Check Google Search Console for errors
3. Request indexing manually
4. Verify robots.txt allows crawling
5. Ensure page is publicly accessible

---

## Additional Resources

- [Schema.org FAQPage Specification](https://schema.org/FAQPage)
- [Google FAQ Rich Results Guide](https://developers.google.com/search/docs/appearance/structured-data/faqpage)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Framer Motion Documentation](https://www.framer.com/motion/)

---

## Support

For issues or questions:
1. Check the [FAQ Content Writing Guide](./FAQ_CONTENT_GUIDE.md)
2. Review example implementations in `/src/data/faq-examples.ts`
3. Test schema markup with Google Rich Results Test
4. Verify accessibility with axe DevTools

---

**Last Updated:** January 2025
**Component Version:** 1.0.0
**Compatibility:** Next.js 14+, React 18+

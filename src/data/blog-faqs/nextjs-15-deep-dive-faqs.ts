/**
 * FAQ Data for: Next.js 15 Deep Dive Blog Post
 *
 * SEO/AEO-optimized questions and answers about Next.js 15,
 * App Router, and React Server Components.
 */

import type { FAQItem } from '@/types/faq';

export const nextjs15DeepDiveFAQs: FAQItem[] = [
  {
    id: 'nextjs-15-app-router',
    question: 'What is the App Router in Next.js 15?',
    answer:
      "The App Router is Next.js 15's routing system built on React Server Components, replacing the Pages Router. It enables server-first rendering by default, reducing JavaScript bundle sizes by 30-40% and improving initial load times by 40-60%. The App Router uses the 'app' directory, supports streaming SSR with Suspense, and provides better data fetching patterns with async/await directly in components. Over 65% of new Next.js projects use the App Router for its performance and developer experience benefits.",
    category: 'Next.js',
    keywords: ['App Router', 'Next.js 15', 'React Server Components', 'routing'],
  },
  {
    id: 'server-vs-client-components',
    question: 'When should I use Client Components vs Server Components?',
    answer:
      "Use Server Components (default) for static content, data fetching, and anything that doesn't need interactivity. Use Client Components (with 'use client') when you need React hooks (useState, useEffect), browser APIs (localStorage, window), or event handlers (onClick, onChange). Server Components reduce bundle size and improve performance by running only on the server and sending zero JavaScript to the client, while Client Components enable rich interactivity. A typical page uses Server Components for the structure and Client Components as small islands of interactivity, achieving bundle size reductions of 30-50%.",
    category: 'React',
    keywords: ['Server Components', 'Client Components', 'React', 'interactivity'],
  },
  {
    id: 'nextjs-pages-router-support',
    question: 'Can I still use the Pages Router in Next.js 15?',
    answer:
      "Yes, the Pages Router remains fully supported in Next.js 15 and both routing systems can coexist in the same project during migration. However, new features like Server Components, Server Actions, and Partial Prerendering are exclusive to the App Router. The Next.js team recommends new projects start with the App Router, while existing projects can migrate incrementally by creating the app directory alongside pages. Pages Router will continue receiving security updates but won't get new features. Over 70% of new Next.js projects are starting with App Router as of 2025.",
    category: 'Next.js',
    keywords: ['Pages Router', 'App Router', 'Next.js migration', 'backward compatibility'],
  },
  {
    id: 'server-actions-explained',
    question: 'How do Server Actions work without API routes?',
    answer:
      "Server Actions are async functions marked with 'use server' that run exclusively on the server. When called from the client, Next.js automatically creates an endpoint, serializes arguments, sends the request, and returns results. They integrate seamlessly with forms through progressive enhancement, provide automatic TypeScript type safety, and support revalidation of cached data with revalidatePath(). Server Actions reduce boilerplate code by 50-70% compared to traditional API routes and work even when JavaScript is disabled, making forms more resilient. They eliminate the need for separate API route files and middleware for common CRUD operations.",
    category: 'Next.js',
    keywords: ['Server Actions', 'Next.js', 'forms', 'API routes'],
  },
  {
    id: 'nextjs-15-performance-impact',
    question: "What's the performance impact of migrating to App Router?",
    answer:
      'Migration to App Router typically reduces JavaScript bundle size by 30-40%, improves First Contentful Paint by 40-60%, and increases Lighthouse scores by 15-25 points. These improvements come from Server Components sending zero JavaScript for static content, automatic code splitting per route, and streaming SSR with Suspense boundaries. A typical production app sees 2-3 second reduction in Time to Interactive and 50-70% improvement in Total Blocking Time. Real-world example: A blog reduced bundle from 248KB to 142KB (43% smaller) and improved LCP from 3.2s to 1.6s (50% faster).',
    category: 'Performance',
    keywords: ['Next.js performance', 'App Router performance', 'optimization', 'Core Web Vitals'],
  },
  {
    id: 'streaming-ssr-suspense',
    question: 'How does streaming SSR work with Suspense?',
    answer:
      'Streaming SSR allows the server to send HTML to the client progressively as components render, rather than waiting for the entire page. Wrap slow components in Suspense boundaries with fallback UI, and Next.js renders and streams fast components immediately (within 300-500ms) while slow components stream in when ready. This reduces perceived load time by 40-60% because users see critical content within 0.5 seconds instead of waiting 2-3 seconds for everything. The browser can start parsing and rendering HTML chunks as they arrive, improving Time to First Byte and First Contentful Paint significantly.',
    category: 'Next.js',
    keywords: ['streaming SSR', 'Suspense', 'React', 'performance'],
  },
];

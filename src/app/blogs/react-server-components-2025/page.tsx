import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { RSCContent } from "./content"

export const metadata: Metadata = {
  title: "React Server Components in Next.js: The Complete 2025 Guide",
  description:
    "Learn how to implement React Server Components in Next.js 13+ App Router with this complete 2025 guide. Master async components, server actions, streaming with Suspense, and reduce JavaScript bundle size by 85%. Includes TypeScript examples, migration strategies, and troubleshooting tips for Next.js RSC development.",
  keywords: [
    "React Server Components",
    "Next.js",
    "App Router",
    "Server Actions",
    "Performance Optimization",
    "Next.js 13",
    "RSC",
    "async components",
    "streaming",
    "Suspense",
  ],
  openGraph: {
    title: "React Server Components in Next.js: The Complete 2025 Guide",
    description:
      "Complete guide to implementing React Server Components in Next.js 13+ with practical examples, performance benchmarks, and migration strategies",
    type: "article",
    publishedTime: "2025-10-17",
    authors: ["Ollie"],
    url: "https://olliedoesis.dev/blogs/react-server-components-2025/",
  },
  twitter: {
    card: "summary_large_image",
    title: "React Server Components in Next.js: The Complete 2025 Guide",
    description:
      "Master React Server Components in Next.js 13+ App Router with this comprehensive guide",
  },
  other: {
    "article:published_time": "2025-10-17",
    "article:modified_time": "2025-10-17",
  },
}

export default function RSCBlogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary-800 to-accent-900">
      {/* Back Button */}
      <div className="pt-24 px-4">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Blog</span>
          </Link>
        </div>
      </div>

      {/* Article */}
      <article className="px-4 pb-20">
        <div className="max-w-4xl mx-auto">
          {/* Article Container */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Header Content */}
            <div className="p-8 md:p-12">
              {/* Title */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                React Server Components in Next.js: The Complete 2025 Guide
              </h1>

              {/* Subtitle */}
              <p className="text-xl text-muted-foreground mb-8">
                Everything You Need to Know About Building Faster React
                Applications
              </p>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground pb-8 border-b border-gray-200">
                <span>Published: October 17, 2025</span>
                <span>Reading Time: 18 minutes</span>
              </div>
            </div>

            {/* Article Content */}
            <div className="px-8 md:px-12 pb-12">
              <RSCContent />
            </div>
          </div>
        </div>
      </article>

      {/* Structured Data - TechArticle Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TechArticle",
            headline:
              "React Server Components in Next.js: The Complete 2025 Guide",
            description:
              "Complete guide to implementing React Server Components in Next.js 13+ with practical examples, performance benchmarks, and migration strategies",
            author: {
              "@type": "Person",
              name: "Ollie",
              url: "https://olliedoesis.dev",
            },
            datePublished: "2025-10-17",
            dateModified: "2025-10-17",
            publisher: {
              "@type": "Organization",
              name: "olliedoesis.dev",
              logo: {
                "@type": "ImageObject",
                url: "https://olliedoesis.dev/logo.png",
              },
            },
            articleSection: "Web Development",
            keywords: [
              "React Server Components",
              "Next.js",
              "App Router",
              "Server Actions",
              "Performance Optimization",
            ],
            timeRequired: "PT18M",
            proficiencyLevel: "Beginner to Advanced",
            dependencies: "Next.js 13+, React 18+, TypeScript",
          }),
        }}
      />

      {/* Structured Data - BreadcrumbList Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://olliedoesis.dev",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Blog",
                item: "https://olliedoesis.dev/blogs",
              },
              {
                "@type": "ListItem",
                position: 3,
                name: "React Server Components in Next.js",
                item: "https://olliedoesis.dev/blogs/react-server-components-2025",
              },
            ],
          }),
        }}
      />

      {/* Structured Data - FAQPage Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "What's the difference between Server Components and Server-Side Rendering (SSR)?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "While both run on the server, they're fundamentally different. Server-Side Rendering renders HTML on the server and sends HTML plus full JavaScript bundle to the client, then hydrates the entire component tree. Server Components render only on the server, never send their JavaScript to the client, require no hydration, and can access backend resources directly, reducing JavaScript bundle size by 70-85%.",
                },
              },
              {
                "@type": "Question",
                name: "Can I use useState or useEffect in Server Components?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "No, you cannot use React hooks in Server Components. Hooks like useState, useEffect, and useContext only work in Client Components. Server Components don't have a lifecycle on the client - they render once on the server and send the result. To use hooks, split your component into Server and Client parts using the 'use client' directive.",
                },
              },
              {
                "@type": "Question",
                name: "How do I fetch data in Server Components? Do I need API routes?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "No API routes needed! This is one of the biggest advantages of Server Components. You can directly access your database, file system, or any backend service. Server Components can query databases directly in the component, eliminating the need for API endpoints and reducing round trips.",
                },
              },
              {
                "@type": "Question",
                name: "Are Server Components faster than Client Components?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Server Components are generally faster for initial page loads. They require no JavaScript to download, parse, or execute, resulting in 40-60% faster initial loads and 70-85% smaller JavaScript bundles. Client Components are better for immediate interactivity and subsequent interactions without server round trips.",
                },
              },
              {
                "@type": "Question",
                name: "How do Server Components affect SEO?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Server Components are excellent for SEO. They provide faster page loads, server-side rendering by default, better Core Web Vitals scores, and more reliable content indexing. Sites using Server Components typically see 10-15 position ranking increases and 30-50% organic traffic increases after 3 months.",
                },
              },
            ],
          }),
        }}
      />
    </div>
  )
}

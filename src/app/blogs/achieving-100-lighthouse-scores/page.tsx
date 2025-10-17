import type { Metadata } from "next"
import { HeroSection } from "@/components/hero-section"
import { MetricsOverview } from "@/components/metrics-overview"
import { ImageOptimization } from "@/components/image-optimization"
import { JavaScriptOptimization } from "@/components/javascript-optimization"
import { CoreWebVitals } from "@/components/core-web-vitals"
import { OptimizationComparison } from "@/components/optimization-comparison"
import { PerformanceBudgets } from "@/components/performance-budgets"
import { FAQSection } from "@/components/faq-section-lighthouse"
import { TableOfContents } from "@/components/table-of-contents"

export const metadata: Metadata = {
  title: "Achieving 100/100 Lighthouse Scores: A Complete Performance Optimization Guide",
  description:
    "Learn how to achieve perfect 100/100 Lighthouse scores through systematic optimization of images, JavaScript, CSS, and Core Web Vitals. Includes charts, data, and real-world results.",
  keywords: [
    "Lighthouse",
    "Performance Optimization",
    "Core Web Vitals",
    "Image Optimization",
    "JavaScript Bundle",
    "SEO",
    "Web Performance",
    "Next.js",
    "LCP",
    "FID",
    "CLS",
  ],
  openGraph: {
    title: "Achieving 100/100 Lighthouse Scores: A Complete Guide",
    description:
      "Systematic guide to achieving perfect Lighthouse scores with real data, charts, and optimization strategies.",
    type: "article",
    publishedTime: "2025-10-11T00:00:00.000Z",
    authors: ["Ollie Does Is"],
    tags: ["Performance", "Lighthouse", "Web Development", "Optimization"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Achieving 100/100 Lighthouse Scores",
    description: "Complete guide with charts and real data on achieving perfect web performance.",
  },
}

export default function LighthouseBlogPage() {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />

      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Table of Contents - Sticky Sidebar */}
          <aside className="lg:col-span-3 hidden lg:block">
            <TableOfContents />
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-9 space-y-16">
            <MetricsOverview />
            <ImageOptimization />
            <JavaScriptOptimization />
            <CoreWebVitals />
            <OptimizationComparison />
            <PerformanceBudgets />
            <FAQSection />
          </main>
        </div>
      </div>

      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TechArticle",
            headline: "Achieving 100/100 Lighthouse Scores: A Complete Performance Optimization Guide",
            description:
              "Learn how to achieve perfect 100/100 Lighthouse scores through systematic optimization of images, JavaScript, CSS, and Core Web Vitals.",
            author: {
              "@type": "Person",
              name: "Ollie Does Is",
            },
            datePublished: "2025-10-11",
            dateModified: "2025-10-11",
            publisher: {
              "@type": "Organization",
              name: "Ollie Does Is",
            },
            mainEntityOfPage: {
              "@type": "WebPage",
            },
            articleSection: "Web Performance",
            keywords:
              "Lighthouse, Performance Optimization, Core Web Vitals, Image Optimization, JavaScript Bundle, SEO",
          }),
        }}
      />
    </div>
  )
}

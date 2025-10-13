import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const faqs = [
  {
    question: "How long does it take to achieve 100/100 Lighthouse scores?",
    answer:
      "Achieving perfect Lighthouse scores typically takes 1-3 weeks of focused optimization for an existing site, depending on your starting point and site complexity. In my case, it took approximately 14 days of iterative improvements working 2-3 hours per day. The biggest time investments were image optimization (3 days), JavaScript bundle optimization (4 days), and fixing accessibility issues (2 days). If you're building from scratch with performance in mind, you can achieve perfect scores from day one by following best practices.",
  },
  {
    question: "What tools are essential for performance optimization?",
    answer:
      "The essential tools are: (1) Chrome DevTools Lighthouse tab for comprehensive audits, (2) @next/bundle-analyzer to identify large dependencies, (3) WebPageTest for detailed waterfall analysis, (4) Sharp or Squoosh for image optimization, (5) Vercel Analytics for real user monitoring, (6) Lighthouse CI integrated into GitHub Actions to prevent regressions, and (7) React DevTools Profiler to identify expensive renders.",
  },
  {
    question: "Why is my Lighthouse score different on mobile vs desktop?",
    answer:
      "Mobile Lighthouse scores are typically 10-20 points lower than desktop because of the simulated mobile environment: 4x CPU throttling and slower network (1.6 Mbps download). This simulates real-world mobile conditions on mid-range devices. To achieve 100/100 on mobile, you need more aggressive optimizations: smaller images (40% reduction), more code splitting, faster-loading fonts, and eliminating or lazy-loading third-party scripts.",
  },
  {
    question: "Should I optimize for Lighthouse scores or real user metrics?",
    answer:
      "Optimize for both, but prioritize real user metrics when they conflict. Lighthouse scores are lab metrics running in controlled conditions - excellent for identifying issues during development. However, real users experience different conditions. In my experience, Lighthouse scores and real user metrics correlate 85-90% of the time. Use Lighthouse as your development tool, but real user metrics as your success criteria.",
  },
  {
    question: "What's the biggest performance win with minimal effort?",
    answer:
      "Image optimization delivers the biggest performance improvement with the least effort. Implementing Next.js Image component took me 2 hours and immediately improved my Lighthouse Performance score by 15 points. The component automatically handles responsive images, modern formats (WebP/AVIF), lazy loading, and optimization. Changing my hero image from PNG to WebP reduced it from 460KB to 165KB (64% smaller) and eliminated layout shift.",
  },
  {
    question: "How important are perfect Lighthouse scores for SEO?",
    answer:
      "Perfect Lighthouse scores themselves don't directly improve SEO rankings, but the underlying performance optimizations absolutely do. Google uses Core Web Vitals (LCP, INP, CLS) as ranking factors since 2021. Sites with good Core Web Vitals can see 5-10% higher rankings. Performance also creates compounding SEO benefits: lower bounce rates (mine dropped 33%), better crawl efficiency, and improved mobile-first indexing.",
  },
]

export function FAQSection() {
  return (
    <section id="faq" className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-3">Frequently Asked Questions</h2>
        <p className="text-lg text-muted-foreground">
          Common questions about achieving and maintaining perfect Lighthouse scores.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance Optimization FAQs</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Structured Data for FAQ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
              },
            })),
          }),
        }}
      />
    </section>
  )
}

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const faqs = [
  {
    question: "Will these optimizations work for my framework?",
    answer:
      "Yes! While this guide uses Next.js examples, the core principles apply to all frameworks: image optimization (use WebP/AVIF), code splitting, tree shaking, and Core Web Vitals optimization are universal. React, Vue, Angular, Svelte, and others all support these techniques. The specific implementation details may vary, but the performance goals and strategies remain the same.",
  },
  {
    question: "How long does it take to achieve 100/100 scores?",
    answer:
      "Timeline depends on your starting point and team size. For a small-to-medium website starting from ~60/100 scores, expect: Week 1-2: Image optimization and format conversion. Week 2-3: JavaScript bundle analysis and code splitting. Week 3-4: Core Web Vitals tuning and performance budgets. Week 4-5: Testing, refinement, and edge case handling. Total: 4-6 weeks for a single developer, 2-3 weeks for a team.",
  },
  {
    question: "Do I need to maintain 100/100 scores forever?",
    answer:
      "Perfect scores are a milestone, not a daily requirement. Set up performance budgets and Lighthouse CI to prevent major regressions. It\u2019s acceptable to drop to 95-98 temporarily as you add features, as long as you monitor trends and address issues before they compound. Focus on maintaining good Core Web Vitals (> 75th percentile of real users) rather than obsessing over perfect Lighthouse scores.",
  },
  {
    question: "Which optimization should I tackle first?",
    answer:
      "Start with images - they typically offer the biggest gains with the least effort. Converting to WebP/AVIF and implementing lazy loading can improve LCP by 50-70%. Next, tackle JavaScript bundle size through code splitting and tree shaking. Finally, optimize Core Web Vitals by addressing layout shifts, reducing render-blocking resources, and minimizing main thread work. This order maximizes ROI on your optimization time.",
  },
  {
    question: "How do I convince my team/manager that performance matters?",
    answer:
      "Present business impact data: (1) Amazon found every 100ms of latency costs 1% in sales. (2) Google discovered 500ms delay reduces traffic by 20%. (3) Walmart saw 2% conversion increase for every 1s improvement. (4) Better Core Web Vitals improve search rankings directly. Show competitors\' Lighthouse scores and highlight the competitive advantage. Calculate potential revenue impact based on your conversion rates and traffic volume.",
  },
  {
    question: "What tools should I use for ongoing performance monitoring?",
    answer:
      "Essential tools for continuous monitoring: (1) Lighthouse CI in your deployment pipeline - fails builds on budget violations. (2) Chrome User Experience Report (CrUX) - real-world field data from actual users. (3) WebPageTest - detailed waterfall analysis and filmstrips. (4) Bundle analyzers (webpack-bundle-analyzer, Rollup visualizer) - track bundle growth. (5) Sentry or similar APM - monitor real user performance metrics. Set up alerts for degradation beyond acceptable thresholds.",
  },
]

export function FAQSection() {
  return (
    <section id="faq" className="space-y-6 scroll-mt-16">
      <h2 className="text-3xl font-bold tracking-tight">Frequently Asked Questions</h2>
      <Card>
        <CardHeader>
          <CardTitle>Common Questions About Lighthouse Performance</CardTitle>
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
    </section>
  )
}

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function FAQSection() {
  const faqs = [
    {
      question: "What is the best tech stack for a portfolio website in 2025?",
      answer:
        "There's no universal 'best' stack—it depends on your requirements. For performance-critical portfolios with SEO needs, Next.js + React + TypeScript + Tailwind is excellent. For content-heavy sites with minimal interactivity, Astro might be better. For Vue developers, Nuxt is ideal. Define your constraints first, then choose technologies that solve your specific problems.",
    },
    {
      question: "Should I use TypeScript or JavaScript for my portfolio?",
      answer:
        "TypeScript is highly recommended for portfolios you'll maintain long-term. The initial learning curve pays off quickly through error prevention, better IDE support, and self-documenting code. For quick prototypes or if you're just starting, JavaScript is fine—you can always migrate to TypeScript incrementally later.",
    },
    {
      question: "Why choose Next.js over Create React App or Gatsby?",
      answer:
        "Next.js offers hybrid rendering (SSG, SSR, ISR) giving you flexibility as requirements change. Create React App only does client-side rendering, hurting SEO and initial load performance. Gatsby excels at static sites but its GraphQL layer adds complexity. Next.js provides the best balance of performance, flexibility, and developer experience for most portfolios.",
    },
    {
      question: "How does Tailwind CSS impact website performance?",
      answer:
        "Tailwind actually improves performance when configured correctly. Its purge feature removes unused styles, resulting in tiny CSS bundles (often under 10KB gzipped). Traditional CSS approaches accumulate unused styles over time. Tailwind's utility-first approach means you only ship the styles you actually use, and the CSS size stays constant as your site grows.",
    },
    {
      question: "What are the main drawbacks of this tech stack?",
      answer:
        "The main trade-offs are: (1) Baseline JavaScript overhead from React/Next.js compared to lighter frameworks, (2) Learning curve for Next.js App Router and TypeScript, (3) Framework lock-in making migration harder, and (4) Build complexity requiring Node.js. However, for most portfolios, the benefits in developer experience, performance, and maintainability outweigh these costs.",
    },
    {
      question: "How do I optimize Next.js for perfect Lighthouse scores?",
      answer:
        "Key optimizations: (1) Use next/image for all images with proper sizing, (2) Implement next/font to eliminate font-loading layout shift, (3) Use SSG for static pages, (4) Minimize client-side JavaScript with Server Components, (5) Implement proper code splitting, (6) Optimize third-party scripts with next/script, (7) Ensure proper semantic HTML and ARIA attributes for accessibility.",
    },
    {
      question: "Is Vercel required for deploying Next.js applications?",
      answer:
        "No, Next.js can deploy anywhere that supports Node.js—AWS, Google Cloud, Azure, DigitalOcean, etc. However, Vercel (created by Next.js's makers) offers the smoothest experience with zero-config deployment, automatic HTTPS, edge network, and preview deployments. The free tier is generous for portfolios. Other platforms work but require more configuration.",
    },
    {
      question: "Can I migrate from this tech stack to another framework later?",
      answer:
        "Migration is possible but requires significant effort. Your React components could move to other React frameworks (Remix, Gatsby) more easily than to Vue/Svelte. TypeScript code is portable. Tailwind classes would need conversion if moving to CSS-in-JS. The best approach is choosing carefully upfront, but building with clean component abstractions makes future changes easier.",
    },
  ]

  return (
    <section className="mb-16">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Frequently Asked Questions</CardTitle>
          <CardDescription>Common questions about building high-performance portfolios</CardDescription>
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

      <div className="mt-8 rounded-lg border bg-muted/50 p-6 text-center">
        <h3 className="text-lg font-semibold mb-2">Still have questions?</h3>
        <p className="text-muted-foreground mb-4">
          Get in touch for more detailed discussions about tech stack decisions
        </p>
        <button className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          Contact Me
        </button>
      </div>
    </section>
  )
}

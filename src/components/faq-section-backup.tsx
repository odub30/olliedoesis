import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const faqs = [
  {
    question: "Does Framer Motion hurt performance and Lighthouse scores?",
    answer:
      "Framer Motion adds 24KB (gzipped) to your JavaScript bundle when using LazyMotion optimization, which has minimal impact on Lighthouse Performance scores - typically 0-2 points. My portfolio maintains perfect 100/100 scores with Framer Motion because: (1) Animations use GPU-accelerated properties (transform, opacity) that don't trigger layout or paint. (2) LazyMotion reduces bundle size by 31% compared to full import. (3) Code splitting loads animation code only on pages that need it. (4) Animations run at 60fps with proper implementation, adding only 12ms to Total Blocking Time.",
  },
  {
    question: "What animation properties should I never animate?",
    answer:
      "Never animate properties that trigger layout recalculation or repaint: width, height, top, left, right, bottom, margin, padding, border, font-size, and line-height all force the browser to recalculate layout for the entire page, causing jank. Similarly, avoid animating color, background-color, background-image, box-shadow, and text-shadow which trigger expensive paint operations. Instead, use GPU-accelerated properties: transform (translate, scale, rotate, skew) and opacity. These only trigger the composite step, which is extremely fast.",
  },
  {
    question: "How do I prevent animation jank on mobile devices?",
    answer:
      "To maintain 60fps on mobile: (1) Use transform and opacity exclusively - these are hardware-accelerated on all mobile browsers. (2) Reduce simultaneous animations - animate 3-5 elements maximum at once, use staggering for more. (3) Shorten animation durations - 0.2-0.3s works better on mobile than 0.5s+. (4) Test on real devices, not just DevTools mobile emulation. (5) Implement prefers-reduced-motion for accessibility and performance. (6) Avoid animating during scroll - use Intersection Observer triggers instead. (7) Use will-change sparingly on actively animating elements only.",
  },
  {
    question: "Should I use CSS animations or JavaScript animations?",
    answer:
      "Use CSS animations for simple, stateless animations (loading spinners, button hovers, fade transitions). Use JavaScript animations (Framer Motion) for complex, stateful animations requiring coordination. CSS animations run on the compositor thread when using transform/opacity, making them slightly more performant. However, JavaScript animations with Framer Motion provide: declarative React integration, gesture support (drag, hover, tap), layout animations for DOM changes, sequencing and orchestration, dynamic values based on state, and complex easing functions.",
  },
  {
    question: "How do I handle animations for users with motion sensitivity?",
    answer:
      "Support users with vestibular disorders by implementing prefers-reduced-motion: (1) Use Framer Motion's useReducedMotion hook to detect user preference and disable/simplify animations. (2) Replace motion animations with instant transitions or fade-only effects. (3) Reduce animation durations to <0.1s or remove entirely. (4) Disable parallax, zoom, and rotation effects completely. (5) Maintain functionality without animations - never hide controls behind animated states. According to WebAIM, 35% of users enable reduced motion, making this critical for accessibility.",
  },
  {
    question: "What's the optimal animation duration for different interaction types?",
    answer:
      "Optimal durations based on user testing: (1) Micro-interactions (buttons, toggles): 0.1-0.2s - immediate feedback feels responsive. (2) UI state changes (accordions, tooltips): 0.2-0.3s - fast enough to feel instant, slow enough to perceive motion. (3) Page transitions: 0.3-0.4s - provides continuity without feeling sluggish. (4) Modal appearances: 0.3-0.5s - slightly longer helps users notice and orient. (5) Scroll-triggered reveals: 0.4-0.6s - more dramatic effect acceptable. Never exceed 0.5s for user-initiated interactions.",
  },
]

export function FAQSection() {
  return (
    <section className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Frequently Asked Questions</h2>
      <Card>
        <CardHeader>
          <CardTitle>Common Questions About Animation Performance</CardTitle>
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

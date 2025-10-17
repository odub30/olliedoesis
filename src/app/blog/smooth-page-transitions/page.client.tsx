"use client"

import { PerformanceChart } from "@/components/performance-chart"
import { LibraryComparisonTable } from "@/components/library-comparison-table"
import { AnimationPropertiesTable } from "@/components/animation-properties-table"
import { DurationGuideTable } from "@/components/duration-guide-table"
import { PerformanceMetricsCard } from "@/components/performance-metrics-card"
import { CodeBlock } from "@/components/code-block"
import { TableOfContents } from "@/components/table-of-contents"
import { FAQSection } from "@/components/blog/faq-section"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Clock, Calendar, TrendingUp, Zap, Eye, Gauge } from "lucide-react"

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Implementing Smooth Page Transitions Without Sacrificing Performance",
  description:
    "Learn how to create buttery-smooth page transitions and animations using Framer Motion while maintaining perfect Lighthouse scores and 60fps performance.",
  datePublished: "2025-10-11T00:00:00.000Z",
  dateModified: "2025-10-11T00:00:00.000Z",
  author: {
    "@type": "Person",
    name: "Your Name",
  },
  publisher: {
    "@type": "Organization",
    name: "Your Blog",
  },
  articleSection: "Frontend Development",
  keywords: "framer motion, page transitions, web animations, performance optimization, react animations",
}

export default function PageClient() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <article className="min-h-screen bg-background">
        {/* Hero Section */}
        <header className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5 border-b">
          <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <div className="flex flex-wrap gap-2 justify-center">
                <Badge variant="secondary">Frontend Development</Badge>
                <Badge variant="secondary">Animation & Interactions</Badge>
                <Badge variant="secondary">Performance Optimization</Badge>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance">
                Implementing Smooth Page Transitions Without Sacrificing Performance
              </h1>

              <p className="text-xl text-muted-foreground text-balance max-w-3xl mx-auto">
                Master buttery-smooth 60fps page transitions and animations using Framer Motion while maintaining
                perfect Lighthouse scores
              </p>

              <div className="flex flex-wrap gap-6 justify-center text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <time dateTime="2025-10-11">October 11, 2025</time>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>9 min read</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  <span>Advanced</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12 max-w-7xl mx-auto">
            {/* Main Content */}
            <div className="space-y-12">
              {/* Introduction */}
              <section className="prose prose-lg max-w-none">
                <p className="text-lg leading-relaxed">
                  Animation is the secret ingredient that transforms a functional website into a delightful experience.
                  Done right, animations guide users, provide feedback, and make interactions feel responsive and
                  polished. Done wrong, they introduce janky scrolling, delayed interactions, and frustrated users
                  hitting the back button.
                </p>
                <p className="text-lg leading-relaxed">
                  When building my portfolio, I committed to creating smooth, engaging animations without compromising
                  the perfect Lighthouse scores I worked hard to achieve. This meant understanding animation performance
                  fundamentals, choosing the right tools, and implementing animations that run at 60fps even on
                  mid-range devices.
                </p>
              </section>

              {/* Key Metrics Overview */}
              <section className="space-y-6">
                <h2 className="text-3xl font-bold tracking-tight">Performance at a Glance</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <Gauge className="h-5 w-5 text-chart-1" />
                        <CardTitle className="text-lg">Frame Rate</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-4xl font-bold text-chart-1">60fps</div>
                      <p className="text-sm text-muted-foreground mt-1">100% consistency</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-chart-2" />
                        <CardTitle className="text-lg">Bundle Size</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-4xl font-bold text-chart-2">24KB</div>
                      <p className="text-sm text-muted-foreground mt-1">With LazyMotion</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <Eye className="h-5 w-5 text-chart-3" />
                        <CardTitle className="text-lg">Lighthouse</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-4xl font-bold text-chart-3">100</div>
                      <p className="text-sm text-muted-foreground mt-1">Perfect score</p>
                    </CardContent>
                  </Card>
                </div>
              </section>

              <Separator />

              {/* Animation Performance Fundamentals */}
              <section className="space-y-6">
                <h2 className="text-3xl font-bold tracking-tight">Animation Performance Fundamentals</h2>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  Before diving into implementation, understanding how browsers render animations is crucial for
                  building performant experiences.
                </p>

                <Card>
                  <CardHeader>
                    <CardTitle>The Browser Rendering Pipeline</CardTitle>
                    <CardDescription>Understanding the 5 stages of frame rendering</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { stage: "JavaScript", description: "Animation logic executes", color: "bg-yellow-500" },
                        { stage: "Style", description: "CSS styles are calculated", color: "bg-blue-500" },
                        {
                          stage: "Layout",
                          description: "Element positions and sizes calculated",
                          color: "bg-purple-500",
                        },
                        { stage: "Paint", description: "Pixels are drawn into layers", color: "bg-green-500" },
                        { stage: "Composite", description: "Layers combined into final image", color: "bg-orange-500" },
                      ].map((item, index) => (
                        <div key={index} className="flex items-center gap-4">
                          <div
                            className={`w-8 h-8 rounded-full ${item.color} flex items-center justify-center text-white font-bold text-sm`}
                          >
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold">{item.stage}</div>
                            <div className="text-sm text-muted-foreground">{item.description}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
                      <p className="font-semibold text-primary">⚡ Golden Rule</p>
                      <p className="text-sm mt-2">
                        Animating properties that trigger layout or paint causes performance issues. Animating{" "}
                        <code className="px-1.5 py-0.5 bg-muted rounded text-sm">transform</code> and{" "}
                        <code className="px-1.5 py-0.5 bg-muted rounded text-sm">opacity</code> only triggers
                        compositing—the fastest stage.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <AnimationPropertiesTable />
              </section>

              <Separator />

              {/* Library Comparison */}
              <section className="space-y-6">
                <h2 className="text-3xl font-bold tracking-tight">Choosing Framer Motion: The Decision</h2>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  I evaluated several animation libraries before choosing Framer Motion for my portfolio. Here&apos;s how
                  they compare:
                </p>

                <LibraryComparisonTable />

                <Card className="border-primary/50 bg-primary/5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-primary" />
                      Why I Chose Framer Motion
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">✓</span>
                        <span>Declarative API matches React patterns perfectly</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">✓</span>
                        <span>Excellent performance with automatic GPU acceleration</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">✓</span>
                        <span>Built-in gesture support (drag, hover, tap)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">✓</span>
                        <span>Layout animations handle complex DOM changes smoothly</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">✓</span>
                        <span>Bundle size acceptable (35KB for all features, tree-shakeable)</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </section>

              <Separator />

              {/* Installation & Setup */}
              <section className="space-y-6">
                <h2 className="text-3xl font-bold tracking-tight">Installation and Setup</h2>

                <CodeBlock language="bash" code="npm install framer-motion" title="Install Framer Motion" />

                <CodeBlock
                  language="typescript"
                  code={`// app/providers.tsx
'use client';

import { LazyMotion, domAnimation } from 'framer-motion';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}`}
                  title="Setup with LazyMotion (reduces bundle by 30%)"
                />
              </section>

              <Separator />

              {/* Page Transition Patterns */}
              <section className="space-y-6">
                <h2 className="text-3xl font-bold tracking-tight">Page Transition Patterns</h2>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  Page transitions create continuity between navigation events, making the experience feel cohesive.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Fade Transition</CardTitle>
                      <CardDescription>Simplest and most performant</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Performance:</span>
                          <span className="font-semibold text-green-600">60fps</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Duration:</span>
                          <span className="font-semibold">0.3s</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Complexity:</span>
                          <span className="font-semibold">Low</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Slide Transition</CardTitle>
                      <CardDescription>More dynamic, still performant</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Performance:</span>
                          <span className="font-semibold text-green-600">60fps</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Duration:</span>
                          <span className="font-semibold">0.4s</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Complexity:</span>
                          <span className="font-semibold">Medium</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <CodeBlock
                  language="typescript"
                  code={`// components/PageTransition.tsx
'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: 0.3,
        ease: [0.4, 0.0, 0.2, 1], // Custom easing curve
      }}
    >
      {children}
    </motion.div>
  );
}`}
                  title="Fade Transition Component"
                />

                <CodeBlock
                  language="typescript"
                  code={`// app/template.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{
          duration: 0.3,
          ease: [0.4, 0.0, 0.2, 1],
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}`}
                  title="Implementing with Next.js App Router"
                />
              </section>

              <Separator />

              {/* Animation Duration Guide */}
              <section className="space-y-6">
                <h2 className="text-3xl font-bold tracking-tight">Optimal Animation Durations</h2>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  Animation duration should match interaction type and user expectation. Here&apos;s a comprehensive guide
                  based on user testing:
                </p>

                <DurationGuideTable />
              </section>

              <Separator />

              {/* Performance Results */}
              <section className="space-y-6">
                <h2 className="text-3xl font-bold tracking-tight">Real-World Performance Results</h2>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  After implementing these animation strategies, here are the measurable improvements:
                </p>

                <PerformanceChart />

                <PerformanceMetricsCard />
              </section>

              <Separator />

              {/* Accessibility */}
              <section className="space-y-6">
                <h2 className="text-3xl font-bold tracking-tight">Accessibility Considerations</h2>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  Animations can cause issues for users with vestibular disorders or motion sensitivity. Always respect
                  user preferences.
                </p>

                <Card className="border-orange-500/50 bg-orange-500/5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="h-5 w-5 text-orange-600" />
                      Important: 35% of users enable reduced motion
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      According to WebAIM, a significant portion of users have motion sensitivity. Always implement{" "}
                      <code className="px-1.5 py-0.5 bg-muted rounded text-sm">prefers-reduced-motion</code> support.
                    </p>
                  </CardContent>
                </Card>

                <CodeBlock
                  language="typescript"
                  code={`'use client';

import { motion, useReducedMotion } from 'framer-motion';

export function AccessibleAnimation({ children }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: shouldReduceMotion ? 0 : 0.5,
      }}
    >
      {children}
    </motion.div>
  );
}`}
                  title="Respecting prefers-reduced-motion"
                />
              </section>

              <Separator />

              {/* FAQ Section */}
              <FAQSection />
            </div>

            {/* Sidebar */}
            <aside className="lg:sticky lg:top-8 h-fit space-y-6">
              <TableOfContents />

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Bundle Size Reduction</div>
                    <div className="text-2xl font-bold text-chart-1">31%</div>
                  </div>
                  <Separator />
                  <div>
                    <div className="text-muted-foreground">Frame Rate</div>
                    <div className="text-2xl font-bold text-chart-2">60fps</div>
                  </div>
                  <Separator />
                  <div>
                    <div className="text-muted-foreground">Engagement Increase</div>
                    <div className="text-2xl font-bold text-chart-3">34%</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
                <CardHeader>
                  <CardTitle className="text-lg">💡 Pro Tip</CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  <p>
                    Always use Chrome DevTools Performance panel to verify your animations run at 60fps. Look for
                    dropped frames (red triangles) and long tasks.
                  </p>
                </CardContent>
              </Card>
            </aside>
          </div>
        </div>
      </article>
    </>
  )
}

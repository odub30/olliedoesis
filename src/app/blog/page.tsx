import { BlogHeader } from "@/components/blog/blog-header"
import { TechStackOverview } from "@/components/blog/tech-stack-overview"
import { FrameworkComparison } from "@/components/blog/framework-comparison"
import { BundleSizeChart } from "@/components/blog/bundle-size-chart"
import { CoreWebVitals } from "@/components/blog/core-web-vitals"
import { FAQSection } from "@/components/blog/faq-section"

export default function BlogPost() {
  return (
    <div className="min-h-screen bg-background">
      <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <BlogHeader />

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <section className="mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-6">Introduction</h2>
            <p className="text-lg leading-relaxed text-muted-foreground">
              Choosing the right tech stack for your portfolio website is one of the most critical decisions you'll make
              as a developer. It's not just about showcasing your work—it's about demonstrating your technical judgment,
              understanding of modern web development, and ability to balance performance, maintainability, and user
              experience.
            </p>
            <p className="text-lg leading-relaxed text-muted-foreground mt-4">
              After months of research, testing, and iteration, I built my portfolio using Next.js 14, React 18,
              TypeScript, and Tailwind CSS. This wasn't a random choice or following trends blindly. Every technology in
              my stack serves a specific purpose and solves real problems I identified during the planning phase.
            </p>
          </section>

          <TechStackOverview />

          <section className="mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-6">The Requirements That Shaped My Decision</h2>
            <div className="grid gap-6 md:grid-cols-2 mb-8">
              <div className="rounded-lg border bg-card p-6">
                <h3 className="font-semibold text-xl mb-3">⚡ Performance</h3>
                <p className="text-muted-foreground">
                  100/100 Lighthouse scores across all metrics. Fast websites retain visitors and rank higher in search
                  results.
                </p>
              </div>
              <div className="rounded-lg border bg-card p-6">
                <h3 className="font-semibold text-xl mb-3">🔍 SEO Built-in</h3>
                <p className="text-muted-foreground">
                  Static generation and SSR capabilities for search engine visibility with clean URLs and proper meta
                  tags.
                </p>
              </div>
              <div className="rounded-lg border bg-card p-6">
                <h3 className="font-semibold text-xl mb-3">🛠️ Developer Experience</h3>
                <p className="text-muted-foreground">
                  Quick iteration, error catching before deployment, and maintainable code quality as the site grows.
                </p>
              </div>
              <div className="rounded-lg border bg-card p-6">
                <h3 className="font-semibold text-xl mb-3">📈 Scalability</h3>
                <p className="text-muted-foreground">
                  Architecture that expands from portfolio to full blog and interactive showcases without rebuilding.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-6">Why Next.js Became My Framework Foundation</h2>
            <p className="text-lg leading-relaxed text-muted-foreground mb-6">
              Next.js emerged as the clear winner after evaluating several options including Create React App, Gatsby,
              and Astro.
            </p>

            <div className="space-y-6 mb-8">
              <div className="border-l-4 border-primary pl-6">
                <h3 className="font-semibold text-xl mb-2">Hybrid Rendering Model</h3>
                <p className="text-muted-foreground">
                  Choose optimal rendering per page: SSG for homepage (instant CDN delivery), ISR for blog posts
                  (content updates without rebuilds), and SSR available for dynamic features without architectural
                  changes.
                </p>
              </div>

              <div className="border-l-4 border-primary pl-6">
                <h3 className="font-semibold text-xl mb-2">Built-in Performance Optimizations</h3>
                <p className="text-muted-foreground">
                  Image component automatically optimizes images, generates multiple sizes, serves WebP/AVIF, and
                  implements lazy loading. Font module eliminates layout shift and optimizes loading strategies.
                </p>
              </div>

              <div className="border-l-4 border-primary pl-6">
                <h3 className="font-semibold text-xl mb-2">Exceptional Developer Experience</h3>
                <p className="text-muted-foreground">
                  Fast Refresh preserves component state during development. File-system routing eliminates boilerplate.
                  API routes handle backend logic without separate servers.
                </p>
              </div>
            </div>
          </section>

          <FrameworkComparison />

          <section className="mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-6">React 18: The UI Library Choice</h2>
            <p className="text-lg leading-relaxed text-muted-foreground mb-6">
              React was a natural pairing with Next.js, but React 18 specifically brought features that elevated my
              portfolio's capabilities.
            </p>

            <div className="grid gap-4 md:grid-cols-3 mb-8">
              <div className="rounded-lg bg-muted p-5">
                <h4 className="font-semibold mb-2">Server Components</h4>
                <p className="text-sm text-muted-foreground">
                  Render on server, send only HTML. Dramatically reduces JavaScript bundle sizes.
                </p>
              </div>
              <div className="rounded-lg bg-muted p-5">
                <h4 className="font-semibold mb-2">Concurrent Rendering</h4>
                <p className="text-sm text-muted-foreground">
                  UI remains responsive during expensive operations with smooth transitions.
                </p>
              </div>
              <div className="rounded-lg bg-muted p-5">
                <h4 className="font-semibold mb-2">Automatic Batching</h4>
                <p className="text-sm text-muted-foreground">
                  Multiple state updates batched into single re-render, reducing unnecessary renders.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-6">TypeScript: Type Safety as a Foundation</h2>
            <p className="text-lg leading-relaxed text-muted-foreground mb-6">
              Adding TypeScript was initially debated but became one of my best decisions.
            </p>

            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <div className="rounded-full bg-primary/10 p-2 mt-1">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Catching Errors Before Runtime</h4>
                  <p className="text-muted-foreground">
                    Compiler identifies type mismatches, missing properties, and invalid function calls during
                    development.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="rounded-full bg-primary/10 p-2 mt-1">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">IDE Integration Enhanced Productivity</h4>
                  <p className="text-muted-foreground">
                    Autocomplete based on types, reliable jump-to-definition, and confident refactoring tools.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="rounded-full bg-primary/10 p-2 mt-1">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Self-Documenting Code</h4>
                  <p className="text-muted-foreground">
                    Type definitions serve as inline documentation with clear contracts between components.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-6">Tailwind CSS: Utility-First Styling Philosophy</h2>
            <p className="text-lg leading-relaxed text-muted-foreground mb-6">
              Styling decisions are deeply personal, but Tailwind CSS aligned perfectly with my development style and
              performance requirements.
            </p>

            <div className="rounded-lg border bg-card p-6 mb-6">
              <h3 className="font-semibold text-xl mb-4">Key Benefits</h3>
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <span className="text-primary font-bold">→</span>
                  <span className="text-muted-foreground">
                    <strong>Utility classes accelerated development:</strong> Compose styles directly in JSX without
                    context switching
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold">→</span>
                  <span className="text-muted-foreground">
                    <strong>Built-in design system:</strong> Default spacing, colors, and typography ensure visual
                    consistency
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold">→</span>
                  <span className="text-muted-foreground">
                    <strong>Tiny production CSS:</strong> Under 10KB gzipped despite thousands of available utilities
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold">→</span>
                  <span className="text-muted-foreground">
                    <strong>Declarative responsive design:</strong> Mobile-first utilities make breakpoints intuitive
                  </span>
                </li>
              </ul>
            </div>
          </section>

          <BundleSizeChart />

          <CoreWebVitals />

          <section className="mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-6">Lessons Learned and Future Considerations</h2>
            <div className="space-y-6">
              <div className="rounded-lg bg-muted/50 p-6">
                <h3 className="font-semibold text-lg mb-2">💡 Start with Constraints, Not Technologies</h3>
                <p className="text-muted-foreground">
                  Defining performance targets, SEO requirements, and scalability needs upfront led to better decisions
                  than choosing trendy technologies and retrofitting requirements.
                </p>
              </div>

              <div className="rounded-lg bg-muted/50 p-6">
                <h3 className="font-semibold text-lg mb-2">🎯 Optimize the Critical Path Obsessively</h3>
                <p className="text-muted-foreground">
                  The majority of performance wins came from optimizing what users see first—above-the-fold content,
                  font loading, and image optimization. Framework choice matters less than how you use it.
                </p>
              </div>

              <div className="rounded-lg bg-muted/50 p-6">
                <h3 className="font-semibold text-lg mb-2">⚙️ Developer Experience Compounds Over Time</h3>
                <p className="text-muted-foreground">
                  TypeScript's initial friction paid off within weeks. Tailwind's utility classes felt awkward initially
                  but became second nature. Investing in DX tools accelerates long-term productivity.
                </p>
              </div>

              <div className="rounded-lg bg-muted/50 p-6">
                <h3 className="font-semibold text-lg mb-2">📊 Measure Everything with Real Data</h3>
                <p className="text-muted-foreground">
                  Synthetic testing (Lighthouse) guided development, but real user monitoring through analytics revealed
                  actual performance. Both perspectives are necessary.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-6">Conclusion</h2>
            <p className="text-lg leading-relaxed text-muted-foreground mb-4">
              Building a high-performance portfolio required more than following tutorials or copying popular tech
              stacks. It demanded understanding my specific requirements, evaluating technologies against those needs,
              and making informed trade-offs.
            </p>
            <p className="text-lg leading-relaxed text-muted-foreground mb-4">
              Next.js, React, TypeScript, and Tailwind CSS form the foundation of my portfolio not because they're
              trendy, but because they solve real problems I identified. Next.js's hybrid rendering delivers performance
              and flexibility. React's component model scales from simple pages to complex interactions. TypeScript
              catches errors and improves maintainability. Tailwind accelerates styling without sacrificing performance.
            </p>
            <p className="text-lg leading-relaxed text-muted-foreground mb-4">
              The results validate these decisions—perfect Lighthouse scores, sub-second load times, and a codebase I
              enjoy maintaining. More importantly, the architecture supports future growth without technical debt
              accumulation.
            </p>
            <div className="rounded-lg border-2 border-primary/20 bg-primary/5 p-6 mt-8">
              <p className="text-lg font-medium">
                The best tech stack isn't the newest or most popular. It's the one that lets you build something
                excellent while remaining maintainable and performant.
              </p>
            </div>
          </section>

          <FAQSection />
        </div>
      </article>
    </div>
  )
}

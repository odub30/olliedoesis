/**
 * Example FAQ Data Sets
 *
 * AEO-optimized FAQ content for various blog topics.
 * Each set demonstrates best practices for:
 * - Natural language questions
 * - Concise, front-loaded answers
 * - Keyword optimization
 * - AI-extractable information
 */

import type { FAQItem } from '@/types/faq';

/**
 * FAQ Set 1: Next.js Portfolio Development
 *
 * Topic: Building a modern portfolio with Next.js
 * Target keywords: Next.js portfolio, modern web development, portfolio optimization
 */
export const nextjsPortfolioFAQs: FAQItem[] = [
  {
    id: 1,
    question: 'What is the best tech stack for a portfolio website in 2025?',
    answer: 'The best tech stack for a portfolio website in 2025 combines Next.js 15 with React 19 for the frontend, Tailwind CSS for styling, and Vercel for deployment. This combination offers exceptional performance with sub-second load times, automatic SEO optimization through server-side rendering, and seamless deployment. Next.js provides built-in image optimization, reducing load times by 40-60%, while Tailwind CSS enables rapid UI development with a minimal footprint (typically under 10KB gzipped).',
    category: 'Technology',
    keywords: ['Next.js', 'tech stack', 'portfolio development', 'React', 'Tailwind CSS'],
  },
  {
    id: 2,
    question: 'How long does it take to build a professional portfolio website?',
    answer: 'You can build a professional portfolio website in 3-7 days with modern tools like Next.js and pre-built components. Day 1-2: Set up project structure and design system. Day 3-4: Build core pages (home, about, projects, contact). Day 5: Implement responsive design and animations. Day 6-7: SEO optimization, testing, and deployment. Using component libraries and AI-assisted development tools like Claude Code can reduce this timeline by 30-40%. A minimal viable portfolio can be deployed in as little as 1-2 days.',
    category: 'Planning',
    keywords: ['development time', 'portfolio timeline', 'project planning'],
  },
  {
    id: 3,
    question: 'Do I need a database for my portfolio website?',
    answer: 'No, most portfolios do not need a database initially. Static content using Markdown files is sufficient for blogs and project showcases, offering faster load times and simpler deployment. However, add a database (like Prisma with PostgreSQL) if you need: dynamic content updates without redeployment, user authentication for admin features, contact form submissions storage, or analytics tracking. A database adds approximately 100-200ms to response times but enables powerful CMS capabilities. Start simple and add database functionality only when static content becomes limiting.',
    category: 'Architecture',
    keywords: ['database', 'static site', 'Markdown', 'CMS', 'Prisma'],
  },
  {
    id: 4,
    question: 'How can I achieve a 100/100 Lighthouse performance score?',
    answer: 'Achieving a perfect Lighthouse score requires optimizing five key areas: (1) Minimize JavaScript bundle size through code splitting and tree shaking, targeting under 200KB total. (2) Optimize images using WebP/AVIF formats and Next.js Image component for automatic optimization. (3) Implement lazy loading for below-the-fold content, reducing initial load by 40-60%. (4) Use a CDN like Vercel Edge Network for sub-50ms response times. (5) Minimize render-blocking resources by inlining critical CSS and deferring non-essential scripts. Each 10-point improvement typically reduces bounce rate by 5-8%.',
    category: 'Performance',
    keywords: ['Lighthouse', 'performance optimization', 'web vitals', 'page speed'],
  },
  {
    id: 5,
    question: 'Should I use TypeScript for my portfolio project?',
    answer: 'Yes, TypeScript is highly recommended for portfolio projects in 2025. TypeScript catches 15-20% of bugs before runtime, improves code maintainability by providing autocomplete and type checking, and signals professional development practices to potential employers. The learning curve is 2-3 days for basic usage, and modern frameworks like Next.js have built-in TypeScript support requiring zero configuration. Start with basic type annotations and gradually adopt advanced features. TypeScript adds minimal overhead (typically 5-10% longer build times) but prevents costly refactoring later.',
    category: 'Development',
    keywords: ['TypeScript', 'type safety', 'JavaScript', 'code quality'],
  },
  {
    id: 6,
    question: 'What should I include in my developer portfolio?',
    answer: 'A complete developer portfolio must include: (1) Homepage with clear value proposition and call-to-action. (2) About page highlighting your technical skills, background, and career goals. (3) Projects section showcasing 3-6 best works with live demos, GitHub links, and tech stacks. (4) Blog for demonstrating expertise and improving SEO (aim for 5-10 posts initially). (5) Contact information with email and social links. Optional but valuable additions: testimonials, resume download, case studies with metrics, and an interactive skills visualization. Prioritize quality over quantity - 3 polished projects outperform 10 mediocre ones.',
    category: 'Content',
    keywords: ['portfolio content', 'what to include', 'portfolio structure'],
  },
  {
    id: 7,
    question: 'How do I make my portfolio stand out from other developers?',
    answer: 'Make your portfolio stand out through personalization and demonstrate real problem-solving: (1) Create a unique design that reflects your personality while maintaining professionalism. (2) Show actual impact metrics (e.g., "Improved load time by 60%" vs. "Optimized performance"). (3) Write detailed case studies explaining your decision-making process, not just what you built. (4) Add interactive elements like animations, dark mode, or Easter eggs. (5) Maintain an active blog sharing technical insights. (6) Include open-source contributions and community involvement. Most portfolios lack personality and measurable results - focusing on these areas puts you in the top 10% of candidates.',
    category: 'Strategy',
    keywords: ['portfolio differentiation', 'standing out', 'personal branding'],
  },
  {
    id: 8,
    question: 'Is it better to use a template or build from scratch?',
    answer: 'Building from scratch is better for portfolios if you want to demonstrate your actual coding abilities to employers. Templates can be detected easily and may signal lack of originality or skill. However, starting with a minimal boilerplate like "create-next-app" is acceptable and saves 2-3 hours of initial setup. The key is customization: modify 80%+ of the template code, implement unique features, and add personal design elements. If time-constrained (less than 1 week), start with a high-quality template and heavily customize it. Most recruiters spend only 10-20 seconds on portfolios, so unique design and clear value proposition matter more than whether you started with a template.',
    category: 'Approach',
    keywords: ['template vs custom', 'from scratch', 'portfolio templates'],
  },
];

/**
 * FAQ Set 2: Web Performance Optimization
 *
 * Topic: Optimizing website performance and Core Web Vitals
 * Target keywords: web performance, Core Web Vitals, site speed
 */
export const webPerformanceFAQs: FAQItem[] = [
  {
    id: 1,
    question: 'What are Core Web Vitals and why do they matter?',
    answer: 'Core Web Vitals are three key metrics Google uses to measure user experience: Largest Contentful Paint (LCP) measuring load time, First Input Delay (FID) measuring interactivity, and Cumulative Layout Shift (CLS) measuring visual stability. They matter because Google uses them as ranking factors starting in 2021, and they directly correlate with user satisfaction and conversion rates. Improving Core Web Vitals by one grade (e.g., "Needs Improvement" to "Good") typically increases conversion rates by 8-15% and reduces bounce rates by 12-24%. Target scores: LCP under 2.5s, FID under 100ms, CLS under 0.1.',
    category: 'Metrics',
    keywords: ['Core Web Vitals', 'LCP', 'FID', 'CLS', 'Google ranking'],
  },
  {
    id: 2,
    question: 'How can I reduce my website\'s load time?',
    answer: 'Reduce load time through six proven techniques: (1) Optimize images using WebP format and lazy loading, typically reducing page weight by 40-60%. (2) Minimize JavaScript bundles through code splitting, targeting under 200KB. (3) Enable compression (gzip or Brotli) for 70-80% size reduction on text assets. (4) Use a CDN to serve assets from locations closer to users, reducing latency by 50-200ms. (5) Implement browser caching with long expiry headers (1 year for static assets). (6) Defer non-critical CSS and JavaScript. Each second of improvement can increase conversion rates by 7% on average.',
    category: 'Performance',
    keywords: ['load time', 'page speed', 'optimization techniques'],
  },
  {
    id: 3,
    question: 'What is the difference between WebP and traditional image formats?',
    answer: 'WebP is a modern image format that is 25-35% smaller than JPEG at equivalent quality and 25-50% smaller than PNG while supporting transparency. WebP uses advanced compression algorithms combining lossless and lossy techniques, making it ideal for web use. Browser support is now 95%+ (all modern browsers since 2020). Use WebP for photographs and complex images, SVG for logos and icons, and AVIF (50% smaller than JPEG) for cutting-edge projects. Converting images to WebP typically reduces total page weight by 30-40% without visible quality loss, directly improving load times and Core Web Vitals scores.',
    category: 'Images',
    keywords: ['WebP', 'image formats', 'image optimization', 'AVIF'],
  },
  {
    id: 4,
    question: 'Should I use server-side rendering or static site generation?',
    answer: 'Choose based on content freshness needs: Static Site Generation (SSG) is best for content that rarely changes (blogs, portfolios, documentation), offering fastest load times (under 100ms) and lowest server costs. Server-Side Rendering (SSR) is necessary for personalized or frequently updated content (user dashboards, real-time data, dynamic pricing). Hybrid approaches like Next.js Incremental Static Regeneration (ISR) combine benefits of both, regenerating static pages every N seconds. For most portfolios and marketing sites, use SSG with ISR for optimal performance. SSG sites typically score 90-100 on Lighthouse, while pure SSR scores 70-85.',
    category: 'Architecture',
    keywords: ['SSR', 'SSG', 'rendering strategies', 'Next.js ISR'],
  },
  {
    id: 5,
    question: 'How do I test my website\'s performance?',
    answer: 'Test performance using three complementary tools: (1) Google PageSpeed Insights for Core Web Vitals and actionable recommendations based on real user data. (2) WebPageTest for detailed waterfall analysis, showing exactly which resources slow your site. (3) Lighthouse (built into Chrome DevTools) for comprehensive audits of performance, accessibility, and SEO. Test on both desktop and mobile, as mobile scores are typically 10-20 points lower. Use throttled testing (Slow 3G simulation) to see worst-case performance. Aim for: 90+ Lighthouse score, under 3s load time, and LCP under 2.5s. Run tests from multiple geographic locations for accurate results.',
    category: 'Testing',
    keywords: ['performance testing', 'PageSpeed Insights', 'Lighthouse', 'WebPageTest'],
  },
  {
    id: 6,
    question: 'What is lazy loading and when should I use it?',
    answer: 'Lazy loading defers loading of non-critical resources (images, videos, components) until they are needed, typically when entering the viewport. This reduces initial page weight by 40-70% and improves First Contentful Paint by 1-3 seconds. Use lazy loading for: images below the fold, embedded videos, heavy JavaScript components not needed immediately, and third-party widgets (chat, analytics). Do NOT lazy load above-the-fold content or critical navigation elements. Modern browsers support native lazy loading with loading="lazy" attribute. For complex cases, use Intersection Observer API or libraries like react-lazy-load-image-component.',
    category: 'Techniques',
    keywords: ['lazy loading', 'defer loading', 'images', 'performance'],
  },
];

/**
 * FAQ Set 3: Modern CSS and Tailwind CSS
 *
 * Topic: CSS architecture and Tailwind CSS usage
 * Target keywords: Tailwind CSS, modern CSS, utility-first CSS
 */
export const tailwindCSSFAQs: FAQItem[] = [
  {
    id: 1,
    question: 'What is Tailwind CSS and how is it different from Bootstrap?',
    answer: 'Tailwind CSS is a utility-first CSS framework providing low-level utility classes instead of pre-designed components. Unlike Bootstrap, which gives you ready-made buttons and cards, Tailwind gives you building blocks like "px-4" (padding-x: 1rem) and "text-blue-600" to construct custom designs. This results in: (1) Smaller production bundle sizes (5-10KB vs 30-50KB for Bootstrap), (2) Greater design flexibility without overriding framework styles, (3) Faster development once you learn the class names. Tailwind requires more initial setup but prevents the "Bootstrap look" and scales better for custom designs. Choose Tailwind for unique designs, Bootstrap for rapid prototyping with standard UI patterns.',
    category: 'Comparison',
    keywords: ['Tailwind CSS', 'Bootstrap', 'CSS frameworks', 'utility-first'],
  },
  {
    id: 2,
    question: 'Is Tailwind CSS just inline styles with extra steps?',
    answer: 'No, Tailwind CSS differs fundamentally from inline styles in four critical ways: (1) Responsive design: Classes like "md:flex" and "lg:grid" enable mobile-first design impossible with inline styles. (2) Pseudo-states: Hover, focus, and active states use "hover:bg-blue-500" syntax. (3) Optimization: PurgeCSS removes unused classes, resulting in tiny production bundles (5-15KB). (4) Design systems: Tailwind enforces consistent spacing, colors, and typography from a centralized config. Inline styles require 3-5x more code and lack these features. Tailwind provides the benefits of utility classes with the power of a proper CSS framework.',
    category: 'Concepts',
    keywords: ['Tailwind vs inline styles', 'utility classes', 'CSS methodology'],
  },
  {
    id: 3,
    question: 'How do I organize Tailwind CSS classes in large projects?',
    answer: 'Organize Tailwind classes using component extraction and @apply directive: (1) Keep utility classes in JSX for simple, one-off styling (under 10 classes). (2) Extract repeated patterns into components (e.g., <Button>, <Card>). (3) Use @apply in CSS files for complex, frequently repeated class combinations (e.g., .btn-primary). (4) Group related utilities: layout, spacing, colors, typography. (5) Use plugins like prettier-plugin-tailwindcss for automatic class sorting. For very large projects, consider component variants with libraries like CVA (class-variance-authority) or twin.macro for TypeScript-safe styling. Avoid @apply overuse - it negates Tailwind\'s benefits.',
    category: 'Best Practices',
    keywords: ['Tailwind organization', 'component extraction', '@apply', 'code structure'],
  },
  {
    id: 4,
    question: 'Does Tailwind CSS work well with React and Next.js?',
    answer: 'Yes, Tailwind CSS is exceptionally well-suited for React and Next.js projects. Integration requires only 2 minutes (npm install + configuration) and provides: (1) Zero runtime cost - all styling is compiled at build time. (2) Component-scoped styling with no naming conflicts. (3) Full TypeScript support for custom theme configuration. (4) Automatic purging of unused styles in production. (5) Built-in support for Next.js SSR and SSG. Over 70% of modern Next.js projects use Tailwind according to 2024 surveys. The combination enables rapid development with excellent performance - most portfolios achieve 95+ Lighthouse scores with Tailwind + Next.js.',
    category: 'Integration',
    keywords: ['Tailwind React', 'Tailwind Next.js', 'integration', 'compatibility'],
  },
  {
    id: 5,
    question: 'How can I customize Tailwind CSS colors and spacing?',
    answer: 'Customize Tailwind through tailwind.config.js theme extension: (1) Extend existing theme: add custom colors to the default palette using theme.extend. (2) Override completely: replace default theme for full control. (3) Use CSS custom properties for dynamic theming (light/dark mode). Example: theme.extend.colors.brand = {"50": "#f0f9ff", ...} creates brand-50 through brand-900 classes. For spacing, extend with custom values like "72": "18rem". Best practice: extend rather than override to keep Tailwind\'s utilities. Use semantic names (primary, secondary) rather than specific colors (blue-500) for easier theme changes. Customization adds zero bytes to production bundle until classes are actually used.',
    category: 'Customization',
    keywords: ['Tailwind customization', 'theme configuration', 'colors', 'spacing'],
  },
];

/**
 * Helper function to get FAQ set by topic
 */
export function getFAQsByTopic(topic: 'nextjs' | 'performance' | 'tailwind'): FAQItem[] {
  switch (topic) {
    case 'nextjs':
      return nextjsPortfolioFAQs;
    case 'performance':
      return webPerformanceFAQs;
    case 'tailwind':
      return tailwindCSSFAQs;
    default:
      return [];
  }
}

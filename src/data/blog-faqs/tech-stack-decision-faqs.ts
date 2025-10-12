/**
 * FAQ Data for "Building a High-Performance Portfolio" Blog Post
 *
 * These FAQs complement the main article content and provide
 * quick answers to common questions about tech stack decisions.
 */

import type { FAQItem } from '@/types/faq';

export const techStackDecisionFAQs: FAQItem[] = [
  {
    id: 1,
    question: 'What is the best tech stack for a portfolio website in 2025?',
    answer: 'The best tech stack depends on your specific needs and goals, but a popular high-performance combination is Next.js 14 with React 18, TypeScript, and Tailwind CSS. This stack delivers excellent performance with built-in SEO capabilities through server-side rendering and static site generation. Next.js provides automatic code splitting and image optimization, helping achieve 100/100 Lighthouse scores. Vercel offers seamless deployment with edge network distribution. For purely static content sites, Astro provides even lighter JavaScript bundles, while Gatsby excels for content-heavy sites with complex data needs. The key is matching the stack to your requirements - performance targets, content management needs, interactivity level, and future scalability - rather than following trends blindly.',
    category: 'Technology Selection',
    keywords: ['tech stack', 'portfolio', 'Next.js', 'React', 'best practices'],
  },
  {
    id: 2,
    question: 'Should I use TypeScript or JavaScript for my portfolio?',
    answer: 'TypeScript offers significant advantages for portfolio development, especially for long-term maintenance and demonstrating professional coding practices. Type safety catches errors during development rather than in production, with the compiler identifying mismatches and invalid function calls immediately. IDE integration provides superior autocomplete, refactoring tools, and jump-to-definition functionality based on type information. TypeScript also serves as self-documenting code - type definitions clarify expected inputs and outputs without extensive comments. However, JavaScript remains viable for simpler portfolios with limited interactivity. If you are showcasing frontend development skills professionally, TypeScript demonstrates understanding of modern development practices and scales better as your portfolio grows. The learning curve is moderate, and gradual adoption allows starting with loose typing and progressively adding strictness.',
    category: 'Technology Selection',
    keywords: ['TypeScript', 'JavaScript', 'type safety', 'portfolio development'],
  },
  {
    id: 3,
    question: 'Why choose Next.js over Create React App or Gatsby?',
    answer: 'Next.js offers critical advantages for portfolio websites that Create React App and Gatsby lack in different ways. Unlike Create React App, Next.js provides server-side rendering and static site generation out of the box, essential for SEO and performance. CRA renders entirely on the client, meaning search engines see blank HTML until JavaScript executes. Next.js hybrid rendering lets you choose the optimal strategy per page - static generation for your homepage, server-side rendering for dynamic content, and client-side rendering for interactive features. The built-in Image component, automatic code splitting, and API routes eliminate configuration overhead. Compared to Gatsby, Next.js offers simpler data fetching without GraphQL complexity, more flexible rendering options, and faster build times for larger sites. Gatsby excels for complex content transformations and has a rich plugin ecosystem, but Next.js provides better developer experience and clearer upgrade paths. For most portfolios, Next.js balances simplicity, performance, and flexibility optimally.',
    category: 'Framework Comparison',
    keywords: ['Next.js', 'Create React App', 'Gatsby', 'framework comparison', 'SSR', 'SSG'],
  },
  {
    id: 4,
    question: 'How does Tailwind CSS impact website performance?',
    answer: 'Tailwind CSS positively impacts performance when configured correctly, despite common misconceptions about utility-first frameworks. During development, Tailwind provides thousands of utility classes, but the production build uses PurgeCSS to remove all unused styles. This results in extremely small CSS bundles - typically 5-15KB gzipped for entire applications, smaller than most custom CSS approaches. Tailwind eliminates the dead code accumulation common in traditional CSS where unused styles persist indefinitely. The utility-first approach also reduces specificity issues and cascade complexity, resulting in more predictable rendering performance. However, improper configuration can cause problems - failing to configure purging correctly ships all utility classes (multiple megabytes). You must ensure your purge configuration includes all template files. When optimized properly, Tailwind delivers faster load times than writing custom CSS while providing comprehensive styling capabilities. The performance benefit increases in larger applications where custom CSS tends to grow unbounded.',
    category: 'Performance',
    keywords: ['Tailwind CSS', 'performance', 'CSS optimization', 'bundle size'],
  },
  {
    id: 5,
    question: 'What are the main drawbacks of this tech stack?',
    answer: 'Every tech stack involves trade-offs, and understanding limitations is crucial for informed decisions. JavaScript bundle size is the primary concern - React and Next.js add baseline overhead compared to lighter frameworks like Astro or vanilla JavaScript. Even optimized, you will ship 80-100KB of JavaScript for initial page load. For portfolios prioritizing absolute minimum JavaScript, this may be excessive. The learning curve is substantial - Next.js App Router, React Server Components, TypeScript type system, and Tailwind utility-first approach all require time investment. Framework lock-in means your code is coupled to Next.js patterns and Vercel ecosystem. Build complexity increases compared to static HTML - you need Node.js, understanding of build processes, and deployment infrastructure. For developers wanting simple HTML/CSS/JS without build steps, this adds unnecessary complexity. Finally, overkill risk is real for minimal portfolios with few pages and no dynamic features - simpler solutions might serve better. Evaluate whether your portfolio scope justifies this stack complexity.',
    category: 'Trade-offs',
    keywords: ['drawbacks', 'trade-offs', 'complexity', 'bundle size', 'learning curve'],
  },
  {
    id: 6,
    question: 'How do I optimize Next.js for perfect Lighthouse scores?',
    answer: 'Achieving 100/100 Lighthouse scores with Next.js requires optimizing multiple performance vectors systematically. Image optimization is critical - use next/image for all images, which automatically generates responsive sizes, serves modern formats (WebP/AVIF), and implements lazy loading. Specify width and height to prevent layout shift. For fonts, use next/font to eliminate font-loading layout shift and optimize font delivery. Code splitting happens automatically at the page level, but verify you are not importing heavy libraries unnecessarily. Minimize third-party scripts and load them asynchronously when possible. Enable proper caching headers through next.config.js. Use static generation (getStaticProps) wherever possible instead of server-side rendering. Implement proper meta tags and structured data for SEO score. Ensure all interactive elements have ARIA labels and keyboard navigation for accessibility. Remove unused JavaScript by analyzing bundle size with @next/bundle-analyzer. Set appropriate resource hints (preconnect, dns-prefetch) for external resources. Deploy on Vercel edge network or comparable CDN for optimal global performance. Most importantly, test on real mobile devices and slower networks, not just desktop development environments.',
    category: 'Performance',
    keywords: ['Lighthouse', 'optimization', 'performance', 'Next.js', '100/100 score'],
  },
  {
    id: 7,
    question: 'Is Vercel required for deploying Next.js applications?',
    answer: 'Vercel is not required for Next.js deployment despite being the framework creator, though it offers the smoothest experience. Next.js applications can deploy to any hosting platform supporting Node.js, including Netlify, AWS Amplify, DigitalOcean, Railway, Render, and self-hosted solutions. However, Vercel provides native Next.js optimizations - automatic edge caching, incremental static regeneration, image optimization API, and preview deployments without configuration. For portfolios, Vercel free tier is generous - 100GB bandwidth, unlimited sites, and automatic SSL certificates. Alternative platforms require more configuration for equivalent features. Netlify supports Next.js well but requires adapter configuration for some features. AWS offers complete control but demands significant DevOps knowledge. Self-hosting on VPS provides maximum flexibility but requires managing server infrastructure, security updates, and scaling. For portfolios prioritizing simplicity and optimal Next.js support, Vercel is the pragmatic choice. For learning deployment intricacies or avoiding vendor lock-in, alternative platforms work effectively with proper configuration.',
    category: 'Deployment',
    keywords: ['Vercel', 'deployment', 'hosting', 'Next.js', 'alternatives'],
  },
  {
    id: 8,
    question: 'Can I migrate from this tech stack to another framework later?',
    answer: 'Migration from Next.js/React/TypeScript/Tailwind to other frameworks is possible but requires substantial effort, making initial technology selection important. The React component architecture provides some portability - components can migrate to other React frameworks (Gatsby, Remix) or adapt to similar component models (Vue, Svelte) with refactoring. TypeScript interfaces and type definitions translate relatively smoothly to other TypeScript-supporting frameworks. However, Next.js-specific features lock you into its patterns - App Router conventions, Server Components, data fetching methods, and routing structure all require reimplementation in new frameworks. Tailwind classes are framework-agnostic and migrate cleanly, maintaining styling with minimal changes. Complete rewrites typically make more sense than gradual migrations for framework changes. To minimize migration pain, separate business logic from framework code, use abstraction layers for data fetching, and keep components focused and loosely coupled. Consider your tech stack choice as semi-permanent - changing core frameworks mid-project is expensive. However, the component-based architecture and modern patterns used in this stack transfer well to other ecosystems even if code does not directly migrate.',
    category: 'Migration',
    keywords: ['migration', 'framework', 'portability', 'refactoring', 'future-proofing'],
  },
];

// src/lib/blogMetadata.ts
// Centralized blog post metadata and type definitions

export type PrimaryCategory =
  | "Frontend Development"
  | "Backend Development"
  | "Performance Optimization"
  | "Design & UX"
  | "DevOps & Deployment"
  | "Tools & Workflow";

export interface BlogPost {
  slug: string;
  title: string;
  publishedDate: string;
  lastUpdated: string;
  readTime: number;
  author: string;
  category: PrimaryCategory;
  tags: string[];
  description: string;
  featured: boolean;
  githubRepo?: string;
  relatedPosts: string[];
  content?: string;
}

export const allPosts: BlogPost[] = [
  {
    slug: "building-high-performance-portfolio-tech-stack",
    title: "Building a High-Performance Portfolio: The Tech Stack Decision",
    publishedDate: "2025-01-15",
    lastUpdated: "2025-01-15",
    readTime: 12,
    author: "Ollie",
    category: "Frontend Development",
    tags: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Performance",
      "Architecture",
      "SSG",
      "App Router",
      "Developer Experience",
      "Modern Web"
    ],
    description: "Deep dive into choosing Next.js, React, TypeScript, and Tailwind CSS for building a modern portfolio website. Learn why this stack delivers exceptional performance, developer experience, and maintainability.",
    featured: true,
    githubRepo: "https://github.com/odub30/olliedoesis",
    relatedPosts: [
      "achieving-100-lighthouse-scores-case-study",
      "nextjs-app-router-migration-guide",
      "optimizing-bundle-size-nextjs"
    ]
  },
  {
    slug: "achieving-100-lighthouse-scores-case-study",
    title: "Achieving 100/100 Lighthouse Scores: A Case Study",
    publishedDate: "2025-01-22",
    lastUpdated: "2025-01-22",
    readTime: 15,
    author: "Ollie",
    category: "Performance Optimization",
    tags: [
      "Lighthouse",
      "Core Web Vitals",
      "LCP",
      "CLS",
      "FID",
      "Performance",
      "Image Optimization",
      "next/image",
      "Font Optimization",
      "SEO"
    ],
    description: "Step-by-step guide to achieving perfect 100/100 Lighthouse scores across all categories. Covers image optimization, font loading, Core Web Vitals, accessibility improvements, and SEO best practices.",
    featured: true,
    relatedPosts: [
      "building-high-performance-portfolio-tech-stack",
      "optimizing-images-nextjs-performance",
      "core-web-vitals-optimization-techniques"
    ]
  },
  {
    slug: "smooth-page-transitions-without-sacrificing-performance",
    title: "Implementing Smooth Page Transitions Without Sacrificing Performance",
    publishedDate: "2025-02-05",
    lastUpdated: "2025-02-05",
    readTime: 10,
    author: "Ollie",
    category: "Frontend Development",
    tags: [
      "Animations",
      "Page Transitions",
      "Framer Motion",
      "Performance",
      "UX",
      "React",
      "CSS Animations",
      "View Transitions API"
    ],
    description: "Learn how to implement beautiful page transitions using Framer Motion and the View Transitions API while maintaining optimal performance. Includes code examples and performance benchmarks.",
    featured: false,
    relatedPosts: [
      "building-high-performance-portfolio-tech-stack",
      "framer-motion-advanced-techniques",
      "css-animations-performance-guide"
    ]
  },
  {
    slug: "shadcn-ui-comprehensive-guide",
    title: "shadcn/ui: Building Beautiful UIs with Radix and Tailwind",
    publishedDate: "2025-02-12",
    lastUpdated: "2025-02-12",
    readTime: 14,
    author: "Ollie",
    category: "Design & UX",
    tags: [
      "shadcn/ui",
      "Radix UI",
      "Tailwind CSS",
      "Component Library",
      "Accessibility",
      "Design System",
      "React Components",
      "UI Development"
    ],
    description: "Comprehensive guide to shadcn/ui - the revolutionary component library that combines Radix UI primitives with Tailwind CSS. Learn why it's different from traditional component libraries and how to build accessible, customizable UIs.",
    featured: true,
    relatedPosts: [
      "building-high-performance-portfolio-tech-stack",
      "tailwind-css-best-practices",
      "accessible-web-components"
    ]
  },
  {
    slug: "nextjs-app-router-migration-guide",
    title: "Migrating to Next.js App Router: Lessons Learned",
    publishedDate: "2025-02-19",
    lastUpdated: "2025-02-19",
    readTime: 18,
    author: "Ollie",
    category: "Frontend Development",
    tags: [
      "Next.js",
      "App Router",
      "Migration",
      "Server Components",
      "React Server Components",
      "Routing",
      "File-based Routing",
      "Best Practices"
    ],
    description: "Real-world migration guide from Next.js Pages Router to App Router. Covers Server Components, data fetching patterns, route handlers, metadata API, and common pitfalls to avoid.",
    featured: false,
    relatedPosts: [
      "building-high-performance-portfolio-tech-stack",
      "server-components-deep-dive",
      "nextjs-14-features-overview"
    ]
  },
  {
    slug: "typescript-advanced-patterns-react",
    title: "Advanced TypeScript Patterns for React Applications",
    publishedDate: "2025-03-01",
    lastUpdated: "2025-03-01",
    readTime: 16,
    author: "Ollie",
    category: "Frontend Development",
    tags: [
      "TypeScript",
      "React",
      "Type Safety",
      "Generics",
      "Advanced Types",
      "Type Inference",
      "Best Practices",
      "Developer Experience"
    ],
    description: "Master advanced TypeScript patterns for React applications. Learn about generic components, discriminated unions, type guards, utility types, and how to build fully type-safe React applications.",
    featured: false,
    relatedPosts: [
      "building-high-performance-portfolio-tech-stack",
      "typescript-tips-tricks",
      "react-hooks-typescript"
    ]
  },
  {
    slug: "vercel-deployment-optimization",
    title: "Optimizing Next.js Deployment on Vercel: Beyond the Defaults",
    publishedDate: "2025-03-10",
    lastUpdated: "2025-03-10",
    readTime: 11,
    author: "Ollie",
    category: "DevOps & Deployment",
    tags: [
      "Vercel",
      "Deployment",
      "Next.js",
      "CI/CD",
      "Performance",
      "Edge Network",
      "Environment Variables",
      "Build Optimization"
    ],
    description: "Advanced Vercel deployment strategies for Next.js applications. Learn about edge functions, preview deployments, environment variables, build caching, and performance optimizations.",
    featured: false,
    relatedPosts: [
      "building-high-performance-portfolio-tech-stack",
      "cicd-best-practices",
      "nextjs-production-checklist"
    ]
  },
  {
    slug: "optimizing-bundle-size-nextjs",
    title: "Bundle Size Optimization: Getting Next.js Under 100KB",
    publishedDate: "2025-03-18",
    lastUpdated: "2025-03-18",
    readTime: 13,
    author: "Ollie",
    category: "Performance Optimization",
    tags: [
      "Bundle Size",
      "Optimization",
      "Next.js",
      "Code Splitting",
      "Tree Shaking",
      "Dynamic Imports",
      "Webpack",
      "Performance"
    ],
    description: "Practical guide to reducing Next.js bundle sizes. Covers dynamic imports, code splitting strategies, analyzing bundle composition, removing unused dependencies, and achieving sub-100KB bundles.",
    featured: true,
    relatedPosts: [
      "building-high-performance-portfolio-tech-stack",
      "achieving-100-lighthouse-scores-case-study",
      "webpack-optimization-techniques"
    ]
  },
  {
    slug: "git-workflow-best-practices",
    title: "Git Workflow Best Practices for Solo Developers",
    publishedDate: "2025-03-25",
    lastUpdated: "2025-03-25",
    readTime: 9,
    author: "Ollie",
    category: "Tools & Workflow",
    tags: [
      "Git",
      "Version Control",
      "Workflow",
      "Best Practices",
      "Commits",
      "Branching",
      "GitHub",
      "Developer Productivity"
    ],
    description: "Efficient Git workflows for solo developers and small teams. Learn about commit conventions, branching strategies, PR best practices, and tools to improve your version control workflow.",
    featured: false,
    relatedPosts: [
      "vercel-deployment-optimization",
      "developer-productivity-tools",
      "cicd-best-practices"
    ]
  },
  {
    slug: "nextauth-v5-setup-guide",
    title: "Setting Up NextAuth v5: Complete Authentication Guide",
    publishedDate: "2025-04-02",
    lastUpdated: "2025-04-02",
    readTime: 17,
    author: "Ollie",
    category: "Backend Development",
    tags: [
      "NextAuth",
      "Authentication",
      "OAuth",
      "Security",
      "Next.js",
      "GitHub OAuth",
      "Session Management",
      "Auth.js"
    ],
    description: "Complete guide to implementing authentication with NextAuth v5 (Auth.js). Covers OAuth setup, session management, middleware protection, database adapters, and security best practices.",
    featured: false,
    relatedPosts: [
      "building-high-performance-portfolio-tech-stack",
      "security-best-practices-nextjs",
      "database-setup-prisma"
    ]
  }
];

// Extract unique categories
export const allCategories: PrimaryCategory[] = [
  "Frontend Development",
  "Backend Development",
  "Performance Optimization",
  "Design & UX",
  "DevOps & Deployment",
  "Tools & Workflow"
];

// Extract all unique tags from posts
export const allTags: string[] = Array.from(
  new Set(allPosts.flatMap(post => post.tags))
).sort();

// Helper function to get posts by category
export function getPostsByCategory(category: PrimaryCategory): BlogPost[] {
  return allPosts.filter(post => post.category === category);
}

// Helper function to get posts by tag
export function getPostsByTag(tag: string): BlogPost[] {
  return allPosts.filter(post => post.tags.includes(tag));
}

// Helper function to get featured posts
export function getFeaturedPosts(): BlogPost[] {
  return allPosts.filter(post => post.featured);
}

// Helper function to get post by slug
export function getPostBySlug(slug: string): BlogPost | undefined {
  return allPosts.find(post => post.slug === slug);
}

// Helper function to get related posts
export function getRelatedPosts(slug: string): BlogPost[] {
  const post = getPostBySlug(slug);
  if (!post) return [];

  return post.relatedPosts
    .map(relatedSlug => getPostBySlug(relatedSlug))
    .filter((p): p is BlogPost => p !== undefined);
}

// Helper function to get recent posts
export function getRecentPosts(limit: number = 5): BlogPost[] {
  return [...allPosts]
    .sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime())
    .slice(0, limit);
}

// src/app/web-development/page.tsx
"use client";

import React from 'react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  Database,
  Layout,
  Server,
  Zap,
  Shield,
  Search,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Rocket,
  Terminal,
  GitBranch,
  Package,
  FileCode,
  Lock,
  BarChart3,
  Palette,
  Layers,
  Box
} from 'lucide-react';

// =============================================
// STATIC DATA (moved outside component for performance)
// =============================================

const techStack = [
  {
    category: "Frontend Framework",
    icon: <Layout className="h-6 w-6" />,
    color: "from-blue-500 to-cyan-500",
    technologies: [
      {
        name: "Next.js 15",
        version: "15.5.4",
        description: "React framework with App Router and React Server Components",
        features: [
          "App Router architecture for optimal performance",
          "Server Components for zero-bundle JavaScript",
          "Streaming SSR with Suspense boundaries",
          "Built-in Image Optimization",
          "Dynamic OG image generation (@vercel/og)",
          "ISR for sitemap generation"
        ]
      },
      {
        name: "React 19",
        version: "19.1.0",
        description: "Latest React with new concurrent features",
        features: [
          "Server Components & Actions",
          "Concurrent rendering",
          "Automatic batching",
          "useTransition & useDeferredValue hooks",
          "Suspense for data fetching"
        ]
      },
      {
        name: "TypeScript",
        version: "5.x",
        description: "Strict type safety across the entire codebase",
        features: [
          "Strict mode enabled",
          "Path aliases (@/* imports)",
          "Type-safe API routes",
          "Zod schema validation",
          "Zero &apos;any&apos; types in production code"
        ]
      }
    ]
  },
  {
    category: "Styling & UI",
    icon: <Palette className="h-6 w-6" />,
    color: "from-purple-500 to-pink-500",
    technologies: [
      {
        name: "Tailwind CSS",
        version: "3.4.17",
        description: "Utility-first CSS with custom design system",
        features: [
          "Custom color palette (Carolina Blue theme)",
          "Custom animations (fade-in, slide-up, bounce-soft)",
          "CSS variables for dynamic theming",
          "Responsive breakpoints",
          "Tailwind Merge for className optimization"
        ]
      },
      {
        name: "Radix UI",
        version: "Latest",
        description: "Unstyled, accessible component primitives",
        features: [
          "Accordion component",
          "Progress indicators",
          "Scroll Area",
          "Select dropdowns",
          "Full ARIA compliance"
        ]
      },
      {
        name: "Framer Motion",
        version: "12.23.22",
        description: "Production-ready animation library",
        features: [
          "Page transitions",
          "Scroll-triggered animations",
          "Gesture animations",
          "Layout animations"
        ]
      },
      {
        name: "Lucide React",
        version: "0.544.0",
        description: "Beautiful, consistent SVG icons",
        features: [
          "600+ icons",
          "Tree-shakeable",
          "Customizable size & color",
          "TypeScript support"
        ]
      }
    ]
  },
  {
    category: "Backend & Database",
    icon: <Database className="h-6 w-6" />,
    color: "from-green-500 to-emerald-500",
    technologies: [
      {
        name: "PostgreSQL",
        version: "Latest",
        description: "Production-grade relational database",
        features: [
          "8 normalized data models",
          "Proper foreign key relationships",
          "Cascade delete rules",
          "Strategic indexes for query performance",
          "Full-text search capabilities"
        ]
      },
      {
        name: "Prisma ORM",
        version: "6.17.1",
        description: "Type-safe database client with migrations",
        features: [
          "Type-safe queries",
          "Database migrations",
          "Connection pooling",
          "Prisma Accelerate extension",
          "Query optimization"
        ]
      },
      {
        name: "NextAuth.js v5",
        version: "5.0.0-beta.29",
        description: "Complete authentication solution",
        features: [
          "Multi-provider auth (GitHub, Google, Email)",
          "Magic link authentication via Resend",
          "JWT strategy for stateless auth",
          "Role-based access control (ADMIN/PUBLIC)",
          "Secure session management"
        ]
      }
    ]
  },
  {
    category: "API & Validation",
    icon: <Server className="h-6 w-6" />,
    color: "from-orange-500 to-red-500",
    technologies: [
      {
        name: "Zod",
        version: "4.1.12",
        description: "TypeScript-first schema validation",
        features: [
          "Runtime type checking",
          "Detailed validation errors",
          "Type inference",
          "Used in all API routes",
          "Form validation"
        ]
      },
      {
        name: "API Routes",
        version: "Native Next.js",
        description: "RESTful API with proper error handling",
        features: [
          "15+ API endpoints",
          "Input validation with Zod",
          "Rate limiting (60 req/min search)",
          "Error logging with Pino",
          "Proper HTTP status codes"
        ]
      },
      {
        name: "Resend",
        version: "6.1.2",
        description: "Modern email API for transactional emails",
        features: [
          "Contact form submissions",
          "Magic link authentication",
          "HTML email templates",
          "Delivery tracking"
        ]
      }
    ]
  },
  {
    category: "Search & Analytics",
    icon: <Search className="h-6 w-6" />,
    color: "from-yellow-500 to-amber-500",
    technologies: [
      {
        name: "Custom Search Engine",
        version: "Built In-House",
        description: "Advanced search with relevance ranking",
        features: [
          "Multi-entity search (Projects, Blogs, Images, Tags)",
          "Relevance scoring algorithm",
          "Fuzzy search with Fuse.js",
          "Search analytics tracking",
          "XSS prevention & sanitization"
        ]
      },
      {
        name: "Fuse.js",
        version: "7.1.0",
        description: "Lightweight fuzzy-search library",
        features: [
          "Typo tolerance",
          "Weighted scoring",
          "Configurable threshold",
          "Fast client-side search"
        ]
      },
      {
        name: "Analytics",
        version: "Custom + Vercel",
        description: "Comprehensive usage analytics",
        features: [
          "Search query tracking",
          "Page view analytics",
          "Click-through rate calculation",
          "Vercel Analytics integration",
          "Speed Insights monitoring"
        ]
      }
    ]
  },
  {
    category: "Security & Logging",
    icon: <Shield className="h-6 w-6" />,
    color: "from-red-500 to-rose-500",
    technologies: [
      {
        name: "Pino Logger",
        version: "10.0.0",
        description: "Production-grade structured logging",
        features: [
          "JSON output in production",
          "Pretty printing in development",
          "Log levels (trace, debug, info, warn, error)",
          "Contextual metadata",
          "53 console statements replaced"
        ]
      },
      {
        name: "bcryptjs",
        version: "3.0.2",
        description: "Password hashing for secure authentication",
        features: [
          "Salted hashing",
          "Configurable rounds",
          "Rainbow table protection"
        ]
      },
      {
        name: "Security Measures",
        version: "Multi-layered",
        description: "Comprehensive security implementation",
        features: [
          "SQL injection prevention (Prisma)",
          "XSS sanitization",
          "CSRF protection",
          "Rate limiting on sensitive endpoints",
          "IP hashing for privacy compliance"
        ]
      }
    ]
  },
  {
    category: "Developer Experience",
    icon: <Terminal className="h-6 w-6" />,
    color: "from-indigo-500 to-purple-500",
    technologies: [
      {
        name: "ESLint",
        version: "9.x",
        description: "Code quality & consistency enforcement",
        features: [
          "TypeScript ESLint rules",
          "Next.js specific rules",
          "React Hooks rules",
          "Prettier integration",
          "Fails builds on errors"
        ]
      },
      {
        name: "Prettier",
        version: "3.6.2",
        description: "Opinionated code formatter",
        features: [
          "Consistent code style",
          "100 character line width",
          "Automatic formatting",
          "Pre-commit hooks ready"
        ]
      },
      {
        name: "Development Tools",
        version: "Various",
        description: "Enhanced developer workflow",
        features: [
          "Hot Module Replacement",
          "TypeScript strict mode",
          "Path aliases",
          "Fast Refresh",
          "Detailed error overlays"
        ]
      }
    ]
  },
  {
    category: "Content & Utilities",
    icon: <FileCode className="h-6 w-6" />,
    color: "from-teal-500 to-cyan-500",
    technologies: [
      {
        name: "Gray Matter",
        version: "4.0.3",
        description: "Markdown frontmatter parsing",
        features: [
          "YAML/TOML frontmatter",
          "Metadata extraction",
          "Content separation"
        ]
      },
      {
        name: "Marked",
        version: "16.3.0",
        description: "Markdown to HTML compiler",
        features: [
          "GitHub Flavored Markdown",
          "Syntax highlighting ready",
          "Custom renderers"
        ]
      },
      {
        name: "Reading Time",
        version: "1.5.0",
        description: "Automatic reading time calculation",
        features: [
          "Word count analysis",
          "Configurable WPM",
          "Accurate estimates"
        ]
      }
    ]
  }
];

const architectureFeatures = [
  {
    title: "Server-Side Rendering",
    description: "React Server Components for optimal performance",
    icon: <Server className="h-5 w-5" />,
    benefits: ["Zero JavaScript bundle", "Instant page loads", "SEO-friendly"]
  },
  {
    title: "Database Optimization",
    description: "Strategic indexes and query optimization",
    icon: <Database className="h-5 w-5" />,
    benefits: ["Fast queries", "Efficient joins", "Scalable design"]
  },
  {
    title: "Type Safety",
    description: "End-to-end TypeScript with strict mode",
    icon: <FileCode className="h-5 w-5" />,
    benefits: ["Catch errors early", "Better IntelliSense", "Refactor with confidence"]
  },
  {
    title: "Performance First",
    description: "Optimized for Core Web Vitals",
    icon: <Zap className="h-5 w-5" />,
    benefits: ["Fast FCP", "Low CLS", "Quick TTI"]
  },
  {
    title: "Security Hardened",
    description: "Multiple layers of security",
    icon: <Lock className="h-5 w-5" />,
    benefits: ["SQL injection proof", "XSS protected", "Rate limited"]
  },
  {
    title: "Production Logging",
    description: "Structured logging with Pino",
    icon: <Terminal className="h-5 w-5" />,
    benefits: ["Debug faster", "Track errors", "Monitor performance"]
  }
];

const projectStats = [
  { label: "TypeScript Files", value: "100+", icon: <FileCode className="h-5 w-5" /> },
  { label: "API Endpoints", value: "15+", icon: <Server className="h-5 w-5" /> },
  { label: "Database Models", value: "8", icon: <Database className="h-5 w-5" /> },
  { label: "UI Components", value: "50+", icon: <Box className="h-5 w-5" /> },
  { label: "Type Safety", value: "100%", icon: <Shield className="h-5 w-5" /> },
  { label: "Test Coverage", value: "Coming", icon: <CheckCircle className="h-5 w-5" /> }
];

// Memoized Tech Card Component for optimal performance
const TechCard = React.memo(({
  tech,
  catIdx,
  techIdx,
  isActive,
  onMouseEnter,
  onMouseLeave
}: {
  tech: { name: string; version: string; description: string; features: string[] };
  catIdx: number;
  techIdx: number;
  isActive: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) => {
  return (
    <div
      className="group bg-gradient-to-br from-dark-blue to-dark-blue-light border-2 border-white/10 rounded-xl p-6 shadow-xl hover:shadow-white/20 hover:scale-[1.02] transition-all duration-300 hover:border-white/30"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Tech Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h4 className="text-xl font-bold text-carolina mb-1">{tech.name}</h4>
          <span className="text-xs text-accent-400 font-mono">{tech.version}</span>
        </div>
        <Package className={`h-5 w-5 text-accent-300 transition-transform duration-300 ${
          isActive ? 'rotate-12 scale-110' : ''
        }`} />
      </div>

      {/* Description */}
      <p className="text-gray-300 text-sm mb-4 leading-relaxed">
        {tech.description}
      </p>

      {/* Features */}
      <div className="space-y-2">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
          Key Features:
        </div>
        {tech.features.map((feature, idx) => (
          <div key={idx} className="flex items-start gap-2">
            <CheckCircle className="h-3.5 w-3.5 text-accent-400 flex-shrink-0 mt-0.5" />
            <span className="text-xs text-gray-300 leading-relaxed">{feature}</span>
          </div>
        ))}
      </div>
    </div>
  );
});

TechCard.displayName = 'TechCard';

export default function WebDevelopmentPage() {
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Core Technology Stack - What Actually Powers This Site

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-700 to-primary-900">
        <div className="absolute inset-0 bg-grid opacity-10" />
        <div className="absolute top-1/4 left-10 w-32 h-32 bg-accent/20 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-1/4 right-10 w-40 h-40 bg-accent/10 rounded-full blur-2xl animate-bounce-soft" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className={`transition-all duration-700 ${mounted ? 'animate-slide-up' : 'opacity-0'}`}>
            {/* Back Button */}
            <Link
              href="/"
              className="inline-flex items-center text-white/80 hover:text-white transition-colors mb-8 group"
              aria-label="Back to home"
            >
              <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Home</span>
            </Link>

            {/* Title */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-white text-sm font-medium mb-6">
                <Sparkles className="h-4 w-4" />
                Full-Stack Development Showcase
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
                Built with Modern
                <span className="block bg-gradient-to-r from-accent-200 to-accent-400 bg-clip-text text-transparent">
                  Web Technologies
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-8">
                A deep dive into the architecture, frameworks, and tools that power this
                production-grade portfolio. Built with Next.js 15, React 19, TypeScript,
                PostgreSQL, and modern best practices.
              </p>

              {/* Project Stats */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
                {projectStats.map((stat, idx) => (
                  <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="flex justify-center mb-2 text-accent-300">
                      {stat.icon}
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-xs text-white/70">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/contact"
                className="inline-flex items-center px-8 py-4 bg-accent text-white rounded-xl font-semibold hover:bg-accent-600 transition-all duration-300 shadow-strong hover:shadow-glow hover:scale-105 group"
              >
                <span>Let&apos;s Build Together</span>
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/projects"
                className="inline-flex items-center px-8 py-4 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 backdrop-blur-sm transition-all duration-300 border border-white/20"
              >
                <span>View Projects</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack - Detailed Breakdown */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Complete Technology Stack
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Every tool, framework, and library used in building this production-ready application,
              with versions and implementation details
            </p>
          </div>

          {/* Technology Categories */}
          <div className="space-y-12">
            {techStack.map((category, catIdx) => (
              <div key={catIdx} className="space-y-6">
                {/* Category Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className={`bg-gradient-to-r ${category.color} p-3 rounded-xl text-white shadow-lg`}>
                    {category.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-foreground">{category.category}</h3>
                  </div>
                </div>

                {/* Technologies in Category */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {category.technologies.map((tech, techIdx) => (
                    <TechCard
                      key={techIdx}
                      tech={tech}
                      catIdx={catIdx}
                      techIdx={techIdx}
                      isActive={activeSection === `${catIdx}-${techIdx}`}
                      onMouseEnter={() => setActiveSection(`${catIdx}-${techIdx}`)}
                      onMouseLeave={() => setActiveSection(null)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture & Implementation Features */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Architecture Highlights
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Key architectural decisions and implementation details that make this application
              production-ready
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {architectureFeatures.map((feature, idx) => (
              <div
                key={idx}
                className="group bg-gradient-to-br from-dark-blue to-dark-blue-light border-2 border-white/10 rounded-xl p-6 shadow-xl hover:shadow-white/20 hover:scale-[1.02] transition-all duration-300"
              >
                <div className="bg-gradient-to-br from-accent-500 to-accent-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-white group-hover:scale-110 transition-transform shadow-lg">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-carolina mb-2">{feature.title}</h3>
                <p className="text-gray-300 text-sm mb-4">{feature.description}</p>
                <div className="space-y-1.5">
                  {feature.benefits.map((benefit, benefitIdx) => (
                    <div key={benefitIdx} className="flex items-center gap-2 text-xs text-gray-400">
                      <div className="w-1 h-1 rounded-full bg-accent-400" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Development Process */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Development Workflow
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Professional development practices and tools used throughout the project
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Code Quality */}
            <div className="bg-gradient-to-br from-dark-blue to-dark-blue-light border-2 border-white/10 rounded-xl p-8 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-xl text-white shadow-lg">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold text-carolina">Code Quality</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-gray-300">
                  <GitBranch className="h-5 w-5 text-accent-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Git Version Control:</strong> Proper commit history and branching strategy</span>
                </li>
                <li className="flex items-start gap-3 text-gray-300">
                  <FileCode className="h-5 w-5 text-accent-400 flex-shrink-0 mt-0.5" />
                  <span><strong>ESLint + Prettier:</strong> Enforced code style and quality standards</span>
                </li>
                <li className="flex items-start gap-3 text-gray-300">
                  <Shield className="h-5 w-5 text-accent-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Type Safety:</strong> Strict TypeScript with zero &apos;any&apos; types</span>
                </li>
                <li className="flex items-start gap-3 text-gray-300">
                  <Terminal className="h-5 w-5 text-accent-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Production Logging:</strong> Replaced 53 console statements with Pino</span>
                </li>
              </ul>
            </div>

            {/* Performance */}
            <div className="bg-gradient-to-br from-dark-blue to-dark-blue-light border-2 border-white/10 rounded-xl p-8 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-yellow-500 to-orange-600 p-3 rounded-xl text-white shadow-lg">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold text-carolina">Performance</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-gray-300">
                  <Server className="h-5 w-5 text-accent-400 flex-shrink-0 mt-0.5" />
                  <span><strong>React Server Components:</strong> Zero client-side JavaScript for static content</span>
                </li>
                <li className="flex items-start gap-3 text-gray-300">
                  <Database className="h-5 w-5 text-accent-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Database Indexes:</strong> Strategic indexes on frequently queried fields</span>
                </li>
                <li className="flex items-start gap-3 text-gray-300">
                  <Layers className="h-5 w-5 text-accent-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Image Optimization:</strong> Next.js Image component with AVIF/WebP</span>
                </li>
                <li className="flex items-start gap-3 text-gray-300">
                  <BarChart3 className="h-5 w-5 text-accent-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Analytics:</strong> Vercel Analytics + Speed Insights monitoring</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Build Stats */}
          <div className="mt-12 bg-gradient-to-br from-dark-blue to-dark-blue-light border-2 border-accent/30 rounded-xl p-8 shadow-xl">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-carolina mb-2">Production Build Stats</h3>
              <p className="text-gray-300 text-sm">Real metrics from this application</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-accent-400 mb-1">100%</div>
                <div className="text-xs text-gray-400 uppercase tracking-wider">Type Safe</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent-400 mb-1">15+</div>
                <div className="text-xs text-gray-400 uppercase tracking-wider">API Routes</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent-400 mb-1">8</div>
                <div className="text-xs text-gray-400 uppercase tracking-wider">DB Models</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent-400 mb-1">0</div>
                <div className="text-xs text-gray-400 uppercase tracking-wider">Vulnerabilities</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-800 to-accent-900" />
        <div className="absolute inset-0 bg-grid opacity-10" />
        <div className="absolute top-1/4 right-10 w-64 h-64 bg-accent/20 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-white text-sm font-medium mb-6">
            <Rocket className="h-4 w-4" />
            Ready to Build Something Amazing?
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-white">
            Let&apos;s Create Your Next Project
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            With expertise in modern frameworks, databases, and best practices, I can help bring
            your web application vision to life with production-ready code.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/contact"
              className="inline-flex items-center px-8 py-4 bg-white text-primary-600 rounded-xl font-semibold hover:bg-primary-50 transition-all duration-300 shadow-strong hover:shadow-glow hover:scale-105 group"
            >
              <span>Start a Conversation</span>
              <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/"
              className="inline-flex items-center px-8 py-4 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 backdrop-blur-sm transition-all duration-300 border border-white/20"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

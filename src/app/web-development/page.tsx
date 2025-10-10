// src/app/web-development/page.tsx
"use client";

import { Metadata } from 'next';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  Code,
  Laptop,
  Zap,
  Globe,
  Palette,
  Smartphone,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Server,
  Database,
  Layout,
  Boxes,
  Terminal,
  Rocket
} from 'lucide-react';

export default function WebDevelopmentPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const services = [
    {
      icon: <Layout className="h-8 w-8" />,
      title: "Responsive Web Design",
      description: "Beautiful, mobile-first designs that work perfectly on all devices and screen sizes.",
      features: ["Mobile-First Approach", "Cross-Browser Compatible", "Modern UI/UX"]
    },
    {
      icon: <Code className="h-8 w-8" />,
      title: "Frontend Development",
      description: "Dynamic, interactive user interfaces built with modern frameworks and best practices.",
      features: ["React & Next.js", "TypeScript", "Tailwind CSS"]
    },
    {
      icon: <Server className="h-8 w-8" />,
      title: "Backend Development",
      description: "Robust server-side solutions with secure APIs and efficient data management.",
      features: ["Node.js & Express", "RESTful APIs", "Authentication"]
    },
    {
      icon: <Database className="h-8 w-8" />,
      title: "Database Design",
      description: "Scalable database architecture for efficient data storage and retrieval.",
      features: ["SQL & NoSQL", "Data Modeling", "Performance Optimization"]
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Performance Optimization",
      description: "Lightning-fast websites optimized for speed, SEO, and Core Web Vitals.",
      features: ["Code Splitting", "Lazy Loading", "Image Optimization"]
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: "Deployment & Hosting",
      description: "Seamless deployment to cloud platforms with CI/CD integration.",
      features: ["Vercel & Netlify", "Custom Domains", "SSL Certificates"]
    }
  ];

  const technologies = [
    { name: "React", category: "Frontend", color: "accent" },
    { name: "Next.js", category: "Framework", color: "primary" },
    { name: "TypeScript", category: "Language", color: "accent" },
    { name: "Tailwind CSS", category: "Styling", color: "primary" },
    { name: "Node.js", category: "Backend", color: "accent" },
    { name: "Express", category: "Backend", color: "primary" },
    { name: "MongoDB", category: "Database", color: "accent" },
    { name: "PostgreSQL", category: "Database", color: "primary" },
    { name: "Git", category: "Version Control", color: "accent" },
    { name: "Docker", category: "DevOps", color: "primary" },
    { name: "REST APIs", category: "Integration", color: "accent" },
    { name: "Vercel", category: "Hosting", color: "primary" },
  ];

  const features = [
    "Clean, maintainable code",
    "Responsive design for all devices",
    "SEO-optimized architecture",
    "Fast load times & performance",
    "Accessibility compliance (WCAG)",
    "Modern UI/UX patterns",
    "Security best practices",
    "Documentation & support"
  ];

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
                Web Development Services
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
                Building Modern
                <span className="block bg-gradient-to-r from-accent-200 to-accent-400 bg-clip-text text-transparent">
                  Web Experiences
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
                From concept to deployment, I create fast, secure, and scalable web applications
                using cutting-edge technologies and industry best practices.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/contact"
                className="inline-flex items-center px-8 py-4 bg-accent text-white rounded-xl font-semibold hover:bg-accent-600 transition-all duration-300 shadow-strong hover:shadow-glow hover:scale-105 group"
              >
                <span>Start a Project</span>
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

      {/* Services Grid - 3 Column Layout */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Comprehensive Web Development Services
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Full-stack development expertise covering every aspect of modern web application development
            </p>
          </div>

          {/* 3-Column Responsive Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className={`group card card-hover bg-gradient-to-br from-card to-primary-50/30 border-primary-200/40 transition-all duration-500 ${
                  mounted ? 'animate-fade-in' : 'opacity-0'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="bg-gradient-to-br from-accent-500 to-accent-600 w-16 h-16 rounded-xl flex items-center justify-center mb-6 text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-glow-accent">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{service.title}</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {service.description}
                </p>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-accent-600 mr-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technologies Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Technologies & Tools
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Leveraging modern technologies to build robust, scalable solutions
            </p>
          </div>

          {/* Technology Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {technologies.map((tech, index) => (
              <div
                key={index}
                className={`group card text-center p-6 hover:shadow-glow transition-all duration-300 ${
                  tech.color === 'accent'
                    ? 'bg-gradient-to-br from-accent-50 to-accent-100/50 border-accent-200/60 hover:border-accent-400'
                    : 'bg-gradient-to-br from-primary-50 to-primary-100/30 border-primary-200/60 hover:border-primary-400'
                }`}
              >
                <div className="font-semibold text-foreground mb-1 group-hover:scale-110 transition-transform">
                  {tech.name}
                </div>
                <div className="text-xs text-muted-foreground">{tech.category}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Why Choose My Services
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Quality, performance, and user experience at the core of every project
            </p>
          </div>

          {/* Feature Grid - 3 Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-start space-x-3 p-6 rounded-xl bg-gradient-to-br from-card to-accent-50/20 border border-border hover:border-accent-300 transition-all duration-300 hover:shadow-md"
              >
                <CheckCircle className="h-6 w-6 text-accent-600 flex-shrink-0 mt-0.5" />
                <span className="text-foreground font-medium">{feature}</span>
              </div>
            ))}
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
            Ready to Build
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-white">
            Let&apos;s Build Your Next Project Together
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            Have a web development project in mind? Let&apos;s discuss how we can bring your vision to life
            with modern technologies and best practices.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/contact"
              className="inline-flex items-center px-8 py-4 bg-white text-primary-600 rounded-xl font-semibold hover:bg-primary-50 transition-all duration-300 shadow-strong hover:shadow-glow hover:scale-105 group"
            >
              <span>Get In Touch</span>
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

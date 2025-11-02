// src/app/page.tsx
"use client";

import Link from 'next/link';
import { ArrowRight, Code, Shield, Laptop, Github, ExternalLink, Sparkles, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-background">

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />

        {/* Floating Elements */}
        <div className="absolute top-1/4 left-10 w-32 h-32 bg-primary/10 rounded-full blur-xl animate-bounce-soft" />
        <div className="absolute top-3/4 right-10 w-24 h-24 bg-accent/10 rounded-full blur-xl animate-bounce-soft delay-1000" />
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-primary/20 rounded-full blur-lg animate-pulse" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 lg:pt-32 lg:pb-24">
          <div className="text-center">
            {/* Status Badge */}
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 text-success-600 text-sm font-medium mb-8 transition-all duration-700 ${mounted ? 'animate-slide-down' : 'opacity-0'}`}>
              <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse" />
              Available for opportunities
            </div>

            {/* Main Heading */}
            <div className={`transition-all duration-700 delay-200 ${mounted ? 'animate-slide-up' : 'opacity-0'}`}>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
                <span className="text-foreground">Hi, I&apos;m </span>
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-primary-500 via-primary-600 to-accent-600 bg-clip-text text-transparent animate-gradient bg-300% bg-gradient-to-r">
                    Ollie
                  </span>
                  <Sparkles className="absolute -top-8 -right-8 w-8 h-8 text-primary-400 animate-pulse" />
                </span>
              </h1>

              <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground mb-4 max-w-4xl mx-auto leading-relaxed">
                Web Developer & Cybersecurity Student crafting
                <span className="text-primary-600 font-semibold"> secure</span>,
                <span className="text-accent-600 font-semibold"> modern</span> digital experiences
              </p>

              <p className="text-base sm:text-lg text-muted-foreground/80 mb-12 max-w-2xl mx-auto">
                Based in Henderson, Nevada • Passionate about code and cybersecurity
              </p>
            </div>

            {/* CTA Buttons */}
            <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 transition-all duration-700 delay-500 ${mounted ? 'animate-slide-up' : 'opacity-0'}`}>
              <Link
                href="/projects"
                className="btn btn-primary px-8 py-4 text-base group hover:scale-105 hover:shadow-glow"
              >
                <span>View My Work</span>
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/contact"
                className="btn btn-outline px-8 py-4 text-base group hover:scale-105"
              >
                <span>Get In Touch</span>
              </Link>
            </div>

            {/* Quick Stats */}
            <div className={`grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto mb-16 transition-all duration-700 delay-700 ${mounted ? 'animate-fade-in' : 'opacity-0'}`}>
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground mb-2">2+</div>
                <div className="text-sm text-muted-foreground">Years Learning</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground mb-2">10+</div>
                <div className="text-sm text-muted-foreground">Projects Built</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground mb-2">∞</div>
                <div className="text-sm text-muted-foreground">Cups of Coffee</div>
              </div>
            </div>

            {/* Scroll Indicator */}
            <div className={`transition-all duration-700 delay-1000 ${mounted ? 'animate-bounce-soft' : 'opacity-0'}`}>
              <ChevronDown className="w-6 h-6 text-muted-foreground/60 mx-auto" />
            </div>
          </div>
        </div>
      </section>

      {/* Skills Preview */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">What I Do</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Combining creativity with security-first thinking to build robust digital solutions
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Link
              href="/web-development"
              className="group text-center bg-gradient-to-br from-dark-blue to-dark-blue-light border-2 border-white rounded-xl p-8 shadow-2xl hover:shadow-white/20 hover:scale-[1.02] transition-all duration-300"
            >
              <div className="bg-gradient-to-br from-accent-500 to-accent-600 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-glow-accent">
                <Code className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-carolina mb-4">Web Development</h3>
              <p className="text-gray-300 mb-4">
                Building modern, responsive web applications with React, Next.js, and TypeScript
              </p>
              <span className="inline-flex items-center text-carolina font-medium text-sm group-hover:gap-2 transition-all">
                Learn more
                <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>

            <Link
              href="/cybersecurity"
              className="group text-center bg-gradient-to-br from-dark-blue to-dark-blue-light border-2 border-white rounded-xl p-8 shadow-2xl hover:shadow-white/20 hover:scale-[1.02] transition-all duration-300"
            >
              <div className="bg-gradient-to-br from-primary-500 to-primary-600 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-glow">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-carolina mb-4">Cybersecurity</h3>
              <p className="text-gray-300 mb-4">
                Studying network security, penetration testing, and digital forensics
              </p>
              <span className="inline-flex items-center text-carolina font-medium text-sm group-hover:gap-2 transition-all">
                Learn more
                <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>

            <Link
              href="/projects"
              className="group text-center bg-gradient-to-br from-dark-blue to-dark-blue-light border-2 border-white rounded-xl p-8 shadow-2xl hover:shadow-white/20 hover:scale-[1.02] transition-all duration-300"
            >
              <div className="bg-gradient-to-br from-success to-success/80 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Laptop className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-carolina mb-4">Full-Stack Solutions</h3>
              <p className="text-gray-300 mb-4">
                End-to-end development from database design to user interface
              </p>
              <span className="inline-flex items-center text-carolina font-medium text-sm group-hover:gap-2 transition-all">
                View projects
                <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Project Preview */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Featured Project</h2>
            <p className="text-lg text-muted-foreground">Here&apos;s what I&apos;ve been working on recently</p>
          </div>

          <div className="max-w-5xl mx-auto overflow-hidden bg-gradient-to-br from-dark-blue to-dark-blue-light border-2 border-white rounded-xl shadow-2xl hover:shadow-white/20 transition-all duration-300">
            <div className="md:flex">
              <div className="md:w-1/2 p-8 lg:p-12">
                <div className="mb-6">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-carolina/20 text-carolina mb-4">
                    ⭐ Featured
                  </span>
                  <h3 className="text-2xl font-bold text-carolina mb-4">Portfolio Website</h3>
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    A modern, secure portfolio built with Next.js, featuring responsive design,
                    GitHub integration, and performance optimization. This site showcases my
                    development skills while documenting my learning journey.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 mb-8">
                  <span className="px-3 py-1 bg-carolina/20 text-carolina rounded-full text-sm font-medium">Next.js</span>
                  <span className="px-3 py-1 bg-carolina/20 text-carolina rounded-full text-sm font-medium">TypeScript</span>
                  <span className="px-3 py-1 bg-carolina/20 text-carolina rounded-full text-sm font-medium">Tailwind CSS</span>
                  <span className="px-3 py-1 bg-carolina/20 text-carolina rounded-full text-sm font-medium">Vercel</span>
                </div>

                <div className="flex space-x-6">
                  <a
                    href="https://github.com/odub30/olliedoesis"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-white hover:text-carolina transition-colors"
                  >
                    <Github className="h-4 w-4 mr-2" />
                    <span>View Code</span>
                  </a>
                  <a
                    href="https://olliedoesis.dev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-white hover:text-carolina transition-colors"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    <span>Live Site</span>
                  </a>
                </div>
              </div>

              <div className="md:w-1/2 bg-gradient-to-br from-dark-blue-light/80 to-dark-blue flex items-center justify-center p-8 lg:p-12">
                <div className="text-center">
                  <div className="relative">
                    <div className="w-32 h-32 bg-gradient-to-br from-primary-400 to-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-glow">
                      <Code className="h-16 w-16 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-success-500 rounded-full flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <p className="text-gray-300 font-medium">Live & Interactive</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              href="/projects"
              className="btn btn-outline px-6 py-3 group"
            >
              <span>View All Projects</span>
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Blog CTA Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Check Out My Blog</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Read my latest thoughts on web development, cybersecurity, and technology
          </p>
          <Link
            href="/blogs"
            className="btn btn-primary px-6 py-3 group"
          >
            <span>View All Posts</span>
            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600" />
        <div className="absolute inset-0 bg-grid opacity-10" />

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">Let&apos;s Build Something Together</h2>
          <p className="text-lg text-primary-100 mb-8 max-w-2xl mx-auto leading-relaxed">
            I&apos;m always interested in new opportunities and collaborations.
            Let&apos;s discuss your next project!
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center px-8 py-4 bg-white text-primary-600 rounded-xl font-semibold hover:bg-primary-50 transition-all duration-300 shadow-strong hover:shadow-glow hover:scale-105 group"
          >
            <span>Start a Conversation</span>
            <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
}
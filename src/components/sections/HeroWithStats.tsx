// src/components/sections/Hero.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowDown, Github, Linkedin, Mail, MapPin, Coffee, Code } from 'lucide-react';

const roles = [
  "Web Developer",
  "Security Enthusiast", 
  "Problem Solver",
  "Tech Explorer"
];

export function Hero() {
  const [currentRole, setCurrentRole] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  // Typing animation effect
  useEffect(() => {
    const currentText = roles[currentRole];
    
    if (isTyping) {
      if (displayText.length < currentText.length) {
        const timer = setTimeout(() => {
          setDisplayText(currentText.slice(0, displayText.length + 1));
        }, 100);
        return () => clearTimeout(timer);
      } else {
        const timer = setTimeout(() => setIsTyping(false), 2000);
        return () => clearTimeout(timer);
      }
    } else {
      if (displayText.length > 0) {
        const timer = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1));
        }, 50);
        return () => clearTimeout(timer);
      } else {
        setCurrentRole((prev) => (prev + 1) % roles.length);
        setIsTyping(true);
      }
    }
  }, [displayText, isTyping, currentRole]);

  const scrollToNext = () => {
    const nextSection = document.getElementById('about');
    nextSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 bg-[size:60px_60px] opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-t from-white/50 to-transparent" />
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 animate-bounce">
        <Code className="w-8 h-8 text-blue-400 opacity-60" />
      </div>
      <div className="absolute top-40 right-20 animate-pulse">
        <Coffee className="w-6 h-6 text-amber-400 opacity-60" />
      </div>
      <div className="absolute bottom-40 left-20 animate-bounce delay-500">
        <div className="w-4 h-4 bg-purple-400 rounded-full opacity-60" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Profile Image */}
        <div className="mb-8 relative">
          <div className="relative w-32 h-32 mx-auto mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse" />
            <div className="relative w-full h-full bg-gray-200 rounded-full overflow-hidden border-4 border-white shadow-xl">
              <Image
                src="/images/avatar.jpg"
                alt="Your Name"
                fill
                sizes="128px"
                className="object-cover"
                priority
                onError={(e) => {
                  // Fallback to a placeholder if image doesn't exist
                  const target = e.target as HTMLImageElement;
                  target.src = `https://ui-avatars.com/api/?name=Your+Name&size=200&background=3b82f6&color=ffffff&format=svg`;
                }}
              />
            </div>
          </div>
          
          {/* Status Badge */}
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
            Available for opportunities
          </div>
        </div>

        {/* Main Heading */}
        <div className="mb-8">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-4">
            Hi, I&apos;m{' '}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
              Your Name
            </span>
          </h1>
          
          {/* Animated Role */}
          <div className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-700 mb-2 h-12 flex items-center justify-center">
            I&apos;m a{' '}
            <span className="ml-3 text-blue-600 relative">
              {displayText}
              <span className="animate-pulse">|</span>
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="max-w-3xl mx-auto mb-12">
          <p className="text-xl sm:text-2xl text-gray-600 leading-relaxed mb-6">
            Passionate about creating <strong>secure</strong>, <strong>performant</strong> web applications 
            and exploring the fascinating world of <strong>cybersecurity</strong>.
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 text-gray-500">
            <div className="flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              <span>Your City, State</span>
            </div>
            <div className="flex items-center">
              <Code className="w-5 h-5 mr-2" />
              <span>Web Development</span>
            </div>
            <div className="flex items-center">
              <Coffee className="w-5 h-5 mr-2" />
              <span>Coffee Enthusiast</span>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            href="/projects"
            className="inline-flex items-center px-8 py-4 text-lg font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-full hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            View My Work
            <ArrowDown className="ml-2 w-5 h-5" />
          </Link>
          
          <Link
            href="/contact"
            className="inline-flex items-center px-8 py-4 text-lg font-medium text-gray-700 bg-white rounded-full border-2 border-gray-200 hover:border-blue-300 hover:text-blue-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Get In Touch
            <Mail className="ml-2 w-5 h-5" />
          </Link>
        </div>

        {/* Social Links */}
        <div className="flex justify-center space-x-6 mb-16">
          <a
            href="https://github.com/your-username"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 text-gray-600 hover:text-blue-600 hover:bg-white rounded-full transition-all duration-300 hover:shadow-lg hover:scale-110"
            aria-label="GitHub"
          >
            <Github className="w-6 h-6" />
          </a>
          <a
            href="https://linkedin.com/in/your-profile"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 text-gray-600 hover:text-blue-600 hover:bg-white rounded-full transition-all duration-300 hover:shadow-lg hover:scale-110"
            aria-label="LinkedIn"
          >
            <Linkedin className="w-6 h-6" />
          </a>
          <a
            href="mailto:your-email@example.com"
            className="p-3 text-gray-600 hover:text-blue-600 hover:bg-white rounded-full transition-all duration-300 hover:shadow-lg hover:scale-110"
            aria-label="Email"
          >
            <Mail className="w-6 h-6" />
          </a>
        </div>

        {/* Scroll Indicator */}
        <button
          onClick={scrollToNext}
          className="animate-bounce p-2 text-gray-400 hover:text-blue-600 transition-colors"
          aria-label="Scroll to next section"
        >
          <ArrowDown className="w-8 h-8" />
        </button>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
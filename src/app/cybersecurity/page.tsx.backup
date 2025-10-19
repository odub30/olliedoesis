// src/app/cybersecurity/page.tsx
"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  Shield,
  Lock,
  Eye,
  ShieldCheck,
  AlertTriangle,
  Key,
  ArrowLeft,
  ArrowRight,
  FileSearch,
  Network,
  Bug,
  Server,
  Fingerprint,
  Award
} from 'lucide-react';

export default function CybersecurityPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const services = [
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Security Assessment",
      description: "Comprehensive security audits to identify vulnerabilities and strengthen your defenses.",
      features: ["Vulnerability Scanning", "Risk Analysis", "Security Reports"]
    },
    {
      icon: <Bug className="h-8 w-8" />,
      title: "Penetration Testing",
      description: "Ethical hacking to discover and fix security weaknesses before attackers do.",
      features: ["Web App Testing", "Network Testing", "API Security"]
    },
    {
      icon: <Network className="h-8 w-8" />,
      title: "Network Security",
      description: "Protecting your network infrastructure from unauthorized access and threats.",
      features: ["Firewall Configuration", "IDS/IPS Setup", "Network Monitoring"]
    },
    {
      icon: <Lock className="h-8 w-8" />,
      title: "Application Security",
      description: "Securing web and mobile applications against common vulnerabilities and exploits.",
      features: ["OWASP Top 10", "Secure Coding", "Code Review"]
    },
    {
      icon: <Eye className="h-8 w-8" />,
      title: "Security Monitoring",
      description: "24/7 monitoring and incident response to detect and mitigate security threats.",
      features: ["SIEM Integration", "Threat Detection", "Incident Response"]
    },
    {
      icon: <FileSearch className="h-8 w-8" />,
      title: "Digital Forensics",
      description: "Investigating security incidents and recovering critical digital evidence.",
      features: ["Incident Analysis", "Evidence Collection", "Forensic Reports"]
    }
  ];

  const expertise = [
    { name: "Network Security", icon: <Network className="h-5 w-5" />, color: "accent" },
    { name: "Web Security", icon: <Shield className="h-5 w-5" />, color: "primary" },
    { name: "Penetration Testing", icon: <Bug className="h-5 w-5" />, color: "accent" },
    { name: "Cryptography", icon: <Key className="h-5 w-5" />, color: "primary" },
    { name: "Secure Coding", icon: <Lock className="h-5 w-5" />, color: "accent" },
    { name: "Risk Assessment", icon: <AlertTriangle className="h-5 w-5" />, color: "primary" },
    { name: "SIEM Tools", icon: <Eye className="h-5 w-5" />, color: "accent" },
    { name: "Digital Forensics", icon: <FileSearch className="h-5 w-5" />, color: "primary" },
    { name: "Compliance", icon: <ShieldCheck className="h-5 w-5" />, color: "accent" },
    { name: "Threat Modeling", icon: <Server className="h-5 w-5" />, color: "primary" },
    { name: "Authentication", icon: <Fingerprint className="h-5 w-5" />, color: "accent" },
    { name: "Security Training", icon: <Award className="h-5 w-5" />, color: "primary" },
  ];

  const certifications = [
    {
      name: "CompTIA Security+",
      status: "In Progress",
      description: "Industry-standard certification for IT security professionals",
      color: "accent"
    },
    {
      name: "Ethical Hacking",
      status: "Studying",
      description: "Learning penetration testing methodologies and tools",
      color: "primary"
    },
    {
      name: "Network Security",
      status: "Studying",
      description: "Advanced network security concepts and practices",
      color: "accent"
    }
  ];

  const securityPrinciples = [
    "Defense in depth",
    "Least privilege access",
    "Zero trust architecture",
    "Regular security audits",
    "Incident response planning",
    "Security awareness training",
    "Encryption at rest & in transit",
    "Continuous monitoring"
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-800 to-accent-900">
        <div className="absolute inset-0 bg-grid opacity-10" />
        <div className="absolute top-1/4 right-10 w-32 h-32 bg-accent/20 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-1/4 left-10 w-40 h-40 bg-accent/10 rounded-full blur-2xl animate-bounce-soft" />

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
                <Shield className="h-4 w-4" />
                Cybersecurity Expertise
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
                Protecting Digital
                <span className="block bg-gradient-to-r from-accent-200 to-accent-400 bg-clip-text text-transparent">
                  Assets & Infrastructure
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
                Cybersecurity student dedicated to learning and implementing best practices
                in network security, penetration testing, and digital defense strategies.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/contact"
                className="inline-flex items-center px-8 py-4 bg-accent text-white rounded-xl font-semibold hover:bg-accent-600 transition-all duration-300 shadow-strong hover:shadow-glow hover:scale-105 group"
              >
                <span>Get In Touch</span>
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center px-8 py-4 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 backdrop-blur-sm transition-all duration-300 border border-white/20"
              >
                <span>Learn More</span>
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
              Cybersecurity Services & Expertise
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Comprehensive security solutions to protect your organization from evolving cyber threats
            </p>
          </div>

          {/* 3-Column Responsive Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className={`group bg-gradient-to-br from-dark-blue to-dark-blue-light border-2 border-white rounded-xl p-8 shadow-2xl hover:shadow-white/20 hover:scale-[1.02] transition-all duration-300 ${
                  mounted ? 'animate-fade-in' : 'opacity-0'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="bg-gradient-to-br from-accent-500 to-accent-600 w-16 h-16 rounded-xl flex items-center justify-center mb-6 text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-glow-accent">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-carolina mb-3">{service.title}</h3>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  {service.description}
                </p>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-300">
                      <ShieldCheck className="h-4 w-4 text-carolina mr-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Expertise Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Areas of Expertise
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Specialized knowledge in various cybersecurity domains and technologies
            </p>
          </div>

          {/* Expertise Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {expertise.map((item, index) => (
              <div
                key={index}
                className="group bg-gradient-to-br from-dark-blue to-dark-blue-light border-2 border-white rounded-lg p-4 shadow-2xl hover:shadow-white/20 hover:scale-[1.02] transition-all duration-300 text-center"
              >
                <div className="flex justify-center mb-3 text-carolina group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <div className="font-semibold text-sm text-white">{item.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Certifications & Learning Path
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Continuously expanding my knowledge and earning industry-recognized certifications
            </p>
          </div>

          {/* Certification Grid - 3 Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {certifications.map((cert, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-dark-blue to-dark-blue-light border-2 border-white rounded-xl p-8 shadow-2xl hover:shadow-white/20 hover:scale-[1.02] transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <Award className="h-8 w-8 text-carolina" />
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-carolina/20 text-carolina">
                    {cert.status}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-carolina mb-3">{cert.name}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {cert.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Principles Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Core Security Principles
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Fundamental principles guiding every security implementation
            </p>
          </div>

          {/* Principles Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {securityPrinciples.map((principle, index) => (
              <div
                key={index}
                className="flex items-start space-x-3 p-6 rounded-xl bg-gradient-to-br from-dark-blue to-dark-blue-light border-2 border-white shadow-2xl hover:shadow-white/20 hover:scale-[1.02] transition-all duration-300"
              >
                <ShieldCheck className="h-6 w-6 text-carolina flex-shrink-0 mt-0.5" />
                <span className="text-white font-medium">{principle}</span>
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
            <Shield className="h-4 w-4" />
            Secure Your Future
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-white">
            Let&apos;s Discuss Your Security Needs
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            Whether you need a security assessment, training, or consultation,
            I&apos;m here to help strengthen your security posture.
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

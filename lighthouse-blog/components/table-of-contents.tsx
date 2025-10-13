"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"

const sections = [
  { id: "baseline-audit", title: "Baseline Audit", level: 1 },
  { id: "image-optimization", title: "Image Optimization", level: 1 },
  { id: "javascript-optimization", title: "JavaScript Optimization", level: 1 },
  { id: "core-web-vitals", title: "Core Web Vitals", level: 1 },
  { id: "optimization-strategies", title: "Optimization Strategies", level: 1 },
  { id: "performance-budgets", title: "Performance Budgets", level: 1 },
  { id: "faq", title: "FAQ", level: 1 },
  { id: "related-posts", title: "Related Posts", level: 1 },
]

export function TableOfContents() {
  const [activeSection, setActiveSection] = useState("")

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { rootMargin: "-20% 0px -80% 0px" },
    )

    sections.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="text-base">Table of Contents</CardTitle>
      </CardHeader>
      <CardContent>
        <nav className="space-y-1">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={cn(
                "block w-full text-left text-sm py-1.5 px-2 rounded transition-colors",
                activeSection === section.id
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted",
              )}
            >
              {section.title}
            </button>
          ))}
        </nav>
      </CardContent>
    </Card>
  )
}

"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

const sections = [
  { id: "metrics-overview", title: "Metrics Overview" },
  { id: "image-optimization", title: "Image Optimization" },
  { id: "javascript-optimization", title: "JavaScript Optimization" },
  { id: "core-web-vitals", title: "Core Web Vitals" },
  { id: "optimization-comparison", title: "Before vs After" },
  { id: "performance-budgets", title: "Performance Budgets" },
  { id: "faq", title: "FAQ" },
]

export function TableOfContents() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Table of Contents</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <nav className="space-y-1">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="block py-2 px-3 text-sm hover:bg-muted rounded-md transition-colors"
              >
                {section.title}
              </a>
            ))}
          </nav>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

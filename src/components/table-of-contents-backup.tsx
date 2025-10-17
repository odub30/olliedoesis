"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

const sections = [
  { id: "introduction", title: "Introduction" },
  { id: "fundamentals", title: "Performance Fundamentals" },
  { id: "choosing-library", title: "Choosing Framer Motion" },
  { id: "installation", title: "Installation & Setup" },
  { id: "page-transitions", title: "Page Transition Patterns" },
  { id: "durations", title: "Optimal Durations" },
  { id: "results", title: "Performance Results" },
  { id: "accessibility", title: "Accessibility" },
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

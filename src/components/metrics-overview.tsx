"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Zap, Image as ImageIcon, Code } from "lucide-react"

export function MetricsOverview() {
  const metrics = [
    {
      category: "Performance",
      score: 100,
      improvement: "+45",
      icon: Zap,
      color: "text-green-500",
      items: [
        { label: "First Contentful Paint", value: "0.8s", target: "< 1.8s" },
        { label: "Largest Contentful Paint", value: "1.2s", target: "< 2.5s" },
        { label: "Total Blocking Time", value: "50ms", target: "< 300ms" },
        { label: "Cumulative Layout Shift", value: "0.02", target: "< 0.1" },
        { label: "Speed Index", value: "1.5s", target: "< 3.4s" },
      ],
    },
    {
      category: "Accessibility",
      score: 100,
      improvement: "+12",
      icon: TrendingUp,
      color: "text-green-500",
      items: [
        { label: "Contrast Ratios", value: "WCAG AAA", target: "WCAG AA" },
        { label: "ARIA Labels", value: "Complete", target: "Required" },
        { label: "Alt Text", value: "100%", target: "100%" },
        { label: "Keyboard Navigation", value: "Full", target: "Required" },
      ],
    },
    {
      category: "Best Practices",
      score: 100,
      improvement: "+8",
      icon: Code,
      color: "text-green-500",
      items: [
        { label: "HTTPS", value: "Enabled", target: "Required" },
        { label: "Console Errors", value: "0", target: "0" },
        { label: "Image Formats", value: "Modern", target: "WebP/AVIF" },
        { label: "Security Headers", value: "Present", target: "Required" },
      ],
    },
    {
      category: "SEO",
      score: 100,
      improvement: "+5",
      icon: ImageIcon,
      color: "text-green-500",
      items: [
        { label: "Meta Tags", value: "Complete", target: "Required" },
        { label: "Structured Data", value: "JSON-LD", target: "Recommended" },
        { label: "Mobile Friendly", value: "Yes", target: "Yes" },
        { label: "Crawlable Links", value: "100%", target: "100%" },
      ],
    },
  ]

  return (
    <section id="metrics-overview" className="scroll-mt-16">
      <div className="mb-8">
        <h2 className="mb-4 text-3xl font-bold tracking-tight">Lighthouse Metrics Overview</h2>
        <p className="text-lg text-muted-foreground">
          Starting point: 55/88/92/95 → Final result: 100/100/100/100 across all categories
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon
          return (
            <Card key={metric.category} className="relative overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <Icon className={`h-5 w-5 ${metric.color}`} />
                  <Badge variant="secondary" className="text-xs">
                    {metric.improvement} pts
                  </Badge>
                </div>
                <CardTitle className="text-xl">{metric.category}</CardTitle>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold">{metric.score}</span>
                  <span className="text-sm text-muted-foreground">/100</span>
                </div>
              </CardHeader>
              <CardContent>
                <Progress value={metric.score} className="mb-4" />
                <div className="space-y-2">
                  {metric.items.map((item) => (
                    <div key={item.label} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{item.label}:</span>
                      <span className="font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card className="mt-6 border-primary/50 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Key Takeaway
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Through systematic optimization of images, JavaScript bundles, and Core Web Vitals, we achieved
            a <strong className="text-foreground">+70 point improvement</strong> across all Lighthouse categories,
            resulting in perfect 100/100 scores. This guide breaks down exactly how we did it.
          </p>
        </CardContent>
      </Card>
    </section>
  )
}

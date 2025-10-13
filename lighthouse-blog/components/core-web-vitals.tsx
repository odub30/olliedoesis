"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Line, LineChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, ReferenceLine } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Gauge, Zap, LayoutGrid } from "lucide-react"

const lcpProgressData = [
  { week: "Week 1", lcp: 3.8 },
  { week: "Week 2", lcp: 2.6 },
  { week: "Week 3", lcp: 1.8 },
  { week: "Week 4", lcp: 1.1 },
]

const webVitalsMetrics = [
  {
    name: "Largest Contentful Paint (LCP)",
    icon: Gauge,
    before: "3.8s",
    after: "1.1s",
    target: "<2.5s",
    improvement: "71%",
    description: "Measures loading performance. Optimized through image compression and CDN delivery.",
    optimizations: [
      "Hero image optimization (WebP format)",
      "Server-side rendering for above-fold content",
      "CDN delivery via Vercel Edge Network",
      "Preloading critical resources",
    ],
  },
  {
    name: "First Input Delay (FID) / INP",
    icon: Zap,
    before: "180ms",
    after: "32ms",
    target: "<100ms",
    improvement: "82%",
    description: "Measures interactivity. Improved by reducing JavaScript bundle size and using Web Workers.",
    optimizations: [
      "Reduced JavaScript bundle (287KB → 94KB)",
      "Code splitting for non-interactive content",
      "Moved heavy computations to Web Workers",
      "Debounced expensive event handlers",
    ],
  },
  {
    name: "Cumulative Layout Shift (CLS)",
    icon: LayoutGrid,
    before: "0.15",
    after: "0.01",
    target: "<0.1",
    improvement: "93%",
    description: "Measures visual stability. Fixed by adding explicit dimensions and using next/font.",
    optimizations: [
      "Explicit width/height on all images",
      "Blur placeholders for images",
      "Reserved space for dynamic content",
      "next/font for zero layout shift fonts",
    ],
  },
]

export function CoreWebVitals() {
  return (
    <section id="core-web-vitals" className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-3">Core Web Vitals Deep Dive</h2>
        <p className="text-lg text-muted-foreground">
          Understanding and optimizing Core Web Vitals was crucial for achieving perfect scores and improving real user
          experience.
        </p>
      </div>

      {/* LCP Progress Chart */}
      <Card>
        <CardHeader>
          <CardTitle>LCP Improvement Over Time</CardTitle>
          <CardDescription>Progressive optimization reduced Largest Contentful Paint from 3.8s to 1.1s</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              lcp: {
                label: "LCP (seconds)",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lcpProgressData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="week" className="text-xs" />
                <YAxis domain={[0, 4]} className="text-xs" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ReferenceLine y={2.5} stroke="hsl(var(--destructive))" strokeDasharray="3 3" label="Target" />
                <Line
                  type="monotone"
                  dataKey="lcp"
                  stroke="var(--color-lcp)"
                  strokeWidth={3}
                  dot={{ fill: "var(--color-lcp)", r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Detailed Metrics Cards */}
      <div className="grid gap-6">
        {webVitalsMetrics.map((metric) => {
          const Icon = metric.icon
          return (
            <Card key={metric.name}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{metric.name}</CardTitle>
                      <CardDescription className="mt-1">{metric.description}</CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Metrics Comparison */}
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-xs text-muted-foreground mb-1">Before</div>
                    <div className="text-xl font-bold">{metric.before}</div>
                  </div>
                  <div className="text-center p-3 bg-primary/10 rounded-lg">
                    <div className="text-xs text-muted-foreground mb-1">After</div>
                    <div className="text-xl font-bold text-primary">{metric.after}</div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-xs text-muted-foreground mb-1">Target</div>
                    <div className="text-xl font-bold">{metric.target}</div>
                  </div>
                  <div className="text-center p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <div className="text-xs text-muted-foreground mb-1">Improvement</div>
                    <div className="text-xl font-bold text-green-600 dark:text-green-400">{metric.improvement}</div>
                  </div>
                </div>

                {/* Optimizations List */}
                <div>
                  <div className="text-sm font-semibold mb-2">Key Optimizations:</div>
                  <ul className="space-y-1.5">
                    {metric.optimizations.map((opt, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <span className="text-primary mt-0.5">✓</span>
                        <span>{opt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </section>
  )
}

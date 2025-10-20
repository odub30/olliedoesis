"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart2 } from "lucide-react"

export function OptimizationComparison() {
  const comparisonData = [
    {
      metric: "First Contentful Paint",
      before: 2.4,
      after: 0.8,
      unit: "s",
      threshold: 1.8,
    },
    {
      metric: "Largest Contentful Paint",
      before: 4.2,
      after: 1.2,
      unit: "s",
      threshold: 2.5,
    },
    {
      metric: "Total Blocking Time",
      before: 380,
      after: 50,
      unit: "ms",
      threshold: 300,
    },
    {
      metric: "Cumulative Layout Shift",
      before: 0.15,
      after: 0.02,
      unit: "",
      threshold: 0.1,
    },
    {
      metric: "Speed Index",
      before: 3.8,
      after: 1.5,
      unit: "s",
      threshold: 3.4,
    },
  ]

  const getImprovementPercentage = (before: number, after: number) => {
    return Math.round(((before - after) / before) * 100)
  }

  return (
    <section id="optimization-comparison" className="scroll-mt-16">
      <div className="mb-8">
        <Badge variant="secondary" className="mb-4">
          <BarChart2 className="mr-2 h-3 w-3" />
          Comparison
        </Badge>
        <h2 className="mb-4 text-3xl font-bold tracking-tight">Before vs After Optimization</h2>
        <p className="text-lg text-muted-foreground">
          Side-by-side comparison of all Core Web Vitals metrics
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics Comparison</CardTitle>
          <CardDescription>All values shown in their respective units (s = seconds, ms = milliseconds)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {comparisonData.map((data) => {
              const improvement = getImprovementPercentage(data.before, data.after)
              const passesThreshold = data.after <= data.threshold

              return (
                <div key={data.metric} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{data.metric}</span>
                    <Badge variant={passesThreshold ? "default" : "secondary"} className="text-xs">
                      -{improvement}%
                    </Badge>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Before Bar */}
                    <div className="flex-1">
                      <div className="mb-1 flex justify-between text-xs">
                        <span className="text-muted-foreground">Before</span>
                        <span className="font-mono">
                          {data.before}
                          {data.unit}
                        </span>
                      </div>
                      <div className="h-8 w-full overflow-hidden rounded-md bg-destructive/20">
                        <div
                          className="h-full bg-destructive"
                          style={{
                            width: `${(data.before / (data.threshold * 2)) * 100}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* After Bar */}
                    <div className="flex-1">
                      <div className="mb-1 flex justify-between text-xs">
                        <span className="text-muted-foreground">After</span>
                        <span className="font-mono font-semibold text-green-600 dark:text-green-400">
                          {data.after}
                          {data.unit}
                        </span>
                      </div>
                      <div className="h-8 w-full overflow-hidden rounded-md bg-green-500/20">
                        <div
                          className="h-full bg-green-600 dark:bg-green-400"
                          style={{
                            width: `${(data.after / (data.threshold * 2)) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Threshold: {data.threshold}{data.unit}</span>
                    {passesThreshold ? (
                      <span className="text-green-600 dark:text-green-400">✓ Passing</span>
                    ) : (
                      <span className="text-yellow-600 dark:text-yellow-400">⚠ Needs Work</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </section>
  )
}

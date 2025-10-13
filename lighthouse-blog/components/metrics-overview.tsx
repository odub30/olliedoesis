"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Legend } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { TrendingDown } from "lucide-react"

const beforeAfterData = [
  { metric: "Performance", before: 78, after: 100 },
  { metric: "Accessibility", before: 91, after: 100 },
  { metric: "Best Practices", before: 83, after: 100 },
  { metric: "SEO", before: 92, after: 100 },
]

const coreWebVitalsData = [
  { metric: "LCP", before: 3.8, after: 1.1, unit: "s", target: 2.5 },
  { metric: "FID", before: 180, after: 32, unit: "ms", target: 100 },
  { metric: "CLS", before: 0.15, after: 0.01, unit: "", target: 0.1 },
]

export function MetricsOverview() {
  return (
    <section id="baseline-audit" className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-3">Baseline Audit: Understanding What to Fix</h2>
        <p className="text-lg text-muted-foreground">
          Before optimizing anything, I ran comprehensive audits to establish baseline metrics and identify the biggest
          opportunities for improvement.
        </p>
      </div>

      {/* Lighthouse Scores Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Lighthouse Scores: Before vs After</CardTitle>
          <CardDescription>Comprehensive improvement across all four Lighthouse categories</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              before: {
                label: "Before",
                color: "hsl(var(--muted-foreground))",
              },
              after: {
                label: "After",
                color: "hsl(var(--primary))",
              },
            }}
            className="h-[350px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={beforeAfterData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="metric" className="text-xs" />
                <YAxis domain={[0, 100]} className="text-xs" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar dataKey="before" fill="var(--color-before)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="after" fill="var(--color-after)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Core Web Vitals Table */}
      <Card>
        <CardHeader>
          <CardTitle>Core Web Vitals Improvements</CardTitle>
          <CardDescription>Dramatic improvements in user-centric performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">Metric</th>
                  <th className="text-right py-3 px-4 font-semibold">Before</th>
                  <th className="text-right py-3 px-4 font-semibold">After</th>
                  <th className="text-right py-3 px-4 font-semibold">Target</th>
                  <th className="text-right py-3 px-4 font-semibold">Improvement</th>
                </tr>
              </thead>
              <tbody>
                {coreWebVitalsData.map((row) => {
                  const improvement = (((row.before - row.after) / row.before) * 100).toFixed(0)
                  const meetsTarget = row.after <= row.target

                  return (
                    <tr key={row.metric} className="border-b last:border-0">
                      <td className="py-3 px-4 font-medium">{row.metric}</td>
                      <td className="text-right py-3 px-4 text-muted-foreground">
                        {row.before}
                        {row.unit}
                      </td>
                      <td className="text-right py-3 px-4 font-semibold text-primary">
                        {row.after}
                        {row.unit}
                      </td>
                      <td className="text-right py-3 px-4 text-muted-foreground">
                        {"<"}
                        {row.target}
                        {row.unit}
                      </td>
                      <td className="text-right py-3 px-4">
                        <div className="flex items-center justify-end gap-1">
                          <TrendingDown className="h-4 w-4 text-green-600 dark:text-green-400" />
                          <span className="text-green-600 dark:text-green-400 font-semibold">{improvement}%</span>
                          {meetsTarget && (
                            <span className="ml-2 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded">
                              ✓ Pass
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Key Issues Identified */}
      <Card>
        <CardHeader>
          <CardTitle>Key Performance Issues Identified</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { issue: "Unoptimized Images", impact: "High", detail: "Hero image was 460KB, causing slow LCP" },
              {
                issue: "Large JavaScript Bundles",
                impact: "High",
                detail: "287KB initial bundle blocking main thread",
              },
              { issue: "Render-blocking CSS", impact: "Medium", detail: "23KB of unused styles delaying FCP" },
              { issue: "Web Font Loading", impact: "Medium", detail: "Fonts causing layout shift and blocking" },
              { issue: "Missing ARIA Labels", impact: "Medium", detail: "Interactive elements lacking accessibility" },
              { issue: "Third-party Scripts", impact: "High", detail: "Analytics and embeds blocking main thread" },
            ].map((item) => (
              <div key={item.issue} className="flex gap-3 p-3 border rounded-lg">
                <div
                  className={`h-2 w-2 rounded-full mt-2 flex-shrink-0 ${
                    item.impact === "High" ? "bg-red-500" : "bg-yellow-500"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm">{item.issue}</div>
                  <div className="text-xs text-muted-foreground mt-1">{item.detail}</div>
                  <div className="text-xs mt-1">
                    <span
                      className={`font-medium ${
                        item.impact === "High"
                          ? "text-red-600 dark:text-red-400"
                          : "text-yellow-600 dark:text-yellow-400"
                      }`}
                    >
                      {item.impact} Impact
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  )
}

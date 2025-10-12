"use client"

import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export function BundleSizeChart() {
  const bundleData = [
    { page: "Homepage", js: 87, css: 9.2 },
    { page: "Blog List", js: 92, css: 9.2 },
    { page: "Blog Post", js: 95, css: 9.2 },
    { page: "Projects", js: 89, css: 9.2 },
    { page: "Contact", js: 85, css: 9.2 },
  ]

  return (
    <section className="mb-16">
      <h2 className="text-3xl font-bold tracking-tight mb-6">Bundle Size Optimization</h2>
      <Card>
        <CardHeader>
          <CardTitle>JavaScript & CSS Bundle Sizes</CardTitle>
          <CardDescription>Gzipped sizes across different pages (in KB)</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              js: {
                label: "JavaScript",
                color: "hsl(var(--chart-1))",
              },
              css: {
                label: "CSS",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={bundleData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="page" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <YAxis
                  className="text-xs"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                  label={{ value: "Size (KB)", angle: -90, position: "insideLeft" }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="js"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={2}
                  name="JavaScript"
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="css"
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={2}
                  name="CSS"
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-lg bg-muted p-4">
              <div className="text-2xl font-bold">87KB</div>
              <div className="text-sm text-muted-foreground">Initial JS (gzipped)</div>
            </div>
            <div className="rounded-lg bg-muted p-4">
              <div className="text-2xl font-bold">9.2KB</div>
              <div className="text-sm text-muted-foreground">Total CSS (gzipped)</div>
            </div>
            <div className="rounded-lg bg-muted p-4">
              <div className="text-2xl font-bold">&lt;20KB</div>
              <div className="text-sm text-muted-foreground">Per route navigation</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}

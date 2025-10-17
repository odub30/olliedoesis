"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  {
    metric: "Width Animation",
    fps: 32,
    frameTime: 45,
  },
  {
    metric: "Transform Scale",
    fps: 60,
    frameTime: 14,
  },
  {
    metric: "Color Change",
    fps: 48,
    frameTime: 28,
  },
  {
    metric: "Opacity",
    fps: 60,
    frameTime: 13,
  },
]

export function PerformanceChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Animation Performance Comparison</CardTitle>
        <CardDescription>Frame rate and frame time for different animation properties</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="metric" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
            <YAxis className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Bar dataKey="fps" fill="hsl(var(--chart-1))" name="FPS" radius={[8, 8, 0, 0]} />
            <Bar dataKey="frameTime" fill="hsl(var(--chart-2))" name="Frame Time (ms)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <p className="text-sm text-muted-foreground mt-4">
          Transform and opacity animations achieve 60fps with ~14ms frame times, while width and color animations cause
          significant performance degradation.
        </p>
      </CardContent>
    </Card>
  )
}

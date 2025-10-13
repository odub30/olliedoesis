"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Package, Scissors, TrendingDown } from "lucide-react"

const bundleSizeData = [
  { stage: "Initial", size: 287, tbt: 420 },
  { stage: "Tree Shaking", size: 245, tbt: 340 },
  { stage: "Code Splitting", size: 156, tbt: 180 },
  { stage: "Dynamic Imports", size: 94, tbt: 85 },
]

const removedDependencies = [
  { name: "moment.js", size: 60, replacement: "Intl.DateTimeFormat" },
  { name: "lodash", size: 24, replacement: "Native ES6 methods" },
  { name: "framer-motion (unused)", size: 18, replacement: "CSS animations" },
]

export function JavaScriptOptimization() {
  return (
    <section id="javascript-optimization" className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-3">JavaScript Bundle Optimization</h2>
        <p className="text-lg text-muted-foreground">
          My initial JavaScript bundle was 287KB (gzipped), causing significant Total Blocking Time. Through systematic
          optimization, I reduced it by 67%.
        </p>
      </div>

      {/* Bundle Size Reduction Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Bundle Size Reduction Journey</CardTitle>
          <CardDescription>
            Progressive optimization reduced JavaScript from 287KB to 94KB (67% reduction)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              size: {
                label: "Bundle Size (KB)",
                color: "hsl(var(--chart-1))",
              },
              tbt: {
                label: "Total Blocking Time (ms)",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={bundleSizeData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSize" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-size)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--color-size)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="stage" className="text-xs" />
                <YAxis className="text-xs" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="size"
                  stroke="var(--color-size)"
                  fillOpacity={1}
                  fill="url(#colorSize)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t">
            {bundleSizeData.map((stage, index) => (
              <div key={stage.stage} className="text-center">
                <div className="text-sm font-semibold mb-1">{stage.stage}</div>
                <div className="text-2xl font-bold text-primary">{stage.size}KB</div>
                <div className="text-xs text-muted-foreground mt-1">{stage.tbt}ms TBT</div>
                {index > 0 && (
                  <div className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center justify-center gap-1">
                    <TrendingDown className="h-3 w-3" />-
                    {Math.round((1 - stage.size / bundleSizeData[index - 1].size) * 100)}%
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Removed Dependencies */}
      <Card>
        <CardHeader>
          <CardTitle>Removed Dependencies</CardTitle>
          <CardDescription>Replaced heavy third-party libraries with native browser APIs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {removedDependencies.map((dep) => (
              <div key={dep.name} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Package className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-semibold text-sm">{dep.name}</div>
                    <div className="text-xs text-muted-foreground">Replaced with: {dep.replacement}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-mono font-semibold">{dep.size}KB</div>
                  <div className="text-xs text-green-600 dark:text-green-400">Saved</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Scissors className="h-4 w-4 text-primary" />
              <span className="font-semibold text-sm">Total Savings</span>
            </div>
            <div className="text-2xl font-bold text-primary">
              {removedDependencies.reduce((acc, dep) => acc + dep.size, 0)}KB removed
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              By replacing heavy dependencies with native browser APIs, we eliminated unnecessary code while maintaining
              functionality.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Code Splitting Example */}
      <Card>
        <CardHeader>
          <CardTitle>Dynamic Imports & Code Splitting</CardTitle>
          <CardDescription>Load components only when needed to reduce initial bundle size</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs font-mono">
            {`import dynamic from 'next/dynamic';

// Heavy component loaded only when needed
const ProjectShowcase = dynamic(
  () => import('@/components/ProjectShowcase'),
  {
    loading: () => <ProjectShowcaseSkeleton />,
    ssr: false, // Client-side only for interactive features
  }
);

const ContactForm = dynamic(
  () => import('@/components/ContactForm')
);

export default function Home() {
  return (
    <main>
      <Hero /> {/* Critical, loaded immediately */}
      <About /> {/* Critical, loaded immediately */}
      <ProjectShowcase /> {/* Lazy loaded */}
      <ContactForm /> {/* Lazy loaded */}
    </main>
  );
}`}
          </pre>
        </CardContent>
      </Card>
    </section>
  )
}

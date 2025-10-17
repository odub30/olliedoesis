"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Code, CheckCircle2, AlertCircle } from "lucide-react"

export function JavaScriptOptimization() {
  const techniques = [
    {
      title: "Code Splitting",
      impact: "High",
      description: "Split bundles by route and component",
      metrics: {
        before: "850 KB",
        after: "245 KB",
        improvement: "71%",
      },
      implementation: [
        "Implemented dynamic imports for heavy components",
        "Route-based code splitting with Next.js",
        "Lazy-loaded modals, charts, and third-party libraries",
      ],
    },
    {
      title: "Tree Shaking",
      impact: "High",
      description: "Removed unused code",
      metrics: {
        before: "650 KB",
        after: "420 KB",
        improvement: "35%",
      },
      implementation: [
        "Configured webpack for aggressive tree shaking",
        "Used ES6 imports for better tree shaking",
        "Eliminated unused CSS with PurgeCSS",
      ],
    },
    {
      title: "Minification & Compression",
      impact: "Medium",
      description: "Compressed JavaScript bundles",
      metrics: {
        before: "420 KB",
        after: "180 KB",
        improvement: "57%",
      },
      implementation: [
        "Enabled Terser for production builds",
        "Configured Brotli compression on server",
        "Gzip fallback for older browsers",
      ],
    },
    {
      title: "Third-Party Scripts",
      impact: "High",
      description: "Optimized external dependencies",
      metrics: {
        before: "320 KB",
        after: "95 KB",
        improvement: "70%",
      },
      implementation: [
        "Deferred non-critical scripts",
        "Used Next.js Script component with strategy='lazyOnload'",
        "Self-hosted Google Fonts for better caching",
      ],
    },
  ]

  const bundleAnalysis = {
    totalReduction: "74%",
    fcp: { before: "2.4s", after: "0.8s", improvement: "67%" },
    tbt: { before: "380ms", after: "50ms", improvement: "87%" },
  }

  return (
    <section id="javascript-optimization" className="scroll-mt-16">
      <div className="mb-8">
        <Badge variant="secondary" className="mb-4">
          <Code className="mr-2 h-3 w-3" />
          JavaScript
        </Badge>
        <h2 className="mb-4 text-3xl font-bold tracking-tight">JavaScript Bundle Optimization</h2>
        <p className="text-lg text-muted-foreground">
          Achieved {bundleAnalysis.totalReduction} reduction in JavaScript bundle size
        </p>
      </div>

      {/* Summary Card */}
      <Card className="mb-8 border-blue-500/50 bg-blue-500/5">
        <CardHeader>
          <CardTitle>JavaScript Optimization Results</CardTitle>
          <CardDescription>Impact on Core Web Vitals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <div className="mb-1 text-sm text-muted-foreground">Total Bundle Reduction</div>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {bundleAnalysis.totalReduction}
              </div>
            </div>
            <div>
              <div className="mb-1 text-sm text-muted-foreground">FCP Improvement</div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">{bundleAnalysis.fcp.after}</span>
                <span className="text-sm text-muted-foreground line-through">{bundleAnalysis.fcp.before}</span>
                <Badge variant="secondary" className="ml-auto">
                  -{bundleAnalysis.fcp.improvement}
                </Badge>
              </div>
            </div>
            <div>
              <div className="mb-1 text-sm text-muted-foreground">TBT Improvement</div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">{bundleAnalysis.tbt.after}</span>
                <span className="text-sm text-muted-foreground line-through">{bundleAnalysis.tbt.before}</span>
                <Badge variant="secondary" className="ml-auto">
                  -{bundleAnalysis.tbt.improvement}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Technique Cards */}
      <div className="space-y-6">
        {techniques.map((technique) => (
          <Card key={technique.title}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-xl">{technique.title}</CardTitle>
                    <Badge variant={technique.impact === "High" ? "default" : "secondary"}>
                      {technique.impact} Impact
                    </Badge>
                  </div>
                  <CardDescription className="mt-1">{technique.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h4 className="mb-3 text-sm font-semibold">Bundle Size Reduction</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Before:</span>
                      <span className="font-mono font-semibold">{technique.metrics.before}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">After:</span>
                      <span className="font-mono font-semibold text-green-600 dark:text-green-400">
                        {technique.metrics.after}
                      </span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="font-semibold">Savings:</span>
                      <span className="font-mono font-bold text-green-600 dark:text-green-400">
                        {technique.metrics.improvement}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="mb-3 text-sm font-semibold">Implementation</h4>
                  <ul className="space-y-2">
                    {technique.implementation.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600 dark:text-green-400" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pro Tips */}
      <Card className="mt-6 border-yellow-500/50 bg-yellow-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            Pro Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-yellow-600 dark:text-yellow-400" />
              <span>
                Use <code className="rounded bg-muted px-1 py-0.5">next/dynamic</code> for components above 50KB
              </span>
            </li>
            <li className="flex gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-yellow-600 dark:text-yellow-400" />
              <span>Analyze your bundle with webpack-bundle-analyzer regularly</span>
            </li>
            <li className="flex gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-yellow-600 dark:text-yellow-400" />
              <span>Set performance budgets in your CI/CD pipeline</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </section>
  )
}

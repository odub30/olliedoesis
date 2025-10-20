"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Image as ImageIcon, CheckCircle2 } from "lucide-react"

export function ImageOptimization() {
  const strategies = [
    {
      title: "Modern Image Formats",
      description: "Converted all images to WebP/AVIF",
      savings: "65%",
      implementation: [
        "Used Next.js Image component with automatic format detection",
        "Served AVIF to supported browsers, WebP as fallback",
        "Maintained PNG fallback for older browsers",
      ],
    },
    {
      title: "Lazy Loading",
      description: "Deferred off-screen images",
      savings: "40%",
      implementation: [
        "Implemented native lazy loading with loading='lazy'",
        "Used Intersection Observer for critical images",
        "Pre loaded above-the-fold images",
      ],
    },
    {
      title: "Responsive Images",
      description: "Optimized srcset for different devices",
      savings: "50%",
      implementation: [
        "Generated multiple image sizes (640w, 750w, 828w, 1080w, 1200w, 1920w)",
        "Used device-specific breakpoints",
        "Implemented art direction for mobile vs desktop",
      ],
    },
    {
      title: "Image Compression",
      description: "Lossless and lossy compression",
      savings: "35%",
      implementation: [
        "Used Sharp for server-side optimization",
        "Quality: 85 for AVIF, 80 for WebP",
        "Automated compression pipeline",
      ],
    },
  ]

  const results = {
    before: { size: "12.5 MB", count: 45, format: "JPG/PNG", lcp: "4.2s" },
    after: { size: "2.1 MB", count: 45, format: "AVIF/WebP", lcp: "1.2s" },
    savings: { size: "83%", lcp: "71%" },
  }

  return (
    <section id="image-optimization" className="scroll-mt-16">
      <div className="mb-8">
        <Badge variant="secondary" className="mb-4">
          <ImageIcon className="mr-2 h-3 w-3" />
          Images
        </Badge>
        <h2 className="mb-4 text-3xl font-bold tracking-tight">Image Optimization Strategy</h2>
        <p className="text-lg text-muted-foreground">
          Reduced total image weight by 83% while maintaining visual quality
        </p>
      </div>

      {/* Results Card */}
      <Card className="mb-8 border-green-500/50 bg-green-500/5">
        <CardHeader>
          <CardTitle>Image Optimization Results</CardTitle>
          <CardDescription>Before and after comparison</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <h4 className="mb-4 font-semibold text-muted-foreground">Before Optimization</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Total Size:</span>
                  <span className="font-mono font-semibold">{results.before.size}</span>
                </div>
                <div className="flex justify-between">
                  <span>Image Count:</span>
                  <span className="font-mono font-semibold">{results.before.count}</span>
                </div>
                <div className="flex justify-between">
                  <span>Format:</span>
                  <span className="font-mono font-semibold">{results.before.format}</span>
                </div>
                <div className="flex justify-between">
                  <span>LCP:</span>
                  <span className="font-mono font-semibold text-destructive">{results.before.lcp}</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="mb-4 font-semibold text-green-600 dark:text-green-400">After Optimization</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Total Size:</span>
                  <span className="font-mono font-semibold text-green-600 dark:text-green-400">
                    {results.after.size}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Image Count:</span>
                  <span className="font-mono font-semibold">{results.after.count}</span>
                </div>
                <div className="flex justify-between">
                  <span>Format:</span>
                  <span className="font-mono font-semibold text-green-600 dark:text-green-400">
                    {results.after.format}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>LCP:</span>
                  <span className="font-mono font-semibold text-green-600 dark:text-green-400">
                    {results.after.lcp}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 flex gap-4 border-t pt-4">
            <Badge variant="secondary" className="text-base">
              {results.savings.size} Size Reduction
            </Badge>
            <Badge variant="secondary" className="text-base">
              {results.savings.lcp} LCP Improvement
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Strategy Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {strategies.map((strategy) => (
          <Card key={strategy.title}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">{strategy.title}</CardTitle>
                  <CardDescription>{strategy.description}</CardDescription>
                </div>
                <Badge variant="secondary" className="ml-2">
                  -{strategy.savings}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {strategy.implementation.map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600 dark:text-green-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

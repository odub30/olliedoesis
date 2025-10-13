"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"
import { FileImage, Zap, TrendingDown } from "lucide-react"

const imageComparisonData = [
  { format: "Original PNG", size: 460, quality: 100 },
  { format: "WebP (85%)", size: 165, quality: 98 },
  { format: "AVIF (85%)", size: 127, quality: 98 },
]

export function ImageOptimization() {
  return (
    <section id="image-optimization" className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-3">Image Optimization: The Biggest Impact</h2>
        <p className="text-lg text-muted-foreground">
          Images accounted for 68% of page weight initially. Optimizing them delivered the largest single performance
          improvement.
        </p>
      </div>

      {/* Image Format Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Image Format Comparison</CardTitle>
          <CardDescription>
            Converting to modern formats reduced file sizes by 64% while maintaining visual quality
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Visual Comparison */}
            <div className="grid md:grid-cols-3 gap-4">
              {imageComparisonData.map((format) => (
                <div key={format.format} className="space-y-3">
                  <div className="aspect-video bg-muted rounded-lg overflow-hidden relative">
                    <Image
                      src="/web-performance-dashboard.png"
                      alt={`${format.format} example`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="font-semibold text-sm">{format.format}</div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">File Size:</span>
                      <span className="font-mono font-semibold">{format.size}KB</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Quality:</span>
                      <span className="font-semibold">{format.quality}%</span>
                    </div>
                    {format.format !== "Original PNG" && (
                      <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 pt-1">
                        <TrendingDown className="h-3 w-3" />
                        <span className="font-semibold">{Math.round((1 - format.size / 460) * 100)}% smaller</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">64%</div>
                <div className="text-xs text-muted-foreground mt-1">Size Reduction</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">1.2s</div>
                <div className="text-xs text-muted-foreground mt-1">LCP Improvement</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">680KB</div>
                <div className="text-xs text-muted-foreground mt-1">Total Page Weight</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Implementation Code */}
      <Card>
        <CardHeader>
          <CardTitle>Implementation with Next.js Image Component</CardTitle>
          <CardDescription>Automatic optimization, lazy loading, and responsive images out of the box</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="component" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="component">Component Usage</TabsTrigger>
              <TabsTrigger value="config">Next.js Config</TabsTrigger>
            </TabsList>
            <TabsContent value="component" className="space-y-4">
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs font-mono">
                {`import Image from 'next/image';

export function Hero() {
  return (
    <div className="relative h-screen">
      <Image
        src="/images/hero-background.webp"
        alt="Portfolio hero background"
        fill
        priority // Load immediately for above-fold
        sizes="100vw"
        quality={85}
        className="object-cover"
      />
    </div>
  );
}`}
              </pre>
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <Zap className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary" />
                <p>
                  The <code className="bg-muted px-1 py-0.5 rounded text-xs">priority</code> prop ensures above-the-fold
                  images load immediately, while others lazy load automatically.
                </p>
              </div>
            </TabsContent>
            <TabsContent value="config" className="space-y-4">
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs font-mono">
                {`// next.config.mjs
export default {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },
};`}
              </pre>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Key Takeaways */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileImage className="h-5 w-5 text-primary" />
            Key Takeaways
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>Convert all images to WebP/AVIF for 60-70% size reduction with minimal quality loss</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>Use Next.js Image component for automatic optimization, lazy loading, and responsive images</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>Always specify width and height to prevent Cumulative Layout Shift (CLS)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>Implement blur placeholders for better perceived performance during image loading</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </section>
  )
}

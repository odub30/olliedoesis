// src/components/blog/MetricsDisplay.tsx
import { TrendingUp, Zap, Image as ImageIcon, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface BlogMetrics {
  bundleReduction?: string | null;
  fcpImprovement?: string | null;
  lcpImprovement?: string | null;
  ttiImprovement?: string | null;
  lighthouseIncrease?: number | null;
}

interface MetricsDisplayProps {
  metrics: BlogMetrics;
}

export function MetricsDisplay({ metrics }: MetricsDisplayProps) {
  if (!metrics) return null;

  const hasMetrics =
    metrics.bundleReduction ||
    metrics.fcpImprovement ||
    metrics.lcpImprovement ||
    metrics.ttiImprovement ||
    metrics.lighthouseIncrease;

  if (!hasMetrics) return null;

  return (
    <section className="mb-16">
      <h2 className="text-3xl font-bold tracking-tight mb-6">Performance Metrics</h2>
      <p className="text-lg leading-relaxed text-muted-foreground mb-6">
        Real performance improvements measured and documented in this implementation.
      </p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {metrics.bundleReduction && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <ImageIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                Bundle Size
              </CardTitle>
              <CardDescription>JavaScript bundle reduction</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                {metrics.bundleReduction}
              </div>
              <p className="text-sm text-muted-foreground mt-1">Smaller, faster loads</p>
            </CardContent>
          </Card>
        )}

        {metrics.fcpImprovement && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <Zap className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                FCP
              </CardTitle>
              <CardDescription>First Contentful Paint</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                {metrics.fcpImprovement}
              </div>
              <p className="text-sm text-muted-foreground mt-1">Faster initial render</p>
            </CardContent>
          </Card>
        )}

        {metrics.lcpImprovement && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <ImageIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                LCP
              </CardTitle>
              <CardDescription>Largest Contentful Paint</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                {metrics.lcpImprovement}
              </div>
              <p className="text-sm text-muted-foreground mt-1">Core Web Vital</p>
            </CardContent>
          </Card>
        )}

        {metrics.ttiImprovement && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                  <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                TTI
              </CardTitle>
              <CardDescription>Time to Interactive</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                {metrics.ttiImprovement}
              </div>
              <p className="text-sm text-muted-foreground mt-1">Faster interactivity</p>
            </CardContent>
          </Card>
        )}

        {metrics.lighthouseIncrease && (
          <Card className="md:col-span-2 lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                Lighthouse Score
              </CardTitle>
              <CardDescription>Overall performance increase</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                +{metrics.lighthouseIncrease} points
              </div>
              <Progress value={metrics.lighthouseIncrease} className="h-2" />
              <p className="text-sm text-muted-foreground mt-2">Performance boost</p>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
}

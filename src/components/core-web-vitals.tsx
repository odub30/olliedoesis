import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function CoreWebVitals({ id, className }: { id?: string; className?: string } = {}) {
  const vitals = [
    {
      name: "Largest Contentful Paint (LCP)",
      value: "1.2s",
      threshold: "< 2.5s",
      status: "good",
      description: "Measures loading performance",
    },
    {
      name: "First Input Delay (FID)",
      value: "< 100ms",
      threshold: "< 100ms",
      status: "good",
      description: "Measures interactivity",
    },
    {
      name: "Cumulative Layout Shift (CLS)",
      value: "0",
      threshold: "< 0.1",
      status: "good",
      description: "Measures visual stability",
    },
  ]

  return (
    <section
      id={id}
      className={`mb-16 ${id ? 'scroll-mt-16' : ''} ${className || ''}`}
    >
      <h2 className="text-3xl font-bold tracking-tight mb-6">Core Web Vitals</h2>
      <p className="text-lg leading-relaxed text-muted-foreground mb-6">
        All Core Web Vitals pass Google&apos;s thresholds with significant room to spare, ensuring excellent user experience
        and search engine rankings.
      </p>
      <div className="grid gap-6 md:grid-cols-3">
        {vitals.map((vital) => (
          <Card key={vital.name}>
            <CardHeader>
              <CardTitle className="text-lg">{vital.name}</CardTitle>
              <CardDescription>{vital.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Current Value</div>
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">{vital.value}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Threshold</div>
                  <div className="text-lg font-medium">{vital.threshold}</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">Passing</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const optimizationStrategies = [
  {
    category: "Images",
    strategies: [
      { name: "Convert to WebP/AVIF", effort: "Low", impact: "High", time: "2 hours" },
      { name: "Implement next/image", effort: "Low", impact: "High", time: "2 hours" },
      { name: "Add blur placeholders", effort: "Medium", impact: "Medium", time: "4 hours" },
      { name: "Responsive images", effort: "Low", impact: "Medium", time: "1 hour" },
    ],
  },
  {
    category: "JavaScript",
    strategies: [
      { name: "Remove unused dependencies", effort: "Medium", impact: "High", time: "6 hours" },
      { name: "Code splitting", effort: "Medium", impact: "High", time: "8 hours" },
      { name: "Dynamic imports", effort: "Low", impact: "Medium", time: "3 hours" },
      { name: "Tree shaking", effort: "Low", impact: "Medium", time: "2 hours" },
    ],
  },
  {
    category: "CSS",
    strategies: [
      { name: "Tailwind purging", effort: "Low", impact: "High", time: "1 hour" },
      { name: "Critical CSS inlining", effort: "Medium", impact: "Medium", time: "4 hours" },
      { name: "Remove unused styles", effort: "Low", impact: "Low", time: "2 hours" },
    ],
  },
  {
    category: "Fonts",
    strategies: [
      { name: "Use next/font", effort: "Low", impact: "High", time: "1 hour" },
      { name: "Font subsetting", effort: "Medium", impact: "Medium", time: "3 hours" },
      { name: "Preload critical fonts", effort: "Low", impact: "Low", time: "1 hour" },
    ],
  },
]

const getEffortColor = (effort: string) => {
  switch (effort) {
    case "Low":
      return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
    case "Medium":
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
    case "High":
      return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
    default:
      return ""
  }
}

const getImpactColor = (impact: string) => {
  switch (impact) {
    case "High":
      return "bg-primary/20 text-primary"
    case "Medium":
      return "bg-muted text-muted-foreground"
    case "Low":
      return "bg-muted text-muted-foreground"
    default:
      return ""
  }
}

export function OptimizationComparison() {
  return (
    <section id="optimization-strategies" className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-3">Optimization Strategies Comparison</h2>
        <p className="text-lg text-muted-foreground">
          A comprehensive breakdown of all optimization strategies, their effort level, impact, and time investment.
        </p>
      </div>

      <div className="grid gap-6">
        {optimizationStrategies.map((category) => (
          <Card key={category.category}>
            <CardHeader>
              <CardTitle>{category.category} Optimizations</CardTitle>
              <CardDescription>{category.strategies.length} strategies implemented</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold">Strategy</th>
                      <th className="text-center py-3 px-4 font-semibold">Effort</th>
                      <th className="text-center py-3 px-4 font-semibold">Impact</th>
                      <th className="text-right py-3 px-4 font-semibold">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {category.strategies.map((strategy, index) => (
                      <tr key={index} className="border-b last:border-0">
                        <td className="py-3 px-4 font-medium">{strategy.name}</td>
                        <td className="py-3 px-4 text-center">
                          <Badge variant="secondary" className={getEffortColor(strategy.effort)}>
                            {strategy.effort}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Badge variant="secondary" className={getImpactColor(strategy.impact)}>
                            {strategy.impact}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-right text-muted-foreground font-mono text-sm">
                          {strategy.time}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Wins Callout */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle>Quick Wins: Start Here</CardTitle>
          <CardDescription>These optimizations deliver the biggest impact with minimal effort</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { name: "Implement next/image", impact: "High", time: "2 hours", saving: "15 points" },
              { name: "Use next/font", impact: "High", time: "1 hour", saving: "8 points" },
              { name: "Tailwind CSS purging", impact: "High", time: "1 hour", saving: "5 points" },
              { name: "Convert images to WebP", impact: "High", time: "2 hours", saving: "12 points" },
            ].map((win) => (
              <div key={win.name} className="flex items-center justify-between p-3 border rounded-lg bg-card">
                <div>
                  <div className="font-semibold text-sm">{win.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {win.time} • {win.impact} impact
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-primary">+{win.saving}</div>
                  <div className="text-xs text-muted-foreground">score</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  )
}

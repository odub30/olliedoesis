import { Badge } from "@/components/ui/badge"
import { Clock, Calendar } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-b from-primary/5 via-background to-background border-b">
      <div className="container mx-auto px-4 py-16 md:py-24 max-w-5xl">
        <div className="space-y-6 text-center">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Badge variant="secondary" className="text-xs">
              Performance Optimization
            </Badge>
            <Badge variant="secondary" className="text-xs">
              Core Web Vitals
            </Badge>
            <Badge variant="secondary" className="text-xs">
              Lighthouse
            </Badge>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance">
            Achieving <span className="text-primary">100/100</span> Lighthouse Scores
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground text-balance max-w-3xl mx-auto">
            A systematic case study on optimizing web performance from 78/100 to perfect scores across all metrics
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground pt-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <time dateTime="2025-10-11">October 11, 2025</time>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>15 min read</span>
            </div>
          </div>

          {/* Key Results Preview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 max-w-4xl mx-auto">
            {[
              { label: "Performance", value: "100", change: "+22" },
              { label: "Accessibility", value: "100", change: "+9" },
              { label: "Best Practices", value: "100", change: "+17" },
              { label: "SEO", value: "100", change: "+8" },
            ].map((metric) => (
              <div key={metric.label} className="bg-card border rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-primary">{metric.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{metric.label}</div>
                <div className="text-xs text-green-600 dark:text-green-400 mt-1">+{metric.change} points</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

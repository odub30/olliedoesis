import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, TrendingUp } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-background to-background">
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />

      <div className="container relative mx-auto px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <Badge variant="secondary" className="mb-4">
            <TrendingUp className="mr-2 h-3 w-3" />
            Performance Optimization
          </Badge>

          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Achieving <span className="text-primary">100/100</span> Lighthouse Scores
          </h1>

          <p className="mb-8 text-lg text-muted-foreground sm:text-xl md:text-2xl">
            A complete, data-driven guide to perfect web performance through systematic optimization
            of images, JavaScript, CSS, and Core Web Vitals.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>October 11, 2025</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>15 min read</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">By Ollie Does Is</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

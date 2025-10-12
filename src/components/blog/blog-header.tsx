import { Badge } from "@/components/ui/badge"

export function BlogHeader() {
  return (
    <header className="mb-12 border-b pb-8">
      <div className="flex items-center gap-2 mb-4">
        <Badge variant="secondary">⭐ FEATURED</Badge>
      </div>
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-balance">
        Building a High-Performance Portfolio: The Tech Stack Decision
      </h1>
      <p className="text-xl text-muted-foreground mb-6 text-pretty">
        A deep dive into choosing the right tech stack for your portfolio website. Learn why I chose Next.js, React,
        TypeScript, and Tailwind CSS, and how these decisions led to 100/100 Lighthouse scores and sub-second load
        times.
      </p>
      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/60" />
          <span className="font-medium">Ollie Does Is</span>
        </div>
        <span>•</span>
        <time>October 10, 2025</time>
        <span>•</span>
        <span>8 min read</span>
        <span>•</span>
        <span>6 views</span>
      </div>
      <div className="flex flex-wrap gap-2 mt-6">
        {[
          "Performance Optimization",
          "Tailwind CSS",
          "Next.js",
          "Tools & Workflow",
          "React",
          "Frontend Development",
        ].map((tag) => (
          <Badge key={tag} variant="outline">
            {tag}
          </Badge>
        ))}
      </div>
    </header>
  )
}

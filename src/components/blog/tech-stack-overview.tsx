import { Badge } from "@/components/ui/badge"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function TechStackOverview() {
  const technologies = [
    {
      name: "Next.js 14",
      category: "Framework",
      description: "Hybrid rendering, built-in optimizations, exceptional DX",
      color: "from-slate-500 to-slate-700",
    },
    {
      name: "React 18",
      category: "UI Library",
      description: "Server Components, concurrent rendering, hooks ecosystem",
      color: "from-blue-500 to-cyan-500",
    },
    {
      name: "TypeScript",
      category: "Language",
      description: "Type safety, IDE integration, self-documenting code",
      color: "from-blue-600 to-blue-800",
    },
    {
      name: "Tailwind CSS",
      category: "Styling",
      description: "Utility-first, tiny bundle, built-in design system",
      color: "from-teal-500 to-cyan-600",
    },
  ]

  return (
    <section className="mb-16">
      <h2 className="text-3xl font-bold tracking-tight mb-6">Tech Stack Overview</h2>
      <div className="grid gap-6 md:grid-cols-2">
        {technologies.map((tech) => (
          <Card key={tech.name} className="overflow-hidden">
            <div className={`h-2 bg-gradient-to-r ${tech.color}`} />
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <CardTitle className="text-2xl">{tech.name}</CardTitle>
                <Badge variant="secondary">{tech.category}</Badge>
              </div>
              <CardDescription className="text-base">{tech.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  )
}

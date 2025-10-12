import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function FrameworkComparison() {
  const frameworks = [
    {
      name: "Next.js",
      rendering: "Hybrid (SSG/SSR/ISR)",
      performance: "Excellent",
      dx: "Excellent",
      ecosystem: "Massive",
      learning: "Moderate",
      chosen: true,
    },
    {
      name: "Gatsby",
      rendering: "SSG + GraphQL",
      performance: "Excellent",
      dx: "Good",
      ecosystem: "Large",
      learning: "Steep",
      chosen: false,
    },
    {
      name: "Astro",
      rendering: "Islands Architecture",
      performance: "Outstanding",
      dx: "Good",
      ecosystem: "Growing",
      learning: "Moderate",
      chosen: false,
    },
    {
      name: "SvelteKit",
      rendering: "Hybrid",
      performance: "Outstanding",
      dx: "Excellent",
      ecosystem: "Medium",
      learning: "Moderate",
      chosen: false,
    },
    {
      name: "Nuxt (Vue)",
      rendering: "Hybrid",
      performance: "Excellent",
      dx: "Excellent",
      ecosystem: "Large",
      learning: "Moderate",
      chosen: false,
    },
  ]

  return (
    <section className="mb-16">
      <h2 className="text-3xl font-bold tracking-tight mb-6">Framework Comparison</h2>
      <Card>
        <CardHeader>
          <CardTitle>Alternatives Considered</CardTitle>
          <CardDescription>
            A comprehensive comparison of modern frameworks evaluated during the decision process
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">Framework</TableHead>
                  <TableHead className="font-semibold">Rendering</TableHead>
                  <TableHead className="font-semibold">Performance</TableHead>
                  <TableHead className="font-semibold">Developer Experience</TableHead>
                  <TableHead className="font-semibold">Ecosystem</TableHead>
                  <TableHead className="font-semibold">Learning Curve</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {frameworks.map((framework) => (
                  <TableRow key={framework.name} className={framework.chosen ? "bg-primary/5" : ""}>
                    <TableCell className="font-medium">
                      {framework.name}
                      {framework.chosen && (
                        <Badge variant="default" className="ml-2">
                          Selected
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{framework.rendering}</TableCell>
                    <TableCell>
                      <span
                        className={
                          framework.performance === "Outstanding"
                            ? "text-green-600 dark:text-green-400"
                            : framework.performance === "Excellent"
                              ? "text-blue-600 dark:text-blue-400"
                              : "text-muted-foreground"
                        }
                      >
                        {framework.performance}
                      </span>
                    </TableCell>
                    <TableCell>{framework.dx}</TableCell>
                    <TableCell>{framework.ecosystem}</TableCell>
                    <TableCell>{framework.learning}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}

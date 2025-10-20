import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Check, X } from "lucide-react"

const libraries = [
  {
    name: "Framer Motion",
    size: "35KB (24KB with LazyMotion)",
    api: "Declarative",
    reactIntegration: true,
    gestures: true,
    layoutAnimations: true,
    learning: "Easy",
    performance: "Excellent",
  },
  {
    name: "React Spring",
    size: "28KB",
    api: "Physics-based",
    reactIntegration: true,
    gestures: false,
    layoutAnimations: false,
    learning: "Moderate",
    performance: "Excellent",
  },
  {
    name: "GSAP",
    size: "45KB+",
    api: "Imperative",
    reactIntegration: false,
    gestures: true,
    layoutAnimations: false,
    learning: "Steep",
    performance: "Excellent",
  },
  {
    name: "CSS Animations",
    size: "0KB",
    api: "Declarative",
    reactIntegration: false,
    gestures: false,
    layoutAnimations: false,
    learning: "Easy",
    performance: "Excellent",
  },
]

export function LibraryComparisonTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Animation Library Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Library</TableHead>
                <TableHead>Bundle Size</TableHead>
                <TableHead>API Style</TableHead>
                <TableHead>React Integration</TableHead>
                <TableHead>Gestures</TableHead>
                <TableHead>Layout Animations</TableHead>
                <TableHead>Learning Curve</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {libraries.map((lib) => (
                <TableRow key={lib.name}>
                  <TableCell className="font-semibold">{lib.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{lib.size}</Badge>
                  </TableCell>
                  <TableCell>{lib.api}</TableCell>
                  <TableCell>
                    {lib.reactIntegration ? (
                      <Check className="h-5 w-5 text-green-600" />
                    ) : (
                      <X className="h-5 w-5 text-red-600" />
                    )}
                  </TableCell>
                  <TableCell>
                    {lib.gestures ? (
                      <Check className="h-5 w-5 text-green-600" />
                    ) : (
                      <X className="h-5 w-5 text-red-600" />
                    )}
                  </TableCell>
                  <TableCell>
                    {lib.layoutAnimations ? (
                      <Check className="h-5 w-5 text-green-600" />
                    ) : (
                      <X className="h-5 w-5 text-red-600" />
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        lib.learning === "Easy" ? "default" : lib.learning === "Moderate" ? "secondary" : "outline"
                      }
                    >
                      {lib.learning}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

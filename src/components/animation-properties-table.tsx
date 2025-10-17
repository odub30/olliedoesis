import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const properties = [
  { property: "transform", triggers: "Composite only", performance: "Excellent", gpuAccelerated: true },
  { property: "opacity", triggers: "Composite only", performance: "Excellent", gpuAccelerated: true },
  { property: "filter", triggers: "Composite (with caveats)", performance: "Good", gpuAccelerated: true },
  { property: "width / height", triggers: "Layout + Paint + Composite", performance: "Poor", gpuAccelerated: false },
  { property: "top / left", triggers: "Layout + Paint + Composite", performance: "Poor", gpuAccelerated: false },
  { property: "margin / padding", triggers: "Layout + Paint + Composite", performance: "Poor", gpuAccelerated: false },
  { property: "color", triggers: "Paint + Composite", performance: "Fair", gpuAccelerated: false },
  { property: "background", triggers: "Paint + Composite", performance: "Fair", gpuAccelerated: false },
  { property: "box-shadow", triggers: "Paint + Composite", performance: "Fair", gpuAccelerated: false },
]

export function AnimationPropertiesTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>CSS Properties Performance Guide</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Property</TableHead>
                <TableHead>Rendering Stages Triggered</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead>GPU Accelerated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {properties.map((prop) => (
                <TableRow key={prop.property}>
                  <TableCell className="font-mono font-semibold">{prop.property}</TableCell>
                  <TableCell className="text-sm">{prop.triggers}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        prop.performance === "Excellent"
                          ? "default"
                          : prop.performance === "Good"
                            ? "secondary"
                            : prop.performance === "Fair"
                              ? "outline"
                              : "destructive"
                      }
                    >
                      {prop.performance}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={prop.gpuAccelerated ? "default" : "secondary"}>
                      {prop.gpuAccelerated ? "Yes" : "No"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4 p-4 bg-muted/50 rounded-lg">
          <p className="text-sm font-semibold mb-2">💡 Key Takeaway</p>
          <p className="text-sm text-muted-foreground">
            Stick to <code className="px-1.5 py-0.5 bg-background rounded">transform</code> and{" "}
            <code className="px-1.5 py-0.5 bg-background rounded">opacity</code> for smooth 60fps animations. These
            properties only trigger the composite stage, which is GPU-accelerated and extremely fast.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

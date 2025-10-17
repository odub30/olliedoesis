import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const durations = [
  {
    interaction: "Micro-interactions",
    examples: "Button presses, toggles, checkboxes",
    duration: "0.1-0.2s",
    feeling: "Instant & responsive",
  },
  {
    interaction: "UI state changes",
    examples: "Expanding accordions, showing tooltips",
    duration: "0.2-0.3s",
    feeling: "Fast yet perceptible",
  },
  {
    interaction: "Page transitions",
    examples: "Route changes, navigation",
    duration: "0.3-0.4s",
    feeling: "Smooth & polished",
  },
  {
    interaction: "Modal appearances",
    examples: "Dialogs, overlays, popups",
    duration: "0.3-0.5s",
    feeling: "Noticeable & orienting",
  },
  {
    interaction: "Scroll reveals",
    examples: "Content appearing on scroll",
    duration: "0.4-0.6s",
    feeling: "Dramatic & engaging",
  },
  {
    interaction: "Loading states",
    examples: "Spinners, progress indicators",
    duration: "0.5-1.0s+",
    feeling: "Processing feedback",
  },
]

export function DurationGuideTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Animation Duration Guide</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Interaction Type</TableHead>
                <TableHead>Examples</TableHead>
                <TableHead>Optimal Duration</TableHead>
                <TableHead>User Feeling</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {durations.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-semibold">{item.interaction}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{item.examples}</TableCell>
                  <TableCell>
                    <code className="px-2 py-1 bg-muted rounded text-sm font-mono">{item.duration}</code>
                  </TableCell>
                  <TableCell className="text-sm">{item.feeling}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
          <p className="text-sm font-semibold mb-2">⚠️ Important Rule</p>
          <p className="text-sm">
            Never exceed 0.5s for user-initiated interactions unless specifically dramatic (like modal overlays). Longer
            durations feel sluggish and hurt perceived performance.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

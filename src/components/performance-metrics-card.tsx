import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { TrendingUp, Smartphone, Monitor } from "lucide-react"

export function PerformanceMetricsCard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Desktop Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">Frame Rate</span>
              <span className="font-bold text-green-600">60fps</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: "100%" }} />
            </div>
          </div>

          <Separator />

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">Total Blocking Time</span>
              <span className="font-bold">+12ms</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: "6%" }} />
            </div>
            <p className="text-xs text-muted-foreground mt-1">Within 200ms budget</p>
          </div>

          <Separator />

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">Lighthouse Score</span>
              <span className="font-bold text-green-600">100/100</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: "100%" }} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Mobile Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">iPhone 12</span>
              <span className="font-bold text-green-600">60fps</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: "100%" }} />
            </div>
          </div>

          <Separator />

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">Pixel 5</span>
              <span className="font-bold text-green-600">60fps</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: "100%" }} />
            </div>
          </div>

          <Separator />

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">iPhone SE (slower)</span>
              <span className="font-bold text-amber-600">58fps</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-amber-600 h-2 rounded-full" style={{ width: "97%" }} />
            </div>
            <p className="text-xs text-muted-foreground mt-1">Still acceptable</p>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            User Experience Improvements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-3xl font-bold text-chart-1 mb-1">23%</div>
              <div className="text-sm text-muted-foreground">Faster perceived loading</div>
              <p className="text-xs mt-2">Animations provide feedback during loads</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-chart-2 mb-1">34%</div>
              <div className="text-sm text-muted-foreground">Increase in page views</div>
              <p className="text-xs mt-2">Per session engagement boost</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-chart-3 mb-1">0%</div>
              <div className="text-sm text-muted-foreground">Bounce rate change</div>
              <p className="text-xs mt-2">No degradation despite animations</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

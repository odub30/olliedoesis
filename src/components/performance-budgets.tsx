"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Target, CheckCircle2, AlertCircle } from "lucide-react"

export function PerformanceBudgets() {
  const budgets = [
    {
      resource: "JavaScript",
      budget: 300,
      actual: 180,
      unit: "KB",
      status: "pass",
    },
    {
      resource: "CSS",
      budget: 50,
      actual: 32,
      unit: "KB",
      status: "pass",
    },
    {
      resource: "Images",
      budget: 500,
      actual: 245,
      unit: "KB",
      status: "pass",
    },
    {
      resource: "Fonts",
      budget: 100,
      actual: 45,
      unit: "KB",
      status: "pass",
    },
    {
      resource: "Total Page Weight",
      budget: 1000,
      actual: 502,
      unit: "KB",
      status: "pass",
    },
    {
      resource: "Request Count",
      budget: 50,
      actual: 28,
      unit: "requests",
      status: "pass",
    },
  ]

  const getUsagePercentage = (actual: number, budget: number) => {
    return (actual / budget) * 100
  }

  const getStatusColor = (status: string, percentage: number) => {
    if (status === "pass" && percentage < 80) return "text-green-600 dark:text-green-400"
    if (percentage < 100) return "text-yellow-600 dark:text-yellow-400"
    return "text-destructive"
  }

  return (
    <section id="performance-budgets" className="scroll-mt-16">
      <div className="mb-8">
        <Badge variant="secondary" className="mb-4">
          <Target className="mr-2 h-3 w-3" />
          Budgets
        </Badge>
        <h2 className="mb-4 text-3xl font-bold tracking-tight">Performance Budgets</h2>
        <p className="text-lg text-muted-foreground">
          Set and monitor resource budgets to maintain optimal performance
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {budgets.map((budget) => {
          const percentage = getUsagePercentage(budget.actual, budget.budget)
          const statusColor = getStatusColor(budget.status, percentage)

          return (
            <Card key={budget.resource}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{budget.resource}</CardTitle>
                    <CardDescription>
                      {budget.actual} / {budget.budget} {budget.unit}
                    </CardDescription>
                  </div>
                  {budget.status === "pass" && percentage < 80 ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="text-muted-foreground">Usage</span>
                    <span className={`font-mono font-semibold ${statusColor}`}>
                      {Math.round(percentage)}%
                    </span>
                  </div>
                  <Progress
                    value={percentage > 100 ? 100 : percentage}
                    className={
                      percentage > 100
                        ? "[&>div]:bg-destructive"
                        : percentage > 80
                        ? "[&>div]:bg-yellow-500"
                        : "[&>div]:bg-green-500"
                    }
                  />
                </div>

                <div className="flex items-center justify-between rounded-md bg-muted p-3 text-sm">
                  <span className="text-muted-foreground">Remaining</span>
                  <span className={`font-mono font-semibold ${statusColor}`}>
                    {budget.budget - budget.actual} {budget.unit}
                  </span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card className="mt-6 border-blue-500/50 bg-blue-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Setting Up Performance Budgets
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="mb-2 font-semibold">1. Use Lighthouse CI</h4>
              <p className="text-muted-foreground">
                Configure budget.json in your repository and run Lighthouse CI in your deployment pipeline
              </p>
            </div>
            <div>
              <h4 className="mb-2 font-semibold">2. Monitor in Real-Time</h4>
              <p className="text-muted-foreground">
                Use tools like WebPageTest, SpeedCurve, or Calibre to track performance over time
              </p>
            </div>
            <div>
              <h4 className="mb-2 font-semibold">3. Fail Builds on Budget Violations</h4>
              <p className="text-muted-foreground">
                Prevent performance regressions by failing CI builds when budgets are exceeded
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}

"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, AlertCircle } from "lucide-react"

const budgets = [
  { resource: "JavaScript", budget: 100, actual: 94, unit: "KB" },
  { resource: "CSS", budget: 15, actual: 9.4, unit: "KB" },
  { resource: "Images", budget: 200, actual: 180, unit: "KB" },
  { resource: "Fonts", budget: 50, actual: 45, unit: "KB" },
  { resource: "Total Page", budget: 400, actual: 385, unit: "KB" },
]

export function PerformanceBudgets() {
  return (
    <section id="performance-budgets" className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-3">Performance Budgets</h2>
        <p className="text-lg text-muted-foreground">
          Setting and enforcing strict performance budgets ensures scores remain perfect over time.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Resource Budget Tracking</CardTitle>
          <CardDescription>All resources are within budget, enforced automatically in CI/CD pipeline</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {budgets.map((item) => {
            const percentage = (item.actual / item.budget) * 100
            const isWithinBudget = item.actual <= item.budget

            return (
              <div key={item.resource} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {isWithinBudget ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                    )}
                    <span className="font-semibold">{item.resource}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <span className="font-mono font-semibold text-foreground">
                      {item.actual}
                      {item.unit}
                    </span>
                    {" / "}
                    <span className="font-mono">
                      {item.budget}
                      {item.unit}
                    </span>
                  </div>
                </div>
                <Progress value={Math.min(percentage, 100)} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{percentage.toFixed(0)}% of budget used</span>
                  <span>
                    {(item.budget - item.actual).toFixed(1)}
                    {item.unit} remaining
                  </span>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* CI/CD Integration */}
      <Card>
        <CardHeader>
          <CardTitle>Automated Budget Enforcement</CardTitle>
          <CardDescription>GitHub Actions workflow that fails builds exceeding performance budgets</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs font-mono">
            {`# .github/workflows/performance-budget.yml
name: Performance Budget Check
on: [push, pull_request]

jobs:
  budget-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      
      - name: Check bundle sizes
        run: |
          JS_SIZE=$(du -sk .next/static/chunks | cut -f1)
          if [ $JS_SIZE -gt 100 ]; then
            echo "JavaScript bundle exceeds 100KB budget"
            exit 1
          fi
      
      - name: Run Lighthouse CI
        uses: treosh/lighthouse-ci-action@v9
        with:
          budgetPath: ./budget.json
          uploadArtifacts: true`}
          </pre>
        </CardContent>
      </Card>
    </section>
  )
}

"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CreditCard, TrendingUp, AlertTriangle, Calendar } from "lucide-react"

export function BillingOverview() {
  const currentPlan = {
    name: "Pro",
    price: "$29",
    period: "month",
    nextBilling: "2024-02-15",
    status: "active",
  }

  const usage = {
    apiCalls: { current: 45000, limit: 100000 },
    mockServers: { current: 12, limit: 25 },
    testRuns: { current: 850, limit: 2000 },
    storage: { current: 2.3, limit: 10 }, // GB
  }

  const getUsagePercentage = (current: number, limit: number) => (current / limit) * 100

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Current Plan</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{currentPlan.name}</div>
          <p className="text-xs text-muted-foreground">
            {currentPlan.price}/{currentPlan.period}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="default" className="text-xs">
              {currentPlan.status}
            </Badge>
            <span className="text-xs text-muted-foreground">
              Next billing: {new Date(currentPlan.nextBilling).toLocaleDateString()}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">API Calls</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{usage.apiCalls.current.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">of {usage.apiCalls.limit.toLocaleString()} this month</p>
          <Progress value={getUsagePercentage(usage.apiCalls.current, usage.apiCalls.limit)} className="mt-2" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Mock Servers</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{usage.mockServers.current}</div>
          <p className="text-xs text-muted-foreground">of {usage.mockServers.limit} active</p>
          <Progress value={getUsagePercentage(usage.mockServers.current, usage.mockServers.limit)} className="mt-2" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Test Runs</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{usage.testRuns.current}</div>
          <p className="text-xs text-muted-foreground">of {usage.testRuns.limit} this month</p>
          <Progress value={getUsagePercentage(usage.testRuns.current, usage.testRuns.limit)} className="mt-2" />
        </CardContent>
      </Card>
    </div>
  )
}

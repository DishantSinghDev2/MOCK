"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { TrendingUp, Clock, CheckCircle, XCircle } from "lucide-react"

interface TestMetrics {
  totalRequests: number
  successRate: number
  avgResponseTime: number
  errorRate: number
  throughput: number
}

interface ResponseTimeData {
  endpoint: string
  responseTime: number
  status: "fast" | "slow" | "timeout"
}

export function TestResultsAnalyzer({ projectId }: { projectId: string }) {
  const [metrics, setMetrics] = useState<TestMetrics>({
    totalRequests: 1247,
    successRate: 94.2,
    avgResponseTime: 245,
    errorRate: 5.8,
    throughput: 12.4,
  })

  const [responseTimeData] = useState<ResponseTimeData[]>([
    { endpoint: "/api/users", responseTime: 120, status: "fast" },
    { endpoint: "/api/posts", responseTime: 340, status: "slow" },
    { endpoint: "/api/auth", responseTime: 89, status: "fast" },
    { endpoint: "/api/upload", responseTime: 1200, status: "timeout" },
    { endpoint: "/api/search", responseTime: 450, status: "slow" },
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) => ({
        ...prev,
        totalRequests: prev.totalRequests + Math.floor(Math.random() * 5),
        successRate: Math.max(90, Math.min(99, prev.successRate + (Math.random() - 0.5) * 2)),
        avgResponseTime: Math.max(100, Math.min(500, prev.avgResponseTime + (Math.random() - 0.5) * 20)),
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span>Test Analytics</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{metrics.totalRequests}</div>
              <p className="text-xs text-muted-foreground">Total Requests</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">{metrics.successRate.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">Success Rate</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Avg Response Time</span>
              <span>{metrics.avgResponseTime}ms</span>
            </div>
            <Progress value={(500 - metrics.avgResponseTime) / 5} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Error Rate</span>
              <span className="text-red-500">{metrics.errorRate.toFixed(1)}%</span>
            </div>
            <Progress value={100 - metrics.errorRate} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Response Time Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-48">
            <div className="space-y-2">
              {responseTimeData.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded border">
                  <div className="flex items-center space-x-2">
                    {item.status === "fast" ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : item.status === "slow" ? (
                      <Clock className="h-4 w-4 text-yellow-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span className="text-sm font-mono">{item.endpoint}</span>
                  </div>
                  <Badge
                    variant={item.status === "fast" ? "default" : item.status === "slow" ? "secondary" : "destructive"}
                    className="text-xs"
                  >
                    {item.responseTime}ms
                  </Badge>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}

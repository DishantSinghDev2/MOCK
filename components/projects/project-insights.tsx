import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { BarChart3, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Clock } from "lucide-react"

const insights = [
  {
    title: "API Health Score",
    value: "87%",
    change: "+5% from last week",
    trend: "up",
    description: "Overall API reliability and performance",
  },
  {
    title: "Test Coverage",
    value: "94.2%",
    change: "+2.1% from last week",
    trend: "up",
    description: "Percentage of endpoints covered by tests",
  },
  {
    title: "Average Response Time",
    value: "245ms",
    change: "+12ms from last week",
    trend: "down",
    description: "Mean response time across all endpoints",
  },
  {
    title: "Error Rate",
    value: "0.8%",
    change: "-0.3% from last week",
    trend: "up",
    description: "Percentage of requests resulting in errors",
  },
]

export function ProjectInsights({ projectId }: { projectId: string }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Project Insights</h3>
        <p className="text-sm text-muted-foreground">AI-powered analysis of your API's health and performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {insights.map((insight, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{insight.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold">{insight.value}</div>
                <div className="flex items-center space-x-2 text-xs">
                  {insight.trend === "up" ? (
                    <TrendingUp className="h-3 w-3 text-green-500" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-500" />
                  )}
                  <span className={insight.trend === "up" ? "text-green-500" : "text-red-500"}>{insight.change}</span>
                </div>
                <p className="text-xs text-muted-foreground">{insight.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Endpoint Performance</span>
            </CardTitle>
            <CardDescription>Response times by endpoint</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { endpoint: "GET /api/users", time: 120, status: "good" },
              { endpoint: "POST /api/users", time: 340, status: "warning" },
              { endpoint: "GET /api/users/{id}", time: 89, status: "good" },
              { endpoint: "PUT /api/users/{id}", time: 567, status: "critical" },
            ].map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-mono">{item.endpoint}</span>
                  <div className="flex items-center space-x-2">
                    <span>{item.time}ms</span>
                    {item.status === "good" && <CheckCircle className="h-4 w-4 text-green-500" />}
                    {item.status === "warning" && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
                    {item.status === "critical" && <AlertTriangle className="h-4 w-4 text-red-500" />}
                  </div>
                </div>
                <Progress value={(600 - item.time) / 6} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Recent Activity</span>
            </CardTitle>
            <CardDescription>Latest test runs and discoveries</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                action: "Test run completed",
                details: "Contract Tests - 23/23 passed",
                time: "2 minutes ago",
                status: "success",
              },
              {
                action: "Mock updated",
                details: "GET /api/users - New scenario added",
                time: "15 minutes ago",
                status: "info",
              },
              {
                action: "Test failed",
                details: "Performance Tests - Timeout exceeded",
                time: "1 hour ago",
                status: "error",
              },
              {
                action: "AI discovery",
                details: "Found 3 new endpoints",
                time: "2 hours ago",
                status: "success",
              },
            ].map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div
                  className={`w-2 h-2 rounded-full mt-2 ${
                    activity.status === "success"
                      ? "bg-green-500"
                      : activity.status === "error"
                        ? "bg-red-500"
                        : "bg-blue-500"
                  }`}
                />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">{activity.details}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Activity, Zap, TestTube, AlertTriangle } from "lucide-react"

const stats = [
  {
    title: "Active Projects",
    value: "12",
    change: "+2 from last month",
    trend: "up",
    icon: Activity,
  },
  {
    title: "Mock Endpoints",
    value: "247",
    change: "+18% from last week",
    trend: "up",
    icon: Zap,
  },
  {
    title: "Tests Run",
    value: "1,429",
    change: "+12% from yesterday",
    trend: "up",
    icon: TestTube,
  },
  {
    title: "Success Rate",
    value: "94.2%",
    change: "-2.1% from last week",
    trend: "down",
    icon: AlertTriangle,
  },
]

export function DashboardOverview() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              {stat.trend === "up" ? (
                <TrendingUp className="h-3 w-3 text-green-500" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500" />
              )}
              <span>{stat.change}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

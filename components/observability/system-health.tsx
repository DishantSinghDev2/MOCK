"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, Server, Database, Zap, Globe, Clock } from "lucide-react"

interface HealthMetric {
  name: string
  status: "healthy" | "warning" | "critical"
  value: string
  description: string
  icon: React.ReactNode
}

export function SystemHealth() {
  const [metrics, setMetrics] = useState<HealthMetric[]>([
    {
      name: "API Gateway",
      status: "healthy",
      value: "99.9%",
      description: "Uptime last 24h",
      icon: <Globe className="h-4 w-4" />,
    },
    {
      name: "Mock Servers",
      status: "healthy",
      value: "47/50",
      description: "Active instances",
      icon: <Server className="h-4 w-4" />,
    },
    {
      name: "Database",
      status: "warning",
      value: "85%",
      description: "Connection pool usage",
      icon: <Database className="h-4 w-4" />,
    },
    {
      name: "AI Engine",
      status: "healthy",
      value: "234ms",
      description: "Avg response time",
      icon: <Zap className="h-4 w-4" />,
    },
    {
      name: "Background Jobs",
      status: "healthy",
      value: "12",
      description: "Pending in queue",
      icon: <Activity className="h-4 w-4" />,
    },
    {
      name: "Cache Hit Rate",
      status: "healthy",
      value: "94.2%",
      description: "Redis performance",
      icon: <Clock className="h-4 w-4" />,
    },
  ])

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) =>
        prev.map((metric) => ({
          ...metric,
          value: metric.name === "Background Jobs" ? Math.floor(Math.random() * 20).toString() : metric.value,
        })),
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "bg-green-500"
      case "warning":
        return "bg-yellow-500"
      case "critical":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "healthy":
        return "default"
      case "warning":
        return "secondary"
      case "critical":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {metrics.map((metric) => (
        <Card key={metric.name} className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              {metric.icon}
              {metric.name}
            </CardTitle>
            <Badge variant={getStatusVariant(metric.status)}>{metric.status}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <p className="text-xs text-muted-foreground">{metric.description}</p>
            <div className={`absolute bottom-0 left-0 h-1 w-full ${getStatusColor(metric.status)}`} />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

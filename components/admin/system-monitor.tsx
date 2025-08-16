"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Cpu,
  MemoryStickIcon as Memory,
  HardDrive,
  Network,
  Zap,
} from "lucide-react"

interface SystemMetrics {
  cpu: number
  memory: number
  disk: number
  network: number
  uptime: string
  errors: number
  warnings: number
}

interface ServiceHealth {
  name: string
  status: "healthy" | "degraded" | "down"
  responseTime: number
  errorRate: number
  lastCheck: string
}

export function SystemMonitor() {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    cpu: 45,
    memory: 67,
    disk: 23,
    network: 89,
    uptime: "15d 7h 23m",
    errors: 3,
    warnings: 12,
  })

  const [services, setServices] = useState<ServiceHealth[]>([
    { name: "API Gateway", status: "healthy", responseTime: 45, errorRate: 0.1, lastCheck: "2s ago" },
    { name: "Mock Engine", status: "healthy", responseTime: 23, errorRate: 0.0, lastCheck: "1s ago" },
    { name: "AI Service", status: "degraded", responseTime: 234, errorRate: 2.3, lastCheck: "5s ago" },
    { name: "Database", status: "healthy", responseTime: 12, errorRate: 0.0, lastCheck: "3s ago" },
    { name: "Redis Cache", status: "healthy", responseTime: 8, errorRate: 0.0, lastCheck: "2s ago" },
    { name: "Job Queue", status: "healthy", responseTime: 67, errorRate: 0.5, lastCheck: "1s ago" },
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) => ({
        ...prev,
        cpu: Math.max(10, Math.min(90, prev.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.max(20, Math.min(95, prev.memory + (Math.random() - 0.5) * 5)),
        network: Math.max(50, Math.min(100, prev.network + (Math.random() - 0.5) * 15)),
      }))

      setServices((prev) =>
        prev.map((service) => ({
          ...service,
          responseTime: Math.max(5, service.responseTime + (Math.random() - 0.5) * 20),
          errorRate: Math.max(0, service.errorRate + (Math.random() - 0.5) * 0.5),
          lastCheck: "just now",
        })),
      )
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "degraded":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "down":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "text-green-500"
      case "degraded":
        return "text-yellow-500"
      case "down":
        return "text-red-500"
      default:
        return "text-gray-500"
    }
  }

  return (
    <div className="space-y-6">
      {/* System Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.cpu.toFixed(1)}%</div>
            <Progress value={metrics.cpu} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Memory</CardTitle>
            <Memory className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.memory.toFixed(1)}%</div>
            <Progress value={metrics.memory} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disk Usage</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.disk}%</div>
            <Progress value={metrics.disk} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Network</CardTitle>
            <Network className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.network.toFixed(1)}%</div>
            <Progress value={metrics.network} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Uptime</span>
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {metrics.uptime}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Active Errors</span>
              <Badge variant={metrics.errors > 0 ? "destructive" : "default"}>{metrics.errors}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Warnings</span>
              <Badge variant={metrics.warnings > 5 ? "secondary" : "outline"}>{metrics.warnings}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
              <Activity className="mr-2 h-4 w-4" />
              Restart Services
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
              <HardDrive className="mr-2 h-4 w-4" />
              Clear Cache
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
              <AlertTriangle className="mr-2 h-4 w-4" />
              View Error Logs
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Service Health */}
      <Card>
        <CardHeader>
          <CardTitle>Service Health</CardTitle>
          <CardDescription>Real-time status of all system services</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {services.map((service) => (
              <div key={service.name} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(service.status)}
                  <div>
                    <div className="font-medium">{service.name}</div>
                    <div className="text-sm text-muted-foreground">Last check: {service.lastCheck}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="text-center">
                    <div className="font-medium">{service.responseTime.toFixed(0)}ms</div>
                    <div className="text-muted-foreground">Response</div>
                  </div>
                  <div className="text-center">
                    <div className={`font-medium ${getStatusColor(service.status)}`}>
                      {service.errorRate.toFixed(1)}%
                    </div>
                    <div className="text-muted-foreground">Error Rate</div>
                  </div>
                  <Badge
                    variant={
                      service.status === "healthy"
                        ? "default"
                        : service.status === "degraded"
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {service.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Alerts */}
      {metrics.errors > 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            System has {metrics.errors} active errors that require attention.
            <Button variant="link" className="p-0 h-auto ml-2">
              View Details
            </Button>
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}

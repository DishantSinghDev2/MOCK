"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Bell, CheckCircle, Clock } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Alert {
  id: string
  title: string
  description: string
  severity: "critical" | "warning" | "info"
  status: "active" | "acknowledged" | "resolved"
  timestamp: string
  service: string
  metric?: string
  threshold?: string
}

const mockAlerts: Alert[] = [
  {
    id: "alert-001",
    title: "High Error Rate",
    description: "Error rate exceeded 5% threshold in the last 5 minutes",
    severity: "critical",
    status: "active",
    timestamp: new Date().toISOString(),
    service: "api-gateway",
    metric: "error_rate",
    threshold: "5%",
  },
  {
    id: "alert-002",
    title: "Database Connection Pool Warning",
    description: "Connection pool usage is above 80%",
    severity: "warning",
    status: "acknowledged",
    timestamp: new Date(Date.now() - 300000).toISOString(),
    service: "database",
    metric: "connection_pool_usage",
    threshold: "80%",
  },
  {
    id: "alert-003",
    title: "AI Engine Response Time",
    description: "Average response time increased to 500ms",
    severity: "warning",
    status: "active",
    timestamp: new Date(Date.now() - 600000).toISOString(),
    service: "ai-engine",
    metric: "response_time",
    threshold: "300ms",
  },
  {
    id: "alert-004",
    title: "Mock Server Deployment",
    description: "New mock server instance deployed successfully",
    severity: "info",
    status: "resolved",
    timestamp: new Date(Date.now() - 900000).toISOString(),
    service: "mock-server",
  },
]

export function AlertsPanel() {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts)

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-red-600 bg-red-50 border-red-200"
      case "warning":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "info":
        return "text-blue-600 bg-blue-50 border-blue-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "info":
        return <Bell className="h-4 w-4 text-blue-600" />
      default:
        return <Bell className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Clock className="h-4 w-4 text-orange-600" />
      case "acknowledged":
        return <CheckCircle className="h-4 w-4 text-blue-600" />
      case "resolved":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const acknowledgeAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((alert) => (alert.id === alertId ? { ...alert, status: "acknowledged" as const } : alert)),
    )
  }

  const resolveAlert = (alertId: string) => {
    setAlerts((prev) => prev.map((alert) => (alert.id === alertId ? { ...alert, status: "resolved" as const } : alert)))
  }

  const activeAlerts = alerts.filter((alert) => alert.status === "active")
  const acknowledgedAlerts = alerts.filter((alert) => alert.status === "acknowledged")
  const resolvedAlerts = alerts.filter((alert) => alert.status === "resolved")

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{activeAlerts.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Acknowledged</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{acknowledgedAlerts.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Resolved Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{resolvedAlerts.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Alert Management</CardTitle>
          <CardDescription>Monitor and manage system alerts</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div key={alert.id} className={`p-4 rounded-lg border ${getSeverityColor(alert.severity)}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      {getSeverityIcon(alert.severity)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{alert.title}</h4>
                          <Badge variant="outline" className="text-xs">
                            {alert.severity}
                          </Badge>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(alert.status)}
                            <span className="text-xs capitalize">{alert.status}</span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{alert.description}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>Service: {alert.service}</span>
                          {alert.metric && <span>Metric: {alert.metric}</span>}
                          {alert.threshold && <span>Threshold: {alert.threshold}</span>}
                          <span>{new Date(alert.timestamp).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      {alert.status === "active" && (
                        <>
                          <Button size="sm" variant="outline" onClick={() => acknowledgeAlert(alert.id)}>
                            Acknowledge
                          </Button>
                          <Button size="sm" onClick={() => resolveAlert(alert.id)}>
                            Resolve
                          </Button>
                        </>
                      )}
                      {alert.status === "acknowledged" && (
                        <Button size="sm" onClick={() => resolveAlert(alert.id)}>
                          Resolve
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}

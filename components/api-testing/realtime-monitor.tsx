"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Activity, Zap, AlertTriangle, CheckCircle } from "lucide-react"

interface LiveEvent {
  id: string
  timestamp: string
  type: "request" | "response" | "error" | "insight"
  endpoint: string
  status?: number
  duration?: number
  message: string
  severity?: "low" | "medium" | "high"
}

export function RealTimeMonitor({ projectId }: { projectId: string }) {
  const [events, setEvents] = useState<LiveEvent[]>([])
  const [isConnected, setIsConnected] = useState(true)

  useEffect(() => {
    const generateEvent = (): LiveEvent => {
      const types: LiveEvent["type"][] = ["request", "response", "error", "insight"]
      const endpoints = ["/api/users", "/api/posts", "/api/auth", "/api/upload"]
      const messages = [
        "Request initiated",
        "Response received successfully",
        "Rate limit exceeded",
        "Slow response detected",
        "Authentication failed",
        "Cache hit",
        "Database query optimized",
        "Security vulnerability detected",
      ]

      const type = types[Math.floor(Math.random() * types.length)]
      return {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
        type,
        endpoint: endpoints[Math.floor(Math.random() * endpoints.length)],
        status: type === "response" ? (Math.random() > 0.1 ? 200 : 500) : undefined,
        duration: type === "response" ? Math.floor(Math.random() * 500) + 50 : undefined,
        message: messages[Math.floor(Math.random() * messages.length)],
        severity: type === "error" ? "high" : type === "insight" ? "medium" : "low",
      }
    }

    const interval = setInterval(() => {
      const newEvent = generateEvent()
      setEvents((prev) => [newEvent, ...prev.slice(0, 49)]) // Keep last 50 events
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const getEventIcon = (type: string) => {
    switch (type) {
      case "request":
        return <Zap className="h-3 w-3 text-blue-500" />
      case "response":
        return <CheckCircle className="h-3 w-3 text-green-500" />
      case "error":
        return <AlertTriangle className="h-3 w-3 text-red-500" />
      case "insight":
        return <Activity className="h-3 w-3 text-purple-500" />
      default:
        return <Activity className="h-3 w-3 text-gray-500" />
    }
  }

  const getEventColor = (type: string, status?: number) => {
    if (type === "error" || (status && status >= 400)) return "border-l-red-500 bg-red-500/5"
    if (type === "insight") return "border-l-purple-500 bg-purple-500/5"
    if (type === "response") return "border-l-green-500 bg-green-500/5"
    return "border-l-blue-500 bg-blue-500/5"
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-4 w-4 text-primary" />
            <span>Live Monitor</span>
          </CardTitle>
          <Badge variant={isConnected ? "default" : "destructive"} className="text-xs">
            {isConnected ? "Connected" : "Disconnected"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64">
          <div className="space-y-2">
            {events.map((event) => (
              <div
                key={event.id}
                className={`border-l-2 pl-3 py-2 rounded-r ${getEventColor(event.type, event.status)}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    {getEventIcon(event.type)}
                    <span className="text-xs font-mono">{event.endpoint}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(event.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{event.message}</p>
                {event.status && (
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant={event.status < 300 ? "default" : "destructive"} className="text-xs">
                      {event.status}
                    </Badge>
                    {event.duration && <span className="text-xs text-muted-foreground">{event.duration}ms</span>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

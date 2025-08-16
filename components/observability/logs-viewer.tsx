"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, Download, Pause, Play } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface LogEntry {
  id: string
  timestamp: string
  level: "info" | "warn" | "error" | "debug"
  service: string
  message: string
  metadata?: Record<string, any>
}

const generateLogEntry = (): LogEntry => {
  const levels: LogEntry["level"][] = ["info", "warn", "error", "debug"]
  const services = ["api-gateway", "mock-server", "ai-engine", "test-runner", "auth-service"]
  const messages = [
    "Request processed successfully",
    "Mock endpoint created",
    "AI discovery completed",
    "Test execution started",
    "User authenticated",
    "Database connection established",
    "Cache miss for key",
    "Rate limit exceeded",
    "Invalid API key provided",
    "Background job completed",
  ]

  return {
    id: Math.random().toString(36).substr(2, 9),
    timestamp: new Date().toISOString(),
    level: levels[Math.floor(Math.random() * levels.length)],
    service: services[Math.floor(Math.random() * services.length)],
    message: messages[Math.floor(Math.random() * messages.length)],
    metadata: {
      requestId: Math.random().toString(36).substr(2, 9),
      userId: Math.random().toString(36).substr(2, 9),
      duration: Math.floor(Math.random() * 1000) + "ms",
    },
  }
}

export function LogsViewer() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [levelFilter, setLevelFilter] = useState("all")
  const [serviceFilter, setServiceFilter] = useState("all")
  const [isStreaming, setIsStreaming] = useState(true)

  // Initialize with some logs
  useEffect(() => {
    const initialLogs = Array.from({ length: 50 }, generateLogEntry).sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    )
    setLogs(initialLogs)
  }, [])

  // Real-time log streaming
  useEffect(() => {
    if (!isStreaming) return

    const interval = setInterval(() => {
      const newLog = generateLogEntry()
      setLogs((prev) => [newLog, ...prev.slice(0, 199)]) // Keep last 200 logs
    }, 2000)

    return () => clearInterval(interval)
  }, [isStreaming])

  // Filter logs
  useEffect(() => {
    let filtered = logs

    if (searchTerm) {
      filtered = filtered.filter(
        (log) =>
          log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.service.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (levelFilter !== "all") {
      filtered = filtered.filter((log) => log.level === levelFilter)
    }

    if (serviceFilter !== "all") {
      filtered = filtered.filter((log) => log.service === serviceFilter)
    }

    setFilteredLogs(filtered)
  }, [logs, searchTerm, levelFilter, serviceFilter])

  const getLevelColor = (level: string) => {
    switch (level) {
      case "error":
        return "bg-red-500"
      case "warn":
        return "bg-yellow-500"
      case "info":
        return "bg-blue-500"
      case "debug":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  const getLevelVariant = (level: string) => {
    switch (level) {
      case "error":
        return "destructive"
      case "warn":
        return "secondary"
      case "info":
        return "default"
      case "debug":
        return "outline"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Live Logs</CardTitle>
              <CardDescription>Real-time application logs and events</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsStreaming(!isStreaming)}>
                {isStreaming ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {isStreaming ? "Pause" : "Resume"}
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="warn">Warning</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="debug">Debug</SelectItem>
              </SelectContent>
            </Select>
            <Select value={serviceFilter} onValueChange={setServiceFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Services</SelectItem>
                <SelectItem value="api-gateway">API Gateway</SelectItem>
                <SelectItem value="mock-server">Mock Server</SelectItem>
                <SelectItem value="ai-engine">AI Engine</SelectItem>
                <SelectItem value="test-runner">Test Runner</SelectItem>
                <SelectItem value="auth-service">Auth Service</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <ScrollArea className="h-[600px] w-full rounded-md border">
            <div className="p-4 space-y-2">
              {filteredLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className={`w-2 h-2 rounded-full mt-2 ${getLevelColor(log.level)}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={getLevelVariant(log.level)} className="text-xs">
                        {log.level.toUpperCase()}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {log.service}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm font-mono">{log.message}</p>
                    {log.metadata && (
                      <div className="mt-2 text-xs text-muted-foreground font-mono">
                        {Object.entries(log.metadata).map(([key, value]) => (
                          <span key={key} className="mr-4">
                            {key}: {value}
                          </span>
                        ))}
                      </div>
                    )}
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

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Clock, Zap, AlertTriangle } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Span {
  id: string
  name: string
  service: string
  duration: number
  startTime: number
  status: "success" | "error" | "timeout"
  tags: Record<string, string>
}

interface Trace {
  id: string
  timestamp: string
  duration: number
  spans: Span[]
  status: "success" | "error" | "timeout"
  rootSpan: string
}

const mockTraces: Trace[] = [
  {
    id: "trace-001",
    timestamp: new Date().toISOString(),
    duration: 245,
    status: "success",
    rootSpan: "POST /api/projects",
    spans: [
      {
        id: "span-001",
        name: "POST /api/projects",
        service: "api-gateway",
        duration: 245,
        startTime: 0,
        status: "success",
        tags: { method: "POST", endpoint: "/api/projects", userId: "user-123" },
      },
      {
        id: "span-002",
        name: "AI Discovery",
        service: "ai-engine",
        duration: 180,
        startTime: 20,
        status: "success",
        tags: { model: "gemini-pro", tokens: "1250" },
      },
      {
        id: "span-003",
        name: "Database Insert",
        service: "database",
        duration: 35,
        startTime: 210,
        status: "success",
        tags: { table: "projects", operation: "insert" },
      },
    ],
  },
  {
    id: "trace-002",
    timestamp: new Date(Date.now() - 60000).toISOString(),
    duration: 1200,
    status: "error",
    rootSpan: "GET /api/mocks/discover",
    spans: [
      {
        id: "span-004",
        name: "GET /api/mocks/discover",
        service: "api-gateway",
        duration: 1200,
        startTime: 0,
        status: "error",
        tags: { method: "GET", endpoint: "/api/mocks/discover", error: "timeout" },
      },
      {
        id: "span-005",
        name: "External API Call",
        service: "mock-server",
        duration: 1150,
        startTime: 50,
        status: "timeout",
        tags: { url: "https://api.example.com", timeout: "5000ms" },
      },
    ],
  },
]

export function TracingViewer() {
  const [selectedTrace, setSelectedTrace] = useState<Trace | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "text-green-600"
      case "error":
        return "text-red-600"
      case "timeout":
        return "text-yellow-600"
      default:
        return "text-gray-600"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <Zap className="h-4 w-4 text-green-600" />
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case "timeout":
        return <Clock className="h-4 w-4 text-yellow-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Distributed Tracing</CardTitle>
          <CardDescription>OpenTelemetry traces across services</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search traces..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <h3 className="text-lg font-semibold mb-3">Recent Traces</h3>
              <ScrollArea className="h-[500px]">
                <div className="space-y-2">
                  {mockTraces.map((trace) => (
                    <div
                      key={trace.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedTrace?.id === trace.id ? "bg-accent border-primary" : "bg-card hover:bg-accent/50"
                      }`}
                      onClick={() => setSelectedTrace(trace)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(trace.status)}
                          <span className="font-mono text-sm">{trace.rootSpan}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {trace.duration}ms
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{trace.id}</span>
                        <span>{trace.spans.length} spans</span>
                        <span>{new Date(trace.timestamp).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Trace Details</h3>
              {selectedTrace ? (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{selectedTrace.rootSpan}</CardTitle>
                      <Badge variant="outline">{selectedTrace.duration}ms</Badge>
                    </div>
                    <CardDescription>
                      Trace ID: {selectedTrace.id} • {selectedTrace.spans.length} spans
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedTrace.spans.map((span, index) => (
                        <div key={span.id} className="relative">
                          <div
                            className="flex items-center gap-3 p-3 rounded-lg border bg-card"
                            style={{ marginLeft: `${index * 16}px` }}
                          >
                            <div
                              className={`w-2 h-2 rounded-full ${
                                span.status === "success"
                                  ? "bg-green-500"
                                  : span.status === "error"
                                    ? "bg-red-500"
                                    : "bg-yellow-500"
                              }`}
                            />
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-medium text-sm">{span.name}</span>
                                <span className="text-xs text-muted-foreground">{span.duration}ms</span>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Badge variant="outline" className="text-xs">
                                  {span.service}
                                </Badge>
                                {Object.entries(span.tags)
                                  .slice(0, 2)
                                  .map(([key, value]) => (
                                    <span key={key}>
                                      {key}: {value}
                                    </span>
                                  ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="flex items-center justify-center h-[400px] border rounded-lg bg-muted/20">
                  <p className="text-muted-foreground">Select a trace to view details</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

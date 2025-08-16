"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Download, RefreshCw, ExternalLink, Clock, AlertTriangle, Info, CheckCircle } from "lucide-react"

const logs = [
  {
    id: "1",
    timestamp: "2024-01-15T14:30:25.123Z",
    level: "info",
    message: "Test run started for Contract Tests",
    source: "test-runner",
    traceId: "trace-abc123",
    metadata: { suite: "Contract Tests", tests: 23 },
  },
  {
    id: "2",
    timestamp: "2024-01-15T14:30:23.456Z",
    level: "error",
    message: "Mock endpoint /api/users returned 500 error",
    source: "mock-server",
    traceId: "trace-def456",
    metadata: { endpoint: "/api/users", method: "GET", statusCode: 500 },
  },
  {
    id: "3",
    timestamp: "2024-01-15T14:30:20.789Z",
    level: "warn",
    message: "High response time detected: 2.5s",
    source: "performance-monitor",
    traceId: "trace-ghi789",
    metadata: { endpoint: "/api/users/{id}", responseTime: 2500 },
  },
  {
    id: "4",
    timestamp: "2024-01-15T14:30:18.012Z",
    level: "info",
    message: "AI discovery completed - 12 endpoints found",
    source: "ai-discovery",
    traceId: "trace-jkl012",
    metadata: { endpointsFound: 12, duration: "45s" },
  },
]

const levelConfig = {
  error: { icon: AlertTriangle, color: "text-red-500", bg: "bg-red-500/10" },
  warn: { icon: AlertTriangle, color: "text-yellow-500", bg: "bg-yellow-500/10" },
  info: { icon: Info, color: "text-blue-500", bg: "bg-blue-500/10" },
  debug: { icon: CheckCircle, color: "text-green-500", bg: "bg-green-500/10" },
}

export function ProjectLogs({ projectId }: { projectId: string }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLevel, setSelectedLevel] = useState("all")
  const [selectedSource, setSelectedSource] = useState("all")

  const filteredLogs = logs.filter((log) => {
    const matchesSearch = log.message.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesLevel = selectedLevel === "all" || log.level === selectedLevel
    const matchesSource = selectedSource === "all" || log.source === selectedSource
    return matchesSearch && matchesLevel && matchesSource
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Project Logs</h3>
          <p className="text-sm text-muted-foreground">Real-time logs from your API tests, mocks, and discovery</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-muted/50"
              />
            </div>
            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger className="w-full md:w-32">
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="warn">Warning</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="debug">Debug</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedSource} onValueChange={setSelectedSource}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="test-runner">Test Runner</SelectItem>
                <SelectItem value="mock-server">Mock Server</SelectItem>
                <SelectItem value="ai-discovery">AI Discovery</SelectItem>
                <SelectItem value="performance-monitor">Performance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Logs List */}
      <div className="space-y-2">
        {filteredLogs.map((log) => {
          const LevelIcon = levelConfig[log.level as keyof typeof levelConfig].icon
          return (
            <Card key={log.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${levelConfig[log.level as keyof typeof levelConfig].bg}`}
                  >
                    <LevelIcon className={`h-4 w-4 ${levelConfig[log.level as keyof typeof levelConfig].color}`} />
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{log.message}</p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{new Date(log.timestamp).toLocaleString()}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {log.source}
                          </Badge>
                          <span className="font-mono">{log.traceId}</span>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Full Log</DropdownMenuItem>
                          <DropdownMenuItem>View Trace</DropdownMenuItem>
                          <DropdownMenuItem>Copy Trace ID</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {log.metadata && Object.keys(log.metadata).length > 0 && (
                      <div className="bg-muted/50 rounded p-2">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                          {Object.entries(log.metadata).map(([key, value]) => (
                            <div key={key}>
                              <span className="font-medium text-muted-foreground">{key}:</span>
                              <span className="ml-1">{String(value)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredLogs.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No logs found</h3>
            <p className="text-muted-foreground">Try adjusting your search terms or filters</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  MoreHorizontal,
  Play,
  Pause,
  Edit,
  Copy,
  Trash2,
  ExternalLink,
  Clock,
  TrendingUp,
  CheckCircle,
} from "lucide-react"

interface MockEndpoint {
  id: string
  method: string
  path: string
  description: string
  status: "active" | "paused"
  requests: number
  avgLatency: number
  successRate: number
  lastUsed: string
}

const methodColors = {
  GET: "bg-green-500/10 text-green-500 border-green-500/20",
  POST: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  PUT: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  DELETE: "bg-red-500/10 text-red-500 border-red-500/20",
  PATCH: "bg-purple-500/10 text-purple-500 border-purple-500/20",
}

export function MockEndpointCard({ endpoint }: { endpoint: MockEndpoint }) {
  const [status, setStatus] = useState(endpoint.status)

  const toggleStatus = () => {
    setStatus((prev) => (prev === "active" ? "paused" : "active"))
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Badge
                variant="outline"
                className={`text-xs font-mono ${methodColors[endpoint.method as keyof typeof methodColors]}`}
              >
                {endpoint.method}
              </Badge>
              <Badge variant={status === "active" ? "default" : "secondary"} className="text-xs">
                {status}
              </Badge>
            </div>
            <CardTitle className="text-base font-mono">{endpoint.path}</CardTitle>
            <CardDescription className="text-sm">{endpoint.description}</CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={toggleStatus}>
                {status === "active" ? (
                  <>
                    <Pause className="mr-2 h-4 w-4" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Activate
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="mr-2 h-4 w-4" />
                Edit Mock
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Copy className="mr-2 h-4 w-4" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem>
                <ExternalLink className="mr-2 h-4 w-4" />
                Test Endpoint
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-1">
            <div className="flex items-center justify-center space-x-1">
              <TrendingUp className="h-3 w-3 text-primary" />
              <span className="text-sm font-medium">{endpoint.requests.toLocaleString()}</span>
            </div>
            <p className="text-xs text-muted-foreground">Requests</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-center space-x-1">
              <Clock className="h-3 w-3 text-accent" />
              <span className="text-sm font-medium">{endpoint.avgLatency}ms</span>
            </div>
            <p className="text-xs text-muted-foreground">Avg Latency</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-center space-x-1">
              <CheckCircle className="h-3 w-3 text-green-500" />
              <span className="text-sm font-medium">{endpoint.successRate}%</span>
            </div>
            <p className="text-xs text-muted-foreground">Success</p>
          </div>
        </div>

        {/* Last Used */}
        <div className="pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground">Last used: {endpoint.lastUsed}</p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="flex-1 bg-transparent">
            <ExternalLink className="mr-2 h-4 w-4" />
            Test
          </Button>
          <Button variant="outline" size="sm" className="flex-1 bg-transparent">
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

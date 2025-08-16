"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MockEndpointCard } from "@/components/mocks/mock-endpoint-card"
import { MockScenarios } from "@/components/mocks/mock-scenarios"
import { MockSettings } from "@/components/mocks/mock-settings"
import {
  Search,
  Filter,
  Plus,
  Play,
  Pause,
  RotateCcw,
  Share,
  Download,
  ExternalLink,
  Zap,
  Settings,
  Layers,
} from "lucide-react"

const mockEndpoints = [
  {
    id: "1",
    method: "GET",
    path: "/api/users",
    description: "Get all users",
    status: "active",
    requests: 1247,
    avgLatency: 45,
    successRate: 99.2,
    lastUsed: "2 minutes ago",
  },
  {
    id: "2",
    method: "POST",
    path: "/api/users",
    description: "Create new user",
    status: "active",
    requests: 342,
    avgLatency: 78,
    successRate: 97.8,
    lastUsed: "5 minutes ago",
  },
  {
    id: "3",
    method: "GET",
    path: "/api/users/{id}",
    description: "Get user by ID",
    status: "paused",
    requests: 856,
    avgLatency: 32,
    successRate: 98.9,
    lastUsed: "1 hour ago",
  },
  {
    id: "4",
    method: "PUT",
    path: "/api/users/{id}",
    description: "Update user",
    status: "active",
    requests: 234,
    avgLatency: 89,
    successRate: 96.5,
    lastUsed: "15 minutes ago",
  },
]

export function MocksOverview({ projectId }: { projectId: string }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [mockServerStatus, setMockServerStatus] = useState<"running" | "stopped">("running")

  const filteredEndpoints = mockEndpoints.filter(
    (endpoint) =>
      endpoint.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      endpoint.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const toggleMockServer = () => {
    setMockServerStatus((prev) => (prev === "running" ? "stopped" : "running"))
  }

  return (
    <div className="space-y-6">
      {/* Mock Server Status */}
      <Card
        className={`border-2 ${mockServerStatus === "running" ? "border-green-500/20 bg-green-500/5" : "border-red-500/20 bg-red-500/5"}`}
      >
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div
                className={`w-3 h-3 rounded-full ${mockServerStatus === "running" ? "bg-green-500 animate-pulse" : "bg-red-500"}`}
              />
              <div>
                <CardTitle className="text-lg">Mock Server</CardTitle>
                <CardDescription>
                  {mockServerStatus === "running"
                    ? "Your mock server is running and ready to serve requests"
                    : "Mock server is currently stopped"}
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant={mockServerStatus === "running" ? "destructive" : "default"}
                size="sm"
                onClick={toggleMockServer}
              >
                {mockServerStatus === "running" ? (
                  <>
                    <Pause className="mr-2 h-4 w-4" />
                    Stop Server
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Start Server
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        {mockServerStatus === "running" && (
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-background rounded-lg border">
              <div className="flex items-center space-x-3">
                <ExternalLink className="h-4 w-4 text-primary" />
                <div>
                  <p className="font-mono text-sm">https://mock-api-{projectId}.dishis.tech</p>
                  <p className="text-xs text-muted-foreground">Base URL for your mock server</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Share className="mr-2 h-4 w-4" />
                  Share
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Mock Management Tabs */}
      <Tabs defaultValue="endpoints" className="space-y-6">
        <TabsList>
          <TabsTrigger value="endpoints" className="flex items-center space-x-2">
            <Zap className="h-4 w-4" />
            <span>Endpoints</span>
          </TabsTrigger>
          <TabsTrigger value="scenarios" className="flex items-center space-x-2">
            <Layers className="h-4 w-4" />
            <span>Scenarios</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="endpoints" className="space-y-6">
          {/* Endpoints Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Mock Endpoints</h3>
              <p className="text-sm text-muted-foreground">
                {filteredEndpoints.length} endpoints • {mockEndpoints.filter((e) => e.status === "active").length}{" "}
                active
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <RotateCcw className="mr-2 h-4 w-4" />
                Regenerate All
              </Button>
              <Button size="sm" className="bg-primary hover:bg-primary/90">
                <Plus className="mr-2 h-4 w-4" />
                Add Endpoint
              </Button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search endpoints..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-muted/50"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>All Endpoints</DropdownMenuItem>
                <DropdownMenuItem>Active Only</DropdownMenuItem>
                <DropdownMenuItem>Paused Only</DropdownMenuItem>
                <DropdownMenuItem>GET Requests</DropdownMenuItem>
                <DropdownMenuItem>POST Requests</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Endpoints Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredEndpoints.map((endpoint) => (
              <MockEndpointCard key={endpoint.id} endpoint={endpoint} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="scenarios">
          <MockScenarios projectId={projectId} />
        </TabsContent>

        <TabsContent value="settings">
          <MockSettings projectId={projectId} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

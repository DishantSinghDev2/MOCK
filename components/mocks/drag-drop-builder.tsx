"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd"
import { Plus, Trash2, Wand2, Code, Database, Zap, Settings, Play } from "lucide-react"

interface EndpointBlock {
  id: string
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH"
  path: string
  description: string
  responseType: "json" | "xml" | "text"
  statusCode: number
  responseBody: string
  headers: Record<string, string>
  delay: number
}

const methodColors = {
  GET: "bg-green-500",
  POST: "bg-blue-500",
  PUT: "bg-yellow-500",
  DELETE: "bg-red-500",
  PATCH: "bg-purple-500",
}

export function DragDropBuilder({ projectId }: { projectId: string }) {
  const [endpoints, setEndpoints] = useState<EndpointBlock[]>([])
  const [selectedEndpoint, setSelectedEndpoint] = useState<EndpointBlock | null>(null)
  const [builderMode, setBuilderMode] = useState<"manual" | "ai-assisted" | "full-ai">("manual")

  const handleDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) return

      const items = Array.from(endpoints)
      const [reorderedItem] = items.splice(result.source.index, 1)
      items.splice(result.destination.index, 0, reorderedItem)

      setEndpoints(items)
    },
    [endpoints],
  )

  const addEndpoint = () => {
    const newEndpoint: EndpointBlock = {
      id: `endpoint-${Date.now()}`,
      method: "GET",
      path: "/api/new-endpoint",
      description: "New endpoint",
      responseType: "json",
      statusCode: 200,
      responseBody: '{\n  "message": "Hello World"\n}',
      headers: { "Content-Type": "application/json" },
      delay: 0,
    }
    setEndpoints([...endpoints, newEndpoint])
    setSelectedEndpoint(newEndpoint)
  }

  const generateWithAI = async () => {
    // Simulate AI generation
    const aiEndpoints: EndpointBlock[] = [
      {
        id: `ai-${Date.now()}-1`,
        method: "GET",
        path: "/api/users",
        description: "Get all users with pagination",
        responseType: "json",
        statusCode: 200,
        responseBody: JSON.stringify(
          {
            users: [
              { id: 1, name: "John Doe", email: "john@example.com" },
              { id: 2, name: "Jane Smith", email: "jane@example.com" },
            ],
            pagination: { page: 1, limit: 10, total: 25 },
          },
          null,
          2,
        ),
        headers: { "Content-Type": "application/json" },
        delay: 100,
      },
      {
        id: `ai-${Date.now()}-2`,
        method: "POST",
        path: "/api/users",
        description: "Create new user",
        responseType: "json",
        statusCode: 201,
        responseBody: JSON.stringify(
          {
            id: 3,
            name: "New User",
            email: "newuser@example.com",
            createdAt: new Date().toISOString(),
          },
          null,
          2,
        ),
        headers: { "Content-Type": "application/json" },
        delay: 200,
      },
    ]

    setEndpoints([...endpoints, ...aiEndpoints])
  }

  const updateEndpoint = (id: string, updates: Partial<EndpointBlock>) => {
    setEndpoints(endpoints.map((ep) => (ep.id === id ? { ...ep, ...updates } : ep)))
    if (selectedEndpoint?.id === id) {
      setSelectedEndpoint({ ...selectedEndpoint, ...updates })
    }
  }

  const deleteEndpoint = (id: string) => {
    setEndpoints(endpoints.filter((ep) => ep.id !== id))
    if (selectedEndpoint?.id === id) {
      setSelectedEndpoint(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Builder Mode Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Mock API Builder
          </CardTitle>
          <CardDescription>Build your mock API endpoints with drag-and-drop simplicity</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={builderMode} onValueChange={(v) => setBuilderMode(v as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="manual" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Manual
              </TabsTrigger>
              <TabsTrigger value="ai-assisted" className="flex items-center gap-2">
                <Wand2 className="h-4 w-4" />
                AI Assisted
              </TabsTrigger>
              <TabsTrigger value="full-ai" className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Full AI
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Endpoints List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Endpoints</CardTitle>
              <div className="flex gap-2">
                {builderMode !== "manual" && (
                  <Button size="sm" onClick={generateWithAI} className="bg-primary">
                    <Wand2 className="h-4 w-4 mr-2" />
                    AI Generate
                  </Button>
                )}
                <Button size="sm" onClick={addEndpoint} variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="endpoints">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                    {endpoints.map((endpoint, index) => (
                      <Draggable key={endpoint.id} draggableId={endpoint.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`p-3 border rounded-lg cursor-pointer transition-all ${
                              snapshot.isDragging ? "shadow-lg" : ""
                            } ${
                              selectedEndpoint?.id === endpoint.id
                                ? "border-primary bg-primary/5"
                                : "hover:border-primary/50"
                            }`}
                            onClick={() => setSelectedEndpoint(endpoint)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${methodColors[endpoint.method]}`} />
                                <Badge variant="outline" className="text-xs">
                                  {endpoint.method}
                                </Badge>
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  deleteEndpoint(endpoint.id)
                                }}
                                className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                            <p className="font-mono text-sm mt-1">{endpoint.path}</p>
                            <p className="text-xs text-muted-foreground">{endpoint.description}</p>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </CardContent>
        </Card>

        {/* Endpoint Editor */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Endpoint Configuration</span>
              {selectedEndpoint && (
                <Button size="sm" className="bg-primary">
                  <Play className="h-4 w-4 mr-2" />
                  Test Endpoint
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedEndpoint ? (
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Method</Label>
                    <Select
                      value={selectedEndpoint.method}
                      onValueChange={(value) => updateEndpoint(selectedEndpoint.id, { method: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="GET">GET</SelectItem>
                        <SelectItem value="POST">POST</SelectItem>
                        <SelectItem value="PUT">PUT</SelectItem>
                        <SelectItem value="DELETE">DELETE</SelectItem>
                        <SelectItem value="PATCH">PATCH</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Status Code</Label>
                    <Input
                      type="number"
                      value={selectedEndpoint.statusCode}
                      onChange={(e) =>
                        updateEndpoint(selectedEndpoint.id, { statusCode: Number.parseInt(e.target.value) })
                      }
                    />
                  </div>
                </div>

                <div>
                  <Label>Path</Label>
                  <Input
                    value={selectedEndpoint.path}
                    onChange={(e) => updateEndpoint(selectedEndpoint.id, { path: e.target.value })}
                    className="font-mono"
                  />
                </div>

                <div>
                  <Label>Description</Label>
                  <Input
                    value={selectedEndpoint.description}
                    onChange={(e) => updateEndpoint(selectedEndpoint.id, { description: e.target.value })}
                  />
                </div>

                {/* Response Configuration */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold">Response Configuration</Label>
                    {builderMode !== "manual" && (
                      <Button size="sm" variant="outline">
                        <Wand2 className="h-4 w-4 mr-2" />
                        AI Enhance
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Response Type</Label>
                      <Select
                        value={selectedEndpoint.responseType}
                        onValueChange={(value) => updateEndpoint(selectedEndpoint.id, { responseType: value as any })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="json">JSON</SelectItem>
                          <SelectItem value="xml">XML</SelectItem>
                          <SelectItem value="text">Text</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Delay (ms)</Label>
                      <Input
                        type="number"
                        value={selectedEndpoint.delay}
                        onChange={(e) =>
                          updateEndpoint(selectedEndpoint.id, { delay: Number.parseInt(e.target.value) })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Response Body</Label>
                    <Textarea
                      value={selectedEndpoint.responseBody}
                      onChange={(e) => updateEndpoint(selectedEndpoint.id, { responseBody: e.target.value })}
                      className="font-mono text-sm min-h-[200px]"
                      placeholder="Enter your response body..."
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">No Endpoint Selected</h3>
                <p className="text-muted-foreground mb-4">
                  Select an endpoint from the list or create a new one to start building
                </p>
                <Button onClick={addEndpoint}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Endpoint
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

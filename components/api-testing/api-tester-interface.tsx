"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Play, Brain, Copy, Download, Clock, Zap, AlertTriangle, CheckCircle } from "lucide-react"

interface TestRequest {
  method: string
  url: string
  headers: Record<string, string>
  body: string
  auth?: {
    type: string
    credentials: Record<string, string>
  }
}

interface TestResponse {
  status: number
  statusText: string
  headers: Record<string, string>
  body: string
  duration: number
  size: number
  timestamp: string
}

interface AIInsight {
  type: "performance" | "security" | "reliability" | "optimization"
  severity: "low" | "medium" | "high" | "critical"
  title: string
  description: string
  suggestion: string
  confidence: number
}

export function APITesterInterface({ projectId }: { projectId: string }) {
  const [request, setRequest] = useState<TestRequest>({
    method: "GET",
    url: "https://api.example.com/users",
    headers: { "Content-Type": "application/json" },
    body: "",
  })
  const [response, setResponse] = useState<TestResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [aiInsights, setAIInsights] = useState<AIInsight[]>([])
  const [activeTab, setActiveTab] = useState("request")

  const handleSendRequest = async () => {
    setIsLoading(true)

    setTimeout(() => {
      const mockResponse: TestResponse = {
        status: 200,
        statusText: "OK",
        headers: {
          "content-type": "application/json",
          "cache-control": "max-age=300",
          "x-ratelimit-remaining": "99",
          "x-response-time": "245ms",
        },
        body: JSON.stringify(
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
        duration: 245,
        size: 1024,
        timestamp: new Date().toISOString(),
      }

      const mockInsights: AIInsight[] = [
        {
          type: "performance",
          severity: "medium",
          title: "Response Time Analysis",
          description: "Response time of 245ms is acceptable but could be optimized",
          suggestion: "Consider implementing caching or database query optimization",
          confidence: 87,
        },
        {
          type: "security",
          severity: "low",
          title: "Security Headers",
          description: "Missing security headers like X-Frame-Options and CSP",
          suggestion: "Add security headers to prevent common attacks",
          confidence: 92,
        },
        {
          type: "reliability",
          severity: "high",
          title: "Rate Limiting",
          description: "Good rate limiting implementation detected",
          suggestion: "Monitor rate limit usage and implement graceful degradation",
          confidence: 95,
        },
      ]

      setResponse(mockResponse)
      setAIInsights(mockInsights)
      setIsLoading(false)
    }, 1500)
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "performance":
        return <Zap className="h-4 w-4" />
      case "security":
        return <AlertTriangle className="h-4 w-4" />
      case "reliability":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Brain className="h-4 w-4" />
    }
  }

  const getInsightColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-red-500 bg-red-500/10"
      case "high":
        return "text-orange-500 bg-orange-500/10"
      case "medium":
        return "text-yellow-500 bg-yellow-500/10"
      case "low":
        return "text-blue-500 bg-blue-500/10"
      default:
        return "text-gray-500 bg-gray-500/10"
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-primary" />
            <span>AI-Powered API Tester</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Request Configuration */}
          <div className="flex space-x-2">
            <Select value={request.method} onValueChange={(value) => setRequest({ ...request, method: value })}>
              <SelectTrigger className="w-24">
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
            <Input
              placeholder="Enter API URL..."
              value={request.url}
              onChange={(e) => setRequest({ ...request, url: e.target.value })}
              className="flex-1"
            />
            <Button onClick={handleSendRequest} disabled={isLoading} className="bg-primary hover:bg-primary/90">
              {isLoading ? <Clock className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
              {isLoading ? "Testing..." : "Send"}
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="request">Request</TabsTrigger>
              <TabsTrigger value="response">Response</TabsTrigger>
              <TabsTrigger value="insights">AI Insights</TabsTrigger>
            </TabsList>

            <TabsContent value="request" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Headers</label>
                  <Textarea
                    placeholder="Content-Type: application/json&#10;Authorization: Bearer token"
                    value={Object.entries(request.headers)
                      .map(([k, v]) => `${k}: ${v}`)
                      .join("\n")}
                    onChange={(e) => {
                      const headers: Record<string, string> = {}
                      e.target.value.split("\n").forEach((line) => {
                        const [key, ...valueParts] = line.split(":")
                        if (key && valueParts.length) {
                          headers[key.trim()] = valueParts.join(":").trim()
                        }
                      })
                      setRequest({ ...request, headers })
                    }}
                    className="min-h-20"
                  />
                </div>
                {(request.method === "POST" || request.method === "PUT" || request.method === "PATCH") && (
                  <div>
                    <label className="text-sm font-medium mb-2 block">Request Body</label>
                    <Textarea
                      placeholder="Enter JSON payload..."
                      value={request.body}
                      onChange={(e) => setRequest({ ...request, body: e.target.value })}
                      className="min-h-32 font-mono"
                    />
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="response" className="space-y-4">
              {response ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Badge variant={response.status < 300 ? "default" : "destructive"}>
                        {response.status} {response.statusText}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{response.duration}ms</span>
                      <span className="text-sm text-muted-foreground">{response.size} bytes</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Copy className="mr-2 h-4 w-4" />
                        Copy
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Export
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Response Headers</label>
                      <ScrollArea className="h-24 w-full rounded border bg-muted/50 p-3">
                        <pre className="text-xs font-mono">
                          {Object.entries(response.headers).map(([key, value]) => (
                            <div key={key}>
                              {key}: {value}
                            </div>
                          ))}
                        </pre>
                      </ScrollArea>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Response Body</label>
                      <ScrollArea className="h-64 w-full rounded border bg-muted/50 p-3">
                        <pre className="text-xs font-mono whitespace-pre-wrap">{response.body}</pre>
                      </ScrollArea>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Send a request to see the response</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="insights" className="space-y-4">
              {aiInsights.length > 0 ? (
                <div className="space-y-3">
                  {aiInsights.map((insight, index) => (
                    <Card key={index} className={`border-l-4 ${getInsightColor(insight.severity)}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center ${getInsightColor(insight.severity)}`}
                          >
                            {getInsightIcon(insight.type)}
                          </div>
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">{insight.title}</h4>
                              <Badge variant="outline" className="text-xs">
                                {insight.confidence}% confidence
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{insight.description}</p>
                            <div className="bg-muted/50 rounded p-2">
                              <p className="text-xs font-medium text-green-600">💡 Suggestion:</p>
                              <p className="text-xs text-muted-foreground mt-1">{insight.suggestion}</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>AI insights will appear after testing your API</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

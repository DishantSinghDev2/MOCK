"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, Play, Pause, Share, Zap, Brain, Target } from "lucide-react"
import { realtimeCollab } from "@/lib/realtime-collab"
import { predictiveAI } from "@/lib/predictive-ai"

export function LiveMultiplayerSession({ projectId }: { projectId: string }) {
  const [session, setSession] = useState<MultiplayerSession | null>(null)
  const [participants, setParticipants] = useState<Participant[]>([])
  const [isActive, setIsActive] = useState(false)
  const [predictions, setPredictions] = useState<any[]>([])

  useEffect(() => {
    initializeSession()
  }, [projectId])

  const initializeSession = async () => {
    const newSession: MultiplayerSession = {
      id: `session-${projectId}-${Date.now()}`,
      projectId,
      name: "Live API Testing Session",
      participants: [
        {
          id: "user-1",
          name: "You",
          avatar: "/placeholder.svg?height=32&width=32",
          role: "host",
          status: "active",
          cursor: { endpoint: "/api/users", action: "testing" },
          contributions: { testsRun: 0, issuesFound: 0, suggestionsGiven: 0 },
        },
        {
          id: "user-2",
          name: "Sarah Wilson",
          avatar: "/placeholder.svg?height=32&width=32",
          role: "tester",
          status: "active",
          cursor: { endpoint: "/api/auth", action: "analyzing" },
          contributions: { testsRun: 12, issuesFound: 3, suggestionsGiven: 7 },
        },
        {
          id: "user-3",
          name: "Mike Chen",
          avatar: "/placeholder.svg?height=32&width=32",
          role: "observer",
          status: "idle",
          cursor: { endpoint: "/api/products", action: "reviewing" },
          contributions: { testsRun: 5, issuesFound: 1, suggestionsGiven: 2 },
        },
      ],
      sharedState: {
        currentEndpoint: "/api/users",
        testResults: [],
        discoveries: [],
        collaborativeNotes: [],
      },
      aiInsights: {
        predictedIssues: [],
        suggestedTests: [],
        performancePredictions: [],
      },
      startedAt: new Date(),
      isActive: true,
    }

    setSession(newSession)
    setParticipants(newSession.participants)

    // Start AI predictions
    const insights = await predictiveAI.analyzePredictivePatterns(projectId)
    setPredictions(insights.predictions)
  }

  const startCollaborativeTesting = async () => {
    if (!session) return

    setIsActive(true)

    const collabSession = await realtimeCollab.startCollabSession(projectId, "user-1")

    // Simulate real-time testing activity
    const interval = setInterval(() => {
      // Update participant activities
      setParticipants((prev) =>
        prev.map((p) => ({
          ...p,
          cursor: {
            endpoint: `/api/${["users", "auth", "products", "orders"][Math.floor(Math.random() * 4)]}`,
            action: ["testing", "analyzing", "reviewing", "debugging"][Math.floor(Math.random() * 4)],
          },
          contributions: {
            ...p.contributions,
            testsRun: p.contributions.testsRun + Math.floor(Math.random() * 3),
            issuesFound: p.contributions.issuesFound + (Math.random() > 0.8 ? 1 : 0),
            suggestionsGiven: p.contributions.suggestionsGiven + (Math.random() > 0.7 ? 1 : 0),
          },
        })),
      )

      // Add collaborative discoveries
      if (Math.random() > 0.6) {
        const discoveries = [
          "Authentication endpoint shows 2s latency under load",
          "User creation API missing validation for email format",
          "Product search returns inconsistent pagination",
          "Order status updates not real-time",
        ]

        const newDiscovery = discoveries[Math.floor(Math.random() * discoveries.length)]
        setSession((prev) =>
          prev
            ? {
                ...prev,
                sharedState: {
                  ...prev.sharedState,
                  discoveries: [
                    ...prev.sharedState.discoveries.slice(-4),
                    {
                      id: `discovery-${Date.now()}`,
                      message: newDiscovery,
                      discoveredBy: participants[Math.floor(Math.random() * participants.length)].name,
                      timestamp: new Date(),
                      severity: Math.random() > 0.7 ? "high" : "medium",
                    },
                  ],
                },
              }
            : null,
        )
      }
    }, 3000)

    // Cleanup
    setTimeout(() => {
      clearInterval(interval)
      setIsActive(false)
    }, 30000)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "idle":
        return "bg-yellow-500"
      case "offline":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "host":
        return "bg-purple-100 text-purple-800"
      case "tester":
        return "bg-blue-100 text-blue-800"
      case "observer":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (!session) return <div>Loading multiplayer session...</div>

  return (
    <div className="space-y-6">
      {/* Session Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                {session.name}
                <Badge variant="outline" className="ml-2">
                  {participants.length} participants
                </Badge>
              </CardTitle>
              <CardDescription>Collaborative real-time API testing with AI assistance</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={startCollaborativeTesting}
                disabled={isActive}
                className="bg-primary hover:bg-primary/90"
              >
                {isActive ? (
                  <>
                    <Pause className="h-4 w-4 mr-2" />
                    Testing Active
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Start Testing
                  </>
                )}
              </Button>
              <Button variant="outline" size="sm">
                <Share className="h-4 w-4 mr-2" />
                Invite
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Participants Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Active Participants</CardTitle>
            <CardDescription>Real-time collaboration status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {participants.map((participant) => (
              <div key={participant.id} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={participant.avatar || "/placeholder.svg"} alt={participant.name} />
                      <AvatarFallback className="text-xs">
                        {participant.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(participant.status)}`}
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{participant.name}</span>
                      <Badge className={getRoleColor(participant.role)} variant="outline">
                        {participant.role}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {participant.cursor.action} {participant.cursor.endpoint}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">
                    {participant.contributions.testsRun} tests • {participant.contributions.issuesFound} issues
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* AI Predictions Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              AI Predictions
            </CardTitle>
            <CardDescription>Real-time predictive insights</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {predictions.slice(0, 3).map((prediction, index) => (
              <div key={index} className="p-3 rounded-lg border bg-accent/5">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-primary" />
                    <span className="font-medium text-sm">{prediction.type}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {Math.round(prediction.likelihood * 100)}% likely
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{prediction.description}</p>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {prediction.timeframe}
                  </Badge>
                  <Badge variant={prediction.impact === "critical" ? "destructive" : "secondary"} className="text-xs">
                    {prediction.impact} impact
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Collaborative Discoveries */}
      {session.sharedState.discoveries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-accent" />
              Live Discoveries
            </CardTitle>
            <CardDescription>Real-time findings from collaborative testing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {session.sharedState.discoveries.map((discovery) => (
              <div key={discovery.id} className="flex items-start gap-3 p-3 rounded-lg border">
                <div
                  className={`w-2 h-2 rounded-full mt-2 ${discovery.severity === "high" ? "bg-red-500" : "bg-yellow-500"}`}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium">{discovery.message}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">Found by {discovery.discoveredBy}</span>
                    <span className="text-xs text-muted-foreground">{discovery.timestamp.toLocaleTimeString()}</span>
                    <Badge variant={discovery.severity === "high" ? "destructive" : "secondary"} className="text-xs">
                      {discovery.severity}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Type definitions
interface MultiplayerSession {
  id: string
  projectId: string
  name: string
  participants: Participant[]
  sharedState: SharedState
  aiInsights: AIInsights
  startedAt: Date
  isActive: boolean
}

interface Participant {
  id: string
  name: string
  avatar: string
  role: "host" | "tester" | "observer"
  status: "active" | "idle" | "offline"
  cursor: {
    endpoint: string
    action: string
  }
  contributions: {
    testsRun: number
    issuesFound: number
    suggestionsGiven: number
  }
}

interface SharedState {
  currentEndpoint: string
  testResults: any[]
  discoveries: Discovery[]
  collaborativeNotes: any[]
}

interface Discovery {
  id: string
  message: string
  discoveredBy: string
  timestamp: Date
  severity: "low" | "medium" | "high"
}

interface AIInsights {
  predictedIssues: any[]
  suggestedTests: any[]
  performancePredictions: any[]
}

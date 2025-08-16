"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  ChevronDown,
  ChevronRight,
  Play,
  CheckCircle,
  XCircle,
  Clock,
  Zap,
  Brain,
  Search,
  FileText,
  TestTube,
  Activity,
  AlertTriangle,
} from "lucide-react"
import type { Job } from "@/lib/job-queue"

interface JobStep {
  id: string
  name: string
  description: string
  status: "pending" | "running" | "completed" | "failed"
  progress: number
  startedAt?: Date
  completedAt?: Date
  logs: LogEntry[]
  outputs?: any
  error?: string
}

interface LogEntry {
  timestamp: Date
  level: "info" | "warn" | "error" | "debug"
  message: string
  data?: any
}

interface JobProgressDetailProps {
  job: Job
  onClose?: () => void
}

export function JobProgressDetail({ job, onClose }: JobProgressDetailProps) {
  const [steps, setSteps] = useState<JobStep[]>([])
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set())
  const [autoScroll, setAutoScroll] = useState(true)

  useEffect(() => {
    // Initialize steps based on job type
    initializeSteps()

    // Set up real-time updates
    const interval = setInterval(() => {
      updateJobProgress()
    }, 1000)

    return () => clearInterval(interval)
  }, [job.id])

  const initializeSteps = () => {
    let jobSteps: JobStep[] = []

    switch (job.type) {
      case "api_discovery":
        jobSteps = [
          {
            id: "analyze_url",
            name: "Analyzing URL",
            description: "Examining the provided URL and determining the best discovery approach",
            status: "pending",
            progress: 0,
            logs: [],
          },
          {
            id: "crawl_endpoints",
            name: "Discovering Endpoints",
            description: "AI is crawling and discovering API endpoints",
            status: "pending",
            progress: 0,
            logs: [],
          },
          {
            id: "infer_schemas",
            name: "Inferring Schemas",
            description: "Analyzing endpoint responses to infer data schemas",
            status: "pending",
            progress: 0,
            logs: [],
          },
          {
            id: "generate_mocks",
            name: "Generating Mocks",
            description: "Creating realistic mock data based on inferred schemas",
            status: "pending",
            progress: 0,
            logs: [],
          },
          {
            id: "validate_mocks",
            name: "Validating Mocks",
            description: "Testing generated mocks for accuracy and completeness",
            status: "pending",
            progress: 0,
            logs: [],
          },
        ]
        break

      case "test_generation":
        jobSteps = [
          {
            id: "analyze_api",
            name: "Analyzing API",
            description: "Understanding API structure and endpoints",
            status: "pending",
            progress: 0,
            logs: [],
          },
          {
            id: "generate_test_cases",
            name: "Generating Test Cases",
            description: "AI is creating comprehensive test scenarios",
            status: "pending",
            progress: 0,
            logs: [],
          },
          {
            id: "create_test_data",
            name: "Creating Test Data",
            description: "Generating realistic test data for each scenario",
            status: "pending",
            progress: 0,
            logs: [],
          },
          {
            id: "validate_tests",
            name: "Validating Tests",
            description: "Running initial validation on generated tests",
            status: "pending",
            progress: 0,
            logs: [],
          },
        ]
        break

      case "performance_test":
        jobSteps = [
          {
            id: "setup_environment",
            name: "Setting Up Environment",
            description: "Preparing performance testing environment",
            status: "pending",
            progress: 0,
            logs: [],
          },
          {
            id: "load_testing",
            name: "Load Testing",
            description: "Running load tests with increasing concurrent users",
            status: "pending",
            progress: 0,
            logs: [],
          },
          {
            id: "stress_testing",
            name: "Stress Testing",
            description: "Testing system limits and breaking points",
            status: "pending",
            progress: 0,
            logs: [],
          },
          {
            id: "analyze_results",
            name: "Analyzing Results",
            description: "AI is analyzing performance metrics and generating insights",
            status: "pending",
            progress: 0,
            logs: [],
          },
        ]
        break

      default:
        jobSteps = [
          {
            id: "processing",
            name: "Processing",
            description: "Executing job tasks",
            status: "pending",
            progress: 0,
            logs: [],
          },
        ]
    }

    setSteps(jobSteps)

    // Auto-expand the first step
    if (jobSteps.length > 0) {
      setExpandedSteps(new Set([jobSteps[0].id]))
    }
  }

  const updateJobProgress = () => {
    // Simulate real-time progress updates
    setSteps((prevSteps) => {
      const updatedSteps = [...prevSteps]
      const currentStepIndex = updatedSteps.findIndex((step) => step.status === "running")

      if (currentStepIndex === -1) {
        // Start first pending step
        const firstPendingIndex = updatedSteps.findIndex((step) => step.status === "pending")
        if (firstPendingIndex !== -1 && job.status === "running") {
          updatedSteps[firstPendingIndex] = {
            ...updatedSteps[firstPendingIndex],
            status: "running",
            startedAt: new Date(),
            logs: [
              ...updatedSteps[firstPendingIndex].logs,
              {
                timestamp: new Date(),
                level: "info",
                message: `Started ${updatedSteps[firstPendingIndex].name.toLowerCase()}...`,
              },
            ],
          }

          // Auto-expand the running step
          setExpandedSteps((prev) => new Set([...prev, updatedSteps[firstPendingIndex].id]))
        }
      } else {
        // Update current running step
        const currentStep = updatedSteps[currentStepIndex]
        const newProgress = Math.min(currentStep.progress + Math.random() * 15, 100)

        // Add realistic log messages
        const logMessages = getRealisticLogMessages(currentStep.id, newProgress)
        const newLogs = logMessages.map((msg) => ({
          timestamp: new Date(),
          level: "info" as const,
          message: msg,
        }))

        updatedSteps[currentStepIndex] = {
          ...currentStep,
          progress: newProgress,
          logs: [...currentStep.logs, ...newLogs],
        }

        // Complete step if progress reaches 100%
        if (newProgress >= 100) {
          updatedSteps[currentStepIndex] = {
            ...updatedSteps[currentStepIndex],
            status: "completed",
            completedAt: new Date(),
            logs: [
              ...updatedSteps[currentStepIndex].logs,
              {
                timestamp: new Date(),
                level: "info",
                message: `✅ ${currentStep.name} completed successfully`,
              },
            ],
          }

          // Start next step
          if (currentStepIndex + 1 < updatedSteps.length) {
            updatedSteps[currentStepIndex + 1] = {
              ...updatedSteps[currentStepIndex + 1],
              status: "running",
              startedAt: new Date(),
              logs: [
                {
                  timestamp: new Date(),
                  level: "info",
                  message: `Started ${updatedSteps[currentStepIndex + 1].name.toLowerCase()}...`,
                },
              ],
            }

            // Auto-expand next step
            setExpandedSteps((prev) => new Set([...prev, updatedSteps[currentStepIndex + 1].id]))
          }
        }
      }

      return updatedSteps
    })
  }

  const getRealisticLogMessages = (stepId: string, progress: number): string[] => {
    const messages: string[] = []

    switch (stepId) {
      case "analyze_url":
        if (progress > 20 && progress < 30) messages.push("🔍 Parsing URL structure...")
        if (progress > 50 && progress < 60) messages.push("🌐 Checking API documentation...")
        if (progress > 80 && progress < 90) messages.push("📋 Identifying authentication requirements...")
        break

      case "crawl_endpoints":
        if (progress > 10 && progress < 20) messages.push("🕷️ Starting endpoint discovery...")
        if (progress > 30 && progress < 40) messages.push("📡 Found 12 potential endpoints")
        if (progress > 60 && progress < 70) messages.push("🔗 Analyzing endpoint relationships...")
        if (progress > 85 && progress < 95) messages.push("✨ Discovered 18 unique endpoints")
        break

      case "infer_schemas":
        if (progress > 15 && progress < 25) messages.push("🧠 AI analyzing response patterns...")
        if (progress > 45 && progress < 55) messages.push("📊 Inferring data types and structures...")
        if (progress > 75 && progress < 85) messages.push("🔍 Validating schema consistency...")
        break

      case "generate_mocks":
        if (progress > 20 && progress < 30) messages.push("🎭 Generating realistic mock data...")
        if (progress > 50 && progress < 60) messages.push("🎲 Creating diverse data scenarios...")
        if (progress > 80 && progress < 90) messages.push("✅ Generated 156 mock responses")
        break

      case "generate_test_cases":
        if (progress > 25 && progress < 35) messages.push("🧪 AI creating test scenarios...")
        if (progress > 55 && progress < 65) messages.push("🎯 Generating edge case tests...")
        if (progress > 85 && progress < 95) messages.push("📝 Created 47 comprehensive test cases")
        break
    }

    return messages
  }

  const getStepIcon = (stepId: string) => {
    switch (stepId) {
      case "analyze_url":
      case "analyze_api":
        return <Search className="h-4 w-4" />
      case "crawl_endpoints":
        return <Activity className="h-4 w-4" />
      case "infer_schemas":
      case "analyze_results":
        return <Brain className="h-4 w-4" />
      case "generate_mocks":
      case "create_test_data":
        return <FileText className="h-4 w-4" />
      case "generate_test_cases":
      case "validate_tests":
      case "validate_mocks":
        return <TestTube className="h-4 w-4" />
      default:
        return <Zap className="h-4 w-4" />
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-gray-500" />
      case "running":
        return <Play className="h-4 w-4 text-blue-500 animate-pulse" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
    }
  }

  const toggleStepExpansion = (stepId: string) => {
    setExpandedSteps((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(stepId)) {
        newSet.delete(stepId)
      } else {
        newSet.add(stepId)
      }
      return newSet
    })
  }

  const formatDuration = (start?: Date, end?: Date) => {
    if (!start) return "Not started"
    const endTime = end || new Date()
    const duration = endTime.getTime() - start.getTime()
    const seconds = Math.floor(duration / 1000)
    const minutes = Math.floor(seconds / 60)

    if (minutes > 0) return `${minutes}m ${seconds % 60}s`
    return `${seconds}s`
  }

  const getLogLevelColor = (level: string) => {
    switch (level) {
      case "error":
        return "text-red-600"
      case "warn":
        return "text-yellow-600"
      case "debug":
        return "text-gray-500"
      default:
        return "text-gray-700"
    }
  }

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {getStepIcon(job.type)}
            Job Progress: {job.type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
          </CardTitle>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              ✕
            </Button>
          )}
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>Job ID: {job.id}</span>
          <Badge className={job.status === "running" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"}>
            {job.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Overall Progress</span>
            <span>{job.progress}%</span>
          </div>
          <Progress value={job.progress} className="h-3" />
        </div>

        {/* Step Details */}
        <ScrollArea className="h-[500px]">
          <div className="space-y-3">
            {steps.map((step, index) => (
              <Card
                key={step.id}
                className={`border ${step.status === "running" ? "border-blue-300 bg-blue-50/30" : ""}`}
              >
                <Collapsible open={expandedSteps.has(step.id)} onOpenChange={() => toggleStepExpansion(step.id)}>
                  <CollapsibleTrigger asChild>
                    <CardHeader className="pb-3 cursor-pointer hover:bg-gray-50/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            {expandedSteps.has(step.id) ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                            {getStatusIcon(step.status)}
                            {getStepIcon(step.id)}
                          </div>
                          <div>
                            <div className="font-medium">{step.name}</div>
                            <div className="text-sm text-muted-foreground">{step.description}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          {step.status === "running" && (
                            <div className="text-sm text-blue-600 font-medium">{step.progress}%</div>
                          )}
                          <div className="text-xs text-muted-foreground">
                            {formatDuration(step.startedAt, step.completedAt)}
                          </div>
                        </div>
                      </div>

                      {step.status === "running" && <Progress value={step.progress} className="h-2 mt-2" />}
                    </CardHeader>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <CardContent className="pt-0">
                      {/* Step Logs */}
                      <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-400">Live Logs</span>
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${step.status === "running" ? "bg-green-400 animate-pulse" : "bg-gray-400"}`}
                            />
                            <span className="text-gray-400 text-xs">{step.logs.length} entries</span>
                          </div>
                        </div>

                        <ScrollArea className="h-32">
                          <div className="space-y-1">
                            {step.logs.length === 0 ? (
                              <div className="text-gray-500 italic">No logs yet...</div>
                            ) : (
                              step.logs.map((log, logIndex) => (
                                <div key={logIndex} className="flex gap-2 text-xs">
                                  <span className="text-gray-500 shrink-0">{log.timestamp.toLocaleTimeString()}</span>
                                  <span className={getLogLevelColor(log.level)}>[{log.level.toUpperCase()}]</span>
                                  <span className="text-gray-300">{log.message}</span>
                                </div>
                              ))
                            )}
                          </div>
                        </ScrollArea>
                      </div>

                      {/* Step Outputs */}
                      {step.outputs && (
                        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div className="text-sm font-medium text-green-800 mb-1">Outputs</div>
                          <pre className="text-xs text-green-700 overflow-x-auto">
                            {JSON.stringify(step.outputs, null, 2)}
                          </pre>
                        </div>
                      )}

                      {/* Step Error */}
                      {step.error && (
                        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <div className="text-sm font-medium text-red-800 mb-1">Error</div>
                          <div className="text-sm text-red-700">{step.error}</div>
                        </div>
                      )}
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

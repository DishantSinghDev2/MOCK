"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Play, Square, Clock, CheckCircle, XCircle, AlertCircle, Zap, MoreHorizontal, Activity } from "lucide-react"
import { jobQueue, type Job } from "@/lib/job-queue"
import { aiAgent } from "@/lib/ai-agent"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { JobProgressDetail } from "./job-progress-detail"

export function JobQueuePanel() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [queueStats, setQueueStats] = useState<any>({})
  const [deadLetterJobs, setDeadLetterJobs] = useState<Job[]>([])
  const [healthMetrics, setHealthMetrics] = useState<any>({})
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null)

  useEffect(() => {
    // Load initial data
    loadJobs()
    loadQueueStats()
    loadDeadLetterQueue()
    loadHealthMetrics()

    // Listen for job updates and alerts
    const handleJobUpdate = (event: CustomEvent) => {
      loadJobs()
      loadQueueStats()
    }

    const handleSystemAlert = (event: CustomEvent) => {
      console.warn("[v0] System Alert:", event.detail)
      // Could show toast notification here
    }

    window.addEventListener("jobUpdate", handleJobUpdate as EventListener)
    window.addEventListener("systemAlert", handleSystemAlert as EventListener)

    // Refresh every 5 seconds
    const interval = setInterval(() => {
      loadJobs()
      loadQueueStats()
      loadDeadLetterQueue()
      loadHealthMetrics()
    }, 5000)

    return () => {
      window.removeEventListener("jobUpdate", handleJobUpdate as EventListener)
      window.removeEventListener("systemAlert", handleSystemAlert as EventListener)
      clearInterval(interval)
    }
  }, [])

  const loadJobs = async () => {
    const userId = "current-user" // Get from auth context
    const userJobs = await jobQueue.getUserJobs(userId)
    setJobs(userJobs.slice(0, 20)) // Show last 20 jobs
  }

  const loadQueueStats = () => {
    const stats = jobQueue.getQueueStats()
    setQueueStats(stats)
  }

  const loadDeadLetterQueue = () => {
    const dlq = jobQueue.getDeadLetterQueue()
    setDeadLetterJobs(dlq.jobs.slice(0, 10)) // Show last 10 failed jobs
  }

  const loadHealthMetrics = async () => {
    const aiHealth = await aiAgent.getHealthMetrics()
    setHealthMetrics({
      ai: aiHealth,
      jobQueue: {
        totalQueues: Object.keys(queueStats).length,
        healthyQueues: Object.values(queueStats).filter((stats: any) => stats.running < stats.maxConcurrent).length,
      },
    })
  }

  const handleCancelJob = async (jobId: string) => {
    await jobQueue.cancelJob(jobId)
    loadJobs()
  }

  const handleRetryDeadLetterJob = async (jobId: string) => {
    const success = await jobQueue.retryDeadLetterJob(jobId)
    if (success) {
      loadDeadLetterQueue()
      loadJobs()
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "running":
        return <Play className="h-4 w-4 text-blue-500" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "cancelled":
        return <Square className="h-4 w-4 text-gray-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/10 text-yellow-700 border-yellow-500/20"
      case "running":
        return "bg-blue-500/10 text-blue-700 border-blue-500/20"
      case "completed":
        return "bg-green-500/10 text-green-700 border-green-500/20"
      case "failed":
        return "bg-red-500/10 text-red-700 border-red-500/20"
      case "cancelled":
        return "bg-gray-500/10 text-gray-700 border-gray-500/20"
      default:
        return "bg-gray-500/10 text-gray-700 border-gray-500/20"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500/10 text-red-700 border-red-500/20"
      case "high":
        return "bg-orange-500/10 text-orange-700 border-orange-500/20"
      case "medium":
        return "bg-blue-500/10 text-blue-700 border-blue-500/20"
      case "low":
        return "bg-gray-500/10 text-gray-700 border-gray-500/20"
      default:
        return "bg-gray-500/10 text-gray-700 border-gray-500/20"
    }
  }

  const formatJobType = (type: string) => {
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)

    if (hours > 0) return `${hours}h ${minutes % 60}m`
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`
    return `${seconds}s`
  }

  const selectedJob = jobs.find((job) => job.id === selectedJobId)

  return (
    <div className="space-y-6">
      {/* Show detailed progress if job is selected */}
      {selectedJob && <JobProgressDetail job={selectedJob} onClose={() => setSelectedJobId(null)} />}

      {/* Health Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            System Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{healthMetrics.ai?.successfulTasks || 0}</div>
              <div className="text-sm text-muted-foreground">AI Tasks Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(healthMetrics.ai?.averageExecutionTime || 0)}ms
              </div>
              <div className="text-sm text-muted-foreground">Avg Execution Time</div>
            </div>
            <div className="text-center">
              <div
                className={`text-2xl font-bold ${healthMetrics.ai?.circuitBreakerState === "CLOSED" ? "text-green-600" : "text-red-600"}`}
              >
                {healthMetrics.ai?.circuitBreakerState || "UNKNOWN"}
              </div>
              <div className="text-sm text-muted-foreground">Circuit Breaker</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{deadLetterJobs.length}</div>
              <div className="text-sm text-muted-foreground">Failed Jobs</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Queue Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {Object.entries(queueStats).map(([type, stats]: [string, any]) => (
          <Card key={type}>
            <CardContent className="p-4">
              <div className="text-sm font-medium text-muted-foreground mb-1">{formatJobType(type)}</div>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{stats.running + stats.pending}</div>
                <Zap className="h-4 w-4 text-primary" />
              </div>
              <div className="text-xs text-muted-foreground">
                {stats.running} running, {stats.pending} pending
              </div>
              {/* Health indicator */}
              <div
                className={`mt-1 h-1 w-full rounded ${stats.running < stats.maxConcurrent ? "bg-green-500" : "bg-red-500"}`}
              />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dead Letter Queue */}
      {deadLetterJobs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <XCircle className="h-5 w-5" />
              Failed Jobs (Dead Letter Queue)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {deadLetterJobs.map((job) => (
                <div key={job.id} className="border border-red-200 rounded-lg p-3 bg-red-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-red-800">{formatJobType(job.type)}</div>
                      <div className="text-sm text-red-600">{job.error}</div>
                      <div className="text-xs text-red-500">{job.id}</div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRetryDeadLetterJob(job.id)}
                      className="border-red-300 text-red-700 hover:bg-red-100"
                    >
                      Retry
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Job List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Recent Jobs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              {jobs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No jobs found. Start by creating a project and running some tests!
                </div>
              ) : (
                jobs.map((job) => (
                  <div key={job.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(job.status)}
                        <div>
                          <div className="font-medium">{formatJobType(job.type)}</div>
                          <div className="text-sm text-muted-foreground">{job.id}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge className={getPriorityColor(job.priority)}>{job.priority}</Badge>
                        <Badge className={getStatusColor(job.status)}>{job.status}</Badge>

                        {job.status === "running" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedJobId(job.id)}
                            className="text-blue-600 border-blue-300 hover:bg-blue-50"
                          >
                            View Progress
                          </Button>
                        )}

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            {(job.status === "pending" || job.status === "running") && (
                              <DropdownMenuItem onClick={() => handleCancelJob(job.id)} className="text-red-600">
                                Cancel Job
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => setSelectedJobId(job.id)}>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Clone Job</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    {job.status === "running" && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{job.progress}%</span>
                        </div>
                        <Progress value={job.progress} className="h-2" />
                        <div className="text-xs text-blue-600 font-medium">
                          🔄 Currently: AI analyzing endpoint responses...
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div>Created: {job.createdAt.toLocaleString()}</div>
                      {job.completedAt && <div>Duration: {formatDuration(job.actualDuration || 0)}</div>}
                      {job.status === "running" && job.startedAt && (
                        <div>Running: {formatDuration(Date.now() - job.startedAt.getTime())}</div>
                      )}
                    </div>

                    {job.error && (
                      <div className="bg-red-50 border border-red-200 rounded p-3">
                        <div className="text-sm text-red-800">
                          <strong>Error:</strong> {job.error}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}

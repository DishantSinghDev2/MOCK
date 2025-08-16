import { CircuitBreaker } from "./circuit-breaker"
import { RateLimiter } from "./rate-limiter"
import type { Worker } from "./worker"

interface Job {
  id: string
  type:
    | "api_discovery"
    | "mock_generation"
    | "test_execution"
    | "performance_test"
    | "security_scan"
    | "integration_test"
  status: "pending" | "running" | "completed" | "failed" | "cancelled"
  priority: "low" | "medium" | "high" | "urgent"
  userId: string
  projectId: string
  data: any
  progress: number
  result?: any
  error?: string
  createdAt: Date
  startedAt?: Date
  completedAt?: Date
  estimatedDuration: number
  actualDuration?: number
}

interface JobQueue {
  jobs: Job[]
  running: Map<string, Job>
  maxConcurrent: number
}

interface DeadLetterQueue {
  jobs: Job[]
  maxRetries: number
}

class JobQueueManager {
  private queues: Map<string, JobQueue> = new Map()
  private workers: Map<string, Worker> = new Map()
  private deadLetterQueue: DeadLetterQueue = { jobs: [], maxRetries: 3 }
  private circuitBreakers = new Map<string, CircuitBreaker>()
  private rateLimiters = new Map<string, RateLimiter>()
  private isShuttingDown = false
  private healthChecks = new Map<string, () => Promise<boolean>>()

  constructor() {
    this.initializeQueues()
    this.initializeCircuitBreakers()
    this.initializeRateLimiters()
    this.startWorkers()
    this.startHealthChecks()
    this.setupGracefulShutdown()
  }

  private initializeQueues() {
    const queueTypes = [
      "api_discovery",
      "mock_generation",
      "test_execution",
      "performance_test",
      "security_scan",
      "integration_test",
    ]

    queueTypes.forEach((type) => {
      this.queues.set(type, {
        jobs: [],
        running: new Map(),
        maxConcurrent: this.getMaxConcurrentForType(type),
      })
    })
  }

  private getMaxConcurrentForType(type: string): number {
    const limits = {
      api_discovery: 3,
      mock_generation: 5,
      test_execution: 10,
      performance_test: 2,
      security_scan: 1,
      integration_test: 3,
    }
    return limits[type as keyof typeof limits] || 1
  }

  private initializeCircuitBreakers() {
    const queueTypes = [
      "api_discovery",
      "mock_generation",
      "test_execution",
      "performance_test",
      "security_scan",
      "integration_test",
    ]

    queueTypes.forEach((type) => {
      this.circuitBreakers.set(
        type,
        new CircuitBreaker({
          failureThreshold: 5,
          resetTimeout: 60000, // 1 minute
          monitoringPeriod: 10000, // 10 seconds
        }),
      )
    })
  }

  private initializeRateLimiters() {
    const queueTypes = [
      "api_discovery",
      "mock_generation",
      "test_execution",
      "performance_test",
      "security_scan",
      "integration_test",
    ]

    queueTypes.forEach((type) => {
      this.rateLimiters.set(
        type,
        new RateLimiter({
          windowMs: 60000, // 1 minute
          maxRequests: this.getMaxRequestsForType(type),
          keyGenerator: (userId) => `${userId}:${type}`,
        }),
      )
    })
  }

  private getMaxRequestsForType(type: string): number {
    const limits = {
      api_discovery: 10,
      mock_generation: 20,
      test_execution: 50,
      performance_test: 5,
      security_scan: 3,
      integration_test: 15,
    }
    return limits[type as keyof typeof limits] || 10
  }

  async addJob(job: Omit<Job, "id" | "status" | "progress" | "createdAt">): Promise<string> {
    if (this.isShuttingDown) {
      throw new Error("System is shutting down, cannot accept new jobs")
    }

    const rateLimiter = this.rateLimiters.get(job.type)
    if (rateLimiter) {
      const rateCheck = await rateLimiter.checkLimit(job.userId)
      if (!rateCheck.allowed) {
        throw new Error(
          `Rate limit exceeded. Try again in ${Math.ceil((rateCheck.resetTime - Date.now()) / 1000)} seconds`,
        )
      }
    }

    const circuitBreaker = this.circuitBreakers.get(job.type)
    if (circuitBreaker && circuitBreaker.getState() === "OPEN") {
      throw new Error(`Service temporarily unavailable for ${job.type}. Circuit breaker is open.`)
    }

    const fullJob: Job = {
      ...job,
      id: `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: "pending",
      progress: 0,
      createdAt: new Date(),
    }

    // Check user limits before adding job
    const canAddJob = await this.checkUserLimits(job.userId, job.type)
    if (!canAddJob.allowed) {
      throw new Error(`Job limit exceeded: ${canAddJob.reason}`)
    }

    const queue = this.queues.get(job.type)
    if (!queue) {
      throw new Error(`Unknown job type: ${job.type}`)
    }

    await this.persistJob(fullJob)

    // Insert job based on priority
    this.insertJobByPriority(queue.jobs, fullJob)

    // Try to start job immediately if capacity allows
    this.processQueue(job.type)

    console.log(`[v0] Job ${fullJob.id} added to queue ${job.type}`)
    return fullJob.id
  }

  private insertJobByPriority(jobs: Job[], newJob: Job) {
    const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 }
    const newPriority = priorityOrder[newJob.priority]

    let insertIndex = jobs.length
    for (let i = 0; i < jobs.length; i++) {
      if (priorityOrder[jobs[i].priority] > newPriority) {
        insertIndex = i
        break
      }
    }

    jobs.splice(insertIndex, 0, newJob)
  }

  private async checkUserLimits(userId: string, jobType: string): Promise<{ allowed: boolean; reason?: string }> {
    const userPlan = await this.getUserPlan(userId)
    const currentUsage = await this.getUserCurrentUsage(userId)

    const limits = this.getPlanLimits(userPlan)

    // Check concurrent jobs limit
    if (currentUsage.concurrentJobs >= limits.maxConcurrentJobs) {
      return {
        allowed: false,
        reason: `Maximum concurrent jobs (${limits.maxConcurrentJobs}) reached. Upgrade to increase limit.`,
      }
    }

    // Check monthly job limit
    if (currentUsage.monthlyJobs >= limits.maxMonthlyJobs) {
      return {
        allowed: false,
        reason: `Monthly job limit (${limits.maxMonthlyJobs}) reached. Upgrade to increase limit.`,
      }
    }

    // Check job type specific limits
    const typeLimit = limits.jobTypeLimits[jobType as keyof typeof limits.jobTypeLimits]
    if (typeLimit && currentUsage.jobTypeUsage[jobType] >= typeLimit) {
      return {
        allowed: false,
        reason: `${jobType} job limit (${typeLimit}) reached. Upgrade to increase limit.`,
      }
    }

    return { allowed: true }
  }

  private getPlanLimits(plan: string) {
    const limits = {
      free: {
        maxConcurrentJobs: 2,
        maxMonthlyJobs: 100,
        jobTypeLimits: {
          api_discovery: 10,
          mock_generation: 20,
          test_execution: 50,
          performance_test: 5,
          security_scan: 2,
          integration_test: 10,
        },
      },
      pro: {
        maxConcurrentJobs: 10,
        maxMonthlyJobs: 1000,
        jobTypeLimits: {
          api_discovery: 100,
          mock_generation: 200,
          test_execution: 500,
          performance_test: 50,
          security_scan: 20,
          integration_test: 100,
        },
      },
      enterprise: {
        maxConcurrentJobs: 50,
        maxMonthlyJobs: 10000,
        jobTypeLimits: {
          api_discovery: 1000,
          mock_generation: 2000,
          test_execution: 5000,
          performance_test: 500,
          security_scan: 200,
          integration_test: 1000,
        },
      },
    }

    return limits[plan as keyof typeof limits] || limits.free
  }

  private async getUserPlan(userId: string): Promise<string> {
    // Get from storage or database
    const userData = JSON.parse(localStorage.getItem(`user_${userId}`) || "{}")
    return userData.plan || "free"
  }

  private async getUserCurrentUsage(userId: string): Promise<any> {
    // Calculate current usage from storage
    const usage = JSON.parse(localStorage.getItem(`usage_${userId}`) || "{}")
    return {
      concurrentJobs: this.getCurrentConcurrentJobs(userId),
      monthlyJobs: usage.monthlyJobs || 0,
      jobTypeUsage: usage.jobTypeUsage || {},
    }
  }

  private getCurrentConcurrentJobs(userId: string): number {
    let count = 0
    this.queues.forEach((queue) => {
      queue.running.forEach((job) => {
        if (job.userId === userId) count++
      })
    })
    return count
  }

  private async processQueue(queueType: string) {
    const queue = this.queues.get(queueType)
    if (!queue) return

    while (queue.running.size < queue.maxConcurrent && queue.jobs.length > 0) {
      const job = queue.jobs.shift()!
      queue.running.set(job.id, job)

      job.status = "running"
      job.startedAt = new Date()

      // Start job execution
      this.executeJob(job).then(() => {
        queue.running.delete(job.id)
        this.processQueue(queueType) // Process next job
      })
    }
  }

  private async executeJob(job: Job): Promise<void> {
    const circuitBreaker = this.circuitBreakers.get(job.type)

    try {
      console.log(`[v0] Starting job ${job.id} of type ${job.type}`)

      const result = circuitBreaker
        ? await circuitBreaker.execute(() => this.executeJobWithRetry(job))
        : await this.executeJobWithRetry(job)

      job.status = "completed"
      job.result = result
      job.completedAt = new Date()
      job.actualDuration = job.completedAt.getTime() - (job.startedAt?.getTime() || 0)

      console.log(`[v0] Completed job ${job.id} in ${job.actualDuration}ms`)
      this.emitJobUpdate(job)

      await this.removePersistedJob(job.id)
    } catch (error) {
      await this.handleJobFailure(job, error)
    }
  }

  private async executeJobWithRetry(job: Job): Promise<any> {
    const maxRetries = 3
    let lastError: Error

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        if (attempt > 0) {
          const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000)
          await new Promise((resolve) => setTimeout(resolve, delay))
          console.log(`[v0] Retrying job ${job.id}, attempt ${attempt + 1}`)
        }

        // Simulate job execution with progress updates
        for (let progress = 0; progress <= 100; progress += 10) {
          job.progress = progress
          await new Promise((resolve) => setTimeout(resolve, 100))
          this.emitJobUpdate(job)
        }

        // Execute actual job logic
        return await this.executeJobLogic(job)
      } catch (error) {
        lastError = error as Error
        console.error(`[v0] Job ${job.id} attempt ${attempt + 1} failed:`, error)

        // Don't retry on certain types of errors
        if (this.isNonRetryableError(error)) {
          throw error
        }
      }
    }

    throw lastError!
  }

  private async executeJobLogic(job: Job): Promise<any> {
    switch (job.type) {
      case "api_discovery":
        return this.executeApiDiscovery(job)
      case "mock_generation":
        return this.executeMockGeneration(job)
      case "test_execution":
        return this.executeTestExecution(job)
      case "performance_test":
        return this.executePerformanceTest(job)
      case "security_scan":
        return this.executeSecurityScan(job)
      case "integration_test":
        return this.executeIntegrationTest(job)
      default:
        throw new Error(`Unknown job type: ${job.type}`)
    }
  }

  private async executeApiDiscovery(job: Job): Promise<any> {
    const { url } = job.data

    // Simulate API discovery
    await new Promise((resolve) => setTimeout(resolve, 2000))

    return {
      endpoints: [
        { path: "/api/users", method: "GET", description: "Get all users" },
        { path: "/api/users/:id", method: "GET", description: "Get user by ID" },
        { path: "/api/users", method: "POST", description: "Create new user" },
        { path: "/api/posts", method: "GET", description: "Get all posts" },
        { path: "/api/posts/:id", method: "GET", description: "Get post by ID" },
      ],
      schemas: {
        User: { id: "number", name: "string", email: "string" },
        Post: { id: "number", title: "string", content: "string", userId: "number" },
      },
    }
  }

  private async executeMockGeneration(job: Job): Promise<any> {
    const { endpoints } = job.data

    // Simulate mock generation
    await new Promise((resolve) => setTimeout(resolve, 1500))

    return {
      mockServer: {
        url: `https://mock-${job.projectId}.mock.dishis.tech`,
        endpoints: endpoints.map((ep: any) => ({
          ...ep,
          mockData: this.generateMockData(ep.path),
        })),
      },
    }
  }

  private async executeTestExecution(job: Job): Promise<any> {
    const { testSuite } = job.data

    // Simulate test execution
    await new Promise((resolve) => setTimeout(resolve, 3000))

    return {
      results: {
        total: 25,
        passed: 22,
        failed: 3,
        coverage: 87.5,
        duration: 2847,
        tests: [
          { name: "GET /api/users", status: "passed", duration: 145 },
          { name: "POST /api/users", status: "failed", duration: 234, error: "Validation error" },
          { name: "GET /api/posts", status: "passed", duration: 123 },
        ],
      },
    }
  }

  private async executePerformanceTest(job: Job): Promise<any> {
    await new Promise((resolve) => setTimeout(resolve, 5000))

    return {
      metrics: {
        avgResponseTime: 245,
        maxResponseTime: 1200,
        minResponseTime: 89,
        throughput: 150,
        errorRate: 2.3,
        p95ResponseTime: 450,
      },
    }
  }

  private async executeSecurityScan(job: Job): Promise<any> {
    await new Promise((resolve) => setTimeout(resolve, 4000))

    return {
      vulnerabilities: [
        { severity: "high", type: "SQL Injection", endpoint: "/api/users" },
        { severity: "medium", type: "XSS", endpoint: "/api/posts" },
      ],
      score: 7.5,
    }
  }

  private async executeIntegrationTest(job: Job): Promise<any> {
    await new Promise((resolve) => setTimeout(resolve, 2500))

    return {
      integrations: [
        { name: "Database", status: "connected", latency: 45 },
        { name: "Redis", status: "connected", latency: 12 },
        { name: "External API", status: "failed", error: "Timeout" },
      ],
    }
  }

  private generateMockData(path: string): any {
    if (path.includes("users")) {
      return [
        { id: 1, name: "John Doe", email: "john@example.com" },
        { id: 2, name: "Jane Smith", email: "jane@example.com" },
      ]
    }
    if (path.includes("posts")) {
      return [
        { id: 1, title: "Hello World", content: "First post", userId: 1 },
        { id: 2, title: "Second Post", content: "Another post", userId: 2 },
      ]
    }
    return {}
  }

  private emitJobUpdate(job: Job) {
    // Emit to all connected clients
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("jobUpdate", { detail: job }))
    }
  }

  private startWorkers() {
    // Initialize background workers for each queue type
    console.log("[v0] Job queue workers started")
  }

  private startHealthChecks(): void {
    this.healthChecks.set("job_queue", async () => {
      const totalJobs = Array.from(this.queues.values()).reduce(
        (sum, queue) => sum + queue.jobs.length + queue.running.size,
        0,
      )
      return totalJobs < 1000 // Healthy if less than 1000 total jobs
    })

    this.healthChecks.set("circuit_breakers", async () => {
      const openBreakers = Array.from(this.circuitBreakers.values()).filter((cb) => cb.getState() === "OPEN").length
      return openBreakers === 0 // Healthy if no circuit breakers are open
    })

    // Run health checks every 30 seconds
    setInterval(async () => {
      if (this.isShuttingDown) return

      for (const [name, check] of this.healthChecks.entries()) {
        try {
          const healthy = await check()
          if (!healthy) {
            this.emitAlert({
              type: "health_check_failed",
              severity: "warning",
              message: `Health check failed: ${name}`,
              component: name,
            })
          }
        } catch (error) {
          console.error(`[v0] Health check error for ${name}:`, error)
        }
      }
    }, 30000)
  }

  private setupGracefulShutdown(): void {
    const shutdown = async () => {
      console.log("[v0] Initiating graceful shutdown...")
      this.isShuttingDown = true

      // Stop accepting new jobs
      console.log("[v0] Stopped accepting new jobs")

      // Wait for running jobs to complete (with timeout)
      const shutdownTimeout = 30000 // 30 seconds
      const startTime = Date.now()

      while (this.hasRunningJobs() && Date.now() - startTime < shutdownTimeout) {
        console.log("[v0] Waiting for running jobs to complete...")
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }

      // Force cancel remaining jobs if timeout reached
      if (this.hasRunningJobs()) {
        console.log("[v0] Timeout reached, cancelling remaining jobs")
        this.cancelAllRunningJobs()
      }

      console.log("[v0] Graceful shutdown completed")
    }

    if (typeof process !== "undefined") {
      process.on("SIGTERM", shutdown)
      process.on("SIGINT", shutdown)
    }
  }

  private hasRunningJobs(): boolean {
    return Array.from(this.queues.values()).some((queue) => queue.running.size > 0)
  }

  private cancelAllRunningJobs(): void {
    for (const queue of this.queues.values()) {
      for (const job of queue.running.values()) {
        job.status = "cancelled"
        job.error = "Cancelled due to system shutdown"
        this.emitJobUpdate(job)
      }
      queue.running.clear()
    }
  }

  private async persistJob(job: Job): Promise<void> {
    const persistedJobs = JSON.parse(localStorage.getItem("persisted_jobs") || "[]")
    persistedJobs.push(job)
    localStorage.setItem("persisted_jobs", JSON.stringify(persistedJobs))
  }

  private async removePersistedJob(jobId: string): Promise<void> {
    const persistedJobs = JSON.parse(localStorage.getItem("persisted_jobs") || "[]")
    const filteredJobs = persistedJobs.filter((job: Job) => job.id !== jobId)
    localStorage.setItem("persisted_jobs", JSON.stringify(filteredJobs))
  }

  private emitAlert(alert: any): void {
    console.warn(`[v0] ALERT:`, alert)
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("systemAlert", { detail: alert }))
    }
  }

  private isNonRetryableError(error: any): boolean {
    const nonRetryableMessages = ["Invalid input", "Authentication failed", "Permission denied", "Resource not found"]

    const errorMessage = error?.message || ""
    return nonRetryableMessages.some((msg) => errorMessage.includes(msg))
  }

  private async handleJobFailure(job: Job, error: any): Promise<void> {
    job.status = "failed"
    job.error = error instanceof Error ? error.message : "Unknown error"
    job.completedAt = new Date()

    console.error(`[v0] Job ${job.id} failed permanently:`, error)

    this.deadLetterQueue.jobs.push({
      ...job,
      error: `${job.error} (moved to DLQ after ${this.deadLetterQueue.maxRetries} retries)`,
    })

    this.emitJobUpdate(job)
    await this.removePersistedJob(job.id)

    if (job.priority === "urgent" || job.priority === "high") {
      this.emitAlert({
        type: "job_failure",
        severity: "high",
        message: `Critical job ${job.id} failed: ${job.error}`,
        jobId: job.id,
        jobType: job.type,
      })
    }
  }

  async recoverPersistedJobs(): Promise<void> {
    const persistedJobs = JSON.parse(localStorage.getItem("persisted_jobs") || "[]")
    console.log(`[v0] Recovering ${persistedJobs.length} persisted jobs`)

    for (const job of persistedJobs) {
      if (job.status === "running") {
        // Reset running jobs to pending for retry
        job.status = "pending"
        job.progress = 0
        job.startedAt = undefined
      }

      const queue = this.queues.get(job.type)
      if (queue) {
        this.insertJobByPriority(queue.jobs, job)
      }
    }

    // Process recovered jobs
    for (const queueType of this.queues.keys()) {
      this.processQueue(queueType)
    }
  }

  getDeadLetterQueue(): DeadLetterQueue {
    return this.deadLetterQueue
  }

  async retryDeadLetterJob(jobId: string): Promise<boolean> {
    const jobIndex = this.deadLetterQueue.jobs.findIndex((job) => job.id === jobId)
    if (jobIndex === -1) return false

    const job = this.deadLetterQueue.jobs[jobIndex]
    this.deadLetterQueue.jobs.splice(jobIndex, 1)

    // Reset job status and add back to queue
    job.status = "pending"
    job.progress = 0
    job.error = undefined
    job.startedAt = undefined
    job.completedAt = undefined

    const queue = this.queues.get(job.type)
    if (queue) {
      this.insertJobByPriority(queue.jobs, job)
      this.processQueue(job.type)
      return true
    }

    return false
  }

  // Public methods for job management
  async getJob(jobId: string): Promise<Job | null> {
    for (const queue of this.queues.values()) {
      const runningJob = queue.running.get(jobId)
      if (runningJob) return runningJob

      const pendingJob = queue.jobs.find((job) => job.id === jobId)
      if (pendingJob) return pendingJob
    }
    return null
  }

  async getUserJobs(userId: string): Promise<Job[]> {
    const userJobs: Job[] = []

    for (const queue of this.queues.values()) {
      // Add running jobs
      queue.running.forEach((job) => {
        if (job.userId === userId) userJobs.push(job)
      })

      // Add pending jobs
      queue.jobs.forEach((job) => {
        if (job.userId === userId) userJobs.push(job)
      })
    }

    return userJobs.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  async cancelJob(jobId: string): Promise<boolean> {
    for (const queue of this.queues.values()) {
      // Remove from pending jobs
      const pendingIndex = queue.jobs.findIndex((job) => job.id === jobId)
      if (pendingIndex !== -1) {
        queue.jobs[pendingIndex].status = "cancelled"
        queue.jobs.splice(pendingIndex, 1)
        return true
      }

      // Cancel running job
      const runningJob = queue.running.get(jobId)
      if (runningJob) {
        runningJob.status = "cancelled"
        queue.running.delete(jobId)
        return true
      }
    }

    return false
  }

  getQueueStats(): any {
    const stats: any = {}

    this.queues.forEach((queue, type) => {
      stats[type] = {
        pending: queue.jobs.length,
        running: queue.running.size,
        maxConcurrent: queue.maxConcurrent,
      }
    })

    return stats
  }
}

export const jobQueue = new JobQueueManager()
export type { Job, JobQueue }

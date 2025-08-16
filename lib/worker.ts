// Background worker system for job processing
export interface WorkerConfig {
  concurrency: number
  retryAttempts: number
  retryDelay: number
  timeout: number
}

export interface WorkerTask {
  id: string
  type: string
  data: any
  priority: number
  createdAt: Date
  attempts: number
}

export class Worker {
  private isRunning = false
  private tasks: WorkerTask[] = []
  private activeTasks = new Map<string, WorkerTask>()
  private config: WorkerConfig

  constructor(config: Partial<WorkerConfig> = {}) {
    this.config = {
      concurrency: 3,
      retryAttempts: 3,
      retryDelay: 1000,
      timeout: 30000,
      ...config,
    }
  }

  async start(): Promise<void> {
    if (this.isRunning) return

    this.isRunning = true
    console.log("[v0] Worker started with concurrency:", this.config.concurrency)

    // Start processing loop
    this.processLoop()
  }

  async stop(): Promise<void> {
    this.isRunning = false

    // Wait for active tasks to complete
    while (this.activeTasks.size > 0) {
      await new Promise((resolve) => setTimeout(resolve, 100))
    }

    console.log("[v0] Worker stopped")
  }

  addTask(task: Omit<WorkerTask, "id" | "createdAt" | "attempts">): string {
    const fullTask: WorkerTask = {
      ...task,
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      attempts: 0,
    }

    // Insert task based on priority (higher number = higher priority)
    let insertIndex = this.tasks.length
    for (let i = 0; i < this.tasks.length; i++) {
      if (this.tasks[i].priority < fullTask.priority) {
        insertIndex = i
        break
      }
    }

    this.tasks.splice(insertIndex, 0, fullTask)
    return fullTask.id
  }

  private async processLoop(): Promise<void> {
    while (this.isRunning) {
      // Process tasks if we have capacity
      while (this.activeTasks.size < this.config.concurrency && this.tasks.length > 0 && this.isRunning) {
        const task = this.tasks.shift()!
        this.activeTasks.set(task.id, task)

        // Process task in background
        this.processTask(task).finally(() => {
          this.activeTasks.delete(task.id)
        })
      }

      // Small delay before next iteration
      await new Promise((resolve) => setTimeout(resolve, 100))
    }
  }

  private async processTask(task: WorkerTask): Promise<void> {
    task.attempts++

    try {
      console.log(`[v0] Processing task ${task.id} (attempt ${task.attempts})`)

      // Create timeout promise
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Task timeout")), this.config.timeout)
      })

      // Execute task with timeout
      await Promise.race([this.executeTask(task), timeoutPromise])

      console.log(`[v0] Task ${task.id} completed successfully`)
    } catch (error) {
      console.error(`[v0] Task ${task.id} failed:`, error)

      // Retry if attempts remaining
      if (task.attempts < this.config.retryAttempts) {
        const delay = this.config.retryDelay * Math.pow(2, task.attempts - 1)
        console.log(`[v0] Retrying task ${task.id} in ${delay}ms`)

        setTimeout(() => {
          if (this.isRunning) {
            this.addTask({
              type: task.type,
              data: task.data,
              priority: task.priority,
            })
          }
        }, delay)
      } else {
        console.error(`[v0] Task ${task.id} failed permanently after ${task.attempts} attempts`)
        this.handleTaskFailure(task, error)
      }
    }
  }

  private async executeTask(task: WorkerTask): Promise<void> {
    // Simulate task execution based on type
    switch (task.type) {
      case "api_discovery":
        await this.executeApiDiscovery(task.data)
        break
      case "mock_generation":
        await this.executeMockGeneration(task.data)
        break
      case "test_execution":
        await this.executeTestExecution(task.data)
        break
      case "cleanup":
        await this.executeCleanup(task.data)
        break
      default:
        throw new Error(`Unknown task type: ${task.type}`)
    }
  }

  private async executeApiDiscovery(data: any): Promise<void> {
    // Simulate API discovery work
    const steps = 5
    for (let i = 0; i < steps; i++) {
      await new Promise((resolve) => setTimeout(resolve, 500))
      // Could emit progress updates here
    }
  }

  private async executeMockGeneration(data: any): Promise<void> {
    // Simulate mock generation work
    const endpoints = data.endpoints || []
    for (const endpoint of endpoints) {
      await new Promise((resolve) => setTimeout(resolve, 200))
      // Generate mock for endpoint
    }
  }

  private async executeTestExecution(data: any): Promise<void> {
    // Simulate test execution work
    const tests = data.tests || []
    for (const test of tests) {
      await new Promise((resolve) => setTimeout(resolve, 300))
      // Execute test
    }
  }

  private async executeCleanup(data: any): Promise<void> {
    // Simulate cleanup work
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  private handleTaskFailure(task: WorkerTask, error: any): void {
    // Store failed task for manual inspection
    const failedTasks = JSON.parse(localStorage.getItem("failed_worker_tasks") || "[]")
    failedTasks.push({
      task,
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date(),
    })
    localStorage.setItem("failed_worker_tasks", JSON.stringify(failedTasks))

    // Emit failure event
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("workerTaskFailed", {
          detail: { task, error },
        }),
      )
    }
  }

  getStats() {
    return {
      isRunning: this.isRunning,
      queueLength: this.tasks.length,
      activeTasks: this.activeTasks.size,
      maxConcurrency: this.config.concurrency,
    }
  }

  getActiveTasks(): WorkerTask[] {
    return Array.from(this.activeTasks.values())
  }

  getPendingTasks(): WorkerTask[] {
    return [...this.tasks]
  }
}

// Global worker instance
export const globalWorker = new Worker({
  concurrency: 5,
  retryAttempts: 3,
  retryDelay: 1000,
  timeout: 60000,
})

// Auto-start worker in browser environment
if (typeof window !== "undefined") {
  globalWorker.start().catch(console.error)
}

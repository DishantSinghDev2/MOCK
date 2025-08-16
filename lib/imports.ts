// Database interface and type definitions
export interface Project {
  id: string
  userId: string
  name: string
  description: string
  baseUrl: string
  status: "discovering" | "ready" | "error"
  discoveryProgress?: {
    step: string
    progress: number
    message: string
  }
  endpoints: number
  mocks: number
  tests: number
  coverage: number
  lastRun?: Date
  createdAt: Date
  updatedAt: Date
}

export interface MockEndpoint {
  id: string
  projectId: string
  path: string
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH"
  description: string
  schema: any
  scenarios: MockScenario[]
  settings: {
    latency: number
    errorRate: number
    enabled: boolean
  }
  usage: {
    requests: number
    lastUsed: Date
  }
  createdAt: Date
  updatedAt: Date
}

export interface MockScenario {
  id: string
  name: string
  description: string
  response: {
    status: number
    headers: Record<string, string>
    body: any
  }
  conditions: Record<string, any>
  probability: number
  isDefault: boolean
}

export interface TestSuite {
  id: string
  projectId: string
  name: string
  type: "contract" | "functional" | "performance" | "security"
  tests: Test[]
  schedule: {
    enabled: boolean
    cron: string
    triggers: string[]
  }
  createdAt: Date
  updatedAt: Date
}

export interface Test {
  id: string
  name: string
  description: string
  endpoint: string
  method: string
  assertions: TestAssertion[]
}

export interface TestAssertion {
  type: string
  field?: string
  operator: string
  expected: any
}

export interface TestRun {
  id: string
  suiteId: string
  projectId: string
  status: "running" | "passed" | "failed"
  results: TestResult[]
  coverage: number
  duration: number
  startedAt: Date
  completedAt?: Date
}

export interface TestResult {
  testId: string
  status: "passed" | "failed"
  duration: number
  error?: string
  assertions: {
    passed: number
    failed: number
    details: AssertionResult[]
  }
}

export interface AssertionResult {
  type: string
  field?: string
  expected: any
  actual: any
  passed: boolean
  message?: string
}

export interface LogEntry {
  id: string
  projectId: string
  timestamp: Date
  level: "info" | "warn" | "error"
  message: string
  source: string
  metadata?: any
}

export interface AIInsight {
  type: "critical" | "warning" | "info"
  title: string
  description: string
  impact: "high" | "medium" | "low"
  category: string
  recommendation: string
  codeExample?: string
  affectedEndpoints: string[]
  confidence: number
}

// Simple IndexedDB wrapper for client-side storage
class Database {
  private dbName = "mock_by_dit"
  private version = 1
  private db: IDBDatabase | null = null

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        // Create object stores
        const stores = ["projects", "mocks", "tests", "logs", "users", "organizations"]

        stores.forEach((storeName) => {
          if (!db.objectStoreNames.contains(storeName)) {
            const store = db.createObjectStore(storeName, { keyPath: "id" })

            // Add indexes for common queries
            if (storeName === "projects" || storeName === "mocks" || storeName === "tests") {
              store.createIndex("projectId", "projectId", { unique: false })
            }
            if (storeName === "projects") {
              store.createIndex("userId", "userId", { unique: false })
            }
          }
        })
      }
    })
  }

  async get<T>(storeName: string, id: string): Promise<T | null> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], "readonly")
      const store = transaction.objectStore(storeName)
      const request = store.get(id)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result || null)
    })
  }

  async put<T>(storeName: string, data: T): Promise<void> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], "readwrite")
      const store = transaction.objectStore(storeName)
      const request = store.put(data)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }

  async getAll<T>(storeName: string, indexName?: string, indexValue?: any): Promise<T[]> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], "readonly")
      const store = transaction.objectStore(storeName)

      let request: IDBRequest
      if (indexName && indexValue) {
        const index = store.index(indexName)
        request = index.getAll(indexValue)
      } else {
        request = store.getAll()
      }

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result || [])
    })
  }

  async delete(storeName: string, id: string): Promise<void> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], "readwrite")
      const store = transaction.objectStore(storeName)
      const request = store.delete(id)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }

  async clear(storeName: string): Promise<void> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], "readwrite")
      const store = transaction.objectStore(storeName)
      const request = store.clear()

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }
}

export const db = new Database()

// Initialize database on module load
if (typeof window !== "undefined") {
  db.init().catch(console.error)
}

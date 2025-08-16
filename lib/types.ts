export interface User {
  id: string
  name: string
  email: string
  image?: string
  organizationId?: string
  role: "owner" | "admin" | "member" | "viewer"
  createdAt: Date
  lastActiveAt: Date
}

export interface Organization {
  id: string
  name: string
  slug: string
  ownerId: string
  plan: "free" | "pro" | "enterprise"
  settings: {
    allowInvites: boolean
    requireApproval: boolean
    ssoEnabled: boolean
    auditLogsRetention: number
  }
  createdAt: Date
  updatedAt: Date
}

export interface Project {
  id: string
  name: string
  description: string
  userId: string
  organizationId?: string
  baseUrl: string
  status: "discovering" | "ready" | "error" | "archived"
  discoveryProgress: {
    step: "discovery" | "schema_infer" | "mocks_ready" | "test_plan" | "running" | "insights" | "fixes_suggested"
    progress: number
    message: string
  }
  endpoints: number
  mocks: number
  tests: number
  coverage: number
  lastRun: Date
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
  conditions: {
    headers?: Record<string, string>
    query?: Record<string, string>
    body?: any
  }
  probability: number
  isDefault: boolean
}

export interface TestSuite {
  id: string
  projectId: string
  name: string
  type: "contract" | "functional" | "performance" | "security" | "integration"
  tests: Test[]
  schedule: {
    enabled: boolean
    cron: string
    triggers: ("push" | "nightly" | "manual")[]
  }
  lastRun?: TestRun
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
  setup?: string
  teardown?: string
}

export interface TestAssertion {
  type: "status" | "header" | "body" | "response_time" | "schema"
  field?: string
  operator: "equals" | "contains" | "greater_than" | "less_than" | "matches"
  expected: any
}

export interface TestRun {
  id: string
  suiteId: string
  projectId: string
  status: "running" | "passed" | "failed" | "cancelled"
  results: TestResult[]
  coverage: number
  duration: number
  aiInsights?: AIInsight[]
  startedAt: Date
  completedAt?: Date
}

export interface TestResult {
  testId: string
  status: "passed" | "failed" | "skipped"
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

export interface AIInsight {
  type: "critical" | "warning" | "suggestion"
  title: string
  description: string
  impact: "high" | "medium" | "low"
  category: "performance" | "security" | "reliability" | "usability"
  recommendation: string
  codeExample?: string
  affectedEndpoints: string[]
  confidence: number
}

export interface LogEntry {
  id: string
  projectId: string
  timestamp: Date
  level: "error" | "warn" | "info" | "debug"
  message: string
  source: "api" | "mock" | "test" | "system"
  metadata: Record<string, any>
  traceId?: string
  spanId?: string
}

export interface Subscription {
  id: string
  userId: string
  organizationId?: string
  plan: "free" | "pro" | "enterprise"
  status: "active" | "cancelled" | "past_due" | "unpaid"
  currentPeriodStart: Date
  currentPeriodEnd: Date
  usage: {
    apiCalls: number
    mockServers: number
    testRuns: number
    storage: number
  }
  limits: {
    apiCalls: number
    mockServers: number
    testRuns: number
    storage: number
    teamMembers: number
  }
  paymentMethod?: {
    type: "razorpay" | "paypal"
    last4: string
    expiryMonth: number
    expiryYear: number
  }
  createdAt: Date
  updatedAt: Date
}

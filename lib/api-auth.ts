import { db } from "@/lib/imports"
import { PlanLimits } from "@/lib/plan-limits"

interface ApiUser {
  id: string
  email: string
  plan: "free" | "pro" | "enterprise"
  apiKeys: string[]
}

interface RateLimitResult {
  allowed: boolean
  resetTime?: number
  remaining?: number
}

export async function validateApiKey(apiKey: string): Promise<ApiUser | null> {
  try {
    const user = await db.getUserByApiKey(apiKey)
    if (!user || !user.apiKeys.includes(apiKey)) {
      return null
    }
    return user
  } catch (error) {
    console.error("[API Auth] Validation error:", error)
    return null
  }
}

export async function checkRateLimit(userId: string, operation: string): Promise<RateLimitResult> {
  try {
    const user = await db.getUser(userId)
    if (!user) return { allowed: false }

    const limits = PlanLimits.getLimits(user.plan)
    const usage = await db.getApiUsage(userId, operation)

    const now = Date.now()
    const windowStart = now - 60 * 60 * 1000 // 1 hour window

    const recentCalls = usage.filter((call) => call.timestamp > windowStart).length
    const limit = limits.apiRateLimit[operation] || 100

    if (recentCalls >= limit) {
      return {
        allowed: false,
        resetTime: windowStart + 60 * 60 * 1000,
        remaining: 0,
      }
    }

    return {
      allowed: true,
      remaining: limit - recentCalls,
    }
  } catch (error) {
    console.error("[API Auth] Rate limit error:", error)
    return { allowed: false }
  }
}

export async function trackUsage(userId: string, operation: string, metadata: any = {}) {
  try {
    await db.recordApiUsage({
      userId,
      operation,
      timestamp: Date.now(),
      metadata,
    })

    const user = await db.getUser(userId)
    if (user) {
      const cost = getOperationCost(operation, user.plan)
      await db.updateBillingUsage(userId, operation, cost)
    }
  } catch (error) {
    console.error("[API Auth] Usage tracking error:", error)
  }
}

function getOperationCost(operation: string, plan: string): number {
  const costs = {
    free: { "api-discovery": 0, "mock-creation": 0, "test-execution": 0 },
    pro: { "api-discovery": 0.1, "mock-creation": 0.05, "test-execution": 0.15 },
    enterprise: { "api-discovery": 0.05, "mock-creation": 0.02, "test-execution": 0.08 },
  }

  return costs[plan as keyof typeof costs]?.[operation as keyof typeof costs.pro] || 0
}

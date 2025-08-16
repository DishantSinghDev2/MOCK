interface RateLimitConfig {
  windowMs: number
  maxRequests: number
  keyGenerator?: (userId: string) => string
}

export class RateLimiter {
  private requests = new Map<string, { count: number; resetTime: number }>()

  constructor(private config: RateLimitConfig) {}

  async checkLimit(userId: string): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
    const key = this.config.keyGenerator ? this.config.keyGenerator(userId) : userId
    const now = Date.now()

    let userRequests = this.requests.get(key)

    if (!userRequests || now > userRequests.resetTime) {
      userRequests = {
        count: 0,
        resetTime: now + this.config.windowMs,
      }
      this.requests.set(key, userRequests)
    }

    if (userRequests.count >= this.config.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: userRequests.resetTime,
      }
    }

    userRequests.count++
    return {
      allowed: true,
      remaining: this.config.maxRequests - userRequests.count,
      resetTime: userRequests.resetTime,
    }
  }

  cleanup() {
    const now = Date.now()
    for (const [key, data] of this.requests.entries()) {
      if (now > data.resetTime) {
        this.requests.delete(key)
      }
    }
  }
}

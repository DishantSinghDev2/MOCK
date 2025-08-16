import { Redis } from "@upstash/redis"

// Redis client for caching and real-time features
export const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

// Cache utilities with automatic expiration
export class CacheManager {
  private static instance: CacheManager
  private redis: Redis

  private constructor() {
    this.redis = redis
  }

  static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager()
    }
    return CacheManager.instance
  }

  // Generic cache operations
  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await this.redis.get(key)
      return data as T
    } catch (error) {
      console.error(`Cache get error for key ${key}:`, error)
      return null
    }
  }

  async set(key: string, value: any, ttl = 3600): Promise<void> {
    try {
      await this.redis.setex(key, ttl, JSON.stringify(value))
    } catch (error) {
      console.error(`Cache set error for key ${key}:`, error)
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.redis.del(key)
    } catch (error) {
      console.error(`Cache delete error for key ${key}:`, error)
    }
  }

  async invalidatePattern(pattern: string): Promise<void> {
    try {
      const keys = await this.redis.keys(pattern)
      if (keys.length > 0) {
        await this.redis.del(...keys)
      }
    } catch (error) {
      console.error(`Cache invalidate pattern error for ${pattern}:`, error)
    }
  }

  // Specialized cache methods for MOCK by DIT
  async cacheProject(projectId: string, project: any, ttl = 1800): Promise<void> {
    await this.set(`project:${projectId}`, project, ttl)
    await this.set(`project:${projectId}:updated`, Date.now(), ttl)
  }

  async getCachedProject(projectId: string): Promise<any> {
    return await this.get(`project:${projectId}`)
  }

  async cacheMockEndpoints(projectId: string, endpoints: any[], ttl = 900): Promise<void> {
    await this.set(`mocks:${projectId}`, endpoints, ttl)
  }

  async getCachedMockEndpoints(projectId: string): Promise<any[]> {
    return (await this.get(`mocks:${projectId}`)) || []
  }

  async cacheTestResults(projectId: string, results: any, ttl = 3600): Promise<void> {
    await this.set(`tests:${projectId}:results`, results, ttl)
  }

  async getCachedTestResults(projectId: string): Promise<any> {
    return await this.get(`tests:${projectId}:results`)
  }

  async cacheUserSession(userId: string, session: any, ttl = 86400): Promise<void> {
    await this.set(`session:${userId}`, session, ttl)
  }

  async getCachedUserSession(userId: string): Promise<any> {
    return await this.get(`session:${userId}`)
  }

  async cacheAPIUsage(userId: string, usage: any, ttl = 3600): Promise<void> {
    await this.set(`usage:${userId}`, usage, ttl)
  }

  async getCachedAPIUsage(userId: string): Promise<any> {
    return await this.get(`usage:${userId}`)
  }

  // Real-time collaboration cache
  async setUserPresence(projectId: string, userId: string, presence: any): Promise<void> {
    await this.set(`presence:${projectId}:${userId}`, presence, 300) // 5 minutes
  }

  async getUserPresence(projectId: string, userId: string): Promise<any> {
    return await this.get(`presence:${projectId}:${userId}`)
  }

  async getAllPresence(projectId: string): Promise<Record<string, any>> {
    try {
      const keys = await this.redis.keys(`presence:${projectId}:*`)
      const presence: Record<string, any> = {}

      for (const key of keys) {
        const userId = key.split(":")[2]
        const data = await this.get(key)
        if (data) {
          presence[userId] = data
        }
      }

      return presence
    } catch (error) {
      console.error("Error getting all presence:", error)
      return {}
    }
  }

  // Job queue caching
  async cacheJobStatus(jobId: string, status: any, ttl = 7200): Promise<void> {
    await this.set(`job:${jobId}:status`, status, ttl)
  }

  async getCachedJobStatus(jobId: string): Promise<any> {
    return await this.get(`job:${jobId}:status`)
  }

  // Analytics caching
  async cacheAnalytics(key: string, data: any, ttl = 1800): Promise<void> {
    await this.set(`analytics:${key}`, data, ttl)
  }

  async getCachedAnalytics(key: string): Promise<any> {
    return await this.get(`analytics:${key}`)
  }
}

export const cache = CacheManager.getInstance()

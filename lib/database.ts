import { Pool } from "pg"
import { cache } from "./redis"

// PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

// Database client with Redis caching
export class DatabaseClient {
  private static instance: DatabaseClient
  private pool: Pool

  private constructor() {
    this.pool = pool
  }

  static getInstance(): DatabaseClient {
    if (!DatabaseClient.instance) {
      DatabaseClient.instance = new DatabaseClient()
    }
    return DatabaseClient.instance
  }

  // Generic query method with caching
  async query(text: string, params?: any[], cacheKey?: string, ttl?: number): Promise<any> {
    // Try cache first if cacheKey provided
    if (cacheKey) {
      const cached = await cache.get(cacheKey)
      if (cached) {
        return cached
      }
    }

    try {
      const start = Date.now()
      const result = await this.pool.query(text, params)
      const duration = Date.now() - start

      console.log(`[DB] Query executed in ${duration}ms`)

      // Cache result if cacheKey provided
      if (cacheKey && ttl) {
        await cache.set(cacheKey, result.rows, ttl)
      }

      return result.rows
    } catch (error) {
      console.error("[DB] Query error:", error)
      throw error
    }
  }

  // User operations
  async createUser(userData: any): Promise<any> {
    const query = `
      INSERT INTO users (id, email, name, avatar_url, provider, provider_id, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      RETURNING *
    `
    const values = [
      userData.id,
      userData.email,
      userData.name,
      userData.avatar_url,
      userData.provider,
      userData.provider_id,
    ]

    const result = await this.query(query, values)

    // Invalidate user cache
    await cache.del(`user:${userData.id}`)

    return result[0]
  }

  async getUserById(userId: string): Promise<any> {
    const cacheKey = `user:${userId}`
    return await this.query(
      "SELECT * FROM users WHERE id = $1",
      [userId],
      cacheKey,
      1800, // 30 minutes
    )
  }

  async updateUser(userId: string, updates: any): Promise<any> {
    const setClause = Object.keys(updates)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(", ")
    const query = `
      UPDATE users 
      SET ${setClause}, updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `
    const values = [userId, ...Object.values(updates)]

    const result = await this.query(query, values)

    // Invalidate user cache
    await cache.del(`user:${userId}`)

    return result[0]
  }

  // Project operations
  async createProject(projectData: any): Promise<any> {
    const query = `
      INSERT INTO projects (id, name, description, base_url, owner_id, org_id, settings, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
      RETURNING *
    `
    const values = [
      projectData.id,
      projectData.name,
      projectData.description,
      projectData.base_url,
      projectData.owner_id,
      projectData.org_id,
      JSON.stringify(projectData.settings || {}),
    ]

    const result = await this.query(query, values)

    // Cache the new project
    await cache.cacheProject(projectData.id, result[0])

    // Invalidate user projects cache
    await cache.invalidatePattern(`projects:user:${projectData.owner_id}*`)

    return result[0]
  }

  async getProjectById(projectId: string): Promise<any> {
    // Try cache first
    const cached = await cache.getCachedProject(projectId)
    if (cached) return cached

    const result = await this.query("SELECT * FROM projects WHERE id = $1", [projectId])

    if (result.length > 0) {
      await cache.cacheProject(projectId, result[0])
      return result[0]
    }

    return null
  }

  async getUserProjects(userId: string, limit = 50): Promise<any[]> {
    const cacheKey = `projects:user:${userId}:${limit}`
    return await this.query(
      `SELECT p.*, COUNT(m.id) as mock_count, COUNT(t.id) as test_count
       FROM projects p
       LEFT JOIN mock_endpoints m ON p.id = m.project_id
       LEFT JOIN test_suites t ON p.id = t.project_id
       WHERE p.owner_id = $1
       GROUP BY p.id
       ORDER BY p.updated_at DESC
       LIMIT $2`,
      [userId, limit],
      cacheKey,
      900, // 15 minutes
    )
  }

  // Mock endpoint operations
  async createMockEndpoint(mockData: any): Promise<any> {
    const query = `
      INSERT INTO mock_endpoints (id, project_id, method, path, response_body, status_code, headers, settings, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
      RETURNING *
    `
    const values = [
      mockData.id,
      mockData.project_id,
      mockData.method,
      mockData.path,
      JSON.stringify(mockData.response_body),
      mockData.status_code,
      JSON.stringify(mockData.headers || {}),
      JSON.stringify(mockData.settings || {}),
    ]

    const result = await this.query(query, values)

    // Invalidate project mocks cache
    await cache.del(`mocks:${mockData.project_id}`)

    return result[0]
  }

  async getProjectMocks(projectId: string): Promise<any[]> {
    // Try cache first
    const cached = await cache.getCachedMockEndpoints(projectId)
    if (cached.length > 0) return cached

    const result = await this.query("SELECT * FROM mock_endpoints WHERE project_id = $1 ORDER BY created_at DESC", [
      projectId,
    ])

    // Cache the results
    await cache.cacheMockEndpoints(projectId, result)

    return result
  }

  // Test operations
  async createTestSuite(testData: any): Promise<any> {
    const query = `
      INSERT INTO test_suites (id, project_id, name, description, tests, settings, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      RETURNING *
    `
    const values = [
      testData.id,
      testData.project_id,
      testData.name,
      testData.description,
      JSON.stringify(testData.tests || []),
      JSON.stringify(testData.settings || {}),
    ]

    const result = await this.query(query, values)

    // Invalidate project tests cache
    await cache.del(`tests:${testData.project_id}`)

    return result[0]
  }

  async getProjectTests(projectId: string): Promise<any[]> {
    const cacheKey = `tests:${projectId}`
    return await this.query(
      "SELECT * FROM test_suites WHERE project_id = $1 ORDER BY created_at DESC",
      [projectId],
      cacheKey,
      1800, // 30 minutes
    )
  }

  // Organization operations
  async createOrganization(orgData: any): Promise<any> {
    const query = `
      INSERT INTO organizations (id, name, slug, owner_id, settings, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
      RETURNING *
    `
    const values = [orgData.id, orgData.name, orgData.slug, orgData.owner_id, JSON.stringify(orgData.settings || {})]

    const result = await this.query(query, values)

    // Cache the new organization
    await cache.set(`org:${orgData.id}`, result[0], 3600)

    return result[0]
  }

  async getUserOrganizations(userId: string): Promise<any[]> {
    const cacheKey = `orgs:user:${userId}`
    return await this.query(
      `SELECT o.*, om.role, om.joined_at
       FROM organizations o
       JOIN org_members om ON o.id = om.org_id
       WHERE om.user_id = $1
       ORDER BY om.joined_at DESC`,
      [userId],
      cacheKey,
      1800, // 30 minutes
    )
  }

  // API key operations
  async createAPIKey(keyData: any): Promise<any> {
    const query = `
      INSERT INTO api_keys (id, user_id, name, key_hash, permissions, last_used, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, NULL, NOW(), NOW())
      RETURNING *
    `
    const values = [
      keyData.id,
      keyData.user_id,
      keyData.name,
      keyData.key_hash,
      JSON.stringify(keyData.permissions || []),
    ]

    const result = await this.query(query, values)

    // Invalidate user API keys cache
    await cache.del(`api_keys:${keyData.user_id}`)

    return result[0]
  }

  async getUserAPIKeys(userId: string): Promise<any[]> {
    const cacheKey = `api_keys:${userId}`
    return await this.query(
      "SELECT id, name, permissions, last_used, created_at FROM api_keys WHERE user_id = $1 ORDER BY created_at DESC",
      [userId],
      cacheKey,
      1800, // 30 minutes
    )
  }

  // Usage tracking
  async recordAPIUsage(usage: any): Promise<void> {
    const query = `
      INSERT INTO api_usage (user_id, endpoint, method, timestamp, response_time, status_code, tokens_used)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `
    const values = [
      usage.user_id,
      usage.endpoint,
      usage.method,
      usage.timestamp,
      usage.response_time,
      usage.status_code,
      usage.tokens_used || 0,
    ]

    await this.query(query, values)

    // Invalidate usage cache
    await cache.del(`usage:${usage.user_id}`)
  }

  async getUserUsage(userId: string, period = "30d"): Promise<any> {
    const cacheKey = `usage:${userId}:${period}`

    let interval = "30 days"
    if (period === "7d") interval = "7 days"
    if (period === "1d") interval = "1 day"

    return await this.query(
      `SELECT 
         COUNT(*) as total_requests,
         AVG(response_time) as avg_response_time,
         SUM(tokens_used) as total_tokens,
         COUNT(DISTINCT endpoint) as unique_endpoints
       FROM api_usage 
       WHERE user_id = $1 AND timestamp >= NOW() - INTERVAL '${interval}'`,
      [userId],
      cacheKey,
      300, // 5 minutes
    )
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      await this.query("SELECT 1")
      return true
    } catch (error) {
      console.error("[DB] Health check failed:", error)
      return false
    }
  }

  // Close connection
  async close(): Promise<void> {
    await this.pool.end()
  }
}

export const db = DatabaseClient.getInstance()

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: any,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

class ApiClient {
  private baseUrl = "/api"

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        throw new ApiError(data.error || "Request failed", response.status, data)
      }

      return data
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      throw new ApiError("Network error", 0)
    }
  }

  // Projects
  async getProjects() {
    return this.request<{ projects: any[] }>("/projects")
  }

  async createProject(data: any) {
    return this.request<{ project: any }>("/projects", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async getProject(id: string) {
    return this.request<{ project: any }>(`/projects/${id}`)
  }

  async updateProject(id: string, data: any) {
    return this.request<{ project: any }>(`/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async deleteProject(id: string) {
    return this.request<{ success: boolean }>(`/projects/${id}`, {
      method: "DELETE",
    })
  }

  // Jobs
  async getJobs(params?: { status?: string; limit?: number }) {
    const searchParams = new URLSearchParams()
    if (params?.status) searchParams.set("status", params.status)
    if (params?.limit) searchParams.set("limit", params.limit.toString())

    const query = searchParams.toString()
    return this.request<{ jobs: any[] }>(`/jobs${query ? `?${query}` : ""}`)
  }

  async createJob(type: string, data: any, priority?: string) {
    return this.request<{ job: any }>("/jobs", {
      method: "POST",
      body: JSON.stringify({ type, data, priority }),
    })
  }

  async cancelJob(id: string) {
    return this.request<{ success: boolean }>(`/jobs/${id}/cancel`, {
      method: "POST",
    })
  }

  // Mocks
  async getMocks(projectId: string) {
    return this.request<{ mocks: any[] }>(`/mocks?projectId=${projectId}`)
  }

  async createMock(data: any) {
    return this.request<{ mock: any }>("/mocks", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }
}

export const apiClient = new ApiClient()

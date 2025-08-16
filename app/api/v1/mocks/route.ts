import { type NextRequest, NextResponse } from "next/server"
import { validateApiKey, trackUsage, checkRateLimit } from "@/lib/api-auth"
import { db } from "@/lib/imports"

export async function POST(request: NextRequest) {
  try {
    const apiKey = request.headers.get("x-api-key")
    if (!apiKey) {
      return NextResponse.json({ error: "API key required" }, { status: 401 })
    }

    const user = await validateApiKey(apiKey)
    if (!user) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 })
    }

    const rateLimitResult = await checkRateLimit(user.id, "mock-creation")
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          resetTime: rateLimitResult.resetTime,
        },
        { status: 429 },
      )
    }

    const { endpoint, method, response, options = {} } = await request.json()

    await trackUsage(user.id, "mock-creation", { endpoint, method })

    const mock = await db.createMockEndpoint(
      {
        endpoint,
        method: method.toUpperCase(),
        response,
        userId: user.id,
        apiCall: true,
        ...options,
      },
      user.id,
    )

    return NextResponse.json({
      mockId: mock.id,
      mockUrl: `https://mock.dit.dev/api/mock/${mock.id}`,
      endpoint: mock.endpoint,
      method: mock.method,
    })
  } catch (error) {
    console.error("[API] Mock creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const apiKey = request.headers.get("x-api-key")
    if (!apiKey) {
      return NextResponse.json({ error: "API key required" }, { status: 401 })
    }

    const user = await validateApiKey(apiKey)
    if (!user) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get("projectId")
    const limit = Number.parseInt(searchParams.get("limit") || "50")

    const mocks = await db.getMockEndpoints(projectId, user.id, { limit, apiCall: true })

    return NextResponse.json({
      mocks: mocks.map((mock) => ({
        id: mock.id,
        endpoint: mock.endpoint,
        method: mock.method,
        mockUrl: `https://mock.dit.dev/api/mock/${mock.id}`,
        createdAt: mock.createdAt,
      })),
    })
  } catch (error) {
    console.error("[API] Get mocks error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

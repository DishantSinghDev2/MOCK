import { type NextRequest, NextResponse } from "next/server"
import { validateApiKey, trackUsage, checkRateLimit } from "@/lib/api-auth"
import { JobQueue } from "@/lib/job-queue"

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

    const rateLimitResult = await checkRateLimit(user.id, "test-execution")
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          resetTime: rateLimitResult.resetTime,
        },
        { status: 429 },
      )
    }

    const { endpoints, testTypes = ["functional"], options = {} } = await request.json()

    await trackUsage(user.id, "test-execution", { endpointCount: endpoints.length, testTypes })

    const job = await JobQueue.addJob(
      "api-testing",
      {
        endpoints,
        testTypes,
        userId: user.id,
        apiCall: true,
        options,
      },
      { priority: "normal" },
    )

    return NextResponse.json({
      jobId: job.id,
      status: "started",
      testTypes,
      endpointCount: endpoints.length,
      estimatedTime: `${endpoints.length * 10}-${endpoints.length * 20} seconds`,
    })
  } catch (error) {
    console.error("[API] Test execution error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

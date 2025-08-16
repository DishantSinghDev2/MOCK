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

    const rateLimitResult = await checkRateLimit(user.id, "api-discovery")
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          resetTime: rateLimitResult.resetTime,
        },
        { status: 429 },
      )
    }

    const { baseUrl, options = {} } = await request.json()

    if (!baseUrl) {
      return NextResponse.json({ error: "baseUrl is required" }, { status: 400 })
    }

    await trackUsage(user.id, "api-discovery", { baseUrl })

    const job = await JobQueue.addJob(
      "ai-discovery",
      {
        baseUrl,
        userId: user.id,
        apiCall: true,
        options,
      },
      { priority: "normal" },
    )

    return NextResponse.json({
      jobId: job.id,
      status: "started",
      estimatedTime: "30-60 seconds",
      webhookUrl: options.webhookUrl || null,
    })
  } catch (error) {
    console.error("[API] Discovery error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

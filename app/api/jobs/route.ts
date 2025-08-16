import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { JobQueue } from "@/lib/job-queue"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const limit = Number.parseInt(searchParams.get("limit") || "50")

    const jobs = await JobQueue.getUserJobs(session.user.id, { status, limit })
    return NextResponse.json({ jobs })
  } catch (error) {
    console.error("[API] Get jobs error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { type, data, priority = "normal" } = await request.json()

    const job = await JobQueue.addJob(
      type,
      {
        ...data,
        userId: session.user.id,
      },
      { priority },
    )

    return NextResponse.json({ job }, { status: 201 })
  } catch (error) {
    console.error("[API] Create job error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

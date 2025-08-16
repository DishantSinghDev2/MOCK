import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { JobQueue } from "@/lib/job-queue"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const success = await JobQueue.cancelJob(params.id, session.user.id)
    if (!success) {
      return NextResponse.json({ error: "Job not found or cannot be cancelled" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[API] Cancel job error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

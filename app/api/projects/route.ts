import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/imports"
import { z } from "zod"

const createProjectSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500),
  baseUrl: z.string().url(),
  type: z.enum(["url", "openapi", "curl"]),
})

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const projects = await db.getProjects(session.user.id)
    return NextResponse.json({ projects })
  } catch (error) {
    console.error("[API] Get projects error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createProjectSchema.parse(body)

    const project = await db.createProject({
      ...validatedData,
      userId: session.user.id,
      status: "discovering",
      discoveryProgress: {
        step: "discovery",
        progress: 0,
        message: "Starting API discovery...",
      },
    })

    // Trigger AI discovery job
    const { JobQueue } = await import("@/lib/job-queue")
    await JobQueue.addJob(
      "ai-discovery",
      {
        projectId: project.id,
        baseUrl: validatedData.baseUrl,
        userId: session.user.id,
      },
      { priority: "high" },
    )

    return NextResponse.json({ project }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input", details: error.errors }, { status: 400 })
    }
    console.error("[API] Create project error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

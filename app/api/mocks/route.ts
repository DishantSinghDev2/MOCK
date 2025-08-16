import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/imports"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get("projectId")

    if (!projectId) {
      return NextResponse.json({ error: "Project ID required" }, { status: 400 })
    }

    const mocks = await db.getMockEndpoints(projectId, session.user.id)
    return NextResponse.json({ mocks })
  } catch (error) {
    console.error("[API] Get mocks error:", error)
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
    const mock = await db.createMockEndpoint(body, session.user.id)

    return NextResponse.json({ mock }, { status: 201 })
  } catch (error) {
    console.error("[API] Create mock error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

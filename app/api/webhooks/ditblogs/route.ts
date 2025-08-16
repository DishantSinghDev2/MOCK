import { type NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import crypto from "crypto"
import { revalidatePath, revalidateTag } from "next/cache"

// Verify webhook signature from DITblogs
function verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
  const expectedSignature = crypto.createHmac("sha256", secret).update(payload).digest("hex")

  return crypto.timingSafeEqual(Buffer.from(`sha256=${expectedSignature}`), Buffer.from(signature))
}

export async function POST(request: NextRequest) {
  try {
    const headersList = headers()
    const signature = headersList.get("x-ditblogs-signature")
    const event = headersList.get("x-ditblogs-event")

    if (!signature) {
      return NextResponse.json({ error: "Missing webhook signature" }, { status: 401 })
    }

    const payload = await request.text()
    const webhookSecret = process.env.DITBLOGS_WEBHOOK_SECRET

    if (!webhookSecret) {
      console.error("[v0] DITblogs webhook secret not configured")
      return NextResponse.json({ error: "Webhook not configured" }, { status: 500 })
    }

    // Verify the webhook signature
    if (!verifyWebhookSignature(payload, signature, webhookSecret)) {
      console.error("[v0] Invalid webhook signature")
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    const data = JSON.parse(payload)

    console.log(`[v0] DITblogs webhook received: ${event}`, data)

    // Handle different webhook events
    switch (event) {
      case "post.published":
      case "post.updated":
      case "post.deleted":
        // Revalidate blog pages
        revalidatePath("/blog")
        revalidatePath(`/blog/${data.slug}`)
        revalidateTag("blog-posts")

        console.log(`[v0] Revalidated blog pages for post: ${data.slug}`)
        break

      case "category.created":
      case "category.updated":
      case "category.deleted":
        // Revalidate category pages
        revalidatePath("/blog")
        revalidateTag("blog-categories")

        console.log(`[v0] Revalidated blog categories`)
        break

      case "tag.created":
      case "tag.updated":
      case "tag.deleted":
        // Revalidate tag pages
        revalidatePath("/blog")
        revalidateTag("blog-tags")

        console.log(`[v0] Revalidated blog tags`)
        break

      default:
        console.log(`[v0] Unhandled webhook event: ${event}`)
    }

    // Optional: Trigger additional actions like cache warming
    if (event === "post.published") {
      // Warm up the cache for the new post
      try {
        await fetch(`${process.env.NEXTAUTH_URL}/blog/${data.slug}`, {
          method: "GET",
          headers: {
            "User-Agent": "MOCK-Cache-Warmer/1.0",
          },
        })
        console.log(`[v0] Cache warmed for new post: ${data.slug}`)
      } catch (error) {
        console.error("[v0] Failed to warm cache:", error)
      }
    }

    return NextResponse.json({
      success: true,
      message: "Webhook processed successfully",
      event,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[v0] Webhook processing error:", error)

    return NextResponse.json(
      {
        error: "Webhook processing failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: "healthy",
    service: "DITblogs Webhook Handler",
    timestamp: new Date().toISOString(),
  })
}

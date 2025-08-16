import { DITBlogsClient } from "@dishistech/blogs-sdk"

// Initialize the DITBlogs client
export const ditblogsClient = new DITBlogsClient(process.env.DITBLOGS_API_KEY!)

// Helper functions for blog operations
export async function getRecentPosts(limit = 5) {
  try {
    const response = await ditblogsClient.getPosts({ limit })
    return response
  } catch (error) {
    console.error("Failed to fetch recent posts:", error)
    throw error
  }
}

export async function getPostBySlug(slug: string) {
  try {
    const post = await ditblogsClient.getPost(slug)
    return post
  } catch (error) {
    console.error(`Failed to fetch post ${slug}:`, error)
    throw error
  }
}

export async function getAllCategories() {
  try {
    const categories = await ditblogsClient.getCategories()
    return categories
  } catch (error) {
    console.error("Failed to fetch categories:", error)
    throw error
  }
}

export async function getAllTags() {
  try {
    const tags = await ditblogsClient.getTags()
    return tags
  } catch (error) {
    console.error("Failed to fetch tags:", error)
    throw error
  }
}

export async function getPostComments(postSlug: string) {
  try {
    const comments = await ditblogsClient.getComments(postSlug)
    return comments
  } catch (error) {
    console.error(`Failed to fetch comments for ${postSlug}:`, error)
    throw error
  }
}

export async function submitComment(params: {
  postSlug: string
  content: string
  userToken: string
  parentId?: string
}) {
  try {
    const comment = await ditblogsClient.postComment(params)
    return comment
  } catch (error) {
    console.error("Failed to submit comment:", error)
    throw error
  }
}

export function validateWebhookPayload(payload: any, event: string): boolean {
  switch (event) {
    case "post.published":
    case "post.updated":
    case "post.deleted":
      return payload && typeof payload.slug === "string"
    case "category.created":
    case "category.updated":
    case "category.deleted":
      return payload && typeof payload.id === "string"
    case "tag.created":
    case "tag.updated":
    case "tag.deleted":
      return payload && typeof payload.id === "string"
    default:
      return false
  }
}

export async function warmBlogCache(slug?: string) {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"

    // Warm main blog page
    await fetch(`${baseUrl}/blog`)

    // Warm specific post if slug provided
    if (slug) {
      await fetch(`${baseUrl}/blog/${slug}`)
    }

    console.log("[v0] Blog cache warmed successfully")
  } catch (error) {
    console.error("[v0] Failed to warm blog cache:", error)
  }
}

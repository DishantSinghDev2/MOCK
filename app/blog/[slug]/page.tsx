import { Suspense } from "react"
import { getPostBySlug, getPostComments } from "@/lib/ditblogs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, User, ArrowLeft, MessageCircle } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

async function BlogPostContent({ slug }: { slug: string }) {
  try {
    const [post, comments] = await Promise.all([getPostBySlug(slug), getPostComments(slug)])

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <Button variant="ghost" size="sm" asChild className="mb-6">
            <Link href="/blog">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Link>
          </Button>

          {/* Article */}
          <article className="max-w-4xl mx-auto">
            <Card className="mb-8">
              <CardHeader>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <Calendar className="h-4 w-4" />
                  {new Date(post.publishedAt).toLocaleDateString()}
                  <User className="h-4 w-4 ml-4" />
                  {post.author.name}
                  <MessageCircle className="h-4 w-4 ml-4" />
                  {comments.length} comments
                </div>
                <CardTitle className="text-4xl mb-4">{post.title}</CardTitle>
                <p className="text-xl text-gray-600 dark:text-gray-300">{post.excerpt}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  <Badge variant="secondary">{post.category.name}</Badge>
                  {post.tags.map((tag) => (
                    <Badge key={tag.slug} variant="outline">
                      <Link href={`/blog/tag/${tag.slug}`}>{tag.name}</Link>
                    </Badge>
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <div
                  className="prose prose-lg max-w-none dark:prose-invert"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </CardContent>
            </Card>

            {/* Comments Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Comments ({comments.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {comments.length > 0 ? (
                  <div className="space-y-4">
                    {comments.map((comment) => (
                      <div key={comment.id} className="border-l-2 border-green-200 pl-4">
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                          <User className="h-4 w-4" />
                          {comment.author.name}
                          <Calendar className="h-4 w-4 ml-2" />
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </div>
                        <div
                          className="prose prose-sm dark:prose-invert"
                          dangerouslySetInnerHTML={{ __html: comment.content }}
                        />
                        {comment.replies && comment.replies.length > 0 && (
                          <div className="ml-6 mt-3 space-y-3">
                            {comment.replies.map((reply) => (
                              <div key={reply.id} className="border-l-2 border-gray-200 pl-4">
                                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                                  <User className="h-4 w-4" />
                                  {reply.author.name}
                                  <Calendar className="h-4 w-4 ml-2" />
                                  {new Date(reply.createdAt).toLocaleDateString()}
                                </div>
                                <div
                                  className="prose prose-sm dark:prose-invert"
                                  dangerouslySetInnerHTML={{ __html: reply.content }}
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                    No comments yet. Be the first to comment!
                  </p>
                )}
              </CardContent>
            </Card>
          </article>
        </div>
      </div>
    )
  } catch (error) {
    notFound()
  }
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading blog post...</p>
          </div>
        </div>
      }
    >
      <BlogPostContent slug={params.slug} />
    </Suspense>
  )
}

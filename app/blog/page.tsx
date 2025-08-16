import { Suspense } from "react"
import { getRecentPosts, getAllCategories, getAllTags } from "@/lib/ditblogs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, User, ArrowRight, BookOpen, Tag, Folder } from "lucide-react"
import Link from "next/link"

async function BlogContent() {
  const [postsResponse, categories, tags] = await Promise.all([getRecentPosts(10), getAllCategories(), getAllTags()])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">MOCK by DIT Blog</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Insights, tutorials, and updates from the world of API development and testing
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="grid gap-6">
              {postsResponse.posts.map((post) => (
                <Card key={post.slug} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                      <Calendar className="h-4 w-4" />
                      {new Date(post.publishedAt).toLocaleDateString()}
                      <User className="h-4 w-4 ml-4" />
                      {post.author.name}
                    </div>
                    <CardTitle className="text-2xl hover:text-green-600 transition-colors">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </CardTitle>
                    <CardDescription className="text-base">{post.excerpt}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {post.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag.slug} variant="secondary">
                            <Link href={`/blog/tag/${tag.slug}`}>{tag.name}</Link>
                          </Badge>
                        ))}
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/blog/${post.slug}`}>
                          Read More <ArrowRight className="h-4 w-4 ml-1" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {postsResponse.pagination.totalPages > 1 && (
              <div className="flex justify-center mt-8 gap-2">
                {Array.from({ length: postsResponse.pagination.totalPages }, (_, i) => (
                  <Button
                    key={i + 1}
                    variant={postsResponse.pagination.currentPage === i + 1 ? "default" : "outline"}
                    size="sm"
                    asChild
                  >
                    <Link href={`/blog?page=${i + 1}`}>{i + 1}</Link>
                  </Button>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Folder className="h-5 w-5" />
                  Categories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <Link
                      key={category.slug}
                      href={`/blog/category/${category.slug}`}
                      className="block p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span>{category.name}</span>
                        <Badge variant="outline">{category.postCount}</Badge>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Popular Tags */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Popular Tags
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {tags.slice(0, 10).map((tag) => (
                    <Badge key={tag.slug} variant="outline" asChild>
                      <Link href={`/blog/tag/${tag.slug}`}>{tag.name}</Link>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Posts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Recent Posts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {postsResponse.posts.slice(0, 5).map((post) => (
                    <Link
                      key={post.slug}
                      href={`/blog/${post.slug}`}
                      className="block p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <h4 className="font-medium text-sm line-clamp-2">{post.title}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {new Date(post.publishedAt).toLocaleDateString()}
                      </p>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function BlogPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading blog posts...</p>
          </div>
        </div>
      }
    >
      <BlogContent />
    </Suspense>
  )
}

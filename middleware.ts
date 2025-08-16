import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  const { pathname } = request.nextUrl

  // Allow requests if token exists
  if (token) {
    console.log("[v0] Protected route accessed:", pathname)
    return NextResponse.next()
  }

  // Redirect to signin if no token for protected routes
  if (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/api/projects") ||
    pathname.startsWith("/api/mocks") ||
    pathname.startsWith("/api/tests")
  ) {
    const signInUrl = new URL("/auth/signin", request.url)
    signInUrl.searchParams.set("callbackUrl", request.url)
    return NextResponse.redirect(signInUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/projects/:path*", "/api/mocks/:path*", "/api/tests/:path*"],
}

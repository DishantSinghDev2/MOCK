import { Suspense } from "react"
import { SignInForm } from "@/components/auth/signin-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Zap } from "lucide-react"
import Link from "next/link"

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-card to-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <Zap className="h-8 w-8 text-primary animate-pulse-glow" />
            <div>
              <h1 className="text-2xl font-bold">MOCK</h1>
              <p className="text-xs text-muted-foreground">by DIT</p>
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl">Welcome back</CardTitle>
            <CardDescription>Sign in to your MOCK account to continue</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div className="h-32 flex items-center justify-center">Loading...</div>}>
            <SignInForm />
          </Suspense>
          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Don't have an account? </span>
            <Link href="/auth/signup" className="text-primary hover:underline font-medium">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

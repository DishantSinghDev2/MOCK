"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, ExternalLink } from "lucide-react"

export function SignInForm() {
  const [isLoading, setIsLoading] = useState(false)

  const handleWhatsYourInfoSignIn = async () => {
    setIsLoading(true)
    // This will redirect to WhatsYour.Info OAuth flow
    // In a real implementation, this would use NextAuth.js
    window.location.href = "/api/auth/signin/whatsyourinfo"
  }

  return (
    <div className="space-y-4">
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <ExternalLink className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-sm">WhatsYour.Info Integration</h3>
              <p className="text-xs text-muted-foreground">Secure OAuth2 authentication via DishIs Technologies</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button
        onClick={handleWhatsYourInfoSignIn}
        disabled={isLoading}
        className="w-full bg-primary hover:bg-primary/90"
        size="lg"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Connecting...
          </>
        ) : (
          <>
            <ExternalLink className="mr-2 h-4 w-4" />
            Continue with WhatsYour.Info
          </>
        )}
      </Button>

      <div className="text-center text-xs text-muted-foreground">
        <p>
          By signing in, you agree to our{" "}
          <a href="/terms" className="text-primary hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  )
}

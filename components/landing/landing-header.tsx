"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Menu, X, Zap } from "lucide-react"

export function LandingHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Zap className="h-8 w-8 text-primary animate-pulse-glow" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">MOCK</h1>
              <p className="text-xs text-muted-foreground">by DIT</p>
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            href="/features"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Features
          </Link>
          <Link
            href="/pricing"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="/blog"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Blog
          </Link>
          <Link
            href="/docs"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Docs
          </Link>
          <Link
            href="/docs#api"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            API
          </Link>
          <Link
            href="/changelog"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Changelog
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <div className="hidden md:flex items-center space-x-2">
            <Button variant="ghost" asChild>
              <Link href="/auth/signin">Sign In</Link>
            </Button>
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link href="/auth/signup">Get Started</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur">
          <nav className="container py-4 space-y-4">
            <Link
              href="/features"
              className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </Link>
            <Link
              href="/pricing"
              className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/blog"
              className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Blog
            </Link>
            <Link
              href="/docs"
              className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Docs
            </Link>
            <Link
              href="/docs#api"
              className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              API
            </Link>
            <Link
              href="/changelog"
              className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Changelog
            </Link>
            <div className="pt-4 space-y-2">
              <Button variant="ghost" asChild className="w-full justify-start">
                <Link href="/auth/signin">Sign In</Link>
              </Button>
              <Button asChild className="w-full bg-primary hover:bg-primary/90">
                <Link href="/auth/signup">Get Started</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

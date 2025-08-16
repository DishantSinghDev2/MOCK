"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowRight, Sparkles, Zap, Bot, TestTube } from "lucide-react"

export function LandingHero() {
  return (
    <section className="container py-24 md:py-32">
      <div className="flex flex-col items-center text-center space-y-8">
        <Badge variant="secondary" className="px-4 py-2 text-sm font-medium">
          <Sparkles className="w-4 h-4 mr-2" />
          AI-Native API Platform
        </Badge>

        <div className="space-y-4 max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Mock & Test APIs with <span className="text-primary">Zero Clicks</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Paste any API URL and watch our AI automatically generate realistic mocks, create comprehensive test suites,
            and deliver actionable insights.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground px-8">
            <Link href="/auth/signup">
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="#demo">Watch Demo</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16 max-w-4xl">
          <Card className="p-6 text-center hover:shadow-lg transition-shadow animate-float">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Bot className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">AI Discovery</h3>
            <p className="text-sm text-muted-foreground">
              Automatically discovers endpoints, infers schemas, and generates realistic test data
            </p>
          </Card>

          <Card
            className="p-6 text-center hover:shadow-lg transition-shadow animate-float"
            style={{ animationDelay: "0.5s" }}
          >
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Zap className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-semibold mb-2">Instant Mocks</h3>
            <p className="text-sm text-muted-foreground">
              Generate production-ready mock servers with dynamic data and scenario switching
            </p>
          </Card>

          <Card
            className="p-6 text-center hover:shadow-lg transition-shadow animate-float"
            style={{ animationDelay: "1s" }}
          >
            <div className="w-12 h-12 bg-chart-5/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <TestTube className="w-6 h-6 text-chart-5" />
            </div>
            <h3 className="font-semibold mb-2">Autonomous Testing</h3>
            <p className="text-sm text-muted-foreground">
              Background jobs run comprehensive tests and provide AI-powered insights and fixes
            </p>
          </Card>
        </div>
      </div>
    </section>
  )
}

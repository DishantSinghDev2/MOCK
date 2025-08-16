import { Suspense } from "react"
import { LandingHero } from "@/components/landing/landing-hero"
import { LandingFeatures } from "@/components/landing/landing-features"
import { LandingPricing } from "@/components/landing/landing-pricing"
import { LandingFooter } from "@/components/landing/landing-footer"
import { LandingHeader } from "@/components/landing/landing-header"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
      <LandingHeader />
      <main>
        <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading...</div>}>
          <LandingHero />
          <LandingFeatures />
          <LandingPricing />
        </Suspense>
      </main>
      <LandingFooter />
    </div>
  )
}

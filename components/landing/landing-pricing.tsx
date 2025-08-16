import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Zap, Crown, Building } from "lucide-react"
import Link from "next/link"

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for trying out MOCK",
    icon: Zap,
    features: [
      "3 projects",
      "10 mock endpoints",
      "100 test runs/month",
      "7 days log retention",
      "Community support",
      "Basic integrations",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "per month",
    description: "For professional developers",
    icon: Crown,
    features: [
      "Unlimited projects",
      "Unlimited mock endpoints",
      "10,000 test runs/month",
      "30 days log retention",
      "Priority support",
      "All integrations",
      "Advanced AI insights",
      "Custom scenarios",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Business",
    price: "$99",
    period: "per month",
    description: "For teams and organizations",
    icon: Building,
    features: [
      "Everything in Pro",
      "Unlimited team members",
      "100,000 test runs/month",
      "90 days log retention",
      "SSO & RBAC",
      "Audit logs",
      "SLA guarantee",
      "Custom integrations",
      "Dedicated support",
    ],
    cta: "Contact Sales",
    popular: false,
  },
]

export function LandingPricing() {
  return (
    <section id="pricing" className="container py-24">
      <div className="text-center space-y-4 mb-16">
        <Badge variant="outline" className="px-4 py-2">
          <Crown className="w-4 h-4 mr-2" />
          Simple Pricing
        </Badge>
        <h2 className="text-3xl md:text-4xl font-bold">Choose your plan</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Start free and scale as you grow. All plans include our core AI-powered features.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {plans.map((plan, index) => (
          <Card
            key={index}
            className={`relative overflow-hidden ${plan.popular ? "border-primary shadow-lg scale-105" : ""}`}
          >
            {plan.popular && (
              <div className="absolute top-0 left-0 right-0 bg-primary text-primary-foreground text-center py-2 text-sm font-medium">
                Most Popular
              </div>
            )}

            <CardHeader className={`text-center ${plan.popular ? "pt-12" : "pt-6"}`}>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <plan.icon className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription className="text-sm">{plan.description}</CardDescription>
              <div className="pt-4">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground">/{plan.period}</span>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <ul className="space-y-3">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center space-x-3">
                    <Check className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                asChild
                className={`w-full ${plan.popular ? "bg-primary hover:bg-primary/90" : ""}`}
                variant={plan.popular ? "default" : "outline"}
              >
                <Link href="/auth/signup">{plan.cta}</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center mt-16 space-y-4">
        <p className="text-muted-foreground">
          Need a custom plan?{" "}
          <Link href="/contact" className="text-primary hover:underline">
            Contact our sales team
          </Link>
        </p>
        <div className="flex items-center justify-center space-x-8 text-sm text-muted-foreground">
          <span>✓ 14-day free trial</span>
          <span>✓ No credit card required</span>
          <span>✓ Cancel anytime</span>
        </div>
      </div>
    </section>
  )
}

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Zap, Crown, Building } from "lucide-react"

const plans = [
  {
    id: "free",
    name: "Free",
    price: 0,
    period: "month",
    description: "Perfect for getting started",
    icon: <Zap className="h-6 w-6" />,
    features: [
      "5,000 API calls/month",
      "3 mock servers",
      "50 test runs/month",
      "1GB storage",
      "Community support",
      "Basic analytics",
    ],
    limits: {
      apiCalls: 5000,
      mockServers: 3,
      testRuns: 50,
      storage: 1,
    },
  },
  {
    id: "pro",
    name: "Pro",
    price: 29,
    period: "month",
    description: "For growing teams and projects",
    icon: <Crown className="h-6 w-6" />,
    popular: true,
    features: [
      "100,000 API calls/month",
      "25 mock servers",
      "2,000 test runs/month",
      "10GB storage",
      "Priority support",
      "Advanced analytics",
      "Custom scenarios",
      "Webhook integrations",
    ],
    limits: {
      apiCalls: 100000,
      mockServers: 25,
      testRuns: 2000,
      storage: 10,
    },
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 99,
    period: "month",
    description: "For large organizations",
    icon: <Building className="h-6 w-6" />,
    features: [
      "Unlimited API calls",
      "Unlimited mock servers",
      "Unlimited test runs",
      "100GB storage",
      "24/7 dedicated support",
      "Custom integrations",
      "SSO & RBAC",
      "SLA guarantee",
      "On-premise deployment",
    ],
    limits: {
      apiCalls: "unlimited",
      mockServers: "unlimited",
      testRuns: "unlimited",
      storage: 100,
    },
  },
]

export function PlanManagement() {
  const [currentPlan, setCurrentPlan] = useState("pro")
  const [isLoading, setIsLoading] = useState<string | null>(null)

  const handlePlanChange = async (planId: string) => {
    setIsLoading(planId)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setCurrentPlan(planId)
    setIsLoading(null)
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Choose Your Plan</h2>
        <p className="text-muted-foreground">Upgrade or downgrade your subscription anytime</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={`relative ${plan.popular ? "border-primary shadow-lg scale-105" : ""} ${
              currentPlan === plan.id ? "ring-2 ring-primary" : ""
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
              </div>
            )}
            <CardHeader className="text-center">
              <div className="flex justify-center mb-2">{plan.icon}</div>
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="text-3xl font-bold">
                ${plan.price}
                <span className="text-sm font-normal text-muted-foreground">/{plan.period}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                className="w-full"
                variant={currentPlan === plan.id ? "outline" : "default"}
                disabled={isLoading !== null}
                onClick={() => handlePlanChange(plan.id)}
              >
                {isLoading === plan.id
                  ? "Processing..."
                  : currentPlan === plan.id
                    ? "Current Plan"
                    : plan.id === "free"
                      ? "Downgrade"
                      : "Upgrade"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Usage-Based Pricing</CardTitle>
          <CardDescription>Additional charges apply when you exceed plan limits</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold">$0.001</div>
              <div className="text-sm text-muted-foreground">per extra API call</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold">$5</div>
              <div className="text-sm text-muted-foreground">per extra mock server/month</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold">$0.10</div>
              <div className="text-sm text-muted-foreground">per extra test run</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold">$2</div>
              <div className="text-sm text-muted-foreground">per extra GB storage/month</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

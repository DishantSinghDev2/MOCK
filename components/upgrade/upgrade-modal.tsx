"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Zap, Crown, Building } from "lucide-react"
import { PLAN_LIMITS } from "@/lib/plan-limits"

interface UpgradeModalProps {
  isOpen: boolean
  onClose: () => void
  currentPlan: string
  recommendedPlan?: string
  limitExceeded?: string
}

export function UpgradeModal({ isOpen, onClose, currentPlan, recommendedPlan, limitExceeded }: UpgradeModalProps) {
  const [selectedPlan, setSelectedPlan] = useState(recommendedPlan || "pro")

  const plans = Object.entries(PLAN_LIMITS).map(([key, limits]) => ({
    key,
    ...limits,
    icon: key === "free" ? Zap : key === "pro" ? Crown : Building,
  }))

  const handleUpgrade = async () => {
    // Simulate upgrade process
    console.log(`[v0] Upgrading to ${selectedPlan}`)

    // Update user plan in storage
    const userId = "current-user" // Get from auth context
    const userData = JSON.parse(localStorage.getItem(`user_${userId}`) || "{}")
    userData.plan = selectedPlan
    localStorage.setItem(`user_${userId}`, JSON.stringify(userData))

    // Show success message
    window.dispatchEvent(
      new CustomEvent("planUpgraded", {
        detail: { newPlan: selectedPlan },
      }),
    )

    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {limitExceeded ? `${limitExceeded} Limit Reached` : "Upgrade Your Plan"}
          </DialogTitle>
          {limitExceeded && (
            <p className="text-center text-muted-foreground">
              You've reached your {limitExceeded.toLowerCase()} limit. Upgrade to continue using MOCK by DIT.
            </p>
          )}
        </DialogHeader>

        <div className="grid md:grid-cols-3 gap-6 mt-6">
          {plans.map((plan) => {
            const Icon = plan.icon
            const isCurrentPlan = plan.key === currentPlan
            const isRecommended = plan.key === recommendedPlan
            const isSelected = plan.key === selectedPlan

            return (
              <div
                key={plan.key}
                className={`relative border rounded-lg p-6 cursor-pointer transition-all ${
                  isSelected ? "border-primary bg-primary/5 shadow-lg" : "border-border hover:border-primary/50"
                } ${isCurrentPlan ? "opacity-50" : ""}`}
                onClick={() => !isCurrentPlan && setSelectedPlan(plan.key)}
              >
                {isRecommended && (
                  <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-secondary text-secondary-foreground">
                    Recommended
                  </Badge>
                )}

                {isCurrentPlan && (
                  <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-muted text-muted-foreground">
                    Current Plan
                  </Badge>
                )}

                <div className="text-center mb-4">
                  <Icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <div className="text-3xl font-bold mt-2">
                    ${plan.price}
                    <span className="text-sm font-normal text-muted-foreground">/month</span>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span>Projects</span>
                    <span className="font-medium">{plan.maxProjects === -1 ? "Unlimited" : plan.maxProjects}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Mock Endpoints</span>
                    <span className="font-medium">
                      {plan.maxMockEndpoints === -1 ? "Unlimited" : plan.maxMockEndpoints}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tests/Month</span>
                    <span className="font-medium">
                      {plan.maxTestsPerMonth === -1 ? "Unlimited" : plan.maxTestsPerMonth.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Team Members</span>
                    <span className="font-medium">
                      {plan.maxTeamMembers === -1 ? "Unlimited" : plan.maxTeamMembers}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Storage</span>
                    <span className="font-medium">{plan.storage}</span>
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  {plan.features.slice(0, 4).map((feature, index) => (
                    <div key={index} className="flex items-center text-sm">
                      <Check className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                  {plan.features.length > 4 && (
                    <div className="text-sm text-muted-foreground">+{plan.features.length - 4} more features</div>
                  )}
                </div>

                {!isCurrentPlan && (
                  <Button className="w-full" variant={isSelected ? "default" : "outline"} disabled={isCurrentPlan}>
                    {isSelected ? "Selected" : "Select Plan"}
                  </Button>
                )}
              </div>
            )
          })}
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleUpgrade} disabled={selectedPlan === currentPlan} className="min-w-[120px]">
            Upgrade Now
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

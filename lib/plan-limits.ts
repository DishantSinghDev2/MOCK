export interface PlanLimits {
  name: string
  price: number
  maxProjects: number
  maxMockEndpoints: number
  maxTestsPerMonth: number
  maxConcurrentJobs: number
  maxTeamMembers: number
  maxOrganizations: number
  features: string[]
  storage: string
  support: string
}

export const PLAN_LIMITS: Record<string, PlanLimits> = {
  free: {
    name: "Free",
    price: 0,
    maxProjects: 3,
    maxMockEndpoints: 10,
    maxTestsPerMonth: 100,
    maxConcurrentJobs: 2,
    maxTeamMembers: 1,
    maxOrganizations: 0,
    features: ["Basic API Discovery", "Simple Mock Generation", "Basic Testing"],
    storage: "100MB",
    support: "Community",
  },
  pro: {
    name: "Pro",
    price: 29,
    maxProjects: 25,
    maxMockEndpoints: 100,
    maxTestsPerMonth: 1000,
    maxConcurrentJobs: 10,
    maxTeamMembers: 5,
    maxOrganizations: 1,
    features: [
      "Advanced AI Discovery",
      "Smart Mock Generation",
      "Automated Testing",
      "Performance Testing",
      "Basic Security Scans",
      "Team Collaboration",
      "API Analytics",
    ],
    storage: "10GB",
    support: "Email",
  },
  enterprise: {
    name: "Enterprise",
    price: 99,
    maxProjects: -1, // Unlimited
    maxMockEndpoints: -1, // Unlimited
    maxTestsPerMonth: -1, // Unlimited
    maxConcurrentJobs: 50,
    maxTeamMembers: -1, // Unlimited
    maxOrganizations: -1, // Unlimited
    features: [
      "Everything in Pro",
      "Advanced Security Scans",
      "Custom Integrations",
      "SSO & RBAC",
      "Priority Support",
      "Custom AI Models",
      "On-premise Deployment",
      "SLA Guarantee",
    ],
    storage: "Unlimited",
    support: "24/7 Phone & Chat",
  },
}

export class PlanEnforcer {
  static checkLimit(
    userPlan: string,
    resource: keyof PlanLimits,
    currentUsage: number,
  ): {
    allowed: boolean
    limit: number
    remaining: number
    upgradeRequired?: boolean
  } {
    const limits = PLAN_LIMITS[userPlan] || PLAN_LIMITS.free
    const limit = limits[resource] as number

    // -1 means unlimited
    if (limit === -1) {
      return {
        allowed: true,
        limit: -1,
        remaining: -1,
      }
    }

    const allowed = currentUsage < limit
    const remaining = Math.max(0, limit - currentUsage)

    return {
      allowed,
      limit,
      remaining,
      upgradeRequired: !allowed,
    }
  }

  static getUpgradeRecommendation(currentPlan: string, exceededResource: keyof PlanLimits): string {
    const planOrder = ["free", "pro", "enterprise"]
    const currentIndex = planOrder.indexOf(currentPlan)

    for (let i = currentIndex + 1; i < planOrder.length; i++) {
      const nextPlan = planOrder[i]
      const nextLimits = PLAN_LIMITS[nextPlan]
      const limit = nextLimits[exceededResource] as number

      if (limit === -1 || limit > (PLAN_LIMITS[currentPlan][exceededResource] as number)) {
        return nextPlan
      }
    }

    return "enterprise"
  }

  static formatLimitMessage(resource: keyof PlanLimits, currentPlan: string): string {
    const limits = PLAN_LIMITS[currentPlan] || PLAN_LIMITS.free
    const limit = limits[resource] as number

    if (limit === -1) return "Unlimited"

    const resourceNames: Record<keyof PlanLimits, string> = {
      name: "Plan Name",
      price: "Price",
      maxProjects: "projects",
      maxMockEndpoints: "mock endpoints",
      maxTestsPerMonth: "tests per month",
      maxConcurrentJobs: "concurrent jobs",
      maxTeamMembers: "team members",
      maxOrganizations: "organizations",
      features: "features",
      storage: "storage",
      support: "support",
    }

    return `${limit} ${resourceNames[resource] || resource}`
  }
}

export function getUsagePercentage(current: number, limit: number): number {
  if (limit === -1) return 0 // Unlimited
  return Math.min(100, (current / limit) * 100)
}

export function shouldShowUpgradePrompt(percentage: number): boolean {
  return percentage >= 80 // Show upgrade prompt at 80% usage
}

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, Zap, TestTube, Users, BarChart3, Webhook, Globe, Shield, Sparkles } from "lucide-react"

const features = [
  {
    icon: Brain,
    title: "Zero-Click AI Flow",
    description:
      "Paste an API URL and watch AI auto-discover endpoints, generate mocks, and create test suites automatically.",
    badge: "AI-Powered",
  },
  {
    icon: Zap,
    title: "AI-Generated Mock APIs",
    description:
      "Dynamic mock servers with realistic data, scenario switching, latency injection, and contract drift detection.",
    badge: "Instant",
  },
  {
    icon: TestTube,
    title: "Autonomous API Testing",
    description:
      "Background jobs run functional, contract, performance, and edge-case tests with explainable AI insights.",
    badge: "Automated",
  },
  {
    icon: BarChart3,
    title: "Observability-First UX",
    description: "Time-series logs, traces, smart diffs, and OpenTelemetry integration for complete API visibility.",
    badge: "Analytics",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Organizations, teams, RBAC permissions, audit logs, and real-time presence in projects.",
    badge: "Enterprise",
  },
  {
    icon: Webhook,
    title: "Rich Integrations",
    description: "One-click exports to Postman, Hoppscotch, GitHub PR suggestions, and Slack notifications.",
    badge: "Connected",
  },
  {
    icon: Globe,
    title: "Global Infrastructure",
    description: "Geolocation-aware payments, multi-region deployment, and localized pricing with tax compliance.",
    badge: "Worldwide",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "RBAC, audit logs, secrets vault, IP allowlists, GDPR/CCPA compliance, and 2FA support.",
    badge: "Secure",
  },
]

export function LandingFeatures() {
  return (
    <section id="features" className="container py-24 bg-muted/30">
      <div className="text-center space-y-4 mb-16">
        <Badge variant="outline" className="px-4 py-2">
          <Sparkles className="w-4 h-4 mr-2" />
          Platform Features
        </Badge>
        <h2 className="text-3xl md:text-4xl font-bold">Everything you need for API development</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          From AI-powered discovery to enterprise-grade security, MOCK provides a complete toolkit for modern API
          workflows.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="relative overflow-hidden hover:shadow-lg transition-all duration-300 group">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <Badge variant="secondary" className="text-xs">
                  {feature.badge}
                </Badge>
              </div>
              <CardTitle className="text-lg">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm leading-relaxed">{feature.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

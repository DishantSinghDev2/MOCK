import type { Metadata } from "next"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Zap,
  Brain,
  Users,
  Shield,
  BarChart3,
  Workflow,
  Globe,
  Clock,
  Code,
  TestTube,
  Palette,
  Calendar,
  ArrowRight,
  CheckCircle,
} from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Features - MOCK by DIT",
  description:
    "Discover all the powerful features of MOCK by DIT - AI-powered API mocking, testing, and collaboration platform",
}

const featureCategories = [
  {
    title: "AI-Powered Core",
    description: "Revolutionary AI capabilities that set us apart",
    icon: <Brain className="h-6 w-6" />,
    features: [
      {
        name: "Zero-Click AI Flow",
        description: "Auto-discover API endpoints from any URL with intelligent schema inference",
        icon: <Zap className="h-5 w-5" />,
        badge: "AI-Powered",
      },
      {
        name: "Predictive Testing",
        description: "AI learns from patterns and predicts failures before they happen",
        icon: <TestTube className="h-5 w-5" />,
        badge: "Revolutionary",
      },
      {
        name: "Smart Mock Generation",
        description: "Generate realistic mock APIs with contextual data and scenarios",
        icon: <Code className="h-5 w-5" />,
        badge: "AI-Powered",
      },
      {
        name: "Anomaly Detection",
        description: "Real-time ML-based detection of API performance anomalies",
        icon: <BarChart3 className="h-5 w-5" />,
        badge: "Advanced",
      },
    ],
  },
  {
    title: "Visual Builder & Automation",
    description: "Intuitive tools for rapid API development",
    icon: <Palette className="h-6 w-6" />,
    features: [
      {
        name: "Drag & Drop Builder",
        description: "Visual API builder with manual, AI-assisted, and full AI modes",
        icon: <Palette className="h-5 w-5" />,
        badge: "Visual",
      },
      {
        name: "Task Scheduling",
        description: "Automate testing, mock refreshing, and maintenance tasks",
        icon: <Calendar className="h-5 w-5" />,
        badge: "Automation",
      },
      {
        name: "Background Jobs",
        description: "Autonomous processing with circuit breakers and retry logic",
        icon: <Workflow className="h-5 w-5" />,
        badge: "Enterprise",
      },
      {
        name: "Real-time Updates",
        description: "Live progress tracking with step-by-step AI generation",
        icon: <Clock className="h-5 w-5" />,
        badge: "Real-time",
      },
    ],
  },
  {
    title: "Team Collaboration",
    description: "Advanced collaboration features for modern teams",
    icon: <Users className="h-6 w-6" />,
    features: [
      {
        name: "Live Multiplayer Sessions",
        description: "Real-time collaborative API testing with shared discoveries",
        icon: <Users className="h-5 w-5" />,
        badge: "Collaborative",
      },
      {
        name: "Operational Transforms",
        description: "Conflict-free collaborative editing with predictive resolution",
        icon: <Workflow className="h-5 w-5" />,
        badge: "Advanced",
      },
      {
        name: "Role-Based Access",
        description: "Granular permissions with team, project, and resource-level control",
        icon: <Shield className="h-5 w-5" />,
        badge: "Security",
      },
      {
        name: "Project Sharing",
        description: "Flexible sharing with public, private, and team visibility options",
        icon: <Globe className="h-5 w-5" />,
        badge: "Flexible",
      },
    ],
  },
  {
    title: "Enterprise & Security",
    description: "Production-ready features for enterprise teams",
    icon: <Shield className="h-6 w-6" />,
    features: [
      {
        name: "SSO Integration",
        description: "Single sign-on across all *.dishis.tech domains",
        icon: <Shield className="h-5 w-5" />,
        badge: "Enterprise",
      },
      {
        name: "Audit Logging",
        description: "Comprehensive audit trails for compliance and security",
        icon: <BarChart3 className="h-5 w-5" />,
        badge: "Compliance",
      },
      {
        name: "API Rate Limiting",
        description: "Advanced rate limiting with circuit breakers and failover",
        icon: <Clock className="h-5 w-5" />,
        badge: "Production",
      },
      {
        name: "Global Payments",
        description: "Geolocation-aware payments with Razorpay and PayPal",
        icon: <Globe className="h-5 w-5" />,
        badge: "Global",
      },
    ],
  },
]

const integrations = ["Postman", "GitHub", "Slack", "Hoppscotch", "OpenAPI", "Swagger", "DITblogs", "WhatsYour.Info"]

const getBadgeColor = (badge: string) => {
  switch (badge) {
    case "AI-Powered":
      return "bg-green-100 text-green-800 border-green-200"
    case "Revolutionary":
      return "bg-purple-100 text-purple-800 border-purple-200"
    case "Advanced":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "Enterprise":
      return "bg-gray-100 text-gray-800 border-gray-200"
    case "Real-time":
      return "bg-orange-100 text-orange-800 border-orange-200"
    case "Visual":
      return "bg-pink-100 text-pink-800 border-pink-200"
    case "Automation":
      return "bg-indigo-100 text-indigo-800 border-indigo-200"
    case "Collaborative":
      return "bg-cyan-100 text-cyan-800 border-cyan-200"
    case "Security":
      return "bg-red-100 text-red-800 border-red-200"
    case "Flexible":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "Compliance":
      return "bg-violet-100 text-violet-800 border-violet-200"
    case "Production":
      return "bg-emerald-100 text-emerald-800 border-emerald-200"
    case "Global":
      return "bg-teal-100 text-teal-800 border-teal-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">Powerful Features for Modern API Development</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              MOCK by DIT combines AI-powered automation with intuitive collaboration tools to revolutionize how teams
              build, test, and maintain APIs.
            </p>
            <div className="flex justify-center gap-4">
              <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
                <Link href="/auth/signin">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/docs">View Documentation</Link>
              </Button>
            </div>
          </div>

          {/* Feature Categories */}
          <div className="space-y-16">
            {featureCategories.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2 bg-green-100 rounded-lg text-green-600">{category.icon}</div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">{category.title}</h2>
                    <p className="text-gray-600">{category.description}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {category.features.map((feature, featureIndex) => (
                    <Card
                      key={featureIndex}
                      className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow"
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-50 rounded-lg text-green-600">{feature.icon}</div>
                            <CardTitle className="text-lg">{feature.name}</CardTitle>
                          </div>
                          <Badge className={getBadgeColor(feature.badge)}>{feature.badge}</Badge>
                        </div>
                        <CardDescription className="text-base ml-11">{feature.description}</CardDescription>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Integrations */}
          <div className="mt-20 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Seamless Integrations</h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Connect with your favorite tools and services to streamline your API development workflow
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {integrations.map((integration, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg"
                >
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-gray-700">{integration}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-20 text-center p-12 bg-gradient-to-r from-green-600 to-green-700 rounded-2xl text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your API Development?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of developers who trust MOCK by DIT for their API testing needs
            </p>
            <div className="flex justify-center gap-4">
              <Button asChild size="lg" variant="secondary">
                <Link href="/auth/signin">Get Started Free</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-green-600 bg-transparent"
              >
                <Link href="/pricing">View Pricing</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Zap, Bug, Shield, Sparkles } from "lucide-react"

export const metadata: Metadata = {
  title: "Changelog - MOCK by DIT",
  description: "Latest updates, features, and improvements to MOCK by DIT platform",
}

const changelogEntries = [
  {
    version: "2.1.0",
    date: "2024-01-15",
    type: "major",
    title: "Revolutionary AI-Powered Predictive Testing",
    description:
      "Introducing predictive testing that learns from API patterns and predicts failures before they happen.",
    changes: [
      { type: "feature", text: "AI-powered predictive testing with pattern learning" },
      { type: "feature", text: "Real-time collaborative editing with operational transforms" },
      { type: "feature", text: "Live multiplayer API testing sessions" },
      { type: "feature", text: "Advanced anomaly detection with ML-based insights" },
      { type: "improvement", text: "Enhanced performance with Redis caching everywhere" },
      { type: "improvement", text: "Improved UI/UX with instant loading states" },
    ],
  },
  {
    version: "2.0.5",
    date: "2024-01-10",
    type: "minor",
    title: "Enhanced Team Collaboration & API Builder",
    description: "Major improvements to team management and introduction of drag-and-drop API builder.",
    changes: [
      { type: "feature", text: "Drag-and-drop mock API builder with AI assistance" },
      { type: "feature", text: "Task scheduling and automation system" },
      { type: "feature", text: "Enhanced team member management with simplified workflows" },
      { type: "improvement", text: "Better project collaboration with real-time updates" },
      { type: "fix", text: "Fixed NextAuth middleware compatibility issues" },
      { type: "fix", text: "Resolved job queue processing edge cases" },
    ],
  },
  {
    version: "2.0.0",
    date: "2024-01-05",
    type: "major",
    title: "Complete Platform Redesign & Public API Launch",
    description: "Major platform overhaul with new design system, public APIs, and enterprise features.",
    changes: [
      { type: "feature", text: "Public API for developers with usage-based billing" },
      { type: "feature", text: "Complete UI redesign with green-based design system" },
      { type: "feature", text: "Enterprise SSO across *.dishis.tech domains" },
      { type: "feature", text: "Advanced observability with OpenTelemetry integration" },
      { type: "feature", text: "Geolocation-aware payments (Razorpay + PayPal)" },
      { type: "improvement", text: "Enhanced job queue with circuit breakers and retry logic" },
      { type: "improvement", text: "Better error handling and production-ready infrastructure" },
    ],
  },
  {
    version: "1.5.2",
    date: "2023-12-20",
    type: "patch",
    title: "Security & Performance Updates",
    description: "Critical security updates and performance optimizations.",
    changes: [
      { type: "security", text: "Enhanced API key security with rotation capabilities" },
      { type: "security", text: "Improved webhook signature validation" },
      { type: "improvement", text: "Optimized database queries for better performance" },
      { type: "fix", text: "Fixed memory leaks in background job processing" },
      { type: "fix", text: "Resolved edge cases in AI discovery engine" },
    ],
  },
  {
    version: "1.5.0",
    date: "2023-12-15",
    type: "minor",
    title: "AI Discovery Engine & Blog Integration",
    description: "Introduction of AI-powered endpoint discovery and blog system integration.",
    changes: [
      { type: "feature", text: "AI-powered API endpoint discovery from URLs" },
      { type: "feature", text: "DITblogs integration with webhook support" },
      { type: "feature", text: "Enhanced mock generation with realistic data" },
      { type: "improvement", text: "Better test automation with comprehensive coverage" },
      { type: "improvement", text: "Improved dashboard with real-time metrics" },
    ],
  },
]

const getTypeIcon = (type: string) => {
  switch (type) {
    case "feature":
      return <Sparkles className="h-4 w-4 text-green-600" />
    case "improvement":
      return <Zap className="h-4 w-4 text-blue-600" />
    case "fix":
      return <Bug className="h-4 w-4 text-orange-600" />
    case "security":
      return <Shield className="h-4 w-4 text-red-600" />
    default:
      return <CalendarDays className="h-4 w-4 text-gray-600" />
  }
}

const getTypeColor = (type: string) => {
  switch (type) {
    case "major":
      return "bg-green-100 text-green-800 border-green-200"
    case "minor":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "patch":
      return "bg-orange-100 text-orange-800 border-orange-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

export default function ChangelogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Changelog</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Stay up to date with the latest features, improvements, and fixes to MOCK by DIT
            </p>
          </div>

          {/* Changelog Entries */}
          <div className="space-y-8">
            {changelogEntries.map((entry, index) => (
              <Card key={entry.version} className="border-l-4 border-l-green-500">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-2xl">v{entry.version}</CardTitle>
                      <Badge className={getTypeColor(entry.type)}>{entry.type}</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                      <CalendarDays className="h-4 w-4" />
                      <span>{entry.date}</span>
                    </div>
                  </div>
                  <CardTitle className="text-lg text-green-700">{entry.title}</CardTitle>
                  <CardDescription className="text-base">{entry.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {entry.changes.map((change, changeIndex) => (
                      <div key={changeIndex} className="flex items-start gap-3">
                        {getTypeIcon(change.type)}
                        <span className="text-gray-700">{change.text}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Footer */}
          <div className="text-center mt-16 p-8 bg-green-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Want to stay updated?</h3>
            <p className="text-gray-600 mb-4">Follow our blog and join our community to get the latest updates</p>
            <div className="flex justify-center gap-4">
              <a
                href="/blog"
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Read Our Blog
              </a>
              <a
                href="/docs"
                className="px-6 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors"
              >
                View Documentation
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

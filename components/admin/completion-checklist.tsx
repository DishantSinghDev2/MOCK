"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, AlertCircle, Clock } from "lucide-react"

interface ChecklistItem {
  id: string
  title: string
  description: string
  category: string
  priority: "high" | "medium" | "low"
  status: "complete" | "incomplete" | "in-progress"
}

const checklistItems: ChecklistItem[] = [
  // Frontend Components
  {
    id: "landing-page",
    title: "Landing Page",
    description: "Complete landing page with hero, features, pricing",
    category: "Frontend",
    priority: "high",
    status: "complete",
  },
  {
    id: "dashboard-layout",
    title: "Dashboard Layout",
    description: "Sidebar navigation, header, responsive design",
    category: "Frontend",
    priority: "high",
    status: "complete",
  },
  {
    id: "project-management",
    title: "Project Management UI",
    description: "Create, edit, delete projects interface",
    category: "Frontend",
    priority: "high",
    status: "complete",
  },
  {
    id: "drag-drop-builder",
    title: "Drag & Drop Builder",
    description: "Visual API mock builder with AI assistance",
    category: "Frontend",
    priority: "high",
    status: "complete",
  },
  {
    id: "job-queue-ui",
    title: "Job Queue Interface",
    description: "Real-time job progress and management",
    category: "Frontend",
    priority: "high",
    status: "complete",
  },
  {
    id: "team-management-ui",
    title: "Team Management UI",
    description: "User roles, permissions, collaboration",
    category: "Frontend",
    priority: "medium",
    status: "complete",
  },
  {
    id: "billing-ui",
    title: "Billing Interface",
    description: "Subscription management, usage tracking",
    category: "Frontend",
    priority: "high",
    status: "complete",
  },
  {
    id: "documentation-ui",
    title: "Documentation Pages",
    description: "Complete guides and API reference",
    category: "Frontend",
    priority: "medium",
    status: "complete",
  },
  {
    id: "blog-integration",
    title: "Blog Integration",
    description: "DITblogs integration with posts and categories",
    category: "Frontend",
    priority: "low",
    status: "complete",
  },

  // Backend APIs
  {
    id: "auth-api",
    title: "Authentication API",
    description: "NextAuth with WhatsYour.Info OAuth",
    category: "Backend",
    priority: "high",
    status: "complete",
  },
  {
    id: "projects-api",
    title: "Projects API",
    description: "CRUD operations for projects",
    category: "Backend",
    priority: "high",
    status: "complete",
  },
  {
    id: "jobs-api",
    title: "Jobs API",
    description: "Background job management and queuing",
    category: "Backend",
    priority: "high",
    status: "complete",
  },
  {
    id: "mocks-api",
    title: "Mocks API",
    description: "Mock server creation and management",
    category: "Backend",
    priority: "high",
    status: "complete",
  },
  {
    id: "public-api",
    title: "Public Developer API",
    description: "API endpoints for external developers",
    category: "Backend",
    priority: "high",
    status: "complete",
  },
  {
    id: "webhook-api",
    title: "Webhook APIs",
    description: "DITblogs webhook for blog updates",
    category: "Backend",
    priority: "medium",
    status: "complete",
  },
  {
    id: "billing-api",
    title: "Billing API",
    description: "Payment processing and subscription management",
    category: "Backend",
    priority: "high",
    status: "incomplete",
  },

  // Database & Storage
  {
    id: "database-schema",
    title: "Database Schema",
    description: "Complete PostgreSQL schema with all tables",
    category: "Database",
    priority: "high",
    status: "complete",
  },
  {
    id: "redis-caching",
    title: "Redis Caching",
    description: "Caching layer for performance optimization",
    category: "Database",
    priority: "high",
    status: "complete",
  },
  {
    id: "data-persistence",
    title: "Data Persistence",
    description: "All data operations use live database",
    category: "Database",
    priority: "high",
    status: "complete",
  },
  {
    id: "indexeddb-fallback",
    title: "IndexedDB Fallback",
    description: "Client-side storage for offline functionality",
    category: "Database",
    priority: "medium",
    status: "complete",
  },

  // AI & Advanced Features
  {
    id: "ai-discovery",
    title: "AI API Discovery",
    description: "Autonomous endpoint discovery and analysis",
    category: "AI Features",
    priority: "high",
    status: "complete",
  },
  {
    id: "ai-mock-generation",
    title: "AI Mock Generation",
    description: "Intelligent mock data generation",
    category: "AI Features",
    priority: "high",
    status: "complete",
  },
  {
    id: "ai-testing",
    title: "AI Testing Automation",
    description: "Automated test generation and execution",
    category: "AI Features",
    priority: "high",
    status: "complete",
  },
  {
    id: "predictive-ai",
    title: "Predictive AI",
    description: "Pattern learning and failure prediction",
    category: "AI Features",
    priority: "medium",
    status: "complete",
  },
  {
    id: "collaborative-editing",
    title: "Real-time Collaboration",
    description: "Live multiplayer editing and testing",
    category: "AI Features",
    priority: "medium",
    status: "complete",
  },

  // Production Readiness
  {
    id: "error-handling",
    title: "Error Handling",
    description: "Comprehensive error boundaries and handling",
    category: "Production",
    priority: "high",
    status: "complete",
  },
  {
    id: "loading-states",
    title: "Loading States",
    description: "Proper loading indicators throughout app",
    category: "Production",
    priority: "high",
    status: "complete",
  },
  {
    id: "form-validation",
    title: "Form Validation",
    description: "Zod schemas and client/server validation",
    category: "Production",
    priority: "high",
    status: "complete",
  },
  {
    id: "rate-limiting",
    title: "Rate Limiting",
    description: "API rate limiting and abuse prevention",
    category: "Production",
    priority: "high",
    status: "complete",
  },
  {
    id: "monitoring",
    title: "Monitoring & Observability",
    description: "Logging, metrics, and health checks",
    category: "Production",
    priority: "high",
    status: "complete",
  },
  {
    id: "docker-config",
    title: "Docker Configuration",
    description: "Production-ready containerization",
    category: "Production",
    priority: "high",
    status: "complete",
  },
  {
    id: "env-variables",
    title: "Environment Variables",
    description: "Complete .env.example with all variables",
    category: "Production",
    priority: "high",
    status: "complete",
  },

  // Security & Compliance
  {
    id: "sso-implementation",
    title: "SSO Implementation",
    description: "Cross-domain authentication for *.dishis.tech",
    category: "Security",
    priority: "high",
    status: "complete",
  },
  {
    id: "api-key-auth",
    title: "API Key Authentication",
    description: "Secure API key management for public APIs",
    category: "Security",
    priority: "high",
    status: "complete",
  },
  {
    id: "plan-enforcement",
    title: "Plan Enforcement",
    description: "Usage limits and upgrade prompts",
    category: "Security",
    priority: "high",
    status: "complete",
  },
  {
    id: "audit-logging",
    title: "Audit Logging",
    description: "Security audit trails and compliance",
    category: "Security",
    priority: "medium",
    status: "complete",
  },

  // Integrations
  {
    id: "ditblogs-integration",
    title: "DITblogs Integration",
    description: "Complete blog system integration",
    category: "Integrations",
    priority: "low",
    status: "complete",
  },
  {
    id: "payment-providers",
    title: "Payment Providers",
    description: "Razorpay (India) and PayPal (global) integration",
    category: "Integrations",
    priority: "high",
    status: "incomplete",
  },
  {
    id: "external-apis",
    title: "External API Integrations",
    description: "GitHub, Slack, Postman integrations",
    category: "Integrations",
    priority: "medium",
    status: "incomplete",
  },
]

export function CompletionChecklist() {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set())

  const categories = Array.from(new Set(checklistItems.map((item) => item.category)))

  const getStatusIcon = (status: ChecklistItem["status"]) => {
    switch (status) {
      case "complete":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "in-progress":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "incomplete":
        return <AlertCircle className="h-4 w-4 text-red-500" />
    }
  }

  const getStatusBadge = (status: ChecklistItem["status"]) => {
    switch (status) {
      case "complete":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Complete
          </Badge>
        )
      case "in-progress":
        return (
          <Badge variant="default" className="bg-yellow-100 text-yellow-800">
            In Progress
          </Badge>
        )
      case "incomplete":
        return <Badge variant="destructive">Incomplete</Badge>
    }
  }

  const getPriorityBadge = (priority: ChecklistItem["priority"]) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">High</Badge>
      case "medium":
        return (
          <Badge variant="default" className="bg-yellow-100 text-yellow-800">
            Medium
          </Badge>
        )
      case "low":
        return <Badge variant="secondary">Low</Badge>
    }
  }

  const calculateProgress = (category: string) => {
    const categoryItems = checklistItems.filter((item) => item.category === category)
    const completeItems = categoryItems.filter((item) => item.status === "complete")
    return Math.round((completeItems.length / categoryItems.length) * 100)
  }

  const overallProgress = Math.round(
    (checklistItems.filter((item) => item.status === "complete").length / checklistItems.length) * 100,
  )

  return (
    <div className="space-y-6">
      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Overall Progress
            <Badge variant="default" className="text-lg px-3 py-1">
              {overallProgress}%
            </Badge>
          </CardTitle>
          <CardDescription>Platform completion status across all categories</CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={overallProgress} className="h-3" />
          <div className="flex justify-between text-sm text-muted-foreground mt-2">
            <span>{checklistItems.filter((item) => item.status === "complete").length} completed</span>
            <span>{checklistItems.length} total items</span>
          </div>
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      {categories.map((category) => {
        const categoryItems = checklistItems.filter((item) => item.category === category)
        const progress = calculateProgress(category)

        return (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {category}
                <Badge variant="outline">{progress}%</Badge>
              </CardTitle>
              <CardDescription>{categoryItems.length} items in this category</CardDescription>
              <Progress value={progress} className="h-2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {categoryItems.map((item) => (
                  <div key={item.id} className="flex items-start space-x-3 p-3 rounded-lg border">
                    <Checkbox
                      id={item.id}
                      checked={checkedItems.has(item.id)}
                      onCheckedChange={(checked) => {
                        const newChecked = new Set(checkedItems)
                        if (checked) {
                          newChecked.add(item.id)
                        } else {
                          newChecked.delete(item.id)
                        }
                        setCheckedItems(newChecked)
                      }}
                      className="mt-1"
                    />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(item.status)}
                          <h4 className="font-medium">{item.title}</h4>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getPriorityBadge(item.priority)}
                          {getStatusBadge(item.status)}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

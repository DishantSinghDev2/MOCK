"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Brain,
  AlertTriangle,
  Lightbulb,
  Code,
  ExternalLink,
  Download,
  Zap,
  Target,
  Shield,
  Clock,
  Plus,
} from "lucide-react"

const insights = [
  {
    id: "1",
    type: "performance",
    severity: "high",
    title: "Response Time Degradation Detected",
    description: "Average response time for GET /api/users has increased by 45% over the last week",
    impact: "User experience may be affected during peak hours",
    recommendation: "Consider implementing caching or optimizing database queries",
    confidence: 92,
    affectedEndpoints: ["GET /api/users", "GET /api/users/{id}"],
    icon: Clock,
    color: "text-yellow-500",
  },
  {
    id: "2",
    type: "security",
    severity: "critical",
    title: "Authentication Bypass Vulnerability",
    description: "Tests show that invalid tokens are sometimes accepted",
    impact: "Potential unauthorized access to protected resources",
    recommendation: "Review token validation logic and implement proper error handling",
    confidence: 98,
    affectedEndpoints: ["POST /api/auth/verify"],
    icon: Shield,
    color: "text-red-500",
  },
  {
    id: "3",
    type: "reliability",
    severity: "medium",
    title: "Intermittent 500 Errors",
    description: "Random server errors occurring in 2.3% of requests",
    impact: "Reduced API reliability and potential data loss",
    recommendation: "Add comprehensive error logging and implement retry mechanisms",
    confidence: 87,
    affectedEndpoints: ["POST /api/users", "PUT /api/users/{id}"],
    icon: AlertTriangle,
    color: "text-orange-500",
  },
]

const recommendations = [
  {
    id: "1",
    title: "Add Rate Limiting Tests",
    description: "Your API lacks rate limiting validation. Consider adding tests to ensure proper throttling.",
    priority: "high",
    effort: "medium",
    impact: "Prevent API abuse and ensure fair usage",
    implementation: "Add test cases that exceed rate limits and verify 429 responses",
  },
  {
    id: "2",
    title: "Implement Contract Testing",
    description: "Add schema validation tests to catch breaking changes early",
    priority: "medium",
    effort: "low",
    impact: "Prevent API contract violations and improve reliability",
    implementation: "Use JSON Schema validation for all request/response payloads",
  },
  {
    id: "3",
    title: "Add Edge Case Coverage",
    description: "Current tests focus on happy paths. Add more edge case scenarios.",
    priority: "medium",
    effort: "high",
    impact: "Improve robustness and catch corner case bugs",
    implementation: "Generate tests for boundary values, null inputs, and malformed data",
  },
]

const codeFixSuggestions = [
  {
    id: "1",
    test: "POST /api/users - Invalid email validation",
    issue: "Expected 400 Bad Request, got 500 Internal Server Error",
    suggestion: {
      language: "javascript",
      code: `// Add input validation middleware
app.use('/api/users', (req, res, next) => {
  const { email } = req.body;
  if (email && !isValidEmail(email)) {
    return res.status(400).json({
      error: 'Invalid email format'
    });
  }
  next();
});`,
    },
    confidence: 95,
  },
  {
    id: "2",
    test: "GET /api/users/{id} - Handle non-existent user",
    issue: "Returns 500 instead of 404 for non-existent users",
    suggestion: {
      language: "javascript",
      code: `// Proper error handling for user lookup
const user = await User.findById(id);
if (!user) {
  return res.status(404).json({
    error: 'User not found'
  });
}
res.json(user);`,
    },
    confidence: 98,
  },
]

export function AITestInsights({ projectId }: { projectId: string }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center space-x-2">
            <Brain className="h-5 w-5 text-primary" />
            <span>AI Test Insights</span>
          </h3>
          <p className="text-sm text-muted-foreground">
            AI-powered analysis of your test results with actionable recommendations
          </p>
        </div>
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      <Tabs defaultValue="insights" className="space-y-6">
        <TabsList>
          <TabsTrigger value="insights">Critical Insights</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="fixes">Code Fixes</TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-4">
          {insights.map((insight) => (
            <Card
              key={insight.id}
              className={`border-l-4 ${
                insight.severity === "critical"
                  ? "border-l-red-500 bg-red-500/5"
                  : insight.severity === "high"
                    ? "border-l-yellow-500 bg-yellow-500/5"
                    : "border-l-blue-500 bg-blue-500/5"
              }`}
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-lg bg-background border flex items-center justify-center`}>
                        <insight.icon className={`h-4 w-4 ${insight.color}`} />
                      </div>
                      <CardTitle className="text-lg">{insight.title}</CardTitle>
                      <Badge
                        variant={
                          insight.severity === "critical"
                            ? "destructive"
                            : insight.severity === "high"
                              ? "destructive"
                              : "secondary"
                        }
                        className="text-xs"
                      >
                        {insight.severity}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {insight.confidence}% confidence
                      </Badge>
                    </div>
                    <CardDescription className="text-sm">{insight.description}</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Details
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Impact</h4>
                    <p className="text-sm text-muted-foreground">{insight.impact}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Recommendation</h4>
                    <p className="text-sm text-muted-foreground">{insight.recommendation}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Affected Endpoints</h4>
                  <div className="flex flex-wrap gap-2">
                    {insight.affectedEndpoints.map((endpoint, index) => (
                      <Badge key={index} variant="outline" className="text-xs font-mono">
                        {endpoint}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    <Zap className="mr-2 h-4 w-4" />
                    Auto-Fix
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    <Target className="mr-2 h-4 w-4" />
                    Create Test
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          {recommendations.map((rec) => (
            <Card key={rec.id}>
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <Lightbulb className="h-5 w-5 text-yellow-500" />
                      <CardTitle className="text-lg">{rec.title}</CardTitle>
                      <Badge
                        variant={
                          rec.priority === "high" ? "destructive" : rec.priority === "medium" ? "default" : "secondary"
                        }
                        className="text-xs"
                      >
                        {rec.priority} priority
                      </Badge>
                    </div>
                    <CardDescription>{rec.description}</CardDescription>
                  </div>
                  <Button size="sm" className="bg-primary hover:bg-primary/90">
                    <Plus className="mr-2 h-4 w-4" />
                    Implement
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="text-sm font-medium mb-1">Effort</h4>
                    <Badge variant="outline" className="text-xs">
                      {rec.effort}
                    </Badge>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-1">Impact</h4>
                    <p className="text-sm text-muted-foreground">{rec.impact}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-1">Implementation</h4>
                    <p className="text-sm text-muted-foreground">{rec.implementation}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="fixes" className="space-y-4">
          {codeFixSuggestions.map((fix) => (
            <Card key={fix.id} className="border-green-500/20 bg-green-500/5">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <Code className="h-5 w-5 text-green-500" />
                      <CardTitle className="text-lg">{fix.test}</CardTitle>
                      <Badge variant="outline" className="text-xs">
                        {fix.confidence}% confidence
                      </Badge>
                    </div>
                    <CardDescription className="text-red-500">{fix.issue}</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      Copy Code
                    </Button>
                    <Button size="sm" className="bg-green-500 hover:bg-green-500/90">
                      Apply Fix
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Suggested Fix</h4>
                  <div className="bg-background border rounded-lg p-4">
                    <pre className="text-sm font-mono overflow-x-auto">
                      <code>{fix.suggestion.code}</code>
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}

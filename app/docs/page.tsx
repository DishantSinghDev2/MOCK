import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Code, Zap, Users, Settings, Key, Calendar, Blocks } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Documentation - MOCK by DIT",
  description: "Complete guide to using MOCK by DIT for AI-powered API mocking and testing",
}

const sidebarSections = [
  {
    title: "Getting Started",
    items: [
      { title: "Quick Start", href: "#quick-start", level: 0 },
      { title: "Installation", href: "#installation", level: 0 },
      { title: "Authentication", href: "#authentication", level: 0 },
      { title: "First Project", href: "#first-project", level: 0 },
    ],
  },
  {
    title: "Core Features",
    items: [
      { title: "AI Discovery", href: "#ai-discovery", level: 0 },
      { title: "Mock Generation", href: "#mock-generation", level: 1 },
      { title: "Testing Automation", href: "#testing-automation", level: 1 },
      { title: "Visual Builder", href: "#visual-builder", level: 0 },
      { title: "Drag & Drop", href: "#drag-drop", level: 1 },
      { title: "AI Assistance", href: "#ai-assistance", level: 1 },
    ],
  },
  {
    title: "Collaboration",
    items: [
      { title: "Team Management", href: "#team-management", level: 0 },
      { title: "Project Sharing", href: "#project-sharing", level: 1 },
      { title: "Real-time Editing", href: "#real-time-editing", level: 1 },
      { title: "Role-based Access", href: "#rbac", level: 1 },
    ],
  },
  {
    title: "Advanced Features",
    items: [
      { title: "Task Scheduling", href: "#task-scheduling", level: 0 },
      { title: "Observability", href: "#observability", level: 0 },
      { title: "Predictive Testing", href: "#predictive-testing", level: 1 },
      { title: "Anomaly Detection", href: "#anomaly-detection", level: 1 },
    ],
  },
  {
    title: "API Reference",
    items: [
      { title: "Authentication", href: "#api-auth", level: 0 },
      { title: "Discovery API", href: "#discovery-api", level: 0 },
      { title: "Mocks API", href: "#mocks-api", level: 0 },
      { title: "Testing API", href: "#testing-api", level: 0 },
      { title: "SDKs", href: "#sdks", level: 0 },
    ],
  },
  {
    title: "Enterprise",
    items: [
      { title: "SSO Integration", href: "#sso", level: 0 },
      { title: "Security", href: "#security", level: 1 },
      { title: "Compliance", href: "#compliance", level: 1 },
      { title: "Custom Deployment", href: "#deployment", level: 0 },
    ],
  },
]

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar Navigation */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-8 space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Documentation</h2>
                <nav className="space-y-1">
                  {sidebarSections.map((section, sectionIndex) => (
                    <div key={sectionIndex} className="space-y-1">
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 px-2 py-1">
                        {section.title}
                      </h3>
                      {section.items.map((item, itemIndex) => (
                        <Link
                          key={itemIndex}
                          href={item.href}
                          className={`block text-sm text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 px-2 py-1 rounded transition-colors ${
                            item.level === 1 ? "ml-4" : ""
                          }`}
                        >
                          {item.title}
                        </Link>
                      ))}
                    </div>
                  ))}
                </nav>
              </div>

              {/* Quick Links */}
              <div className="border-t pt-4">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Quick Links</h3>
                <div className="space-y-1">
                  <Link href="/dashboard" className="block text-sm text-gray-600 hover:text-green-600 px-2 py-1">
                    Dashboard
                  </Link>
                  <Link
                    href="/dashboard/api-keys"
                    className="block text-sm text-gray-600 hover:text-green-600 px-2 py-1"
                  >
                    API Keys
                  </Link>
                  <Link href="/pricing" className="block text-sm text-gray-600 hover:text-green-600 px-2 py-1">
                    Pricing
                  </Link>
                  <Link href="/changelog" className="block text-sm text-gray-600 hover:text-green-600 px-2 py-1">
                    Changelog
                  </Link>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 max-w-4xl">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">MOCK by DIT Documentation</h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Complete guide to using the world's most advanced AI-powered API mocking and testing platform
              </p>
            </div>

            {/* Quick Start */}
            <section id="quick-start" className="mb-12">
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-green-600" />
                    Quick Start Guide
                  </CardTitle>
                  <CardDescription>Get started with MOCK by DIT in under 5 minutes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-green-600 mb-2">1</div>
                      <h3 className="font-semibold mb-2">Sign Up</h3>
                      <p className="text-sm text-gray-600">Create your account with WhatsYour.Info OAuth</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-green-600 mb-2">2</div>
                      <h3 className="font-semibold mb-2">Create Project</h3>
                      <p className="text-sm text-gray-600">Add your API URL or upload OpenAPI spec</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-green-600 mb-2">3</div>
                      <h3 className="font-semibold mb-2">AI Discovery</h3>
                      <p className="text-sm text-gray-600">Let AI discover and mock your endpoints</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Main Documentation Tabs */}
            <Tabs defaultValue="platform" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="platform">Platform Guide</TabsTrigger>
                <TabsTrigger value="api">API Reference</TabsTrigger>
                <TabsTrigger value="collaboration">Collaboration</TabsTrigger>
                <TabsTrigger value="advanced">Advanced Features</TabsTrigger>
              </TabsList>

              {/* Platform Guide */}
              <TabsContent value="platform" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        Core Features
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">AI-Powered Discovery</h4>
                        <p className="text-sm text-gray-600 mb-2">
                          Automatically discover API endpoints from any base URL using advanced AI
                        </p>
                        <Badge variant="secondary">Auto-discovery</Badge>
                        <Badge variant="secondary">Schema inference</Badge>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Smart Mock Generation</h4>
                        <p className="text-sm text-gray-600 mb-2">
                          Generate realistic mock data with AI-powered scenarios
                        </p>
                        <Badge variant="secondary">Dynamic data</Badge>
                        <Badge variant="secondary">Scenarios</Badge>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Autonomous Testing</h4>
                        <p className="text-sm text-gray-600 mb-2">
                          Run comprehensive tests automatically with AI insights
                        </p>
                        <Badge variant="secondary">Background jobs</Badge>
                        <Badge variant="secondary">AI insights</Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Blocks className="h-5 w-5" />
                        Visual Builder
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Drag & Drop Interface</h4>
                        <p className="text-sm text-gray-600 mb-2">
                          Build APIs visually with our intuitive drag-and-drop builder
                        </p>
                        <Link href="/dashboard/projects/new/builder">
                          <Button size="sm">Try Builder</Button>
                        </Link>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">AI Assistance</h4>
                        <p className="text-sm text-gray-600 mb-2">
                          Get AI suggestions while building your APIs manually
                        </p>
                        <Badge variant="outline">Manual + AI</Badge>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Full AI Mode</h4>
                        <p className="text-sm text-gray-600 mb-2">Let AI build complete APIs from your requirements</p>
                        <Badge variant="outline">Complete AI</Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Task Scheduling
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Automated Testing</h4>
                        <p className="text-sm text-gray-600 mb-2">Schedule tests to run automatically on your APIs</p>
                        <Link href="/dashboard/schedule">
                          <Button size="sm">Schedule Tasks</Button>
                        </Link>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Mock Refresh</h4>
                        <p className="text-sm text-gray-600 mb-2">
                          Keep your mocks up-to-date with scheduled refreshes
                        </p>
                        <Badge variant="outline">Cron jobs</Badge>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Maintenance Tasks</h4>
                        <p className="text-sm text-gray-600 mb-2">Automate cleanup and optimization tasks</p>
                        <Badge variant="outline">Webhooks</Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        Observability
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Real-time Monitoring</h4>
                        <p className="text-sm text-gray-600 mb-2">Monitor your APIs with live metrics and alerts</p>
                        <Link href="/dashboard/observability">
                          <Button size="sm">View Metrics</Button>
                        </Link>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Distributed Tracing</h4>
                        <p className="text-sm text-gray-600 mb-2">Track requests across your entire API ecosystem</p>
                        <Badge variant="outline">OpenTelemetry</Badge>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Intelligent Alerts</h4>
                        <p className="text-sm text-gray-600 mb-2">Get notified about issues before they impact users</p>
                        <Badge variant="outline">AI-powered</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* API Reference */}
              <TabsContent value="api" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Code className="h-5 w-5" />
                      Public API Reference
                    </CardTitle>
                    <CardDescription>Integrate MOCK by DIT's AI capabilities into your applications</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Authentication */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Authentication</h3>
                      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                        <p className="text-sm mb-2">All API requests require an API key in the header:</p>
                        <code className="text-sm bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                          Authorization: Bearer YOUR_API_KEY
                        </code>
                      </div>
                      <Link href="/dashboard/api-keys" className="inline-block mt-2">
                        <Button size="sm">
                          <Key className="h-4 w-4 mr-2" />
                          Manage API Keys
                        </Button>
                      </Link>
                    </div>

                    {/* Endpoints */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Endpoints</h3>

                      {/* Discovery API */}
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="default">POST</Badge>
                          <code className="text-sm">/api/v1/discover</code>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">Discover API endpoints from a base URL using AI</p>
                        <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm">
                          <pre>{`curl -X POST https://mock.dishis.tech/api/v1/discover \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "baseUrl": "https://api.example.com",
    "options": {
      "depth": 3,
      "includeAuth": true
    }
  }'`}</pre>
                        </div>
                      </div>

                      {/* Mocks API */}
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="default">POST</Badge>
                          <code className="text-sm">/api/v1/mocks</code>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">Generate mock endpoints with AI-powered data</p>
                        <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm">
                          <pre>{`curl -X POST https://mock.dishis.tech/api/v1/mocks \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "endpoint": "/users",
    "method": "GET",
    "schema": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": {"type": "number"},
          "name": {"type": "string"}
        }
      }
    }
  }'`}</pre>
                        </div>
                      </div>

                      {/* Test API */}
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="default">POST</Badge>
                          <code className="text-sm">/api/v1/test</code>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">Execute comprehensive API tests with AI insights</p>
                        <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm">
                          <pre>{`curl -X POST https://mock.dishis.tech/api/v1/test \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://api.example.com/users",
    "testTypes": ["functional", "performance", "security"],
    "options": {
      "timeout": 30000,
      "concurrent": 10
    }
  }'`}</pre>
                        </div>
                      </div>
                    </div>

                    {/* SDKs */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3">SDKs & Libraries</h3>
                      <div className="grid md:grid-cols-3 gap-4">
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-base">JavaScript/Node.js</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <code className="text-sm bg-gray-100 dark:bg-gray-800 p-2 rounded block mb-2">
                              npm install @mock-dit/sdk
                            </code>
                            <Button size="sm" variant="outline">
                              View Docs
                            </Button>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-base">Python</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <code className="text-sm bg-gray-100 dark:bg-gray-800 p-2 rounded block mb-2">
                              pip install mock-dit
                            </code>
                            <Button size="sm" variant="outline">
                              View Docs
                            </Button>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-base">Go</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <code className="text-sm bg-gray-100 dark:bg-gray-800 p-2 rounded block mb-2">
                              go get github.com/mock-dit/go-sdk
                            </code>
                            <Button size="sm" variant="outline">
                              View Docs
                            </Button>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Collaboration */}
              <TabsContent value="collaboration" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Team Management
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Simple Member Management</h4>
                        <p className="text-sm text-gray-600 mb-2">Invite team members with role-based permissions</p>
                        <Link href="/dashboard/team">
                          <Button size="sm">Manage Team</Button>
                        </Link>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Project Collaboration</h4>
                        <p className="text-sm text-gray-600 mb-2">
                          Share projects with specific team members or make them public
                        </p>
                        <Badge variant="secondary">Private</Badge>
                        <Badge variant="secondary">Team</Badge>
                        <Badge variant="secondary">Public</Badge>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Role-Based Access</h4>
                        <p className="text-sm text-gray-600 mb-2">
                          Control what team members can do with granular permissions
                        </p>
                        <Badge variant="outline">Owner</Badge>
                        <Badge variant="outline">Admin</Badge>
                        <Badge variant="outline">Developer</Badge>
                        <Badge variant="outline">Viewer</Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Real-time Collaboration</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Live Multiplayer Sessions</h4>
                        <p className="text-sm text-gray-600 mb-2">
                          Collaborate in real-time with your team on API testing
                        </p>
                        <Badge variant="secondary">Live cursors</Badge>
                        <Badge variant="secondary">Shared discoveries</Badge>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Conflict Resolution</h4>
                        <p className="text-sm text-gray-600 mb-2">
                          AI-powered conflict resolution when multiple users edit simultaneously
                        </p>
                        <Badge variant="outline">Operational transforms</Badge>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Activity Feed</h4>
                        <p className="text-sm text-gray-600 mb-2">See what your team is working on in real-time</p>
                        <Badge variant="outline">Live updates</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Advanced Features */}
              <TabsContent value="advanced" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>AI-Powered Features</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Predictive Testing</h4>
                        <p className="text-sm text-gray-600 mb-2">
                          AI learns from your API patterns to predict potential failures
                        </p>
                        <Badge variant="secondary">Pattern learning</Badge>
                        <Badge variant="secondary">Failure prediction</Badge>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Anomaly Detection</h4>
                        <p className="text-sm text-gray-600 mb-2">
                          Real-time detection of unusual API behavior and performance issues
                        </p>
                        <Badge variant="secondary">Real-time alerts</Badge>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Smart Insights</h4>
                        <p className="text-sm text-gray-600 mb-2">
                          Get AI-powered recommendations for API optimization
                        </p>
                        <Badge variant="secondary">Performance tips</Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Enterprise Features</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">SSO Integration</h4>
                        <p className="text-sm text-gray-600 mb-2">Single sign-on across all *.dishis.tech domains</p>
                        <Badge variant="secondary">WhatsYour.Info</Badge>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Advanced Security</h4>
                        <p className="text-sm text-gray-600 mb-2">
                          Enterprise-grade security with audit logs and compliance
                        </p>
                        <Badge variant="outline">SOC 2</Badge>
                        <Badge variant="outline">GDPR</Badge>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Custom Integrations</h4>
                        <p className="text-sm text-gray-600 mb-2">Connect with your existing tools and workflows</p>
                        <Badge variant="outline">Slack</Badge>
                        <Badge variant="outline">GitHub</Badge>
                        <Badge variant="outline">Webhooks</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>

            {/* Support Section */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
                <CardDescription>Get support from our team or community</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent">
                    <BookOpen className="h-6 w-6" />
                    <span>Knowledge Base</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent">
                    <Users className="h-6 w-6" />
                    <span>Community Forum</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent">
                    <Settings className="h-6 w-6" />
                    <span>Contact Support</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </div>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Loader2, Upload, Link, FileText, Zap, CheckCircle } from "lucide-react"

export function CreateProjectForm() {
  const [isCreating, setIsCreating] = useState(false)
  const [creationStep, setCreationStep] = useState(0)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    environment: "development",
    method: "url",
    apiUrl: "",
    schema: "",
    curl: "",
  })

  const creationSteps = [
    "Validating input...",
    "Discovering endpoints...",
    "Inferring schemas...",
    "Generating mocks...",
    "Creating test plan...",
    "Project ready!",
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsCreating(true)
    setCreationStep(0)

    // Simulate AI discovery process
    for (let i = 0; i < creationSteps.length; i++) {
      setCreationStep(i)
      await new Promise((resolve) => setTimeout(resolve, 1500))
    }

    // Redirect to project dashboard
    setTimeout(() => {
      window.location.href = "/dashboard/projects/1"
    }, 1000)
  }

  if (isCreating) {
    return (
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center space-x-2">
            <Zap className="h-6 w-6 text-primary animate-pulse-glow" />
            <span>AI is working its magic...</span>
          </CardTitle>
          <CardDescription>This usually takes 30-60 seconds</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            {creationSteps.map((step, index) => (
              <div key={index} className="flex items-center space-x-3">
                {index < creationStep ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : index === creationStep ? (
                  <Loader2 className="h-5 w-5 text-primary animate-spin" />
                ) : (
                  <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30" />
                )}
                <span className={`text-sm ${index <= creationStep ? "text-foreground" : "text-muted-foreground"}`}>
                  {step}
                </span>
              </div>
            ))}
          </div>
          <Progress value={(creationStep / (creationSteps.length - 1)) * 100} className="w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
          <CardDescription>Basic information about your API project</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Project Name</Label>
            <Input
              id="name"
              placeholder="My Awesome API"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Brief description of your API project..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Environment</Label>
            <RadioGroup
              value={formData.environment}
              onValueChange={(value) => setFormData({ ...formData, environment: value })}
              className="flex space-x-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="development" id="development" />
                <Label htmlFor="development">Development</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="staging" id="staging" />
                <Label htmlFor="staging">Staging</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="production" id="production" />
                <Label htmlFor="production">Production</Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>API Source</CardTitle>
          <CardDescription>How would you like to provide your API information?</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={formData.method} onValueChange={(value) => setFormData({ ...formData, method: value })}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="url" className="flex items-center space-x-2">
                <Link className="h-4 w-4" />
                <span>API URL</span>
              </TabsTrigger>
              <TabsTrigger value="schema" className="flex items-center space-x-2">
                <Upload className="h-4 w-4" />
                <span>Schema</span>
              </TabsTrigger>
              <TabsTrigger value="curl" className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>cURL</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="url" className="space-y-4 mt-6">
              <div className="space-y-2">
                <Label htmlFor="apiUrl">Base URL</Label>
                <Input
                  id="apiUrl"
                  placeholder="https://api.example.com"
                  value={formData.apiUrl}
                  onChange={(e) => setFormData({ ...formData, apiUrl: e.target.value })}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Our AI will automatically discover all endpoints from this base URL
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="text-xs">
                  <Zap className="mr-1 h-3 w-3" />
                  AI Discovery
                </Badge>
                <span className="text-xs text-muted-foreground">Fastest and most comprehensive method</span>
              </div>
            </TabsContent>

            <TabsContent value="schema" className="space-y-4 mt-6">
              <div className="space-y-2">
                <Label htmlFor="schema">OpenAPI/Swagger Schema</Label>
                <Textarea
                  id="schema"
                  placeholder="Paste your OpenAPI 3.x or Swagger 2.0 specification here..."
                  className="min-h-[200px] font-mono text-sm"
                  value={formData.schema}
                  onChange={(e) => setFormData({ ...formData, schema: e.target.value })}
                />
              </div>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer">
                <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Or drag and drop your schema file here</p>
                <p className="text-xs text-muted-foreground mt-1">Supports .json, .yaml, .yml files</p>
              </div>
            </TabsContent>

            <TabsContent value="curl" className="space-y-4 mt-6">
              <div className="space-y-2">
                <Label htmlFor="curl">cURL Commands</Label>
                <Textarea
                  id="curl"
                  placeholder={`curl -X GET "https://api.example.com/users" \\
  -H "Authorization: Bearer token" \\
  -H "Content-Type: application/json"`}
                  className="min-h-[200px] font-mono text-sm"
                  value={formData.curl}
                  onChange={(e) => setFormData({ ...formData, curl: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  Paste multiple cURL commands (one per line) to define your API endpoints
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline">
          Save as Draft
        </Button>
        <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={!formData.name}>
          <Zap className="mr-2 h-4 w-4" />
          Create Project
        </Button>
      </div>
    </form>
  )
}

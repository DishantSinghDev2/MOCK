import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload, Link, FileText, Zap } from "lucide-react"

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Zap className="h-5 w-5 text-primary" />
          <span>Quick Start</span>
        </CardTitle>
        <CardDescription>Get started with AI-powered API mocking in seconds</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Paste URL */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Link className="h-4 w-4 text-primary" />
              <Label className="font-medium">Paste API URL</Label>
            </div>
            <Input placeholder="https://api.example.com" className="bg-muted/50" />
            <Button className="w-full bg-primary hover:bg-primary/90">
              <Zap className="mr-2 h-4 w-4" />
              Auto-Discover
            </Button>
          </div>

          {/* Upload Schema */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Upload className="h-4 w-4 text-accent" />
              <Label className="font-medium">Upload Schema</Label>
            </div>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer">
              <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Drop OpenAPI/Swagger file here</p>
            </div>
            <Button variant="outline" className="w-full bg-transparent">
              Browse Files
            </Button>
          </div>

          {/* Paste cURL */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4 text-chart-5" />
              <Label className="font-medium">Paste cURL</Label>
            </div>
            <Textarea placeholder="curl -X GET https://api.example.com/users" className="bg-muted/50 min-h-[80px]" />
            <Button variant="outline" className="w-full bg-transparent">
              Import cURL
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

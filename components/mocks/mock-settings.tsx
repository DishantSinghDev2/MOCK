import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save, RotateCcw, Download, Upload } from "lucide-react"

export function MockSettings({ projectId }: { projectId: string }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Mock Server Configuration</h3>
        <p className="text-sm text-muted-foreground">Configure how your mock server behaves and responds to requests</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Server Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Server Settings</CardTitle>
            <CardDescription>Basic mock server configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="baseUrl">Base URL</Label>
              <Input
                id="baseUrl"
                value={`https://mock-api-${projectId}.dishis.tech`}
                readOnly
                className="bg-muted/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="port">Port (Development)</Label>
              <Input id="port" defaultValue="3001" />
            </div>

            <div className="space-y-2">
              <Label>Response Format</Label>
              <Select defaultValue="json">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="xml">XML</SelectItem>
                  <SelectItem value="text">Plain Text</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Auto-restart on changes</Label>
                <p className="text-xs text-muted-foreground">Restart server when mock data changes</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Data Generation */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Data Generation</CardTitle>
            <CardDescription>Configure how mock data is generated</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Locale</Label>
              <Select defaultValue="en">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English (US)</SelectItem>
                  <SelectItem value="en_GB">English (UK)</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="seed">Random Seed</Label>
              <Input id="seed" placeholder="12345" />
              <p className="text-xs text-muted-foreground">Use same seed for consistent data across restarts</p>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Realistic relationships</Label>
                <p className="text-xs text-muted-foreground">Generate related data across endpoints</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Dynamic data</Label>
                <p className="text-xs text-muted-foreground">Generate new data on each request</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Security & Access</CardTitle>
            <CardDescription>Control who can access your mock server</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Require authentication</Label>
                <p className="text-xs text-muted-foreground">Require API key for access</p>
              </div>
              <Switch />
            </div>

            <div className="space-y-2">
              <Label htmlFor="allowedOrigins">Allowed Origins</Label>
              <Textarea
                id="allowedOrigins"
                placeholder="https://myapp.com&#10;https://localhost:3000"
                className="min-h-[80px]"
              />
              <p className="text-xs text-muted-foreground">One origin per line. Leave empty to allow all.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rateLimitRpm">Rate Limit (requests/minute)</Label>
              <Input id="rateLimitRpm" defaultValue="1000" type="number" />
            </div>
          </CardContent>
        </Card>

        {/* Import/Export */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Import/Export</CardTitle>
            <CardDescription>Backup and restore your mock configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Button variant="outline" className="w-full bg-transparent">
                <Download className="mr-2 h-4 w-4" />
                Export Configuration
              </Button>
              <p className="text-xs text-muted-foreground">Download all mock settings and data as JSON</p>
            </div>

            <div className="space-y-2">
              <Button variant="outline" className="w-full bg-transparent">
                <Upload className="mr-2 h-4 w-4" />
                Import Configuration
              </Button>
              <p className="text-xs text-muted-foreground">Upload and restore from a configuration file</p>
            </div>

            <div className="space-y-2">
              <Button variant="outline" className="w-full bg-transparent">
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset to Defaults
              </Button>
              <p className="text-xs text-muted-foreground">Reset all settings to their default values</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save Actions */}
      <div className="flex justify-end space-x-4">
        <Button variant="outline">Reset Changes</Button>
        <Button className="bg-primary hover:bg-primary/90">
          <Save className="mr-2 h-4 w-4" />
          Save Configuration
        </Button>
      </div>
    </div>
  )
}

import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  BookOpen,
  Code,
  ExternalLink,
  Server,
  Shield,
  Zap,
  Database,
  Bell,
  Activity,
} from 'lucide-react'

export const Route = createFileRoute('/_authenticated/docs')({
  component: DocsPage,
})

function DocsPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
          <BookOpen className="h-6 w-6 text-blue-500" />
        </div>
        <div>
          <h3 className="text-lg font-medium">Documentation</h3>
          <p className="text-sm text-muted-foreground">
            Guides and API documentation for infrastructure management
          </p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="api">API Reference</TabsTrigger>
          <TabsTrigger value="guides">Guides</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Infrastructure Dashboard</CardTitle>
              <CardDescription>
                Comprehensive monitoring and management for OpenMemory infrastructure
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                This dashboard provides centralized management for all OpenMemory services,
                including health monitoring, metrics visualization, container management,
                and administrative tools.
              </p>

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Key Features</h4>
                <ul className="grid gap-2">
                  <li className="flex items-start gap-2 text-sm">
                    <Activity className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>Real-time health monitoring for 16+ services</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <Zap className="h-4 w-4 text-yellow-500 mt-0.5" />
                    <span>Metrics visualization with VictoriaMetrics integration</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <Server className="h-4 w-4 text-blue-500 mt-0.5" />
                    <span>Container management and system monitoring (Beszel)</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <Database className="h-4 w-4 text-purple-500 mt-0.5" />
                    <span>Database connections and admin tools</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <Shield className="h-4 w-4 text-red-500 mt-0.5" />
                    <span>User management with Authelia integration</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <Bell className="h-4 w-4 text-orange-500 mt-0.5" />
                    <span>Alert system with multiple notification channels</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Technology Stack
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Frontend</span>
                  <Badge variant="outline">React + Vite</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">UI Framework</span>
                  <Badge variant="outline">Shadcn UI</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Routing</span>
                  <Badge variant="outline">TanStack Router</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Charts</span>
                  <Badge variant="outline">Recharts</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Metrics</span>
                  <Badge variant="outline">VictoriaMetrics</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ExternalLink className="h-5 w-5" />
                  Quick Links
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="https://grafana.collabmind.dev" target="_blank" rel="noopener">
                    <Activity className="mr-2 h-4 w-4" />
                    Grafana Dashboard
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="https://traefik.collabmind.dev" target="_blank" rel="noopener">
                    <Server className="mr-2 h-4 w-4" />
                    Traefik Dashboard
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="https://authelia.collabmind.dev" target="_blank" rel="noopener">
                    <Shield className="mr-2 h-4 w-4" />
                    Authelia
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="https://beszel.collabmind.dev" target="_blank" rel="noopener">
                    <Activity className="mr-2 h-4 w-4" />
                    Beszel Monitoring
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Service Directory</CardTitle>
              <CardDescription>All monitored services and their endpoints</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="mb-2 text-sm font-medium">Core Services</h4>
                  <div className="space-y-2">
                    <ServiceDoc
                      name="OpenMemory"
                      url="https://openmemory.collabmind.dev"
                      description="Primary memory service with HSG and temporal graph"
                    />
                    <ServiceDoc
                      name="OpenMemory Python"
                      url="https://openmemory-py.collabmind.dev"
                      description="Python implementation of memory service"
                    />
                    <ServiceDoc
                      name="API Gateway"
                      url="https://api.collabmind.dev"
                      description="Central API gateway with routing and authentication"
                    />
                    <ServiceDoc
                      name="XAI Memory Gateway"
                      url="https://xai.collabmind.dev"
                      description="AI-enhanced memory access gateway"
                    />
                  </div>
                </div>

                  <div>
                    <h4 className="mb-2 text-sm font-medium">XAI Services</h4>
                    <div className="space-y-2">
                      <ServiceDoc
                        name="XAI Reasoning Service"
                        url="https://reasoning-openmemory.collabmind.dev"
                        description="Grok 4.20 reasoning with memory integration, web/X search, TTS, and image generation"
                      />
                      <ServiceDoc
                        name="Ara Voice Agent"
                        url="https://ara-openmemory.collabmind.dev"
                        description="WebSocket voice agent with Grok Voice API and MCP memory connector"
                      />
                      <ServiceDoc
                        name="Collections Service"
                        url="https://collections-openmemory.collabmind.dev"
                        description="File collections with vector search (PDF, DOCX, XLSX, TXT)"
                      />
                      <ServiceDoc
                        name="Reasoning Chat (standalone)"
                        url="https://reasoning.collabmind.dev"
                        description="Independent Next.js app: Grok chat with hybrid RAG, animated stages, and xAI realtime voice"
                      />
                    </div>
                  </div>

                  <div>
                    <h4 className="mb-2 text-sm font-medium">Data & Memory</h4>
                    <div className="space-y-2">
                      <ServiceDoc
                        name="OpenMetadata"
                        url="https://openmetadata.collabmind.dev"
                        description="Data discovery, cataloging, and governance platform with Authentik SSO"
                      />
                      <ServiceDoc
                        name="Mem0"
                        url="https://mem0.collabmind.dev"
                        description="AI memory layer with persistent knowledge storage and vector search"
                      />
                      <ServiceDoc
                        name="Mem0 API"
                        url="https://mem0-api.collabmind.dev"
                        description="Mem0 REST API endpoint"
                      />
                      <ServiceDoc
                        name="Mem0 MCP"
                        url="https://mem0-mcp.collabmind.dev"
                        description="Mem0 MCP connector for AI agent integration"
                      />
                    </div>
                  </div>

                  <div>
                    <h4 className="mb-2 text-sm font-medium">Monitoring</h4>
                  <div className="space-y-2">
                    <ServiceDoc
                      name="VictoriaMetrics"
                      url="https://victoriametrics.collabmind.dev"
                      description="Time-series metrics database"
                    />
                    <ServiceDoc
                      name="Prometheus"
                      url="http://prometheus:9090"
                      description="Metrics collection and alerting"
                    />
                    <ServiceDoc
                      name="Grafana"
                      url="https://grafana.collabmind.dev"
                      description="Metrics visualization dashboard"
                    />
                    <ServiceDoc
                      name="Beszel"
                      url="https://beszel.collabmind.dev"
                      description="System monitoring and resource tracking"
                    />
                  </div>
                </div>

                <div>
                  <h4 className="mb-2 text-sm font-medium">Database Administration</h4>
                  <div className="space-y-2">
                    <ServiceDoc
                      name="NocoDB"
                      url="https://nocodb.collabmind.dev"
                      description="No-code database interface"
                    />
                    <ServiceDoc
                      name="Bytebase"
                      url="https://bytebase.collabmind.dev"
                      description="Database version control and schema management"
                    />
                    <ServiceDoc
                      name="CloudBeaver"
                      url="https://cloudbeaver.collabmind.dev"
                      description="Web-based database management"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Reference</CardTitle>
              <CardDescription>REST API endpoints for infrastructure management</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <ApiEndpoint
                  method="GET"
                  path="/health"
                  description="Health check for all services"
                  response={{
                    services: [
                      {
                        name: 'openmemory',
                        status: 'healthy',
                        responseTime: 123,
                      },
                    ],
                  }}
                />

                <ApiEndpoint
                  method="GET"
                  path="/metrics"
                  description="Fetch metrics data from VictoriaMetrics"
                  params={{
                    query: 'PromQL query string',
                    start: 'Start timestamp (ISO 8601)',
                    end: 'End timestamp (ISO 8601)',
                  }}
                />

                <ApiEndpoint
                  method="GET"
                  path="/containers"
                  description="List all Docker containers with status"
                  response={{
                    containers: [
                      {
                        name: 'openmemory',
                        status: 'running',
                        health: 'healthy',
                      },
                    ],
                  }}
                />

                <ApiEndpoint
                  method="GET"
                  path="/logs"
                  description="Fetch aggregated logs from all services"
                  params={{
                    service: 'Filter by service name',
                    level: 'Filter by log level (debug|info|warn|error|fatal)',
                    limit: 'Number of entries to return',
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guides" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Getting Started</CardTitle>
                <CardDescription>Quick start guide for new users</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <ol className="list-decimal list-inside space-y-2">
                  <li>Access the dashboard at https://intra-beta.collabmind.dev</li>
                  <li>Log in with your Authelia credentials</li>
                  <li>Review the Services page for system health</li>
                  <li>Explore Metrics for performance insights</li>
                  <li>Configure alerts in the Monitoring section</li>
                </ol>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monitoring Best Practices</CardTitle>
                <CardDescription>Tips for effective monitoring</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <ul className="list-disc list-inside space-y-2">
                  <li>Check service health daily</li>
                  <li>Set up email/Slack notifications for critical alerts</li>
                  <li>Monitor response times and set thresholds</li>
                  <li>Review logs regularly for errors</li>
                  <li>Keep metrics retention aligned with compliance needs</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Troubleshooting</CardTitle>
                <CardDescription>Common issues and solutions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>
                  <p className="font-medium">Service is unhealthy:</p>
                  <ul className="list-disc list-inside ml-4 mt-1">
                    <li>Check container logs in Logs page</li>
                    <li>Verify container status in Containers page</li>
                    <li>Review recent alerts</li>
                    <li>Restart the container if needed</li>
                  </ul>
                </div>
                <div className="mt-3">
                  <p className="font-medium">Metrics not showing:</p>
                  <ul className="list-disc list-inside ml-4 mt-1">
                    <li>Verify VictoriaMetrics is running</li>
                    <li>Check Prometheus scrape targets</li>
                    <li>Review time range selection</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Managing users and permissions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <ul className="list-disc list-inside space-y-2">
                  <li>Users are managed through Authelia</li>
                  <li>Assign users to groups for access control</li>
                  <li>Require 2FA for administrator accounts</li>
                  <li>Review audit logs regularly</li>
                  <li>Revoke inactive sessions from the Sessions tab</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ServiceDoc({
  name,
  url,
  description,
}: {
  name: string
  url: string
  description: string
}) {
  return (
    <div className="rounded-lg border p-3">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="font-medium">{name}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <a href={url} target="_blank" rel="noopener">
            <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
      </div>
      <code className="mt-2 block text-xs text-muted-foreground">{url}</code>
    </div>
  )
}

function ApiEndpoint({
  method,
  path,
  description,
  params,
  response,
}: {
  method: string
  path: string
  description: string
  params?: Record<string, string>
  response?: any
}) {
  return (
    <div className="rounded-lg border p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Badge
          variant={method === 'GET' ? 'default' : 'secondary'}
          className="font-mono text-xs"
        >
          {method}
        </Badge>
        <code className="text-sm font-medium">{path}</code>
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
      {params && (
        <div className="space-y-2">
          <p className="text-xs font-medium">Parameters:</p>
          <div className="space-y-1">
            {Object.entries(params).map(([key, value]) => (
              <div key={key} className="text-xs">
                <code className="text-blue-600">{key}</code>
                <span className="text-muted-foreground"> - {value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {response && (
        <div className="space-y-2">
          <p className="text-xs font-medium">Example Response:</p>
          <pre className="rounded bg-muted p-2 text-xs overflow-x-auto">
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}

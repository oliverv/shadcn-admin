import { createFileRoute } from '@tanstack/react-router'
import { ServiceCard } from '@/components/infrastructure/service-card'
import { useServiceHealth } from '@/hooks/use-service-health'
import { SERVICES } from '@/lib/health-check'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Server,
  Activity,
  Database,
  Network,
  BarChart3,
  Shield,
  Layers,
  RefreshCw,
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

export const Route = createFileRoute('/_authenticated/')({
  component: DashboardPage,
})

const SERVICE_METADATA = {
  'api-gateway': {
    icon: Network,
    description: 'Main API routing and load balancing',
    category: 'core' as const,
    version: undefined as string | undefined,
  },
  victoriametrics: {
    icon: Activity,
    description: 'Time-series metrics storage',
    category: 'core' as const,
    version: 'v1.93.0' as string | undefined,
  },
  prometheus: {
    icon: BarChart3,
    description: 'Metrics collection and alerting',
    category: 'core' as const,
    version: 'v2.45.0' as string | undefined,
  },
  traefik: {
    icon: Network,
    description: 'Reverse proxy and load balancer',
    category: 'core' as const,
    version: 'v3.0' as string | undefined,
  },
  qdrant: {
    icon: Layers,
    description: 'Vector database for embeddings',
    category: 'core' as const,
    version: 'v1.8.0' as string | undefined,
  },
  authelia: {
    icon: Shield,
    description: 'Authentication and SSO',
    category: 'core' as const,
    version: 'v4.38' as string | undefined,
  },
  'authelia-admin': {
    icon: Shield,
    description: 'Authelia admin API',
    category: 'admin' as const,
    version: undefined as string | undefined,
  },
  cloudbeaver: {
    icon: Database,
    description: 'Universal database manager',
    category: 'admin' as const,
    version: '26.1.0' as string | undefined,
  },
  directus: {
    icon: Server,
    description: 'Headless CMS',
    category: 'admin' as const,
    version: '11.17' as string | undefined,
  },
  bytebase: {
    icon: Database,
    description: 'Database migration tool',
    category: 'admin' as const,
    version: '3.19.0' as string | undefined,
  },
  nocodb: {
    icon: Database,
    description: 'Airtable alternative',
    category: 'admin' as const,
    version: '2026.06.0' as string | undefined,
  },
  grafana: {
    icon: BarChart3,
    description: 'Metrics visualization',
    category: 'monitoring' as const,
    version: 'v10.0' as string | undefined,
  },
  beszel: {
    icon: Server,
    description: 'Server monitoring',
    category: 'monitoring' as const,
    version: undefined as string | undefined,
  },
  litellm: {
    icon: Activity,
    description: 'LiteLLM proxy server',
    category: 'admin' as const,
    version: undefined as string | undefined,
  },
  'caddy-py': {
    icon: Network,
    description: 'Caddy Python API server',
    category: 'admin' as const,
    version: undefined as string | undefined,
  },
  'api-gateway-admin': {
    icon: Network,
    description: 'API Gateway admin interface',
    category: 'admin' as const,
    version: undefined as string | undefined,
  },
}

function DashboardPage() {
  const { healthData, isLoading, lastUpdate, refresh } = useServiceHealth({
    services: SERVICES,
    refreshInterval: 10000, // 10 seconds
    enabled: true,
  })

  const coreServices = SERVICES.filter(
    (s) => SERVICE_METADATA[s.id as keyof typeof SERVICE_METADATA]?.category === 'core'
  )
  const adminServices = SERVICES.filter(
    (s) => SERVICE_METADATA[s.id as keyof typeof SERVICE_METADATA]?.category === 'admin'
  )
  const monitoringServices = SERVICES.filter(
    (s) => SERVICE_METADATA[s.id as keyof typeof SERVICE_METADATA]?.category === 'monitoring'
  )

  const totalHealthy = Array.from(healthData.values()).filter((h) => h.status === 'healthy').length
  const totalDegraded = Array.from(healthData.values()).filter((h) => h.status === 'degraded')
    .length
  const totalDown = Array.from(healthData.values()).filter((h) => h.status === 'down').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Infrastructure Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Monitor and manage OpenMemory infrastructure services
            {lastUpdate && (
              <span className="ml-2 text-xs">
                • Updated {formatDistanceToNow(lastUpdate, { addSuffix: true })}
              </span>
            )}
          </p>
        </div>
        <Button onClick={refresh} disabled={isLoading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Refreshing...' : 'Refresh All'}
        </Button>
      </div>

      {/* Health Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Services</CardDescription>
            <CardTitle className="text-3xl">{SERVICES.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Healthy</CardDescription>
            <CardTitle className="text-3xl text-green-600">{totalHealthy}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Degraded</CardDescription>
            <CardTitle className="text-3xl text-yellow-600">{totalDegraded}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Down</CardDescription>
            <CardTitle className="text-3xl text-red-600">{totalDown}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Core Services */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Core Services</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {coreServices.map((service) => {
            const metadata = SERVICE_METADATA[service.id as keyof typeof SERVICE_METADATA]
            const health = healthData.get(service.id)

            return (
              <ServiceCard
                key={service.id}
                name={service.name}
                description={metadata?.description || ''}
                status={health?.status || 'unknown'}
                icon={metadata?.icon || Server}
                url={service.url}
                port={service.port}
                version={metadata?.version}
                onRefresh={refresh}
                metrics={
                  health?.responseTime
                    ? [
                        {
                          label: 'Response Time',
                          value: `${health.responseTime}ms`,
                        },
                      ]
                    : undefined
                }
              />
            )
          })}
        </div>
      </div>

      {/* Admin Tools */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Admin Tools</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {adminServices.map((service) => {
            const metadata = SERVICE_METADATA[service.id as keyof typeof SERVICE_METADATA]
            const health = healthData.get(service.id)

            return (
              <ServiceCard
                key={service.id}
                name={service.name}
                description={metadata?.description || ''}
                status={health?.status || 'unknown'}
                icon={metadata?.icon || Database}
                url={service.url}
                port={service.port}
                version={metadata?.version}
                onRefresh={refresh}
              />
            )
          })}
        </div>
      </div>

      {/* Monitoring Stack */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Monitoring</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {monitoringServices.map((service) => {
            const metadata = SERVICE_METADATA[service.id as keyof typeof SERVICE_METADATA]
            const health = healthData.get(service.id)

            return (
              <ServiceCard
                key={service.id}
                name={service.name}
                description={metadata?.description || ''}
                status={health?.status || 'unknown'}
                icon={metadata?.icon || Activity}
                url={service.url}
                port={service.port}
                version={metadata?.version}
                onRefresh={refresh}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

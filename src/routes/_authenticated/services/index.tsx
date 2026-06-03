import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusBadge } from '@/components/infrastructure/status-badge'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ExternalLink, RefreshCw } from 'lucide-react'

export const Route = createFileRoute('/_authenticated/services/')({
  component: ServicesPage,
})

interface Service {
  id: string
  name: string
  container: string
  status: 'healthy' | 'degraded' | 'down' | 'unknown'
  port: number
  url: string
  version?: string
  uptime?: string
  category: string
}

const services: Service[] = [
  {
    id: 'api-gateway',
    name: 'API Gateway',
    container: 'api-gateway',
    status: 'healthy',
    port: 8888,
    url: 'http://localhost:8888',
    category: 'Core',
    uptime: '15d 8h',
  },
  {
    id: 'victoriametrics',
    name: 'VictoriaMetrics',
    container: 'victoriametrics',
    status: 'healthy',
    port: 8428,
    url: 'http://localhost:8428',
    version: 'v1.93.0',
    category: 'Metrics',
    uptime: '15d 8h',
  },
  {
    id: 'prometheus',
    name: 'Prometheus',
    container: 'prometheus',
    status: 'healthy',
    port: 9093,
    url: 'http://localhost:9093',
    version: 'v2.45.0',
    category: 'Metrics',
    uptime: '15d 8h',
  },
  {
    id: 'grafana',
    name: 'Grafana',
    container: 'grafana',
    status: 'healthy',
    port: 3004,
    url: 'http://localhost:3004',
    version: 'v10.0',
    category: 'Monitoring',
    uptime: '15d 8h',
  },
  {
    id: 'traefik',
    name: 'Traefik',
    container: 'openmemory-traefik',
    status: 'healthy',
    port: 8007,
    url: 'http://localhost:8007',
    version: 'v3.0',
    category: 'Network',
    uptime: '15d 8h',
  },
  {
    id: 'qdrant',
    name: 'Qdrant',
    container: 'qdrant',
    status: 'healthy',
    port: 6333,
    url: 'http://localhost:6333',
    version: 'v1.8.0',
    category: 'Database',
    uptime: '15d 8h',
  },
  {
    id: 'authelia',
    name: 'Authelia',
    container: 'authelia',
    status: 'healthy',
    port: 9091,
    url: 'http://localhost:9091',
    version: 'v4.38',
    category: 'Security',
    uptime: '15d 8h',
  },
  {
    id: 'cloudbeaver',
    name: 'CloudBeaver',
    container: 'openmemory-cloudbeaver',
    status: 'healthy',
    port: 8978,
    url: 'http://localhost:8978',
    version: '26.1.0',
    category: 'Admin',
    uptime: '2d 4h',
  },
  {
    id: 'directus',
    name: 'Directus',
    container: 'openmemory-directus',
    status: 'healthy',
    port: 8055,
    url: 'http://localhost:8055',
    version: '11.17',
    category: 'Admin',
    uptime: '2d 4h',
  },
  {
    id: 'bytebase',
    name: 'Bytebase',
    container: 'openmemory-bytebase',
    status: 'healthy',
    port: 8089,
    url: 'http://localhost:8089',
    version: '3.19.0',
    category: 'Admin',
    uptime: '2d 4h',
  },
  {
    id: 'nocodb',
    name: 'NocoDB',
    container: 'openmemory-nocodb',
    status: 'healthy',
    port: 8083,
    url: 'http://localhost:8083',
    version: '2026.06.0',
    category: 'Admin',
    uptime: '2d 4h',
  },
]

function ServicesPage() {
  const categories = [...new Set(services.map((s) => s.category))].sort()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Services</h1>
          <p className="text-muted-foreground mt-2">
            All running infrastructure services
          </p>
        </div>
        <Button>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh All
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Services</CardDescription>
            <CardTitle className="text-3xl">{services.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Healthy</CardDescription>
            <CardTitle className="text-3xl text-green-600">
              {services.filter((s) => s.status === 'healthy').length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Degraded</CardDescription>
            <CardTitle className="text-3xl text-yellow-600">
              {services.filter((s) => s.status === 'degraded').length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Down</CardDescription>
            <CardTitle className="text-3xl text-red-600">
              {services.filter((s) => s.status === 'down').length}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Services by Category */}
      {categories.map((category) => {
        const categoryServices = services.filter((s) => s.category === category)
        return (
          <div key={category}>
            <h2 className="text-xl font-semibold mb-4">{category}</h2>
            <div className="space-y-2">
              {categoryServices.map((service) => (
                <Card key={service.id}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-4 flex-1">
                      <StatusBadge status={service.status} />
                      <div className="flex-1">
                        <h3 className="font-semibold">{service.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {service.container}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <Badge variant="outline">Port {service.port}</Badge>
                        {service.version && (
                          <Badge variant="secondary">{service.version}</Badge>
                        )}
                        {service.uptime && (
                          <span className="text-muted-foreground">
                            Uptime: {service.uptime}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={service.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

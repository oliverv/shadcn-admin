import { createFileRoute } from '@tanstack/react-router'
import { ServiceCard } from '@/components/infrastructure/service-card'
import {
  Server,
  Activity,
  Database,
  Network,
  BarChart3,
  Container,
  Shield,
  Layers,
} from 'lucide-react'

export const Route = createFileRoute('/_authenticated/')({
  component: DashboardPage,
})

function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Infrastructure Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Monitor and manage OpenMemory infrastructure services
        </p>
      </div>

      {/* Service Status Grid */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Core Services</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <ServiceCard
            name="API Gateway"
            description="Main API routing and load balancing"
            status="healthy"
            icon={Network}
            port={8888}
            url="http://localhost:8888"
            uptime="99.9%"
            metrics={[
              { label: 'Requests/min', value: '1.2K' },
              { label: 'Avg Response', value: '45ms' },
            ]}
          />
          <ServiceCard
            name="VictoriaMetrics"
            description="Time-series metrics storage"
            status="healthy"
            icon={Activity}
            port={8428}
            url="http://localhost:8428"
            version="v1.93.0"
            metrics={[
              { label: 'Series', value: '12.5K' },
              { label: 'Datapoints', value: '2.3M' },
            ]}
          />
          <ServiceCard
            name="Prometheus"
            description="Metrics collection and alerting"
            status="healthy"
            icon={BarChart3}
            port={9093}
            url="http://localhost:9093"
            version="v2.45.0"
            metrics={[
              { label: 'Targets', value: '18' },
              { label: 'Active Alerts', value: '0' },
            ]}
          />
          <ServiceCard
            name="Traefik"
            description="Reverse proxy and load balancer"
            status="healthy"
            icon={Network}
            port={8007}
            url="http://localhost:8007"
            version="v3.0"
            metrics={[
              { label: 'Routers', value: '24' },
              { label: 'Services', value: '19' },
            ]}
          />
          <ServiceCard
            name="Qdrant"
            description="Vector database for embeddings"
            status="healthy"
            icon={Layers}
            port={6333}
            url="http://localhost:6333"
            version="v1.8.0"
            metrics={[
              { label: 'Collections', value: '3' },
              { label: 'Vectors', value: '45.2K' },
            ]}
          />
          <ServiceCard
            name="Authelia"
            description="Authentication and SSO"
            status="healthy"
            icon={Shield}
            port={9091}
            url="http://localhost:9091"
            version="v4.38"
            metrics={[
              { label: 'Active Sessions', value: '12' },
              { label: 'Auth Success', value: '99.8%' },
            ]}
          />
        </div>
      </div>

      {/* Admin Tools */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Admin Tools</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <ServiceCard
            name="CloudBeaver"
            description="Universal database manager"
            status="healthy"
            icon={Database}
            port={8978}
            url="http://localhost:8978"
            version="26.1.0"
          />
          <ServiceCard
            name="Directus"
            description="Headless CMS"
            status="healthy"
            icon={Server}
            port={8055}
            url="http://localhost:8055"
            version="11.17"
          />
          <ServiceCard
            name="Bytebase"
            description="Database migration tool"
            status="healthy"
            icon={Database}
            port={8089}
            url="http://localhost:8089"
            version="3.19.0"
          />
          <ServiceCard
            name="NocoDB"
            description="Airtable alternative"
            status="healthy"
            icon={Database}
            port={8083}
            url="http://localhost:8083"
            version="2026.06.0"
          />
        </div>
      </div>

      {/* Monitoring Stack */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Monitoring</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <ServiceCard
            name="Grafana"
            description="Metrics visualization"
            status="healthy"
            icon={BarChart3}
            port={3004}
            url="http://localhost:3004"
            version="v10.0"
          />
          <ServiceCard
            name="Beszel"
            description="Server monitoring"
            status="healthy"
            icon={Server}
            port={8090}
            url="http://localhost:8090"
            version="latest"
          />
          <ServiceCard
            name="Docker"
            description="Container runtime"
            status="healthy"
            icon={Container}
            metrics={[
              { label: 'Containers', value: '28' },
              { label: 'Running', value: '28' },
            ]}
          />
        </div>
      </div>
    </div>
  )
}

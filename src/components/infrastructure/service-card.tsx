import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusBadge, type ServiceStatus } from './status-badge'
import { Button } from '@/components/ui/button'
import { ExternalLink, RefreshCw } from 'lucide-react'
import { LucideIcon } from 'lucide-react'

export interface ServiceCardProps {
  name: string
  description: string
  status: ServiceStatus
  icon: LucideIcon
  url?: string
  port?: number
  version?: string
  uptime?: string
  onRefresh?: () => void
  metrics?: {
    label: string
    value: string
  }[]
}

export function ServiceCard({
  name,
  description,
  status,
  icon: Icon,
  url,
  port,
  version,
  uptime,
  onRefresh,
  metrics,
}: ServiceCardProps) {
  return (
    <Card className="relative">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-lg">{name}</CardTitle>
            <CardDescription className="text-sm">{description}</CardDescription>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={status} />
          {onRefresh && (
            <Button variant="ghost" size="icon" onClick={onRefresh}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Service Info */}
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            {port && <span>Port: {port}</span>}
            {version && <span>Version: {version}</span>}
            {uptime && <span>Uptime: {uptime}</span>}
          </div>

          {/* Metrics */}
          {metrics && metrics.length > 0 && (
            <div className="grid grid-cols-2 gap-2 pt-2 border-t">
              {metrics.map((metric, idx) => (
                <div key={idx} className="space-y-1">
                  <p className="text-xs text-muted-foreground">{metric.label}</p>
                  <p className="text-sm font-semibold">{metric.value}</p>
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          {url && (
            <div className="pt-2">
              <Button variant="outline" size="sm" className="w-full" asChild>
                <a href={url} target="_blank" rel="noopener noreferrer">
                  Open Dashboard
                  <ExternalLink className="ml-2 h-3 w-3" />
                </a>
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

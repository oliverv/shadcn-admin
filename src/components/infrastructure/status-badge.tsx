import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export type ServiceStatus = 'healthy' | 'degraded' | 'down' | 'unknown'

interface StatusBadgeProps {
  status: ServiceStatus
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const variants = {
    healthy: {
      variant: 'default' as const,
      className: 'bg-green-500 hover:bg-green-600',
      label: 'Healthy',
    },
    degraded: {
      variant: 'default' as const,
      className: 'bg-yellow-500 hover:bg-yellow-600',
      label: 'Degraded',
    },
    down: {
      variant: 'destructive' as const,
      className: '',
      label: 'Down',
    },
    unknown: {
      variant: 'secondary' as const,
      className: '',
      label: 'Unknown',
    },
  }

  const config = variants[status]

  return (
    <Badge variant={config.variant} className={cn(config.className, className)}>
      {config.label}
    </Badge>
  )
}

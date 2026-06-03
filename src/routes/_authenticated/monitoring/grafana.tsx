import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ExternalLink, BarChart3, Activity, TrendingUp, Info } from 'lucide-react'

export const Route = createFileRoute('/_authenticated/monitoring/grafana')({
  component: GrafanaPage,
})

function GrafanaPage() {
  const grafanaUrl = import.meta.env.VITE_GRAFANA_URL || 'https://grafana-openmemory.collabmind.dev'

  return (
    <div className='space-y-4'>
      <div>
        <h3 className='text-lg font-medium'>Grafana</h3>
        <p className='text-sm text-muted-foreground'>
          Metrics visualization and alerting dashboards
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div className='space-y-1'>
              <CardTitle className='flex items-center gap-2'>
                <BarChart3 className='h-5 w-5' />
                Grafana Dashboards
              </CardTitle>
              <CardDescription>
                Time-series metrics, logs, and alerting via Grafana
              </CardDescription>
            </div>
            <Button asChild>
              <a href={grafanaUrl} target='_blank' rel='noopener noreferrer'>
                <ExternalLink className='mr-2 h-4 w-4' />
                Open Grafana
              </a>
            </Button>
          </div>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid gap-4 md:grid-cols-3'>
            <div className='flex items-center gap-3 rounded-lg border p-4'>
              <div className='rounded-full bg-primary/10 p-2'>
                <TrendingUp className='h-5 w-5 text-primary' />
              </div>
              <div>
                <p className='text-sm font-medium'>Dashboards</p>
                <p className='text-xs text-muted-foreground'>Custom metric panels</p>
              </div>
            </div>

            <div className='flex items-center gap-3 rounded-lg border p-4'>
              <div className='rounded-full bg-primary/10 p-2'>
                <Activity className='h-5 w-5 text-primary' />
              </div>
              <div>
                <p className='text-sm font-medium'>Alerting</p>
                <p className='text-xs text-muted-foreground'>Threshold-based alerts</p>
              </div>
            </div>

            <div className='flex items-center gap-3 rounded-lg border p-4'>
              <div className='rounded-full bg-primary/10 p-2'>
                <BarChart3 className='h-5 w-5 text-primary' />
              </div>
              <div>
                <p className='text-sm font-medium'>Data Sources</p>
                <p className='text-xs text-muted-foreground'>Prometheus, Victoria Metrics</p>
              </div>
            </div>
          </div>

          <div className='rounded-lg border bg-muted/50 p-4'>
            <div className='flex items-start gap-3'>
              <Info className='h-5 w-5 text-muted-foreground' />
              <div className='space-y-1'>
                <p className='text-sm font-medium'>About Grafana</p>
                <p className='text-xs text-muted-foreground'>
                  Grafana visualizes metrics from Prometheus and Victoria Metrics. Use it for historical
                  analysis, SLO tracking, and alert management. For raw metrics queries, see the Metrics page.
                </p>
              </div>
            </div>
          </div>

          <div className='overflow-hidden rounded-lg border'>
            <iframe
              src={grafanaUrl}
              className='h-[600px] w-full'
              title='Grafana Dashboards'
              sandbox='allow-same-origin allow-scripts allow-forms allow-popups'
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

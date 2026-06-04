import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ExternalLink, Server, Activity, HardDrive, Cpu, Info } from 'lucide-react'

export const Route = createFileRoute('/_authenticated/monitoring/systems')({
  component: SystemsPage,
})

function SystemsPage() {
  const beszelUrl = 'https://beszel-openmemory.collabmind.dev'

  return (
    <div className='space-y-4'>
      <div>
        <h3 className='text-lg font-medium'>System Monitoring</h3>
        <p className='text-sm text-muted-foreground'>
          Real-time system metrics and resource monitoring via Beszel
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div className='space-y-1'>
              <CardTitle className='flex items-center gap-2'>
                <Server className='h-5 w-5' />
                Beszel System Monitor
              </CardTitle>
              <CardDescription>
                View CPU, memory, disk, network, and process metrics for all connected systems
              </CardDescription>
            </div>
            <Button asChild>
              <a href={beszelUrl} target='_blank' rel='noopener noreferrer'>
                <ExternalLink className='mr-2 h-4 w-4' />
                Open Beszel
              </a>
            </Button>
          </div>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
            <div className='flex items-center gap-3 rounded-lg border p-4'>
              <div className='rounded-full bg-primary/10 p-2'>
                <Cpu className='h-5 w-5 text-primary' />
              </div>
              <div>
                <p className='text-sm font-medium'>CPU Usage</p>
                <p className='text-xs text-muted-foreground'>Per-core monitoring</p>
              </div>
            </div>

            <div className='flex items-center gap-3 rounded-lg border p-4'>
              <div className='rounded-full bg-primary/10 p-2'>
                <Activity className='h-5 w-5 text-primary' />
              </div>
              <div>
                <p className='text-sm font-medium'>Memory</p>
                <p className='text-xs text-muted-foreground'>RAM & swap usage</p>
              </div>
            </div>

            <div className='flex items-center gap-3 rounded-lg border p-4'>
              <div className='rounded-full bg-primary/10 p-2'>
                <HardDrive className='h-5 w-5 text-primary' />
              </div>
              <div>
                <p className='text-sm font-medium'>Disk I/O</p>
                <p className='text-xs text-muted-foreground'>Read/write metrics</p>
              </div>
            </div>

            <div className='flex items-center gap-3 rounded-lg border p-4'>
              <div className='rounded-full bg-primary/10 p-2'>
                <Activity className='h-5 w-5 text-primary' />
              </div>
              <div>
                <p className='text-sm font-medium'>Network</p>
                <p className='text-xs text-muted-foreground'>Bandwidth usage</p>
              </div>
            </div>
          </div>

          <div className='rounded-lg border bg-muted/50 p-4'>
            <div className='flex items-start gap-3'>
              <Info className='h-5 w-5 text-muted-foreground' />
              <div className='space-y-1'>
                <p className='text-sm font-medium'>About Beszel</p>
                <p className='text-xs text-muted-foreground'>
                  Beszel is a lightweight server monitoring platform that provides real-time system metrics,
                  historical data visualization, and alerting capabilities. Click "Open Beszel" above to access
                  the full monitoring dashboard.
                </p>
              </div>
            </div>
          </div>

          {/* Embedded iframe - may require auth */}
          <div className='overflow-hidden rounded-lg border'>
            <iframe
              src={beszelUrl}
              className='h-[600px] w-full'
              title='Beszel System Monitoring'
              sandbox='allow-same-origin allow-scripts allow-forms allow-popups'
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ExternalLink, Network, Activity, Shield, Info } from 'lucide-react'

export const Route = createFileRoute('/_authenticated/traefik/dashboard')({
  component: TraefikDashboardPage,
})

function TraefikDashboardPage() {
  const traefikUrl = import.meta.env.VITE_TRAEFIK_DASHBOARD_URL || 'https://traefik-openmemory.collabmind.dev'

  return (
    <div className='space-y-4'>
      <div>
        <h3 className='text-lg font-medium'>Traefik Dashboard</h3>
        <p className='text-sm text-muted-foreground'>
          Live view of routers, services, and middleware via Traefik
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div className='space-y-1'>
              <CardTitle className='flex items-center gap-2'>
                <Network className='h-5 w-5' />
                Traefik Reverse Proxy
              </CardTitle>
              <CardDescription>
                Real-time router, service, and middleware status
              </CardDescription>
            </div>
            <Button asChild>
              <a href={traefikUrl} target='_blank' rel='noopener noreferrer'>
                <ExternalLink className='mr-2 h-4 w-4' />
                Open Traefik
              </a>
            </Button>
          </div>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid gap-4 md:grid-cols-3'>
            <div className='flex items-center gap-3 rounded-lg border p-4'>
              <div className='rounded-full bg-primary/10 p-2'>
                <Network className='h-5 w-5 text-primary' />
              </div>
              <div>
                <p className='text-sm font-medium'>Routers</p>
                <p className='text-xs text-muted-foreground'>HTTP & TCP routes</p>
              </div>
            </div>

            <div className='flex items-center gap-3 rounded-lg border p-4'>
              <div className='rounded-full bg-primary/10 p-2'>
                <Activity className='h-5 w-5 text-primary' />
              </div>
              <div>
                <p className='text-sm font-medium'>Services</p>
                <p className='text-xs text-muted-foreground'>Backend load balancers</p>
              </div>
            </div>

            <div className='flex items-center gap-3 rounded-lg border p-4'>
              <div className='rounded-full bg-primary/10 p-2'>
                <Shield className='h-5 w-5 text-primary' />
              </div>
              <div>
                <p className='text-sm font-medium'>Middleware</p>
                <p className='text-xs text-muted-foreground'>Auth, headers, rate limits</p>
              </div>
            </div>
          </div>

          <div className='rounded-lg border bg-muted/50 p-4'>
            <div className='flex items-start gap-3'>
              <Info className='h-5 w-5 text-muted-foreground' />
              <div className='space-y-1'>
                <p className='text-sm font-medium'>About Traefik Dashboard</p>
                <p className='text-xs text-muted-foreground'>
                  The Traefik dashboard shows all active routers, services, and middleware in real time.
                  Use it to verify routing rules and debug connectivity issues. For a structured view of
                  configured routes, see the Routes tab in the sidebar.
                </p>
              </div>
            </div>
          </div>

          <div className='overflow-hidden rounded-lg border'>
            <iframe
              src={traefikUrl}
              className='h-[600px] w-full'
              title='Traefik Dashboard'
              sandbox='allow-same-origin allow-scripts allow-forms allow-popups'
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ExternalLink, BrainCircuit, Database, Key, Info } from 'lucide-react'

export const Route = createFileRoute('/_authenticated/admin/mem0')({
  component: Mem0Page,
})

function Mem0Page() {
  const mem0Url = import.meta.env.VITE_MEM0_URL || 'https://mem0.collabmind.dev'

  return (
    <div className='space-y-4'>
      <div>
        <h3 className='text-lg font-medium'>Mem0</h3>
        <p className='text-sm text-muted-foreground'>
          AI memory layer with persistent knowledge storage
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div className='space-y-1'>
              <CardTitle className='flex items-center gap-2'>
                <BrainCircuit className='h-5 w-5' />
                Mem0 Dashboard
              </CardTitle>
              <CardDescription>
                Manage AI agent memories, users, and knowledge graphs
              </CardDescription>
            </div>
            <Button asChild>
              <a href={mem0Url} target='_blank' rel='noopener noreferrer'>
                <ExternalLink className='mr-2 h-4 w-4' />
                Open Mem0
              </a>
            </Button>
          </div>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid gap-4 md:grid-cols-3'>
            <div className='flex items-center gap-3 rounded-lg border p-4'>
              <div className='rounded-full bg-primary/10 p-2'>
                <Database className='h-5 w-5 text-primary' />
              </div>
              <div>
                <p className='text-sm font-medium'>Memory Store</p>
                <p className='text-xs text-muted-foreground'>pgvector + Qdrant</p>
              </div>
            </div>

            <div className='flex items-center gap-3 rounded-lg border p-4'>
              <div className='rounded-full bg-primary/10 p-2'>
                <Key className='h-5 w-5 text-primary' />
              </div>
              <div>
                <p className='text-sm font-medium'>Auth</p>
                <p className='text-xs text-muted-foreground'>Authentik SSO</p>
              </div>
            </div>

            <div className='flex items-center gap-3 rounded-lg border p-4'>
              <div className='rounded-full bg-primary/10 p-2'>
                <BrainCircuit className='h-5 w-5 text-primary' />
              </div>
              <div>
                <p className='text-sm font-medium'>API Endpoints</p>
                <p className='text-xs text-muted-foreground'>REST + MCP</p>
              </div>
            </div>
          </div>

          <div className='rounded-lg border bg-muted/50 p-4'>
            <div className='flex items-start gap-3'>
              <Info className='h-5 w-5 text-muted-foreground' />
              <div className='space-y-1'>
                <p className='text-sm font-medium'>About Mem0</p>
                <p className='text-xs text-muted-foreground'>
                  Mem0 provides persistent memory for AI agents with vector search and temporal graph capabilities. Sign in with your Authentik credentials to access the dashboard.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ExternalLink, Search, Database, Shield, Info } from 'lucide-react'

export const Route = createFileRoute('/_authenticated/admin/openmetadata')({
  component: OpenMetadataPage,
})

function OpenMetadataPage() {
  const openmetadataUrl = import.meta.env.VITE_OPENMETADATA_URL || 'https://openmetadata.collabmind.dev'

  return (
    <div className='space-y-4'>
      <div>
        <h3 className='text-lg font-medium'>OpenMetadata</h3>
        <p className='text-sm text-muted-foreground'>
          Data discovery, cataloging, and governance platform
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div className='space-y-1'>
              <CardTitle className='flex items-center gap-2'>
                <Search className='h-5 w-5' />
                OpenMetadata Dashboard
              </CardTitle>
              <CardDescription>
                Explore and manage your data assets, schemas, and lineage
              </CardDescription>
            </div>
            <Button asChild>
              <a href={openmetadataUrl} target='_blank' rel='noopener noreferrer'>
                <ExternalLink className='mr-2 h-4 w-4' />
                Open OpenMetadata
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
                <p className='text-sm font-medium'>Data Catalog</p>
                <p className='text-xs text-muted-foreground'>Tables, schemas, views</p>
              </div>
            </div>

            <div className='flex items-center gap-3 rounded-lg border p-4'>
              <div className='rounded-full bg-primary/10 p-2'>
                <Shield className='h-5 w-5 text-primary' />
              </div>
              <div>
                <p className='text-sm font-medium'>Auth</p>
                <p className='text-xs text-muted-foreground'>Authentik SSO</p>
              </div>
            </div>

            <div className='flex items-center gap-3 rounded-lg border p-4'>
              <div className='rounded-full bg-primary/10 p-2'>
                <Database className='h-5 w-5 text-primary' />
              </div>
              <div>
                <p className='text-sm font-medium'>Version</p>
                <p className='text-xs text-muted-foreground'>1.12.6</p>
              </div>
            </div>
          </div>

          <div className='rounded-lg border bg-muted/50 p-4'>
            <div className='flex items-start gap-3'>
              <Info className='h-5 w-5 text-muted-foreground' />
              <div className='space-y-1'>
                <p className='text-sm font-medium'>About OpenMetadata</p>
                <p className='text-xs text-muted-foreground'>
                  OpenMetadata is an open-source metadata platform for data discovery, lineage, data quality, observability, and collaboration. Sign in with your Authentik credentials to access the dashboard.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

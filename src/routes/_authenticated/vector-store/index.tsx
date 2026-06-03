import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ExternalLink, Layers, Database, Search, Info } from 'lucide-react'

export const Route = createFileRoute('/_authenticated/vector-store/')({
  component: VectorStorePage,
})

function VectorStorePage() {
  const qdrantUrl = import.meta.env.VITE_QDRANT_URL || 'https://qdrant-openmemory.collabmind.dev'

  return (
    <div className='space-y-4'>
      <div>
        <h3 className='text-lg font-medium'>Vector Store</h3>
        <p className='text-sm text-muted-foreground'>
          Qdrant vector database for semantic search and memory embeddings
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div className='space-y-1'>
              <CardTitle className='flex items-center gap-2'>
                <Layers className='h-5 w-5' />
                Qdrant Vector Database
              </CardTitle>
              <CardDescription>
                High-performance vector search engine for OpenMemory embeddings
              </CardDescription>
            </div>
            <Button asChild>
              <a href={qdrantUrl} target='_blank' rel='noopener noreferrer'>
                <ExternalLink className='mr-2 h-4 w-4' />
                Open Qdrant
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
                <p className='text-sm font-medium'>Collections</p>
                <p className='text-xs text-muted-foreground'>Vector collections</p>
              </div>
            </div>

            <div className='flex items-center gap-3 rounded-lg border p-4'>
              <div className='rounded-full bg-primary/10 p-2'>
                <Search className='h-5 w-5 text-primary' />
              </div>
              <div>
                <p className='text-sm font-medium'>Semantic Search</p>
                <p className='text-xs text-muted-foreground'>Cosine similarity queries</p>
              </div>
            </div>

            <div className='flex items-center gap-3 rounded-lg border p-4'>
              <div className='rounded-full bg-primary/10 p-2'>
                <Layers className='h-5 w-5 text-primary' />
              </div>
              <div>
                <p className='text-sm font-medium'>Embeddings</p>
                <p className='text-xs text-muted-foreground'>Memory vector index</p>
              </div>
            </div>
          </div>

          <div className='rounded-lg border bg-muted/50 p-4'>
            <div className='flex items-start gap-3'>
              <Info className='h-5 w-5 text-muted-foreground' />
              <div className='space-y-1'>
                <p className='text-sm font-medium'>About Qdrant</p>
                <p className='text-xs text-muted-foreground'>
                  Qdrant powers the semantic search layer in OpenMemory. It stores vector embeddings
                  for all memories and enables fast nearest-neighbour lookups used by the HSG memory
                  engine. Click "Open Qdrant" to browse collections and inspect vectors directly.
                </p>
              </div>
            </div>
          </div>

          <div className='overflow-hidden rounded-lg border'>
            <iframe
              src={qdrantUrl}
              className='h-[600px] w-full'
              title='Qdrant Vector Store'
              sandbox='allow-same-origin allow-scripts allow-forms allow-popups'
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

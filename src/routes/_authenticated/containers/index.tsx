import { createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Search, ExternalLink, Box, Database, Shield, Activity, Network, CheckCircle2, XCircle, AlertCircle, Play } from 'lucide-react'
import { getContainers, getContainersByCategory, getContainerStats, ContainerInfo } from '@/lib/containers'

export const Route = createFileRoute('/_authenticated/containers/')({
  component: ContainersPage,
})

function ContainersPage() {
  const [search, setSearch] = useState('')
  const containers = useMemo(() => getContainers(), [])
  const byCategory = useMemo(() => getContainersByCategory(), [])
  const stats = useMemo(() => getContainerStats(), [])

  const filteredContainers = useMemo(() => {
    if (!search) return containers
    const query = search.toLowerCase()
    return containers.filter(
      c =>
        c.name.toLowerCase().includes(query) ||
        c.service.toLowerCase().includes(query) ||
        c.description.toLowerCase().includes(query) ||
        c.image.toLowerCase().includes(query)
    )
  }, [search, containers])

  const getStatusBadge = (status: ContainerInfo['status']) => {
    const config = {
      healthy: { variant: 'default' as const, icon: CheckCircle2, text: 'Healthy' },
      running: { variant: 'secondary' as const, icon: Play, text: 'Running' },
      unhealthy: { variant: 'destructive' as const, icon: XCircle, text: 'Unhealthy' },
      starting: { variant: 'outline' as const, icon: AlertCircle, text: 'Starting' },
      unknown: { variant: 'outline' as const, icon: AlertCircle, text: 'Unknown' },
    }

    const { variant, icon: Icon, text } = config[status]
    return (
      <Badge variant={variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {text}
      </Badge>
    )
  }

  const getCategoryIcon = (category: ContainerInfo['category']) => {
    const icons = {
      core: Box,
      admin: Shield,
      monitoring: Activity,
      database: Database,
      proxy: Network,
    }
    return icons[category]
  }

  const getCategoryColor = (category: ContainerInfo['category']) => {
    const colors = {
      core: 'text-blue-500',
      admin: 'text-purple-500',
      monitoring: 'text-green-500',
      database: 'text-orange-500',
      proxy: 'text-cyan-500',
    }
    return colors[category]
  }

  const renderContainerTable = (containers: ContainerInfo[]) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Container</TableHead>
          <TableHead>Image</TableHead>
          <TableHead>Port</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Health Check</TableHead>
          <TableHead>URL</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {containers.map((container) => {
          const Icon = getCategoryIcon(container.category)
          const colorClass = getCategoryColor(container.category)
          
          return (
            <TableRow key={container.name}>
              <TableCell>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Icon className={`h-4 w-4 ${colorClass}`} />
                    <span className="font-mono text-sm font-medium">{container.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{container.description}</p>
                </div>
              </TableCell>
              <TableCell className="font-mono text-xs text-muted-foreground">
                {container.image}
              </TableCell>
              <TableCell className="font-mono text-sm">
                {container.port ? (
                  <span>
                    {container.port}
                    {container.internalPort && container.port !== container.internalPort.toString() && (
                      <span className="text-muted-foreground">:{container.internalPort}</span>
                    )}
                  </span>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell>{getStatusBadge(container.status)}</TableCell>
              <TableCell>
                {container.healthCheck ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                  <span className="text-muted-foreground text-xs">None</span>
                )}
              </TableCell>
              <TableCell>
                {container.url ? (
                  <a
                    href={container.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs hover:underline"
                  >
                    Open
                    <ExternalLink className="h-3 w-3" />
                  </a>
                ) : (
                  <span className="text-muted-foreground text-xs">—</span>
                )}
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">Containers</h3>
        <p className="text-sm text-muted-foreground">
          Docker containers running in the OpenMemory stack
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Box className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Containers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Healthy</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.healthy}</div>
            <p className="text-xs text-muted-foreground">Passing health checks</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Running</CardTitle>
            <Play className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.running}</div>
            <p className="text-xs text-muted-foreground">No health check</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unhealthy</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.unhealthy}</div>
            <p className="text-xs text-muted-foreground">Failing checks</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monitored</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.withHealthCheck}</div>
            <p className="text-xs text-muted-foreground">With health checks</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
            <TabsTrigger value="core">Core ({byCategory.core.length})</TabsTrigger>
            <TabsTrigger value="admin">Admin ({byCategory.admin.length})</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoring ({byCategory.monitoring.length})</TabsTrigger>
            <TabsTrigger value="database">Database ({byCategory.database.length})</TabsTrigger>
            <TabsTrigger value="proxy">Proxy ({byCategory.proxy.length})</TabsTrigger>
          </TabsList>

          <div className="relative w-72">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search containers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Containers</CardTitle>
              <CardDescription>Complete list of Docker containers in the stack</CardDescription>
            </CardHeader>
            <CardContent>{renderContainerTable(filteredContainers)}</CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="core" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Core Services</CardTitle>
              <CardDescription>Essential OpenMemory services</CardDescription>
            </CardHeader>
            <CardContent>{renderContainerTable(byCategory.core)}</CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="admin" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Admin Tools</CardTitle>
              <CardDescription>Management and administration interfaces</CardDescription>
            </CardHeader>
            <CardContent>{renderContainerTable(byCategory.admin)}</CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monitoring Services</CardTitle>
              <CardDescription>Metrics collection and visualization</CardDescription>
            </CardHeader>
            <CardContent>{renderContainerTable(byCategory.monitoring)}</CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="database" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Database Services</CardTitle>
              <CardDescription>Data storage and caching</CardDescription>
            </CardHeader>
            <CardContent>{renderContainerTable(byCategory.database)}</CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="proxy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Proxy & Routing</CardTitle>
              <CardDescription>Reverse proxies and load balancers</CardDescription>
            </CardHeader>
            <CardContent>{renderContainerTable(byCategory.proxy)}</CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

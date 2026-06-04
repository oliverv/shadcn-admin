import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Database,
  ExternalLink,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Server,
  Zap,
  GitBranch,
  Table2,
  Wrench,
} from 'lucide-react'
import { getDatabases, getAdminTools, getDatabaseStats, getConnectionString } from '@/lib/databases'

export const Route = createFileRoute('/_authenticated/admin/databases')({
  component: DatabasesPage,
})

function DatabasesPage() {
  const databases = getDatabases()
  const adminTools = getAdminTools()
  const stats = getDatabaseStats()

  const getStatusBadge = (status: string) => {
    const config = {
      connected: { variant: 'default' as const, icon: CheckCircle2, text: 'Connected' },
      unhealthy: { variant: 'destructive' as const, icon: XCircle, text: 'Unhealthy' },
      disconnected: { variant: 'outline' as const, icon: AlertCircle, text: 'Disconnected' },
      unknown: { variant: 'outline' as const, icon: AlertCircle, text: 'Unknown' },
    }

    const { variant, icon: Icon, text } = config[status as keyof typeof config] || config.unknown
    return (
      <Badge variant={variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {text}
      </Badge>
    )
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'postgres':
        return Database
      case 'redis':
        return Zap
      case 'vector':
        return Server
      default:
        return Database
    }
  }

  const getToolIcon = (category: string) => {
    switch (category) {
      case 'database':
        return Table2
      case 'migration':
        return GitBranch
      case 'admin':
        return Wrench
      default:
        return Database
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">Databases</h3>
        <p className="text-sm text-muted-foreground">
          Database connections and administration tools
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Databases</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.postgres} Postgres, {stats.redis} Redis, {stats.vector} Vector
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connected</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.connected}</div>
            <p className="text-xs text-muted-foreground">Active connections</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unhealthy</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.unhealthy}</div>
            <p className="text-xs text-muted-foreground">Needs attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admin Tools</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.adminTools}</div>
            <p className="text-xs text-muted-foreground">{stats.healthyTools} healthy</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="databases" className="space-y-4">
        <TabsList>
          <TabsTrigger value="databases">Databases ({stats.total})</TabsTrigger>
          <TabsTrigger value="tools">Admin Tools ({stats.adminTools})</TabsTrigger>
        </TabsList>

        <TabsContent value="databases" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-1">
            {databases.map((db) => {
              const Icon = getTypeIcon(db.type)
              
              return (
                <Card key={db.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Icon className="h-5 w-5" />
                          <CardTitle>{db.name}</CardTitle>
                          {getStatusBadge(db.status)}
                        </div>
                        <CardDescription>{db.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">Connection</p>
                        <p className="font-mono text-sm">{getConnectionString(db)}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">Primary Use</p>
                        <p className="text-sm">{db.primaryUse}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">Container</p>
                        <p className="font-mono text-sm">{db.container || 'N/A'}</p>
                      </div>
                    </div>

                    {db.backends.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-muted-foreground">Environment Variables</p>
                        <div className="flex flex-wrap gap-2">
                          {db.backends.map((backend, idx) => (
                            <Badge key={idx} variant="secondary" className="font-mono text-xs">
                              {backend}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {db.adminTools.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-muted-foreground">Admin Tools</p>
                        <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                          {db.adminTools.map((tool, idx) => (
                            <Button
                              key={idx}
                              variant="outline"
                              size="sm"
                              className="justify-start"
                              asChild
                            >
                              <a href={tool.url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="mr-2 h-3 w-3" />
                                {tool.name}
                              </a>
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="tools" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Database Administration Tools</CardTitle>
              <CardDescription>
                Web-based tools for managing databases, schemas, and migrations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tool</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Supports</TableHead>
                    <TableHead>Features</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Access</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {adminTools.map((tool) => {
                    const Icon = getToolIcon(tool.category)
                    
                    return (
                      <TableRow key={tool.id}>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Icon className="h-4 w-4" />
                              <span className="font-medium">{tool.name}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">{tool.description}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{tool.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {tool.supports.map((db, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {db}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs">
                            <p className="text-xs text-muted-foreground">
                              {tool.features.slice(0, 3).join(', ')}
                              {tool.features.length > 3 && ` +${tool.features.length - 3} more`}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={tool.status === 'healthy' ? 'default' : 'secondary'}
                            className="gap-1"
                          >
                            {tool.status === 'healthy' ? (
                              <CheckCircle2 className="h-3 w-3" />
                            ) : (
                              <AlertCircle className="h-3 w-3" />
                            )}
                            {tool.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm" asChild>
                            <a href={tool.url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="mr-2 h-3 w-3" />
                              Open
                            </a>
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Quick Access Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            {adminTools.map((tool) => {
              const Icon = getToolIcon(tool.category)
              
              return (
                <Card key={tool.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="h-5 w-5" />
                        <CardTitle className="text-base">{tool.name}</CardTitle>
                      </div>
                      <Badge variant={tool.status === 'healthy' ? 'default' : 'secondary'}>
                        {tool.status}
                      </Badge>
                    </div>
                    <CardDescription className="text-xs">{tool.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground">Features</p>
                      <ul className="space-y-0.5 text-xs text-muted-foreground">
                        {tool.features.slice(0, 4).map((feature, idx) => (
                          <li key={idx}>• {feature}</li>
                        ))}
                      </ul>
                    </div>
                    <Button className="w-full" asChild>
                      <a href={tool.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Open {tool.name}
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

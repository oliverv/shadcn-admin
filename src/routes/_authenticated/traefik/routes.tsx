import { useState, useMemo } from 'react'
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
import { Search, ExternalLink, Shield, Key, Globe, ArrowRight, Server, Layers } from 'lucide-react'
import { parseTraefikConfig, getRouterHosts, getAuthType, isPublicRoute } from '@/lib/traefik'

export default function TraefikRoutesPage() {
  const [search, setSearch] = useState('')
  const config = useMemo(() => parseTraefikConfig(), [])

  const filteredRouters = useMemo(() => {
    if (!search) return config.routers
    const query = search.toLowerCase()
    return config.routers.filter(
      router =>
        router.name.toLowerCase().includes(query) ||
        router.rule.toLowerCase().includes(query) ||
        router.service.toLowerCase().includes(query) ||
        getRouterHosts(router).some(host => host.toLowerCase().includes(query))
    )
  }, [search, config.routers])

  const stats = useMemo(() => {
    return {
      totalRouters: config.routers.length,
      publicRoutes: config.routers.filter(isPublicRoute).length,
      oauth2Routes: config.routers.filter(r => getAuthType(r) === 'OAuth2').length,
      jwtRoutes: config.routers.filter(r => getAuthType(r) === 'JWT').length,
      apiKeyRoutes: config.routers.filter(r => getAuthType(r) === 'API Key').length,
      totalMiddlewares: config.middlewares.length,
      totalServices: config.services.length,
    }
  }, [config])

  const getAuthBadge = (authType: string) => {
    const variants = {
      'OAuth2': 'default',
      'JWT': 'secondary',
      'API Key': 'outline',
      'None': 'destructive',
    } as const

    const icons = {
      'OAuth2': Shield,
      'JWT': Key,
      'API Key': Key,
      'None': Globe,
    }

    const Icon = icons[authType as keyof typeof icons]
    const variant = variants[authType as keyof typeof variants]

    return (
      <Badge variant={variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {authType}
      </Badge>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">Traefik Routes</h3>
        <p className="text-sm text-muted-foreground">
          HTTP routers, services, and middleware configuration
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Routes</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRouters}</div>
            <p className="text-xs text-muted-foreground">Active HTTP routers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">OAuth2 Protected</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.oauth2Routes}</div>
            <p className="text-xs text-muted-foreground">Via Authelia</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Public Routes</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.publicRoutes}</div>
            <p className="text-xs text-muted-foreground">No authentication</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Middlewares</CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMiddlewares}</div>
            <p className="text-xs text-muted-foreground">Active middleware</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="routers" className="space-y-4">
        <TabsList>
          <TabsTrigger value="routers">Routers ({stats.totalRouters})</TabsTrigger>
          <TabsTrigger value="services">Services ({stats.totalServices})</TabsTrigger>
          <TabsTrigger value="middlewares">Middlewares ({stats.totalMiddlewares})</TabsTrigger>
        </TabsList>

        <TabsContent value="routers" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>HTTP Routers</CardTitle>
                  <CardDescription>
                    Route matching rules and middleware chains
                  </CardDescription>
                </div>
                <div className="relative w-72">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search routes..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Router</TableHead>
                    <TableHead>Host(s)</TableHead>
                    <TableHead>Auth</TableHead>
                    <TableHead>Middleware Chain</TableHead>
                    <TableHead>Service</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRouters.map((router) => {
                    const hosts = getRouterHosts(router)
                    const authType = getAuthType(router)
                    
                    return (
                      <TableRow key={router.name}>
                        <TableCell className="font-mono text-sm">{router.name}</TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            {hosts.map((host, idx) => (
                              <a
                                key={idx}
                                href={`https://${host}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-xs hover:underline"
                              >
                                {host}
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>{getAuthBadge(authType)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            {router.middlewares.length > 0 ? (
                              <>
                                {router.middlewares.map((mw, idx) => (
                                  <span key={idx} className="flex items-center gap-1">
                                    {mw}
                                    {idx < router.middlewares.length - 1 && (
                                      <ArrowRight className="h-3 w-3" />
                                    )}
                                  </span>
                                ))}
                              </>
                            ) : (
                              <span className="text-muted-foreground">None</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-xs">{router.service}</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Backend Services</CardTitle>
              <CardDescription>
                Load balancer configurations and upstream servers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead>Backend URL</TableHead>
                    <TableHead>Used By</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {config.services.map((service) => {
                    const usedBy = config.routers.filter(r => r.service === service.name)
                    
                    return (
                      <TableRow key={service.name}>
                        <TableCell className="font-mono text-sm">{service.name}</TableCell>
                        <TableCell className="font-mono text-xs">
                          {service.loadBalancer.servers.map((server, idx) => (
                            <div key={idx}>{server.url}</div>
                          ))}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {usedBy.map((router) => (
                              <Badge key={router.name} variant="outline" className="text-xs">
                                {router.name}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="middlewares" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>HTTP Middlewares</CardTitle>
              <CardDescription>
                Request/response transformation and authentication
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Middleware</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Configuration</TableHead>
                    <TableHead>Used By</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {config.middlewares.map((middleware) => {
                    const usedBy = config.routers.filter(r => r.middlewares.includes(middleware.name))
                    
                    return (
                      <TableRow key={middleware.name}>
                        <TableCell className="font-mono text-sm">{middleware.name}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{middleware.type}</Badge>
                        </TableCell>
                        <TableCell className="max-w-md">
                          <pre className="text-xs text-muted-foreground overflow-x-auto">
                            {JSON.stringify(middleware.config, null, 2)}
                          </pre>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-muted-foreground">
                            {usedBy.length} router{usedBy.length !== 1 ? 's' : ''}
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

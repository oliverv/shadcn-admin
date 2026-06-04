import { createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Cloud,
  Shield,
  Globe,
  Search,
  CheckCircle2,
  XCircle,
  Server,
  Lock,
  ExternalLink,
} from 'lucide-react'
import {
  getAllZones,
  getCloudflareZone,
  getDNSRecords,
  getCloudflareStats,
  getAllTags,
  getFirewallRules,
  getPageRules,
  getWorkers,
  getCacheSettings,
  getSecuritySettings,
  getAnalyticsSummary,
} from '@/lib/cloudflare'

export const Route = createFileRoute('/_authenticated/admin/cloudflare')({
  component: CloudflarePage,
})

function CloudflarePage() {
  const [search, setSearch] = useState('')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [selectedZoneId, setSelectedZoneId] = useState<string>('')

  const zones = useMemo(() => getAllZones(), [])
  const zone = useMemo(() => getCloudflareZone(selectedZoneId), [selectedZoneId])
  const records = useMemo(() => getDNSRecords(selectedZoneId), [selectedZoneId])
  const stats = useMemo(() => getCloudflareStats(selectedZoneId), [selectedZoneId])
  const tags = useMemo(() => getAllTags(), [])
  const firewallRules = useMemo(() => getFirewallRules(selectedZoneId), [selectedZoneId])
  const pageRules = useMemo(() => getPageRules(selectedZoneId), [selectedZoneId])
  const workers = useMemo(() => getWorkers(selectedZoneId), [selectedZoneId])
  const cacheSettings = useMemo(() => getCacheSettings(selectedZoneId), [selectedZoneId])
  const securitySettings = useMemo(() => getSecuritySettings(selectedZoneId), [selectedZoneId])
  const analytics = useMemo(() => getAnalyticsSummary(selectedZoneId), [selectedZoneId])

  const filteredRecords = useMemo(() => {
    let filtered = records

    if (selectedTag) {
      filtered = filtered.filter((r) => r.tags?.includes(selectedTag))
    }

    if (search) {
      const query = search.toLowerCase()
      filtered = filtered.filter(
        (r) =>
          r.name.toLowerCase().includes(query) ||
          r.content.toLowerCase().includes(query) ||
          r.type.toLowerCase().includes(query) ||
          r.comment?.toLowerCase().includes(query)
      )
    }

    return filtered
  }, [records, search, selectedTag])

  const getTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      A: 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20',
      AAAA: 'bg-purple-500/10 text-purple-500 hover:bg-purple-500/20',
      CNAME: 'bg-green-500/10 text-green-500 hover:bg-green-500/20',
      MX: 'bg-orange-500/10 text-orange-500 hover:bg-orange-500/20',
      TXT: 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20',
      NS: 'bg-cyan-500/10 text-cyan-500 hover:bg-cyan-500/20',
    }

    return (
      <Badge variant="secondary" className={colors[type] || ''}>
        {type}
      </Badge>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-500/10">
            <Cloud className="h-6 w-6 text-orange-500" />
          </div>
          <div>
            <h3 className="text-lg font-medium">Cloudflare Management</h3>
            <p className="text-sm text-muted-foreground">
              Manage DNS, security, and performance for all domains
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedZoneId || zone.id} onValueChange={setSelectedZoneId}>
            <SelectTrigger className="w-[240px]">
              <SelectValue placeholder="Select domain" />
            </SelectTrigger>
            <SelectContent>
              {zones.map((z) => (
                <SelectItem key={z.id} value={z.id}>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    <span>{z.name}</span>
                    <Badge variant={z.status === 'active' ? 'default' : 'outline'} className="ml-2 text-xs">
                      {z.status}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <a
            href={`https://dash.cloudflare.com/?to=/:account/zones/${zone.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ExternalLink className="h-4 w-4" />
            Open Dashboard
          </a>
        </div>
      </div>

      {/* Current Zone Info */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                {zone.name}
              </CardTitle>
              <CardDescription className="mt-1">
                Zone ID: <code className="text-xs">{zone.id}</code>
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{zone.plan.name}</Badge>
              <Badge variant={zone.status === 'active' ? 'default' : 'secondary'}>
                {zone.status}
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Zone Status</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span className="text-xl font-bold capitalize">{zone.status}</span>
            </div>
            <p className="text-xs text-muted-foreground">Zone active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SSL Status</CardTitle>
            <Lock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span className="text-xl font-bold capitalize">{zone.ssl.status}</span>
            </div>
            <p className="text-xs text-muted-foreground">{zone.ssl.type} SSL</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">DNS Records</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRecords}</div>
            <p className="text-xs text-muted-foreground">{stats.proxiedRecords} proxied</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Proxy Status</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((stats.proxiedRecords / stats.totalRecords) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">Records proxied</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Plan</CardTitle>
            <Cloud className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{zone.plan.name}</div>
            <p className="text-xs text-muted-foreground">Cloudflare plan</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="records">DNS ({filteredRecords.length})</TabsTrigger>
          <TabsTrigger value="firewall">Firewall ({firewallRules.length})</TabsTrigger>
          <TabsTrigger value="page-rules">Page Rules ({pageRules.length})</TabsTrigger>
          <TabsTrigger value="workers">Workers ({workers.length})</TabsTrigger>
          <TabsTrigger value="cache">Cache</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Analytics Card */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Analytics (Last 24h)</CardTitle>
                <CardDescription>Traffic and security metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">Total Requests</p>
                    <p className="text-2xl font-bold">{analytics.requests.total.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">
                      {analytics.requests.cached.toLocaleString()} cached (
                      {Math.round((analytics.requests.cached / analytics.requests.total) * 100)}%)
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">Bandwidth</p>
                    <p className="text-2xl font-bold">{analytics.bandwidth.total}</p>
                    <p className="text-xs text-muted-foreground">{analytics.bandwidth.cached} cached</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">Threats Blocked</p>
                    <p className="text-2xl font-bold text-red-500">{analytics.threats.blocked.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">
                      of {analytics.threats.total.toLocaleString()} detected
                    </p>
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">Page Views</p>
                    <p className="text-xl font-bold">{analytics.pageViews.toLocaleString()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">Unique Visitors</p>
                    <p className="text-xl font-bold">{analytics.uniqueVisitors.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Status */}
            <Card>
              <CardHeader>
                <CardTitle>Security Status</CardTitle>
                <CardDescription>Protection features</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Security Level</span>
                  <Badge variant="default">{securitySettings.securityLevel}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">WAF</span>
                  {securitySettings.waf ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">DDoS Protection</span>
                  {securitySettings.ddos ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Bot Management</span>
                  {securitySettings.botManagement ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Rate Limiting</span>
                  {securitySettings.rateLimiting ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="records" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle>DNS Records</CardTitle>
                  <CardDescription>
                    Manage DNS records for {zone.name}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <div className="relative w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search records..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                <Badge
                  variant={selectedTag === null ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => setSelectedTag(null)}
                >
                  All ({records.length})
                </Badge>
                {tags.map((tag) => {
                  const count = records.filter((r) => r.tags?.includes(tag)).length
                  return (
                    <Badge
                      key={tag}
                      variant={selectedTag === tag ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => setSelectedTag(tag)}
                    >
                      {tag} ({count})
                    </Badge>
                  )
                })}
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Content</TableHead>
                    <TableHead>Proxy</TableHead>
                    <TableHead>TTL</TableHead>
                    <TableHead>Comment</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{getTypeBadge(record.type)}</TableCell>
                      <TableCell className="font-mono text-sm">{record.name}</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {record.content}
                      </TableCell>
                      <TableCell>
                        {record.proxied ? (
                          <div className="flex items-center gap-1 text-orange-500">
                            <Shield className="h-3 w-3" />
                            <span className="text-xs">Proxied</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <XCircle className="h-3 w-3" />
                            <span className="text-xs">DNS only</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {record.ttl === 1 ? 'Auto' : `${record.ttl}s`}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {record.comment || '—'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="firewall" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Firewall Rules</CardTitle>
              <CardDescription>Web Application Firewall rules and filters</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Filter Expression</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {firewallRules.map((rule) => (
                    <TableRow key={rule.id}>
                      <TableCell className="font-medium">{rule.description}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            rule.action === 'block'
                              ? 'destructive'
                              : rule.action === 'allow'
                              ? 'default'
                              : 'secondary'
                          }
                        >
                          {rule.action}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-md">
                        <code className="text-xs text-muted-foreground">{rule.filter}</code>
                      </TableCell>
                      <TableCell>
                        {rule.enabled ? (
                          <Badge variant="default" className="gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            Enabled
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="gap-1">
                            <XCircle className="h-3 w-3" />
                            Disabled
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="page-rules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Page Rules</CardTitle>
              <CardDescription>URL pattern-based configuration rules</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Priority</TableHead>
                    <TableHead>URL Pattern</TableHead>
                    <TableHead>Actions</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pageRules.map((rule) => (
                    <TableRow key={rule.id}>
                      <TableCell className="font-medium">#{rule.priority}</TableCell>
                      <TableCell className="font-mono text-sm">{rule.targets.join(', ')}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {rule.actions.map((action, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {action.id}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={rule.status === 'active' ? 'default' : 'outline'}>
                          {rule.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cloudflare Workers</CardTitle>
              <CardDescription>Serverless functions running on Cloudflare's edge</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Route</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workers.map((worker) => (
                    <TableRow key={worker.id}>
                      <TableCell className="font-mono font-medium">{worker.name}</TableCell>
                      <TableCell className="font-mono text-sm text-muted-foreground">
                        {worker.route}
                      </TableCell>
                      <TableCell className="text-sm">{worker.script}</TableCell>
                      <TableCell>
                        {worker.enabled ? (
                          <Badge variant="default" className="gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            Enabled
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="gap-1">
                            <XCircle className="h-3 w-3" />
                            Disabled
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cache" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cache Configuration</CardTitle>
              <CardDescription>Caching and performance settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Cache Level</p>
                  <Badge variant="default" className="text-base">
                    {cacheSettings.cacheLevel}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Browser Cache TTL</p>
                  <p className="text-base">{cacheSettings.browserCacheTTL / 3600} hours</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Always Online</p>
                  {cacheSettings.alwaysOnline ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Development Mode</p>
                  {cacheSettings.developmentMode ? (
                    <CheckCircle2 className="h-5 w-5 text-orange-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Web application firewall and DDoS protection</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b pb-3">
                  <div>
                    <p className="font-medium">Security Level</p>
                    <p className="text-sm text-muted-foreground">
                      Challenge level for visitors
                    </p>
                  </div>
                  <Badge variant="default" className="text-base">
                    {securitySettings.securityLevel}
                  </Badge>
                </div>
                <div className="flex items-center justify-between border-b pb-3">
                  <div>
                    <p className="font-medium">Web Application Firewall</p>
                    <p className="text-sm text-muted-foreground">
                      OWASP protection and custom rules
                    </p>
                  </div>
                  {securitySettings.waf ? (
                    <Badge variant="default" className="gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="gap-1">
                      <XCircle className="h-3 w-3" />
                      Disabled
                    </Badge>
                  )}
                </div>
                <div className="flex items-center justify-between border-b pb-3">
                  <div>
                    <p className="font-medium">DDoS Protection</p>
                    <p className="text-sm text-muted-foreground">
                      Automatic DDoS mitigation
                    </p>
                  </div>
                  {securitySettings.ddos ? (
                    <Badge variant="default" className="gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="gap-1">
                      <XCircle className="h-3 w-3" />
                      Disabled
                    </Badge>
                  )}
                </div>
                <div className="flex items-center justify-between border-b pb-3">
                  <div>
                    <p className="font-medium">Bot Management</p>
                    <p className="text-sm text-muted-foreground">
                      Detect and block malicious bots
                    </p>
                  </div>
                  {securitySettings.botManagement ? (
                    <Badge variant="default" className="gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="gap-1">
                      <XCircle className="h-3 w-3" />
                      Disabled
                    </Badge>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Rate Limiting</p>
                    <p className="text-sm text-muted-foreground">
                      Protect against abuse
                    </p>
                  </div>
                  {securitySettings.rateLimiting ? (
                    <Badge variant="default" className="gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="gap-1">
                      <XCircle className="h-3 w-3" />
                      Disabled
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Request Statistics</CardTitle>
                <CardDescription>Last 24 hours</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Requests</span>
                    <span className="text-lg font-bold">
                      {analytics.requests.total.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full bg-green-500"
                      style={{
                        width: `${(analytics.requests.cached / analytics.requests.total) * 100}%`,
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Cached: {analytics.requests.cached.toLocaleString()}</span>
                    <span>Uncached: {analytics.requests.uncached.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Bandwidth Usage</CardTitle>
                <CardDescription>Last 24 hours</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Bandwidth</span>
                    <span className="text-lg font-bold">{analytics.bandwidth.total}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Cached: {analytics.bandwidth.cached}</span>
                    <span>Uncached: {analytics.bandwidth.uncached}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Security Threats</CardTitle>
                <CardDescription>Last 24 hours</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Threats Detected</span>
                    <span className="text-lg font-bold text-red-500">
                      {analytics.threats.total.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Blocked</span>
                    <span className="text-lg font-bold text-green-500">
                      {analytics.threats.blocked.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {Math.round((analytics.threats.blocked / analytics.threats.total) * 100)}% block rate
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Visitor Stats</CardTitle>
                <CardDescription>Last 24 hours</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Page Views</span>
                  <span className="text-lg font-bold">{analytics.pageViews.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Unique Visitors</span>
                  <span className="text-lg font-bold">{analytics.uniqueVisitors.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="zone" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Zone Information</CardTitle>
                <CardDescription>Basic zone configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Zone ID</p>
                  <p className="font-mono text-sm">{zone.id}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Domain</p>
                  <p className="text-sm">{zone.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Status</p>
                  <Badge variant="default" className="gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    {zone.status}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Type</p>
                  <Badge variant="secondary">{zone.type} DNS</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Nameservers</CardTitle>
                <CardDescription>Cloudflare nameservers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {zone.nameServers.map((ns, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Server className="h-4 w-4 text-muted-foreground" />
                    <p className="font-mono text-sm">{ns}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>SSL/TLS Configuration</CardTitle>
                <CardDescription>Encryption settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Status</p>
                  <Badge variant="default" className="gap-1">
                    <Lock className="h-3 w-3" />
                    {zone.ssl.status}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Encryption Mode</p>
                  <Badge variant="secondary">{zone.ssl.type}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Record Type Distribution</CardTitle>
                <CardDescription>DNS record types</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {Object.entries(stats.recordTypes).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getTypeBadge(type)}
                      <span className="text-sm text-muted-foreground">{type} records</span>
                    </div>
                    <span className="text-sm font-medium">{count}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

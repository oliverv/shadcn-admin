import { createFileRoute } from '@tanstack/react-router'
import { useMemo } from 'react'
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
  Bell,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Info,
  Clock,
  Shield,
  Mail,
  Webhook,
  MessageSquare,
} from 'lucide-react'
import { getAlerts, getAlertRules, getNotificationChannels, getAlertStats, getRecentIncidents } from '@/lib/alerts'

export const Route = createFileRoute('/_authenticated/monitoring/alerts')({
  component: AlertsPage,
})

function AlertsPage() {
  const alerts = useMemo(() => getAlerts(), [])
  const rules = useMemo(() => getAlertRules(), [])
  const channels = useMemo(() => getNotificationChannels(), [])
  const stats = useMemo(() => getAlertStats(), [])
  const incidents = useMemo(() => getRecentIncidents(), [])

  const getSeverityBadge = (severity: string) => {
    const config = {
      critical: { variant: 'destructive' as const, icon: XCircle, text: 'Critical' },
      warning: { variant: 'default' as const, icon: AlertTriangle, text: 'Warning' },
      info: { variant: 'secondary' as const, icon: Info, text: 'Info' },
      success: { variant: 'outline' as const, icon: CheckCircle2, text: 'Success' },
    }

    const { variant, icon: Icon, text } = config[severity as keyof typeof config]
    return (
      <Badge variant={variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {text}
      </Badge>
    )
  }

  const getStatusBadge = (status: string) => {
    const config = {
      active: { variant: 'destructive' as const, text: 'Active' },
      acknowledged: { variant: 'default' as const, text: 'Acknowledged' },
      resolved: { variant: 'outline' as const, text: 'Resolved' },
      silenced: { variant: 'secondary' as const, text: 'Silenced' },
    }

    const { variant, text } = config[status as keyof typeof config]
    return <Badge variant={variant}>{text}</Badge>
  }

  const getChannelIcon = (type: string) => {
    const icons = {
      email: Mail,
      slack: MessageSquare,
      webhook: Webhook,
      discord: MessageSquare,
      telegram: MessageSquare,
    }
    return icons[type as keyof typeof icons] || Bell
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-500/10">
          <Bell className="h-6 w-6 text-red-500" />
        </div>
        <div>
          <h3 className="text-lg font-medium">Alerts & Notifications</h3>
          <p className="text-sm text-muted-foreground">
            Monitor system health and configure alert rules
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <Bell className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{stats.active}</div>
            <p className="text-xs text-muted-foreground">{stats.acknowledged} acknowledged</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved Today</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.resolved}</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alert Rules</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.enabledRules}</div>
            <p className="text-xs text-muted-foreground">
              of {stats.totalRules} enabled
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Incidents</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{incidents.today}</div>
            <p className="text-xs text-muted-foreground">{incidents.week} this week</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="alerts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="alerts">Alerts ({stats.active + stats.acknowledged})</TabsTrigger>
          <TabsTrigger value="rules">Alert Rules ({stats.totalRules})</TabsTrigger>
          <TabsTrigger value="channels">Channels ({channels.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Alerts</CardTitle>
              <CardDescription>All alerts and incidents across services</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Alert</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {alerts.map((alert) => (
                    <TableRow key={alert.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium">{alert.title}</p>
                          <p className="text-xs text-muted-foreground">{alert.message}</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{alert.source}</TableCell>
                      <TableCell>{getSeverityBadge(alert.severity)}</TableCell>
                      <TableCell>{getStatusBadge(alert.status)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(alert.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {alert.status === 'active' && (
                          <Button variant="outline" size="sm">
                            Acknowledge
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Alert Rules</CardTitle>
                  <CardDescription>Configure thresholds and conditions</CardDescription>
                </div>
                <Button>
                  <Shield className="mr-2 h-4 w-4" />
                  New Rule
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rule</TableHead>
                    <TableHead>Condition</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Triggers</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rules.map((rule) => (
                    <TableRow key={rule.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium">{rule.name}</p>
                          <p className="text-xs text-muted-foreground">{rule.description}</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {rule.conditions.metric} {rule.conditions.operator} {rule.conditions.threshold}
                        {rule.conditions.duration && (
                          <span className="text-muted-foreground"> ({rule.conditions.duration}s)</span>
                        )}
                      </TableCell>
                      <TableCell>{getSeverityBadge(rule.severity)}</TableCell>
                      <TableCell className="text-sm">
                        {rule.triggerCount}
                        {rule.lastTriggered && (
                          <p className="text-xs text-muted-foreground">
                            Last: {new Date(rule.lastTriggered).toLocaleDateString()}
                          </p>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={rule.enabled ? 'default' : 'outline'}>
                          {rule.enabled ? 'Enabled' : 'Disabled'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="channels" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Notification Channels</CardTitle>
                  <CardDescription>Configure where alerts are sent</CardDescription>
                </div>
                <Button>
                  <Bell className="mr-2 h-4 w-4" />
                  Add Channel
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {channels.map((channel) => {
                  const Icon = getChannelIcon(channel.type)
                  
                  return (
                    <Card key={channel.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Icon className="h-5 w-5" />
                            <CardTitle className="text-base">{channel.name}</CardTitle>
                          </div>
                          <Badge variant={channel.enabled ? 'default' : 'outline'}>
                            {channel.enabled ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        <CardDescription className="capitalize">{channel.type} notifications</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="text-xs text-muted-foreground">
                          {channel.type === 'email' && `${channel.config.recipients.length} recipient(s)`}
                          {channel.type === 'slack' && `Channel: ${channel.config.channel}`}
                          {channel.type === 'webhook' && `${channel.config.method} ${channel.config.url}`}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            Edit
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1">
                            Test
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

import { createFileRoute } from '@tanstack/react-router'
import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
  FileText,
  Search,
  Filter,
  Download,
  AlertTriangle,
  XCircle,
  Info,
  Bug,
  Skull,
} from 'lucide-react'
import {
  getLogs,
  getLogStats,
  getLogServices,
  getLogLevelColor,
  getLogLevelBadgeVariant,
  type LogLevel,
  type LogSource,
  type LogFilter,
} from '@/lib/logs'

export const Route = createFileRoute('/_authenticated/monitoring/logs')({
  component: LogsPage,
})

function LogsPage() {
  const [search, setSearch] = useState('')
  const [levelFilter, setLevelFilter] = useState<LogLevel | 'all'>('all')
  const [sourceFilter, setSourceFilter] = useState<LogSource | 'all'>('all')
  const [serviceFilter, setServiceFilter] = useState<string>('all')

  const stats = useMemo(() => getLogStats(), [])
  const services = useMemo(() => getLogServices(), [])

  const filter = useMemo((): LogFilter => {
    const f: LogFilter = {}
    if (search) f.search = search
    if (levelFilter !== 'all') f.level = [levelFilter]
    if (sourceFilter !== 'all') f.source = [sourceFilter]
    if (serviceFilter !== 'all') f.service = [serviceFilter]
    return f
  }, [search, levelFilter, sourceFilter, serviceFilter])

  const logs = useMemo(() => getLogs(filter), [filter])

  const getLevelIcon = (level: LogLevel) => {
    const icons = {
      debug: Bug,
      info: Info,
      warn: AlertTriangle,
      error: XCircle,
      fatal: Skull,
    }
    const Icon = icons[level]
    const color = getLogLevelColor(level)
    return <Icon className={`h-4 w-4 ${color}`} />
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/10">
          <FileText className="h-6 w-6 text-purple-500" />
        </div>
        <div>
          <h3 className="text-lg font-medium">Log Aggregation</h3>
          <p className="text-sm text-muted-foreground">
            View and search logs from all services
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Logs</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Last 15 minutes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Errors</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{stats.errors}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((stats.errors / stats.total) * 100)}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Warnings</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">{stats.warnings}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((stats.warnings / stats.total) * 100)}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Services</CardTitle>
            <Info className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{services.length}</div>
            <p className="text-xs text-muted-foreground">Logging services</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search logs..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Level</label>
              <Select value={levelFilter} onValueChange={(v) => setLevelFilter(v as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="debug">Debug</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="warn">Warning</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                  <SelectItem value="fatal">Fatal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Source</label>
              <Select value={sourceFilter} onValueChange={(v) => setSourceFilter(v as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  <SelectItem value="container">Container</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                  <SelectItem value="application">Application</SelectItem>
                  <SelectItem value="security">Security</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Service</label>
              <Select value={serviceFilter} onValueChange={setServiceFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Services</SelectItem>
                  {services.map((service) => (
                    <SelectItem key={service} value={service}>
                      {service}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {logs.length} of {stats.total} logs
            </p>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export Logs
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Log Entries</CardTitle>
          <CardDescription>Real-time log stream from all services</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">Timestamp</TableHead>
                  <TableHead className="w-[100px]">Level</TableHead>
                  <TableHead className="w-[120px]">Source</TableHead>
                  <TableHead className="w-[150px]">Service</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead className="w-[200px]">Tags</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {new Date(log.timestamp).toLocaleTimeString('en-US', {
                        hour12: false,
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                      .{new Date(log.timestamp).getMilliseconds().toString().padStart(3, '0')}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={getLogLevelBadgeVariant(log.level)}
                        className="gap-1 font-mono text-xs uppercase"
                      >
                        {getLevelIcon(log.level)}
                        {log.level}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {log.source}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{log.service}</TableCell>
                    <TableCell className="max-w-md">
                      <p className="truncate text-sm">{log.message}</p>
                      {log.metadata && (
                        <p className="mt-1 truncate font-mono text-xs text-muted-foreground">
                          {JSON.stringify(log.metadata)}
                        </p>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {log.tags?.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

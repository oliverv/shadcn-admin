import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { MetricChart } from '@/components/infrastructure/metric-chart'
import { useMetrics } from '@/hooks/use-metrics'
import { METRIC_QUERIES } from '@/lib/metrics'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RefreshCw, TrendingUp, Activity, Database, Server } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export const Route = createFileRoute('/_authenticated/metrics/')({
  component: MetricsPage,
})

type TimeRange = 'last_hour' | 'last_6h' | 'last_24h' | 'last_7d'

function MetricsPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>('last_hour')
  const [refreshing, setRefreshing] = useState(false)

  // Query multiple metrics
  const cpuMetrics = useMetrics({
    query: METRIC_QUERIES.cpuUsage,
    timeRange,
    refreshInterval: 30000,
  })

  const memoryMetrics = useMetrics({
    query: METRIC_QUERIES.memoryUsage,
    timeRange,
    refreshInterval: 30000,
  })

  const requestRateMetrics = useMetrics({
    query: METRIC_QUERIES.requestRate,
    timeRange,
    refreshInterval: 30000,
  })

  const errorRateMetrics = useMetrics({
    query: METRIC_QUERIES.errorRate,
    timeRange,
    refreshInterval: 30000,
  })

  const handleRefreshAll = async () => {
    setRefreshing(true)
    await Promise.all([
      cpuMetrics.refresh(),
      memoryMetrics.refresh(),
      requestRateMetrics.refresh(),
      errorRateMetrics.refresh(),
    ])
    setRefreshing(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Metrics Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Real-time infrastructure metrics from VictoriaMetrics
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={(v) => setTimeRange(v as TimeRange)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last_hour">Last Hour</SelectItem>
              <SelectItem value="last_6h">Last 6 Hours</SelectItem>
              <SelectItem value="last_24h">Last 24 Hours</SelectItem>
              <SelectItem value="last_7d">Last 7 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleRefreshAll} disabled={refreshing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh All'}
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {cpuMetrics.data?.data.result[0]?.values.slice(-1)[0]?.value.toFixed(1) || '--'}%
            </div>
            <p className="text-xs text-muted-foreground">Last measurement</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {memoryMetrics.data?.data.result[0]?.values.slice(-1)[0]?.value.toFixed(0) || '--'} MB
            </div>
            <p className="text-xs text-muted-foreground">Last measurement</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Request Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {requestRateMetrics.data?.data.result[0]?.values.slice(-1)[0]?.value.toFixed(2) || '--'}/s
            </div>
            <p className="text-xs text-muted-foreground">Requests per second</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {errorRateMetrics.data?.data.result[0]?.values.slice(-1)[0]?.value.toFixed(3) || '--'}/s
            </div>
            <p className="text-xs text-muted-foreground">Errors per second</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <MetricChart
          title="CPU Usage"
          description="Process CPU usage over time"
          data={cpuMetrics.data}
          isLoading={cpuMetrics.isLoading}
          error={cpuMetrics.error}
          unit="%"
          color="#10b981"
        />

        <MetricChart
          title="Memory Usage"
          description="Process memory consumption"
          data={memoryMetrics.data}
          isLoading={memoryMetrics.isLoading}
          error={memoryMetrics.error}
          unit="MB"
          color="#3b82f6"
        />

        <MetricChart
          title="Request Rate"
          description="HTTP requests per second"
          data={requestRateMetrics.data}
          isLoading={requestRateMetrics.isLoading}
          error={requestRateMetrics.error}
          unit="req/s"
          color="#8b5cf6"
        />

        <MetricChart
          title="Error Rate"
          description="HTTP 5xx errors per second"
          data={errorRateMetrics.data}
          isLoading={errorRateMetrics.isLoading}
          error={errorRateMetrics.error}
          unit="err/s"
          color="#ef4444"
        />
      </div>
    </div>
  )
}

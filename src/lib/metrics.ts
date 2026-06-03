/**
 * Metrics API utilities for VictoriaMetrics and Prometheus
 */

export interface MetricQuery {
  query: string
  start?: number // Unix timestamp
  end?: number // Unix timestamp
  step?: string // e.g., "15s", "1m", "5m"
}

export interface MetricDataPoint {
  timestamp: number
  value: number
}

export interface MetricResult {
  metric: Record<string, string>
  values: MetricDataPoint[]
}

export interface MetricsResponse {
  status: 'success' | 'error'
  data: {
    resultType: string
    result: MetricResult[]
  }
  error?: string
}

const VM_BASE_URL = import.meta.env.VITE_VICTORIA_METRICS_URL || 'https://vm-openmemory.collabmind.dev'
const PROM_BASE_URL = import.meta.env.VITE_PROMETHEUS_URL || 'https://prometheus-openmemory.collabmind.dev'

/**
 * Query VictoriaMetrics for metric data
 */
export async function queryVictoriaMetrics(params: MetricQuery): Promise<MetricsResponse> {
  const { query, start, end, step = '15s' } = params
  
  const url = new URL(`${VM_BASE_URL}/api/v1/query_range`)
  url.searchParams.set('query', query)
  
  if (start) url.searchParams.set('start', start.toString())
  if (end) url.searchParams.set('end', end.toString())
  url.searchParams.set('step', step)

  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('VictoriaMetrics query failed:', error)
    return {
      status: 'error',
      data: { resultType: '', result: [] },
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Query Prometheus for metric data
 */
export async function queryPrometheus(params: MetricQuery): Promise<MetricsResponse> {
  const { query, start, end, step = '15s' } = params
  
  const url = new URL(`${PROM_BASE_URL}/api/v1/query_range`)
  url.searchParams.set('query', query)
  
  if (start) url.searchParams.set('start', start.toString())
  if (end) url.searchParams.set('end', end.toString())
  url.searchParams.set('step', step)

  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Prometheus query failed:', error)
    return {
      status: 'error',
      data: { resultType: '', result: [] },
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Pre-defined metric queries for common infrastructure metrics
 */
export const METRIC_QUERIES = {
  // System metrics
  cpuUsage: 'rate(process_cpu_seconds_total[5m]) * 100',
  memoryUsage: 'process_resident_memory_bytes / 1024 / 1024',
  
  // HTTP metrics
  requestRate: 'rate(http_requests_total[5m])',
  errorRate: 'rate(http_requests_total{status=~"5.."}[5m])',
  requestDuration: 'histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))',
  
  // Database metrics
  dbConnections: 'pg_stat_database_numbackends',
  dbQueryDuration: 'rate(pg_stat_statements_mean_exec_time[5m])',
  
  // Container metrics
  containerCpu: 'rate(container_cpu_usage_seconds_total[5m]) * 100',
  containerMemory: 'container_memory_usage_bytes / 1024 / 1024',
  
  // OpenMemory specific
  memoryStoreSize: 'openmemory_memory_store_size',
  memoryQueryLatency: 'openmemory_query_latency_seconds',
}

/**
 * Get time range presets
 */
export function getTimeRange(preset: 'last_hour' | 'last_6h' | 'last_24h' | 'last_7d'): { start: number; end: number; step: string } {
  const now = Math.floor(Date.now() / 1000)
  
  const ranges = {
    last_hour: { duration: 3600, step: '15s' },
    last_6h: { duration: 21600, step: '1m' },
    last_24h: { duration: 86400, step: '5m' },
    last_7d: { duration: 604800, step: '30m' },
  }
  
  const { duration, step } = ranges[preset]
  
  return {
    start: now - duration,
    end: now,
    step,
  }
}

/**
 * Format metric data for charts
 */
export function formatMetricData(response: MetricsResponse): Array<{ time: string; value: number }> {
  if (response.status !== 'success' || !response.data.result.length) {
    return []
  }

  const result = response.data.result[0]
  if (!result || !result.values) {
    return []
  }

  return result.values.map((point) => ({
    time: new Date(point.timestamp * 1000).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }),
    value: parseFloat(point.value.toFixed(2)),
  }))
}

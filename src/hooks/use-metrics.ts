import { useEffect, useState } from 'react'
import {
  queryVictoriaMetrics,
  type MetricQuery,
  type MetricsResponse,
  getTimeRange,
} from '@/lib/metrics'

interface UseMetricsOptions {
  query: string
  timeRange?: 'last_hour' | 'last_6h' | 'last_24h' | 'last_7d'
  refreshInterval?: number // milliseconds
  enabled?: boolean
}

interface UseMetricsReturn {
  data: MetricsResponse | null
  isLoading: boolean
  error: string | null
  lastUpdate: Date | null
  refresh: () => Promise<void>
}

export function useMetrics({
  query,
  timeRange = 'last_hour',
  refreshInterval = 30000, // 30 seconds default
  enabled = true,
}: UseMetricsOptions): UseMetricsReturn {
  const [data, setData] = useState<MetricsResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  const fetchMetrics = async () => {
    if (!enabled || !query) return

    setIsLoading(true)
    setError(null)

    try {
      const range = getTimeRange(timeRange)
      const params: MetricQuery = {
        query,
        ...range,
      }

      const response = await queryVictoriaMetrics(params)

      if (response.status === 'error') {
        setError(response.error || 'Query failed')
      } else {
        setData(response)
        setLastUpdate(new Date())
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsLoading(false)
    }
  }

  // Initial fetch
  useEffect(() => {
    if (enabled) {
      fetchMetrics()
    }
  }, [query, timeRange, enabled])

  // Auto-refresh
  useEffect(() => {
    if (!enabled || !refreshInterval) return

    const intervalId = setInterval(fetchMetrics, refreshInterval)

    return () => clearInterval(intervalId)
  }, [query, timeRange, refreshInterval, enabled])

  return {
    data,
    isLoading,
    error,
    lastUpdate,
    refresh: fetchMetrics,
  }
}

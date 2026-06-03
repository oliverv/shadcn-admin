import { useEffect, useState } from 'react'
import {
  checkMultipleServicesHealth,
  type ServiceHealthCheck,
  type ServiceHealth,
} from '@/lib/health-check'

interface UseServiceHealthOptions {
  services: ServiceHealthCheck[]
  refreshInterval?: number // milliseconds
  enabled?: boolean
}

interface UseServiceHealthReturn {
  healthData: Map<string, ServiceHealth>
  isLoading: boolean
  error: Error | null
  lastUpdate: Date | null
  refresh: () => Promise<void>
}

export function useServiceHealth({
  services,
  refreshInterval = 10000, // 10 seconds default
  enabled = true,
}: UseServiceHealthOptions): UseServiceHealthReturn {
  const [healthData, setHealthData] = useState<Map<string, ServiceHealth>>(new Map())
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  const refresh = async () => {
    if (!enabled) return

    setIsLoading(true)
    setError(null)

    try {
      const results = await checkMultipleServicesHealth(services)
      const newHealthData = new Map<string, ServiceHealth>()

      results.forEach((result) => {
        newHealthData.set(result.id, result)
      })

      setHealthData(newHealthData)
      setLastUpdate(new Date())
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'))
    } finally {
      setIsLoading(false)
    }
  }

  // Initial load
  useEffect(() => {
    if (enabled) {
      refresh()
    }
  }, [enabled])

  // Auto-refresh interval
  useEffect(() => {
    if (!enabled || !refreshInterval) return

    const intervalId = setInterval(refresh, refreshInterval)

    return () => clearInterval(intervalId)
  }, [enabled, refreshInterval, services])

  return {
    healthData,
    isLoading,
    error,
    lastUpdate,
    refresh,
  }
}

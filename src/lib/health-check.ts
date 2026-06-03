import { ServiceStatus } from '@/components/infrastructure/status-badge'

export interface ServiceHealthCheck {
  id: string
  name: string
  url: string
  port: number
  healthEndpoint?: string
  expectedStatus?: number
}

export interface ServiceHealth {
  id: string
  status: ServiceStatus
  responseTime?: number
  lastChecked: Date
  error?: string
}

const DEFAULT_TIMEOUT = 5000 // 5 seconds

/**
 * Check if a service is healthy by making an HTTP request
 */
export async function checkServiceHealth(
  service: ServiceHealthCheck
): Promise<ServiceHealth> {
  const startTime = Date.now()
  const url = service.healthEndpoint || service.url

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT)

    const response = await fetch(url, {
      method: 'GET',
      signal: controller.signal,
      mode: 'no-cors', // Allow cross-origin requests
    })

    clearTimeout(timeoutId)
    const responseTime = Date.now() - startTime

    // With no-cors mode, we can't read the response, but if fetch succeeds, service is up
    const isHealthy = response.ok || response.type === 'opaque'

    return {
      id: service.id,
      status: isHealthy ? 'healthy' : 'degraded',
      responseTime,
      lastChecked: new Date(),
    }
  } catch (error) {
    const responseTime = Date.now() - startTime

    // Distinguish between timeout and connection failure
    if (error instanceof Error && error.name === 'AbortError') {
      return {
        id: service.id,
        status: 'degraded',
        responseTime,
        lastChecked: new Date(),
        error: 'Request timeout',
      }
    }

    return {
      id: service.id,
      status: 'down',
      responseTime,
      lastChecked: new Date(),
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Check health of multiple services in parallel
 */
export async function checkMultipleServicesHealth(
  services: ServiceHealthCheck[]
): Promise<ServiceHealth[]> {
  const checks = services.map((service) => checkServiceHealth(service))
  return Promise.all(checks)
}

/**
 * Service definitions with health check endpoints
 */
export const SERVICES: ServiceHealthCheck[] = [
  {
    id: 'api-gateway',
    name: 'API Gateway',
    url: 'http://localhost:8888',
    port: 8888,
    healthEndpoint: 'http://localhost:8888/health',
  },
  {
    id: 'victoriametrics',
    name: 'VictoriaMetrics',
    url: 'http://localhost:8428',
    port: 8428,
    healthEndpoint: 'http://localhost:8428/health',
  },
  {
    id: 'prometheus',
    name: 'Prometheus',
    url: 'http://localhost:9093',
    port: 9093,
    healthEndpoint: 'http://localhost:9093/-/healthy',
  },
  {
    id: 'grafana',
    name: 'Grafana',
    url: 'http://localhost:3004',
    port: 3004,
    healthEndpoint: 'http://localhost:3004/api/health',
  },
  {
    id: 'traefik',
    name: 'Traefik',
    url: 'http://localhost:8007',
    port: 8007,
    healthEndpoint: 'http://localhost:8007/ping',
  },
  {
    id: 'qdrant',
    name: 'Qdrant',
    url: 'http://localhost:6333',
    port: 6333,
    healthEndpoint: 'http://localhost:6333/health',
  },
  {
    id: 'authelia',
    name: 'Authelia',
    url: 'http://localhost:9091',
    port: 9091,
    healthEndpoint: 'http://localhost:9091/api/health',
  },
  {
    id: 'cloudbeaver',
    name: 'CloudBeaver',
    url: 'http://localhost:8978',
    port: 8978,
  },
  {
    id: 'directus',
    name: 'Directus',
    url: 'http://localhost:8055',
    port: 8055,
    healthEndpoint: 'http://localhost:8055/server/health',
  },
  {
    id: 'bytebase',
    name: 'Bytebase',
    url: 'http://localhost:8089',
    port: 8089,
  },
  {
    id: 'nocodb',
    name: 'NocoDB',
    url: 'http://localhost:8083',
    port: 8083,
    healthEndpoint: 'http://localhost:8083/api/v1/health',
  },
  {
    id: 'beszel',
    name: 'Beszel',
    url: 'http://localhost:8090',
    port: 8090,
  },
]

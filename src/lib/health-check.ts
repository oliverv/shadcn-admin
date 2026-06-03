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
    url: 'https://gateway-openmemory.collabmind.dev',
    port: 8888,
    healthEndpoint: 'https://gateway-openmemory.collabmind.dev/health',
  },
  {
    id: 'victoriametrics',
    name: 'VictoriaMetrics',
    url: 'https://vm-openmemory.collabmind.dev',
    port: 8428,
    healthEndpoint: 'https://vm-openmemory.collabmind.dev/health',
  },
  {
    id: 'prometheus',
    name: 'Prometheus',
    url: 'https://prometheus-openmemory.collabmind.dev',
    port: 9093,
    healthEndpoint: 'https://prometheus-openmemory.collabmind.dev/-/healthy',
  },
  {
    id: 'grafana',
    name: 'Grafana',
    url: 'https://grafana-openmemory.collabmind.dev',
    port: 3004,
    healthEndpoint: 'https://grafana-openmemory.collabmind.dev/api/health',
  },
  {
    id: 'traefik',
    name: 'Traefik',
    url: 'https://intra-beta.collabmind.dev',
    port: 8007,
    healthEndpoint: 'https://intra-beta.collabmind.dev/ping',
  },
  {
    id: 'qdrant',
    name: 'Qdrant',
    url: 'https://qdrant-openmemory.collabmind.dev',
    port: 6333,
    healthEndpoint: 'https://qdrant-openmemory.collabmind.dev/health',
  },
  {
    id: 'authelia',
    name: 'Authelia',
    url: 'https://auth.collabmind.dev',
    port: 9091,
    healthEndpoint: 'https://auth.collabmind.dev/api/health',
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
    url: 'https://beszel-openmemory.collabmind.dev',
    port: 8090,
  },
]

/**
 * Docker container information utilities
 * Since we can't access Docker API directly from browser,
 * we'll use the known container configuration from docker-compose.yml
 */

export interface ContainerInfo {
  name: string
  service: string
  image: string
  port?: string
  internalPort?: number
  status: 'running' | 'healthy' | 'unhealthy' | 'starting' | 'unknown'
  description: string
  category: 'core' | 'admin' | 'monitoring' | 'database' | 'proxy'
  healthCheck?: boolean
  url?: string
}

/**
 * Get all known containers from docker-compose.yml
 * In production, this would query Docker API via a backend endpoint
 */
export function getContainers(): ContainerInfo[] {
  return [
    // Core Services
    {
      name: 'openmemory',
      service: 'openmemory',
      image: 'openmemory-openmemory',
      port: '8080',
      internalPort: 8080,
      status: 'healthy',
      description: 'OpenMemory Core API - Node.js/TypeScript server',
      category: 'core',
      healthCheck: true,
      url: 'https://api-openmemory.collabmind.dev',
    },
    {
      name: 'openmemory-py',
      service: 'openmemory-py',
      image: 'openmemory-openmemory-py',
      port: '8082',
      internalPort: 8082,
      status: 'healthy',
      description: 'OpenMemory Python API server',
      category: 'core',
      healthCheck: true,
      url: 'https://api-py-openmemory.collabmind.dev',
    },
    {
      name: 'api-gateway',
      service: 'api-gateway',
      image: 'openmemory-api-gateway',
      port: '8888',
      internalPort: 8888,
      status: 'healthy',
      description: 'Unified API Gateway - Service monitoring dashboard',
      category: 'core',
      healthCheck: true,
      url: 'https://gateway-openmemory.collabmind.dev',
    },
    {
      name: 'dashboard',
      service: 'dashboard',
      image: 'openmemory-dashboard',
      port: '3000',
      internalPort: 3000,
      status: 'healthy',
      description: 'Memory Dashboard - Next.js web UI',
      category: 'core',
      healthCheck: true,
      url: 'https://openmemory.collabmind.dev',
    },
    {
      name: 'infrastructure-dashboard',
      service: 'infrastructure-dashboard',
      image: 'openmemory-infrastructure-dashboard',
      port: '3001',
      internalPort: 3001,
      status: 'healthy',
      description: 'Infrastructure Dashboard - Vite/React admin panel',
      category: 'admin',
      healthCheck: true,
      url: 'https://intra-beta.collabmind.dev',
    },
    {
      name: 'xai-mem-gateway',
      service: 'xai-mem-gateway',
      image: 'openmemory-xai-mem-gateway',
      port: '8233',
      internalPort: 8233,
      status: 'healthy',
      description: 'xAI Memory Gateway - xAI API integration',
      category: 'core',
      healthCheck: true,
      url: 'https://xai-openmemory.collabmind.dev',
    },

    // Authentication
    {
      name: 'authentik-server',
      service: 'authentik-server',
      image: 'ghcr.io/goauthentik/server:2024.12.3',
      port: '9000',
      internalPort: 9000,
      status: 'healthy',
      description: 'Authentik - OAuth2/OIDC authentication server',
      category: 'core',
      healthCheck: true,
      url: 'https://auth.collabmind.dev',
    },
    {
      name: 'authentik-worker',
      service: 'authentik-worker',
      image: 'ghcr.io/goauthentik/server:2024.12.3',
      status: 'healthy',
      description: 'Authentik Worker',
      category: 'core',
      healthCheck: true,
    },
    {
      name: 'authentik-postgresql',
      service: 'authentik-postgresql',
      image: 'postgres:16-alpine',
      status: 'healthy',
      description: 'Authentik Database',
      category: 'database',
      healthCheck: true,
    },
    {
      name: 'authentik-redis',
      service: 'authentik-redis',
      image: 'redis:alpine',
      status: 'healthy',
      description: 'Authentik Redis',
      category: 'database',
      healthCheck: true,
    },
    {
      name: 'jwt-validator',
      service: 'jwt-validator',
      image: 'openmemory-jwt-validator',
      port: '9000',
      internalPort: 9000,
      status: 'running',
      description: 'JWT Validator - Traefik forwardAuth sidecar',
      category: 'proxy',
      healthCheck: false,
    },

    // Databases & Storage
    {
      name: 'openmemory-pg',
      service: 'openmemory-pg',
      image: 'postgres:17-alpine',
      port: '5432',
      internalPort: 5432,
      status: 'unhealthy',
      description: 'PostgreSQL - Primary database for metadata',
      category: 'database',
      healthCheck: true,
    },
    {
      name: 'valkey',
      service: 'valkey',
      image: 'valkey/valkey:8.0-alpine',
      port: '6379',
      internalPort: 6379,
      status: 'healthy',
      description: 'Valkey - Redis-compatible cache and vector backend',
      category: 'database',
      healthCheck: true,
    },
    {
      name: 'qdrant',
      service: 'qdrant',
      image: 'qdrant/qdrant:latest',
      port: '6333',
      internalPort: 6333,
      status: 'running',
      description: 'Qdrant - Vector database for embeddings',
      category: 'database',
      healthCheck: false,
      url: 'https://qdrant-openmemory.collabmind.dev',
    },

    // Proxy & Routing
    {
      name: 'openmemory-traefik',
      service: 'traefik',
      image: 'traefik:v3.0',
      port: '8007',
      internalPort: 8007,
      status: 'running',
      description: 'Traefik - Reverse proxy and load balancer',
      category: 'proxy',
      healthCheck: false,
      url: 'https://intra-beta.collabmind.dev',
    },
    {
      name: 'openmemory-caddy',
      service: 'caddy',
      image: 'openmemory-caddy',
      port: '8008',
      internalPort: 8008,
      status: 'running',
      description: 'Caddy - Python API reverse proxy',
      category: 'proxy',
      healthCheck: false,
      url: 'https://caddy-py-openmemory.collabmind.dev',
    },

    // Monitoring
    {
      name: 'victoriametrics',
      service: 'victoriametrics',
      image: 'victoriametrics/victoria-metrics:latest',
      port: '8428',
      internalPort: 8428,
      status: 'running',
      description: 'VictoriaMetrics - Time-series database for metrics',
      category: 'monitoring',
      healthCheck: false,
      url: 'https://vm-openmemory.collabmind.dev',
    },
    {
      name: 'prometheus',
      service: 'prometheus',
      image: 'prom/prometheus:latest',
      port: '9090',
      internalPort: 9090,
      status: 'running',
      description: 'Prometheus - Metrics collection and alerting',
      category: 'monitoring',
      healthCheck: false,
      url: 'https://prometheus-openmemory.collabmind.dev',
    },
    {
      name: 'grafana',
      service: 'grafana',
      image: 'grafana/grafana:latest',
      port: '3000',
      internalPort: 3000,
      status: 'running',
      description: 'Grafana - Metrics visualization and dashboards',
      category: 'monitoring',
      healthCheck: false,
      url: 'https://grafana-openmemory.collabmind.dev',
    },
    {
      name: 'beszel',
      service: 'beszel',
      image: 'henrygd/beszel:latest',
      port: '8090',
      internalPort: 8090,
      status: 'running',
      description: 'Beszel - Lightweight server monitoring',
      category: 'monitoring',
      healthCheck: false,
      url: 'https://beszel-openmemory.collabmind.dev',
    },
    {
      name: 'beszel-agent',
      service: 'beszel-agent',
      image: 'henrygd/beszel-agent',
      status: 'running',
      description: 'Beszel Agent - System metrics collector',
      category: 'monitoring',
      healthCheck: false,
    },
    {
      name: 'ollama-monitor',
      service: 'ollama-monitor',
      image: 'openmemory-ollama-monitor',
      port: '3003',
      internalPort: 3003,
      status: 'running',
      description: 'Ollama Monitor - Ollama server monitoring UI',
      category: 'monitoring',
      healthCheck: false,
    },

    // Admin Tools
    {
      name: 'openmemory-nocodb',
      service: 'nocodb',
      image: 'nocodb/nocodb:latest',
      port: '8083',
      internalPort: 8080,
      status: 'healthy',
      description: 'NocoDB - Airtable alternative for database management',
      category: 'admin',
      healthCheck: true,
    },
    {
      name: 'openmemory-bytebase',
      service: 'bytebase',
      image: 'bytebase/bytebase:3.19.0',
      port: '8089',
      internalPort: 8080,
      status: 'healthy',
      description: 'Bytebase - Database schema migration tool',
      category: 'admin',
      healthCheck: true,
    },
    {
      name: 'openmemory-cloudbeaver',
      service: 'cloudbeaver',
      image: 'dbeaver/cloudbeaver:latest',
      port: '8978',
      internalPort: 8978,
      status: 'healthy',
      description: 'CloudBeaver - Universal database manager',
      category: 'admin',
      healthCheck: true,
    },
  ]
}

/**
 * Get containers grouped by category
 */
export function getContainersByCategory() {
  const containers = getContainers()
  
  return {
    core: containers.filter(c => c.category === 'core'),
    admin: containers.filter(c => c.category === 'admin'),
    monitoring: containers.filter(c => c.category === 'monitoring'),
    database: containers.filter(c => c.category === 'database'),
    proxy: containers.filter(c => c.category === 'proxy'),
  }
}

/**
 * Get container statistics
 */
export function getContainerStats() {
  const containers = getContainers()
  
  return {
    total: containers.length,
    healthy: containers.filter(c => c.status === 'healthy').length,
    running: containers.filter(c => c.status === 'running').length,
    unhealthy: containers.filter(c => c.status === 'unhealthy').length,
    starting: containers.filter(c => c.status === 'starting').length,
    withHealthCheck: containers.filter(c => c.healthCheck).length,
  }
}

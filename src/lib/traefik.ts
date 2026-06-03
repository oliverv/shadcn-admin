/**
 * Traefik configuration parser and utilities
 * Parses dynamic.yml and provides typed access to routes, services, and middlewares
 */

export interface TraefikRouter {
  name: string
  rule: string
  entryPoints: string[]
  middlewares: string[]
  service: string
}

export interface TraefikMiddleware {
  name: string
  type: 'forwardAuth' | 'headers' | 'buffering' | 'unknown'
  config: Record<string, any>
}

export interface TraefikService {
  name: string
  loadBalancer: {
    servers: Array<{ url: string }>
  }
}

export interface TraefikConfig {
  routers: TraefikRouter[]
  middlewares: TraefikMiddleware[]
  services: TraefikService[]
}

/**
 * Parse Traefik dynamic.yml configuration
 * In production, this would read from /traefik/dynamic.yml mounted volume
 * For now, we hardcode the configuration
 */
export function parseTraefikConfig(): TraefikConfig {
  // TODO: In production, fetch this from the mounted /traefik/dynamic.yml file
  // For now, we'll parse the known configuration
  
  const routers: TraefikRouter[] = [
    { name: 'api-openmemory', rule: 'Host(`api-openmemory.collabmind.dev`)', entryPoints: ['web'], middlewares: ['jwt-auth'], service: 'openmemory-svc' },
    { name: 'mcp-openmemory', rule: 'Host(`mcp-openmemory.collabmind.dev`)', entryPoints: ['web'], middlewares: ['add-api-key'], service: 'openmemory-svc' },
    { name: 'api-py-openmemory', rule: 'Host(`api-py-openmemory.collabmind.dev`)', entryPoints: ['web'], middlewares: ['add-api-key'], service: 'openmemory-py-svc' },
    { name: 'mcp-py-openmemory', rule: 'Host(`mcp-py-openmemory.collabmind.dev`)', entryPoints: ['web'], middlewares: ['set-https-scheme', 'authelia-auth', 'no-buffer'], service: 'openmemory-py-svc' },
    { name: 'authelia-server', rule: 'Host(`auth.collabmind.dev`)', entryPoints: ['web'], middlewares: ['set-https-scheme'], service: 'authelia-svc' },
    { name: 'intra-beta', rule: 'Host(`intra-beta.collabmind.dev`)', entryPoints: ['web'], middlewares: ['set-https-scheme', 'authelia-auth'], service: 'intra-beta-svc' },
    { name: 'dashboard-openmemory', rule: 'Host(`openmemory.collabmind.dev`) || Host(`dash-openmemory.collabmind.dev`)', entryPoints: ['web'], middlewares: [], service: 'dashboard-svc' },
    { name: 'infrastructure-dashboard-openmemory', rule: 'Host(`intra-beta.collabmind.dev`)', entryPoints: ['web'], middlewares: ['set-https-scheme', 'authelia-auth'], service: 'infrastructure-dashboard-svc' },
    { name: 'qdrant-openmemory', rule: 'Host(`qdrant-openmemory.collabmind.dev`)', entryPoints: ['web'], middlewares: [], service: 'qdrant-svc' },
    { name: 'xai-mem-gateway', rule: 'Host(`xai-openmemory.collabmind.dev`)', entryPoints: ['web'], middlewares: ['set-https-scheme', 'authelia-auth'], service: 'xai-gateway-svc' },
    { name: 'api-gateway-openmemory', rule: 'Host(`gateway-openmemory.collabmind.dev`)', entryPoints: ['web'], middlewares: ['set-https-scheme', 'authelia-auth'], service: 'api-gateway-svc' },
    { name: 'authelia-admin-openmemory', rule: 'Host(`auth-admin-openmemory.collabmind.dev`)', entryPoints: ['web'], middlewares: ['set-https-scheme', 'authelia-auth'], service: 'authelia-admin-svc' },
    { name: 'grafana-openmemory', rule: 'Host(`grafana-openmemory.collabmind.dev`)', entryPoints: ['web'], middlewares: ['set-https-scheme', 'authelia-auth'], service: 'grafana-svc' },
    { name: 'prometheus-openmemory', rule: 'Host(`prometheus-openmemory.collabmind.dev`)', entryPoints: ['web'], middlewares: ['set-https-scheme', 'authelia-auth'], service: 'prometheus-svc' },
    { name: 'vm-openmemory', rule: 'Host(`vm-openmemory.collabmind.dev`)', entryPoints: ['web'], middlewares: ['set-https-scheme', 'authelia-auth'], service: 'victoriametrics-svc' },
    { name: 'beszel-openmemory', rule: 'Host(`beszel-openmemory.collabmind.dev`)', entryPoints: ['web'], middlewares: ['set-https-scheme', 'authelia-auth'], service: 'beszel-svc' },
    { name: 'py-openmemory', rule: 'Host(`py-openmemory.collabmind.dev`)', entryPoints: ['web'], middlewares: ['add-api-key'], service: 'openmemory-py-svc' },
  ]

  const middlewares: TraefikMiddleware[] = [
    { name: 'no-buffer', type: 'buffering', config: { maxResponseBodyBytes: 0 } },
    { name: 'jwt-auth', type: 'forwardAuth', config: { address: 'http://jwt-validator:9000', authRequestHeaders: ['Authorization'] } },
    { name: 'authelia-auth', type: 'forwardAuth', config: { address: 'http://authelia:9091/api/authz/forward-auth', trustForwardHeader: true } },
    { name: 'set-https-scheme', type: 'headers', config: { customRequestHeaders: { 'X-Forwarded-Proto': 'https', 'X-Forwarded-Ssl': 'on' } } },
    { name: 'add-api-key', type: 'headers', config: { customRequestHeaders: { 'X-API-Key': '***' } } },
  ]

  const services: TraefikService[] = [
    { name: 'openmemory-py-svc', loadBalancer: { servers: [{ url: 'http://openmemory-py:8082' }] } },
    { name: 'openmemory-svc', loadBalancer: { servers: [{ url: 'http://openmemory:8080' }] } },
    { name: 'dashboard-svc', loadBalancer: { servers: [{ url: 'http://dashboard:3000' }] } },
    { name: 'infrastructure-dashboard-svc', loadBalancer: { servers: [{ url: 'http://infrastructure-dashboard:3001' }] } },
    { name: 'qdrant-svc', loadBalancer: { servers: [{ url: 'http://qdrant:6333' }] } },
    { name: 'xai-gateway-svc', loadBalancer: { servers: [{ url: 'http://xai-mem-gateway:8233' }] } },
    { name: 'api-gateway-svc', loadBalancer: { servers: [{ url: 'http://api-gateway:8888' }] } },
    { name: 'authelia-admin-svc', loadBalancer: { servers: [{ url: 'http://authelia-admin:8889' }] } },
    { name: 'authelia-svc', loadBalancer: { servers: [{ url: 'http://authelia:9091' }] } },
    { name: 'intra-beta-svc', loadBalancer: { servers: [{ url: 'http://host.docker.internal:3001' }] } },
    { name: 'grafana-svc', loadBalancer: { servers: [{ url: 'http://grafana:3000' }] } },
    { name: 'prometheus-svc', loadBalancer: { servers: [{ url: 'http://prometheus:9090' }] } },
    { name: 'victoriametrics-svc', loadBalancer: { servers: [{ url: 'http://victoriametrics:8428' }] } },
    { name: 'beszel-svc', loadBalancer: { servers: [{ url: 'http://beszel:8090' }] } },
  ]

  return { routers, middlewares, services }
}

/**
 * Get all unique hosts from router rules
 */
export function getRouterHosts(router: TraefikRouter): string[] {
  const hostRegex = /Host\(`([^`]+)`\)/g
  const hosts: string[] = []
  let match
  
  while ((match = hostRegex.exec(router.rule)) !== null) {
    hosts.push(match[1])
  }
  
  return hosts
}

/**
 * Get middleware chain description
 */
export function getMiddlewareChain(router: TraefikRouter, middlewares: TraefikMiddleware[]): string {
  if (router.middlewares.length === 0) return 'None'
  
  return router.middlewares
    .map(mw => {
      const middleware = middlewares.find(m => m.name === mw)
      return middleware ? `${mw} (${middleware.type})` : mw
    })
    .join(' → ')
}

/**
 * Get authentication type from middlewares
 */
export function getAuthType(router: TraefikRouter): 'JWT' | 'OAuth2' | 'API Key' | 'None' {
  if (router.middlewares.includes('jwt-auth')) return 'JWT'
  if (router.middlewares.includes('authelia-auth')) return 'OAuth2'
  if (router.middlewares.includes('add-api-key')) return 'API Key'
  return 'None'
}

/**
 * Check if router is publicly accessible (no auth)
 */
export function isPublicRoute(router: TraefikRouter): boolean {
  return getAuthType(router) === 'None'
}

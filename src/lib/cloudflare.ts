/**
 * Cloudflare zone and DNS management utilities
 * 
 * NOTE: In production, these API calls should be proxied through a backend
 * service to avoid exposing credentials in the browser. For now, this
 * displays static/cached data from the collabmind.dev zone.
 */

export interface CloudflareZone {
  id: string
  name: string
  status: 'active' | 'pending' | 'initializing' | 'moved' | 'deleted'
  paused: boolean
  type: 'full' | 'partial'
  nameServers: string[]
  createdOn: string
  modifiedOn: string
  account: {
    id: string
    name: string
  }
  ssl: {
    status: 'active' | 'pending' | 'disabled'
    type: 'full' | 'flexible' | 'full_strict' | 'strict'
  }
  plan: {
    id: string
    name: string
  }
}

export interface DNSRecord {
  id: string
  type: 'A' | 'AAAA' | 'CNAME' | 'MX' | 'TXT' | 'NS' | 'SRV' | 'CAA'
  name: string
  content: string
  proxied: boolean
  ttl: number
  priority?: number
  comment?: string
  tags?: string[]
}

export interface CloudflareStats {
  totalRecords: number
  proxiedRecords: number
  recordTypes: Record<string, number>
  sslStatus: string
  zoneStatus: string
}

/**
 * Get all Cloudflare zones in the account
 * In production, this would call: GET /zones
 */
export function getAllZones(): CloudflareZone[] {
  return [
    {
      id: '2d8609696b6cac3fdc6c2f55c518402a',
      name: 'collabmind.dev',
      status: 'active',
      paused: false,
      type: 'full',
      nameServers: [
        'gemma.ns.cloudflare.com',
        'rick.ns.cloudflare.com',
      ],
      createdOn: '2024-01-15T10:30:00Z',
      modifiedOn: '2026-06-03T14:00:00Z',
      account: {
        id: 'cloudflare-account-id',
        name: 'CollabMind',
      },
      ssl: {
        status: 'active',
        type: 'full',
      },
      plan: {
        id: 'free',
        name: 'Free Plan',
      },
    },
    // Add more zones here as needed
  ]
}

/**
 * Get Cloudflare zone information by ID or name
 */
export function getCloudflareZone(idOrName?: string): CloudflareZone {
  const zones = getAllZones()
  
  if (!idOrName) {
    return zones[0] // Default to first zone
  }
  
  const zone = zones.find(z => z.id === idOrName || z.name === idOrName)
  return zone || zones[0]
}

/**
 * Get DNS records for a specific zone
 * In production, this would call: GET /zones/{zone_id}/dns_records
 */
export function getDNSRecords(zoneId?: string): DNSRecord[] {
  const zone = getCloudflareZone(zoneId)
  
  // Return zone-specific records
  if (zone.name !== 'collabmind.dev') {
    return [] // Placeholder for other zones
  }
  
  // collabmind.dev records
  return [
    // OpenMemory Services
    {
      id: 'rec-api-openmemory',
      type: 'CNAME',
      name: 'api-openmemory.collabmind.dev',
      content: 'tunnel.collabmind.dev',
      proxied: true,
      ttl: 1,
      comment: 'OpenMemory Core API',
      tags: ['openmemory', 'api'],
    },
    {
      id: 'rec-api-py-openmemory',
      type: 'CNAME',
      name: 'api-py-openmemory.collabmind.dev',
      content: 'tunnel.collabmind.dev',
      proxied: true,
      ttl: 1,
      comment: 'OpenMemory Python API',
      tags: ['openmemory', 'api'],
    },
    {
      id: 'rec-mcp-openmemory',
      type: 'CNAME',
      name: 'mcp-openmemory.collabmind.dev',
      content: 'tunnel.collabmind.dev',
      proxied: true,
      ttl: 1,
      comment: 'OpenMemory MCP Server (JS)',
      tags: ['openmemory', 'mcp'],
    },
    {
      id: 'rec-mcp-py-openmemory',
      type: 'CNAME',
      name: 'mcp-py-openmemory.collabmind.dev',
      content: 'tunnel.collabmind.dev',
      proxied: true,
      ttl: 1,
      comment: 'OpenMemory MCP Server (Python)',
      tags: ['openmemory', 'mcp'],
    },
    {
      id: 'rec-openmemory',
      type: 'CNAME',
      name: 'openmemory.collabmind.dev',
      content: 'tunnel.collabmind.dev',
      proxied: true,
      ttl: 1,
      comment: 'OpenMemory Dashboard',
      tags: ['openmemory', 'dashboard'],
    },
    {
      id: 'rec-gateway-openmemory',
      type: 'CNAME',
      name: 'gateway-openmemory.collabmind.dev',
      content: 'tunnel.collabmind.dev',
      proxied: true,
      ttl: 1,
      comment: 'Unified API Gateway',
      tags: ['openmemory', 'gateway'],
    },
    {
      id: 'rec-xai-openmemory',
      type: 'CNAME',
      name: 'xai-openmemory.collabmind.dev',
      content: 'tunnel.collabmind.dev',
      proxied: true,
      ttl: 1,
      comment: 'xAI Memory Gateway',
      tags: ['openmemory', 'gateway'],
    },

    // Infrastructure
    {
      id: 'rec-intra-beta',
      type: 'CNAME',
      name: 'intra-beta.collabmind.dev',
      content: 'tunnel.collabmind.dev',
      proxied: true,
      ttl: 1,
      comment: 'Infrastructure Dashboard',
      tags: ['infrastructure', 'admin'],
    },
    {
      id: 'rec-auth',
      type: 'CNAME',
      name: 'auth.collabmind.dev',
      content: 'tunnel.collabmind.dev',
      proxied: true,
      ttl: 1,
      comment: 'Authelia OAuth2',
      tags: ['infrastructure', 'auth'],
    },
    {
      id: 'rec-auth-admin',
      type: 'CNAME',
      name: 'auth-admin-openmemory.collabmind.dev',
      content: 'tunnel.collabmind.dev',
      proxied: true,
      ttl: 1,
      comment: 'Authelia Admin UI',
      tags: ['openmemory', 'admin'],
    },

    // Monitoring
    {
      id: 'rec-grafana',
      type: 'CNAME',
      name: 'grafana-openmemory.collabmind.dev',
      content: 'tunnel.collabmind.dev',
      proxied: true,
      ttl: 1,
      comment: 'Grafana Dashboards',
      tags: ['monitoring'],
    },
    {
      id: 'rec-prometheus',
      type: 'CNAME',
      name: 'prometheus-openmemory.collabmind.dev',
      content: 'tunnel.collabmind.dev',
      proxied: true,
      ttl: 1,
      comment: 'Prometheus Metrics',
      tags: ['monitoring'],
    },
    {
      id: 'rec-vm',
      type: 'CNAME',
      name: 'vm-openmemory.collabmind.dev',
      content: 'tunnel.collabmind.dev',
      proxied: true,
      ttl: 1,
      comment: 'VictoriaMetrics',
      tags: ['monitoring'],
    },
    {
      id: 'rec-beszel',
      type: 'CNAME',
      name: 'beszel-openmemory.collabmind.dev',
      content: 'tunnel.collabmind.dev',
      proxied: true,
      ttl: 1,
      comment: 'Beszel System Monitor',
      tags: ['monitoring'],
    },

    // Database
    {
      id: 'rec-qdrant',
      type: 'CNAME',
      name: 'qdrant-openmemory.collabmind.dev',
      content: 'tunnel.collabmind.dev',
      proxied: true,
      ttl: 1,
      comment: 'Qdrant Vector DB',
      tags: ['database'],
    },

    // Tunnel
    {
      id: 'rec-tunnel',
      type: 'CNAME',
      name: 'tunnel.collabmind.dev',
      content: 'your-cloudflare-tunnel-id.cfargotunnel.com',
      proxied: false,
      ttl: 1,
      comment: 'Cloudflare Tunnel',
      tags: ['infrastructure', 'tunnel'],
    },

    // Root and WWW
    {
      id: 'rec-root',
      type: 'A',
      name: 'collabmind.dev',
      content: '192.0.2.1',
      proxied: true,
      ttl: 1,
      comment: 'Root domain',
      tags: ['main'],
    },
    {
      id: 'rec-www',
      type: 'CNAME',
      name: 'www.collabmind.dev',
      content: 'collabmind.dev',
      proxied: true,
      ttl: 1,
      comment: 'WWW redirect',
      tags: ['main'],
    },
  ]
}

/**
 * Get Cloudflare statistics for a specific zone
 */
export function getCloudflareStats(zoneId?: string): CloudflareStats {
  const records = getDNSRecords(zoneId)
  const recordTypes: Record<string, number> = {}

  records.forEach((record) => {
    recordTypes[record.type] = (recordTypes[record.type] || 0) + 1
  })

  return {
    totalRecords: records.length,
    proxiedRecords: records.filter((r) => r.proxied).length,
    recordTypes,
    sslStatus: 'Active (Full)',
    zoneStatus: 'Active',
  }
}

/**
 * Get records by tag
 */
export function getRecordsByTag(tag: string): DNSRecord[] {
  return getDNSRecords().filter((record) => record.tags?.includes(tag))
}

/**
 * Get all unique tags
 */
export function getAllTags(): string[] {
  const tags = new Set<string>()
  getDNSRecords().forEach((record) => {
    record.tags?.forEach((tag) => tags.add(tag))
  })
  return Array.from(tags).sort()
}

// Additional Cloudflare Features

export interface FirewallRule {
  id: string
  description: string
  action: 'block' | 'challenge' | 'allow' | 'js_challenge'
  filter: string
  enabled: boolean
}

export interface PageRule {
  id: string
  targets: string[]
  actions: Array<{ id: string; value: any }>
  priority: number
  status: 'active' | 'disabled'
}

export interface Worker {
  id: string
  name: string
  script: string
  route: string
  enabled: boolean
  createdOn: string
}

export interface CacheSettings {
  cacheLevel: 'aggressive' | 'basic' | 'simplified'
  browserCacheTTL: number
  alwaysOnline: boolean
  developmentMode: boolean
}

export interface SecuritySettings {
  securityLevel: 'off' | 'essentially_off' | 'low' | 'medium' | 'high' | 'under_attack'
  waf: boolean
  ddos: boolean
  botManagement: boolean
  rateLimiting: boolean
}

export interface AnalyticsSummary {
  requests: {
    total: number
    cached: number
    uncached: number
  }
  bandwidth: {
    total: string
    cached: string
    uncached: string
  }
  threats: {
    total: number
    blocked: number
  }
  pageViews: number
  uniqueVisitors: number
}

/**
 * Get firewall rules for a specific zone
 */
export function getFirewallRules(_zoneId?: string): FirewallRule[] {
  return [
    {
      id: 'fw-1',
      description: 'Block known bad bots',
      action: 'block',
      filter: '(cf.client.bot) and not (cf.verified_bot_category in {"Search Engine Crawler"})',
      enabled: true,
    },
    {
      id: 'fw-2',
      description: 'Challenge non-US traffic to admin pages',
      action: 'challenge',
      filter: '(http.request.uri.path contains "/admin") and (ip.geoip.country ne "US")',
      enabled: true,
    },
    {
      id: 'fw-3',
      description: 'Block specific countries',
      action: 'block',
      filter: '(ip.geoip.country in {"CN" "RU" "KP"})',
      enabled: false,
    },
  ]
}

/**
 * Get page rules for a specific zone
 */
export function getPageRules(_zoneId?: string): PageRule[] {
  return [
    {
      id: 'pr-1',
      targets: ['*collabmind.dev/api/*'],
      actions: [
        { id: 'cache_level', value: 'bypass' },
        { id: 'disable_performance', value: true },
      ],
      priority: 1,
      status: 'active',
    },
    {
      id: 'pr-2',
      targets: ['*collabmind.dev/static/*'],
      actions: [
        { id: 'cache_level', value: 'aggressive' },
        { id: 'edge_cache_ttl', value: 86400 },
      ],
      priority: 2,
      status: 'active',
    },
  ]
}

/**
 * Get Workers for a specific zone
 */
export function getWorkers(_zoneId?: string): Worker[] {
  return [
    {
      id: 'worker-auth',
      name: 'auth-middleware',
      script: 'Authentication middleware for API routes',
      route: '*collabmind.dev/api/*',
      enabled: true,
      createdOn: '2026-01-15T10:00:00Z',
    },
  ]
}

/**
 * Get cache settings for a specific zone
 */
export function getCacheSettings(_zoneId?: string): CacheSettings {
  return {
    cacheLevel: 'aggressive',
    browserCacheTTL: 14400,
    alwaysOnline: true,
    developmentMode: false,
  }
}

/**
 * Get security settings for a specific zone
 */
export function getSecuritySettings(_zoneId?: string): SecuritySettings {
  return {
    securityLevel: 'medium',
    waf: true,
    ddos: true,
    botManagement: true,
    rateLimiting: true,
  }
}

/**
 * Get analytics summary for a specific zone (last 24h)
 */
export function getAnalyticsSummary(_zoneId?: string): AnalyticsSummary {
  return {
    requests: {
      total: 1250000,
      cached: 875000,
      uncached: 375000,
    },
    bandwidth: {
      total: '45.2 GB',
      cached: '32.1 GB',
      uncached: '13.1 GB',
    },
    threats: {
      total: 1523,
      blocked: 1489,
    },
    pageViews: 85420,
    uniqueVisitors: 12340,
  }
}

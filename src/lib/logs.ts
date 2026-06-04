/**
 * Log aggregation utilities
 * Integrates with Docker container logs and system logs
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal'
export type LogSource = 'container' | 'system' | 'application' | 'security'

export interface LogEntry {
  id: string
  timestamp: string
  level: LogLevel
  source: LogSource
  service: string
  message: string
  metadata?: Record<string, any>
  tags?: string[]
}

export interface LogFilter {
  level?: LogLevel[]
  source?: LogSource[]
  service?: string[]
  search?: string
  startTime?: string
  endTime?: string
}

/**
 * Get log entries (mock data - will integrate with real Docker logs)
 */
export function getLogs(filter?: LogFilter): LogEntry[] {
  const allLogs: LogEntry[] = [
    {
      id: 'log-1',
      timestamp: '2026-06-03T15:30:15.123Z',
      level: 'error',
      source: 'container',
      service: 'openmemory-pg',
      message: 'Connection refused to database on port 5432',
      metadata: { port: 5432, host: 'localhost', retries: 3 },
      tags: ['database', 'connection'],
    },
    {
      id: 'log-2',
      timestamp: '2026-06-03T15:30:10.456Z',
      level: 'warn',
      source: 'container',
      service: 'traefik',
      message: 'Rate limit exceeded for IP 203.0.113.42',
      metadata: { ip: '203.0.113.42', limit: 100, window: '1m' },
      tags: ['security', 'rate-limit'],
    },
    {
      id: 'log-3',
      timestamp: '2026-06-03T15:30:05.789Z',
      level: 'info',
      source: 'application',
      service: 'openmemory',
      message: 'Memory stored successfully: project-abc-123',
      metadata: { project_id: 'project-abc-123', sector: 'semantic', size: 1024 },
      tags: ['memory', 'storage'],
    },
    {
      id: 'log-4',
      timestamp: '2026-06-03T15:30:00.012Z',
      level: 'info',
      source: 'security',
      service: 'authelia',
      message: 'Successful authentication for user: oliver',
      metadata: { username: 'oliver', ip: '192.168.1.101', method: '2fa' },
      tags: ['auth', 'login'],
    },
    {
      id: 'log-5',
      timestamp: '2026-06-03T15:29:55.345Z',
      level: 'debug',
      source: 'container',
      service: 'victoriametrics',
      message: 'Metrics scraped: 1234 datapoints',
      metadata: { datapoints: 1234, duration_ms: 45 },
      tags: ['metrics', 'scrape'],
    },
    {
      id: 'log-6',
      timestamp: '2026-06-03T15:29:50.678Z',
      level: 'error',
      source: 'container',
      service: 'api-gateway',
      message: 'Upstream service timeout: openmemory-py',
      metadata: { upstream: 'openmemory-py', timeout_ms: 5000, path: '/api/v1/query' },
      tags: ['gateway', 'timeout'],
    },
    {
      id: 'log-7',
      timestamp: '2026-06-03T15:29:45.901Z',
      level: 'warn',
      source: 'system',
      service: 'docker',
      message: 'Container health check failed: openmemory-pg',
      metadata: { container: 'openmemory-pg', exit_code: 1 },
      tags: ['health', 'container'],
    },
    {
      id: 'log-8',
      timestamp: '2026-06-03T15:29:40.234Z',
      level: 'info',
      source: 'application',
      service: 'xai-mem-gateway',
      message: 'Request processed successfully',
      metadata: { method: 'POST', path: '/api/query', status: 200, duration_ms: 123 },
      tags: ['http', 'gateway'],
    },
    {
      id: 'log-9',
      timestamp: '2026-06-03T15:29:35.567Z',
      level: 'fatal',
      source: 'container',
      service: 'nocodb',
      message: 'Out of memory: JavaScript heap limit exceeded',
      metadata: { heap_used: '2048MB', heap_limit: '2048MB' },
      tags: ['crash', 'memory'],
    },
    {
      id: 'log-10',
      timestamp: '2026-06-03T15:29:30.890Z',
      level: 'info',
      source: 'security',
      service: 'jwt-validator',
      message: 'Token validated successfully',
      metadata: { subject: 'user-123', exp: 1717435200 },
      tags: ['jwt', 'auth'],
    },
    {
      id: 'log-11',
      timestamp: '2026-06-03T15:29:25.123Z',
      level: 'warn',
      source: 'container',
      service: 'valkey',
      message: 'High memory usage detected: 85%',
      metadata: { usage_percent: 85, used_mb: 1700, total_mb: 2000 },
      tags: ['redis', 'memory'],
    },
    {
      id: 'log-12',
      timestamp: '2026-06-03T15:29:20.456Z',
      level: 'info',
      source: 'application',
      service: 'dashboard',
      message: 'Page loaded: /monitoring/metrics',
      metadata: { user: 'oliver', load_time_ms: 234 },
      tags: ['frontend', 'performance'],
    },
    {
      id: 'log-13',
      timestamp: '2026-06-03T15:29:15.789Z',
      level: 'error',
      source: 'security',
      service: 'authelia',
      message: 'Failed login attempt from suspicious IP',
      metadata: { ip: '203.0.113.99', username: 'admin', reason: 'invalid_credentials' },
      tags: ['security', 'failed-login'],
    },
    {
      id: 'log-14',
      timestamp: '2026-06-03T15:29:10.012Z',
      level: 'debug',
      source: 'container',
      service: 'qdrant',
      message: 'Vector search completed',
      metadata: { collection: 'memories', query_time_ms: 12, results: 10 },
      tags: ['vector', 'search'],
    },
    {
      id: 'log-15',
      timestamp: '2026-06-03T15:29:05.345Z',
      level: 'info',
      source: 'system',
      service: 'docker',
      message: 'Container started: infrastructure-dashboard',
      metadata: { container: 'infrastructure-dashboard', image: 'infrastructure-dashboard:latest' },
      tags: ['container', 'lifecycle'],
    },
  ]

  if (!filter) return allLogs

  return allLogs.filter((log) => {
    if (filter.level && !filter.level.includes(log.level)) return false
    if (filter.source && !filter.source.includes(log.source)) return false
    if (filter.service && !filter.service.includes(log.service)) return false
    if (filter.search) {
      const searchLower = filter.search.toLowerCase()
      const messageMatch = log.message.toLowerCase().includes(searchLower)
      const serviceMatch = log.service.toLowerCase().includes(searchLower)
      const tagsMatch = log.tags?.some((tag) => tag.toLowerCase().includes(searchLower))
      if (!messageMatch && !serviceMatch && !tagsMatch) return false
    }
    if (filter.startTime && new Date(log.timestamp) < new Date(filter.startTime)) return false
    if (filter.endTime && new Date(log.timestamp) > new Date(filter.endTime)) return false
    return true
  })
}

/**
 * Get log statistics
 */
export function getLogStats() {
  const logs = getLogs()
  
  const byLevel = logs.reduce((acc, log) => {
    acc[log.level] = (acc[log.level] || 0) + 1
    return acc
  }, {} as Record<LogLevel, number>)

  const bySource = logs.reduce((acc, log) => {
    acc[log.source] = (acc[log.source] || 0) + 1
    return acc
  }, {} as Record<LogSource, number>)

  const byService = logs.reduce((acc, log) => {
    acc[log.service] = (acc[log.service] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const errors = logs.filter((log) => log.level === 'error' || log.level === 'fatal')
  const warnings = logs.filter((log) => log.level === 'warn')

  return {
    total: logs.length,
    byLevel,
    bySource,
    byService,
    errors: errors.length,
    warnings: warnings.length,
    recentErrors: errors.slice(0, 5),
  }
}

/**
 * Get unique services from logs
 */
export function getLogServices(): string[] {
  const logs = getLogs()
  const services = new Set(logs.map((log) => log.service))
  return Array.from(services).sort()
}

/**
 * Get log level color
 */
export function getLogLevelColor(level: LogLevel): string {
  const colors: Record<LogLevel, string> = {
    debug: 'text-gray-500',
    info: 'text-blue-500',
    warn: 'text-yellow-500',
    error: 'text-red-500',
    fatal: 'text-red-700',
  }
  return colors[level]
}

/**
 * Get log level badge variant
 */
export function getLogLevelBadgeVariant(level: LogLevel): 'default' | 'secondary' | 'destructive' | 'outline' {
  const variants: Record<LogLevel, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    debug: 'outline',
    info: 'default',
    warn: 'secondary',
    error: 'destructive',
    fatal: 'destructive',
  }
  return variants[level]
}

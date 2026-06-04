/**
 * Alerts and notifications management
 */

export type AlertSeverity = 'critical' | 'warning' | 'info' | 'success'
export type AlertStatus = 'active' | 'acknowledged' | 'resolved' | 'silenced'
export type AlertType = 'service_down' | 'high_latency' | 'high_cpu' | 'high_memory' | 'disk_space' | 'ssl_expiry' | 'custom'

export interface Alert {
  id: string
  title: string
  message: string
  severity: AlertSeverity
  status: AlertStatus
  type: AlertType
  source: string
  timestamp: string
  acknowledgedAt?: string
  acknowledgedBy?: string
  resolvedAt?: string
  metadata?: Record<string, any>
}

export interface AlertRule {
  id: string
  name: string
  description: string
  enabled: boolean
  severity: AlertSeverity
  type: AlertType
  conditions: {
    metric: string
    operator: '>' | '<' | '>=' | '<=' | '==' | '!='
    threshold: number
    duration?: number // seconds
  }
  actions: {
    notify: boolean
    webhook?: string
    email?: string[]
  }
  lastTriggered?: string
  triggerCount: number
}

export interface NotificationChannel {
  id: string
  type: 'email' | 'slack' | 'webhook' | 'discord' | 'telegram'
  name: string
  enabled: boolean
  config: Record<string, any>
}

/**
 * Get all active and recent alerts
 */
export function getAlerts(): Alert[] {
  return [
    {
      id: 'alert-1',
      title: 'PostgreSQL Connection Unhealthy',
      message: 'PostgreSQL database (openmemory-pg) is reporting unhealthy status',
      severity: 'warning',
      status: 'active',
      type: 'service_down',
      source: 'openmemory-pg',
      timestamp: '2026-06-03T14:30:00Z',
    },
    {
      id: 'alert-2',
      title: 'High Memory Usage - API Gateway',
      message: 'API Gateway container memory usage exceeded 80% (current: 85%)',
      severity: 'warning',
      status: 'acknowledged',
      type: 'high_memory',
      source: 'api-gateway',
      timestamp: '2026-06-03T13:15:00Z',
      acknowledgedAt: '2026-06-03T13:20:00Z',
      acknowledgedBy: 'admin',
    },
    {
      id: 'alert-3',
      title: 'SSL Certificate Expiring Soon',
      message: 'SSL certificate for *.collabmind.dev expires in 30 days',
      severity: 'info',
      status: 'active',
      type: 'ssl_expiry',
      source: 'cloudflare',
      timestamp: '2026-06-03T10:00:00Z',
    },
    {
      id: 'alert-4',
      title: 'Service Restored - VictoriaMetrics',
      message: 'VictoriaMetrics service has recovered and is now healthy',
      severity: 'success',
      status: 'resolved',
      type: 'service_down',
      source: 'victoriametrics',
      timestamp: '2026-06-03T09:00:00Z',
      resolvedAt: '2026-06-03T09:15:00Z',
    },
    {
      id: 'alert-5',
      title: 'High Request Rate Detected',
      message: 'Unusual spike in API requests detected (150% above baseline)',
      severity: 'info',
      status: 'acknowledged',
      type: 'custom',
      source: 'api-gateway',
      timestamp: '2026-06-03T08:45:00Z',
      acknowledgedAt: '2026-06-03T09:00:00Z',
      acknowledgedBy: 'admin',
    },
  ]
}

/**
 * Get alert rules configuration
 */
export function getAlertRules(): AlertRule[] {
  return [
    {
      id: 'rule-1',
      name: 'Service Health Check',
      description: 'Alert when any service reports unhealthy status',
      enabled: true,
      severity: 'critical',
      type: 'service_down',
      conditions: {
        metric: 'health_status',
        operator: '==',
        threshold: 0,
        duration: 60,
      },
      actions: {
        notify: true,
        email: ['admin@openmemory.local'],
      },
      lastTriggered: '2026-06-03T14:30:00Z',
      triggerCount: 3,
    },
    {
      id: 'rule-2',
      name: 'High CPU Usage',
      description: 'Alert when container CPU usage exceeds 80%',
      enabled: true,
      severity: 'warning',
      type: 'high_cpu',
      conditions: {
        metric: 'cpu_percent',
        operator: '>',
        threshold: 80,
        duration: 300,
      },
      actions: {
        notify: true,
        email: ['admin@openmemory.local'],
      },
      triggerCount: 12,
    },
    {
      id: 'rule-3',
      name: 'High Memory Usage',
      description: 'Alert when container memory usage exceeds 80%',
      enabled: true,
      severity: 'warning',
      type: 'high_memory',
      conditions: {
        metric: 'memory_percent',
        operator: '>',
        threshold: 80,
        duration: 300,
      },
      actions: {
        notify: true,
        email: ['admin@openmemory.local'],
      },
      lastTriggered: '2026-06-03T13:15:00Z',
      triggerCount: 8,
    },
    {
      id: 'rule-4',
      name: 'Disk Space Low',
      description: 'Alert when disk usage exceeds 85%',
      enabled: true,
      severity: 'warning',
      type: 'disk_space',
      conditions: {
        metric: 'disk_percent',
        operator: '>',
        threshold: 85,
        duration: 600,
      },
      actions: {
        notify: true,
        email: ['admin@openmemory.local'],
      },
      triggerCount: 2,
    },
    {
      id: 'rule-5',
      name: 'High Response Time',
      description: 'Alert when API response time exceeds 2 seconds',
      enabled: true,
      severity: 'warning',
      type: 'high_latency',
      conditions: {
        metric: 'response_time_ms',
        operator: '>',
        threshold: 2000,
        duration: 120,
      },
      actions: {
        notify: true,
        webhook: 'https://hooks.slack.com/services/...',
      },
      triggerCount: 5,
    },
    {
      id: 'rule-6',
      name: 'SSL Certificate Expiry',
      description: 'Alert when SSL certificates expire within 30 days',
      enabled: true,
      severity: 'info',
      type: 'ssl_expiry',
      conditions: {
        metric: 'ssl_days_remaining',
        operator: '<',
        threshold: 30,
      },
      actions: {
        notify: true,
        email: ['admin@openmemory.local'],
      },
      lastTriggered: '2026-06-03T10:00:00Z',
      triggerCount: 1,
    },
  ]
}

/**
 * Get notification channels
 */
export function getNotificationChannels(): NotificationChannel[] {
  return [
    {
      id: 'channel-1',
      type: 'email',
      name: 'Admin Email',
      enabled: true,
      config: {
        recipients: ['admin@openmemory.local'],
        smtp_server: 'smtp.example.com',
      },
    },
    {
      id: 'channel-2',
      type: 'slack',
      name: 'Infrastructure Slack',
      enabled: false,
      config: {
        webhook_url: 'https://hooks.slack.com/services/...',
        channel: '#infrastructure',
      },
    },
    {
      id: 'channel-3',
      type: 'webhook',
      name: 'Custom Webhook',
      enabled: false,
      config: {
        url: 'https://api.example.com/alerts',
        method: 'POST',
      },
    },
  ]
}

/**
 * Get alert statistics
 */
export function getAlertStats() {
  const alerts = getAlerts()
  const rules = getAlertRules()

  return {
    total: alerts.length,
    active: alerts.filter(a => a.status === 'active').length,
    acknowledged: alerts.filter(a => a.status === 'acknowledged').length,
    resolved: alerts.filter(a => a.status === 'resolved').length,
    critical: alerts.filter(a => a.severity === 'critical').length,
    warning: alerts.filter(a => a.severity === 'warning').length,
    totalRules: rules.length,
    enabledRules: rules.filter(r => r.enabled).length,
  }
}

/**
 * Get recent incidents grouped by day
 */
export function getRecentIncidents() {
  const alerts = getAlerts()
  
  return {
    today: alerts.filter(a => a.timestamp.startsWith('2026-06-03')).length,
    week: alerts.length,
    month: alerts.length,
  }
}

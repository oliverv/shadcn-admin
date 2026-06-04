/**
 * Settings and configuration management
 */

export interface SystemSettings {
  general: GeneralSettings
  monitoring: MonitoringSettings
  notifications: NotificationSettings
  security: SecuritySettings
  performance: PerformanceSettings
}

export interface GeneralSettings {
  dashboardTitle: string
  timezone: string
  dateFormat: string
  theme: 'light' | 'dark' | 'auto'
  language: string
}

export interface MonitoringSettings {
  healthCheckInterval: number
  metricsRetention: number
  logRetention: number
  autoRefresh: boolean
  refreshInterval: number
}

export interface NotificationSettings {
  enableEmail: boolean
  enableSlack: boolean
  enableWebhook: boolean
  emailRecipients: string[]
  slackWebhookUrl: string
  webhookUrl: string
  notifyOnError: boolean
  notifyOnWarning: boolean
  notifyOnServiceDown: boolean
}

export interface SecuritySettings {
  sessionTimeout: number
  require2FA: boolean
  passwordMinLength: number
  passwordRequireSpecialChars: boolean
  maxLoginAttempts: number
  ipWhitelist: string[]
  apiRateLimit: number
}

export interface PerformanceSettings {
  enableCaching: boolean
  cacheTimeout: number
  maxConcurrentRequests: number
  requestTimeout: number
  enableCompression: boolean
}

/**
 * Get current system settings
 */
export function getSettings(): SystemSettings {
  return {
    general: {
      dashboardTitle: 'OpenMemory Infrastructure',
      timezone: 'UTC',
      dateFormat: 'YYYY-MM-DD HH:mm:ss',
      theme: 'light',
      language: 'en',
    },
    monitoring: {
      healthCheckInterval: 10,
      metricsRetention: 30,
      logRetention: 7,
      autoRefresh: true,
      refreshInterval: 10,
    },
    notifications: {
      enableEmail: true,
      enableSlack: true,
      enableWebhook: false,
      emailRecipients: ['admin@openmemory.local', 'oliver@collabmind.dev'],
      slackWebhookUrl: 'https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXX',
      webhookUrl: '',
      notifyOnError: true,
      notifyOnWarning: true,
      notifyOnServiceDown: true,
    },
    security: {
      sessionTimeout: 3600,
      require2FA: true,
      passwordMinLength: 12,
      passwordRequireSpecialChars: true,
      maxLoginAttempts: 5,
      ipWhitelist: ['192.168.1.0/24', '10.0.0.0/8'],
      apiRateLimit: 100,
    },
    performance: {
      enableCaching: true,
      cacheTimeout: 300,
      maxConcurrentRequests: 100,
      requestTimeout: 30,
      enableCompression: true,
    },
  }
}

/**
 * Get available timezones
 */
export function getTimezones(): string[] {
  return [
    'UTC',
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Paris',
    'Europe/Berlin',
    'Asia/Tokyo',
    'Asia/Shanghai',
    'Asia/Singapore',
    'Australia/Sydney',
  ]
}

/**
 * Get available languages
 */
export function getLanguages(): Array<{ code: string; name: string }> {
  return [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'ja', name: 'Japanese' },
    { code: 'zh', name: 'Chinese' },
  ]
}

/**
 * Save settings (mock)
 */
export function saveSettings(settings: Partial<SystemSettings>): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Settings saved:', settings)
      resolve()
    }, 500)
  })
}

/**
 * Reset settings to defaults
 */
export function resetSettings(): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Settings reset to defaults')
      resolve()
    }, 500)
  })
}

/**
 * Export settings as JSON
 */
export function exportSettings(): string {
  const settings = getSettings()
  return JSON.stringify(settings, null, 2)
}

/**
 * Import settings from JSON
 */
export function importSettings(json: string): SystemSettings {
  return JSON.parse(json) as SystemSettings
}

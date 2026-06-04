import { createFileRoute } from '@tanstack/react-router'
import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import {
  Settings as SettingsIcon,
  Save,
  RotateCcw,
  Download,
  Globe,
  Bell,
  Shield,
  Zap,
  Activity,
} from 'lucide-react'
import { getSettings, getTimezones, getLanguages, saveSettings, resetSettings, exportSettings } from '@/lib/settings'
import { useToast } from '@/hooks/use-toast'

export const Route = createFileRoute('/_authenticated/settings')({
  component: SettingsPage,
})

function SettingsPage() {
  const { toast } = useToast()
  const initialSettings = useMemo(() => getSettings(), [])
  const [settings, setSettings] = useState(initialSettings)
  const timezones = useMemo(() => getTimezones(), [])
  const languages = useMemo(() => getLanguages(), [])

  const handleSave = async () => {
    await saveSettings(settings)
    toast({
      title: 'Settings saved',
      description: 'Your settings have been saved successfully.',
    })
  }

  const handleReset = async () => {
    await resetSettings()
    setSettings(initialSettings)
    toast({
      title: 'Settings reset',
      description: 'Settings have been reset to defaults.',
    })
  }

  const handleExport = () => {
    const json = exportSettings()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'infrastructure-settings.json'
    a.click()
    URL.revokeObjectURL(url)
    toast({
      title: 'Settings exported',
      description: 'Settings have been exported successfully.',
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-500/10">
            <SettingsIcon className="h-6 w-6 text-gray-500" />
          </div>
          <div>
            <h3 className="text-lg font-medium">Settings</h3>
            <p className="text-sm text-muted-foreground">
              Configure dashboard and system preferences
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">
            <Globe className="mr-2 h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="monitoring">
            <Activity className="mr-2 h-4 w-4" />
            Monitoring
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="mr-2 h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="performance">
            <Zap className="mr-2 h-4 w-4" />
            Performance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Basic dashboard configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Dashboard Title</Label>
                <Input
                  id="title"
                  value={settings.general.dashboardTitle}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      general: { ...settings.general, dashboardTitle: e.target.value },
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select
                  value={settings.general.timezone}
                  onValueChange={(value) =>
                    setSettings({
                      ...settings,
                      general: { ...settings.general, timezone: value },
                    })
                  }
                >
                  <SelectTrigger id="timezone">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timezones.map((tz) => (
                      <SelectItem key={tz} value={tz}>
                        {tz}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select
                  value={settings.general.language}
                  onValueChange={(value) =>
                    setSettings({
                      ...settings,
                      general: { ...settings.general, language: value },
                    })
                  }
                >
                  <SelectTrigger id="language">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <Select
                  value={settings.general.theme}
                  onValueChange={(value: any) =>
                    setSettings({
                      ...settings,
                      general: { ...settings.general, theme: value },
                    })
                  }
                >
                  <SelectTrigger id="theme">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="auto">Auto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monitoring Settings</CardTitle>
              <CardDescription>Configure health checks and data retention</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto Refresh</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically refresh dashboards
                  </p>
                </div>
                <Switch
                  checked={settings.monitoring.autoRefresh}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      monitoring: { ...settings.monitoring, autoRefresh: checked },
                    })
                  }
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="refresh-interval">Refresh Interval (seconds)</Label>
                <Input
                  id="refresh-interval"
                  type="number"
                  value={settings.monitoring.refreshInterval}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      monitoring: {
                        ...settings.monitoring,
                        refreshInterval: parseInt(e.target.value),
                      },
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="health-check">Health Check Interval (seconds)</Label>
                <Input
                  id="health-check"
                  type="number"
                  value={settings.monitoring.healthCheckInterval}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      monitoring: {
                        ...settings.monitoring,
                        healthCheckInterval: parseInt(e.target.value),
                      },
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="metrics-retention">Metrics Retention (days)</Label>
                <Input
                  id="metrics-retention"
                  type="number"
                  value={settings.monitoring.metricsRetention}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      monitoring: {
                        ...settings.monitoring,
                        metricsRetention: parseInt(e.target.value),
                      },
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="log-retention">Log Retention (days)</Label>
                <Input
                  id="log-retention"
                  type="number"
                  value={settings.monitoring.logRetention}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      monitoring: {
                        ...settings.monitoring,
                        logRetention: parseInt(e.target.value),
                      },
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure alert notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Send alerts via email</p>
                </div>
                <Switch
                  checked={settings.notifications.enableEmail}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, enableEmail: checked },
                    })
                  }
                />
              </div>

              {settings.notifications.enableEmail && (
                <div className="space-y-2">
                  <Label htmlFor="email-recipients">Email Recipients (comma-separated)</Label>
                  <Input
                    id="email-recipients"
                    value={settings.notifications.emailRecipients.join(', ')}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        notifications: {
                          ...settings.notifications,
                          emailRecipients: e.target.value.split(',').map((s) => s.trim()),
                        },
                      })
                    }
                  />
                </div>
              )}

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Slack Notifications</Label>
                  <p className="text-sm text-muted-foreground">Send alerts to Slack</p>
                </div>
                <Switch
                  checked={settings.notifications.enableSlack}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, enableSlack: checked },
                    })
                  }
                />
              </div>

              {settings.notifications.enableSlack && (
                <div className="space-y-2">
                  <Label htmlFor="slack-webhook">Slack Webhook URL</Label>
                  <Input
                    id="slack-webhook"
                    value={settings.notifications.slackWebhookUrl}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        notifications: {
                          ...settings.notifications,
                          slackWebhookUrl: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              )}

              <Separator />

              <div className="space-y-4">
                <Label>Alert Triggers</Label>
                <div className="flex items-center justify-between">
                  <Label htmlFor="notify-error" className="font-normal">
                    Notify on errors
                  </Label>
                  <Switch
                    id="notify-error"
                    checked={settings.notifications.notifyOnError}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, notifyOnError: checked },
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="notify-warning" className="font-normal">
                    Notify on warnings
                  </Label>
                  <Switch
                    id="notify-warning"
                    checked={settings.notifications.notifyOnWarning}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        notifications: {
                          ...settings.notifications,
                          notifyOnWarning: checked,
                        },
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="notify-down" className="font-normal">
                    Notify on service down
                  </Label>
                  <Switch
                    id="notify-down"
                    checked={settings.notifications.notifyOnServiceDown}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        notifications: {
                          ...settings.notifications,
                          notifyOnServiceDown: checked,
                        },
                      })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Authentication and access control</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Require 2FA</Label>
                  <p className="text-sm text-muted-foreground">
                    Require two-factor authentication for all users
                  </p>
                </div>
                <Switch
                  checked={settings.security.require2FA}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      security: { ...settings.security, require2FA: checked },
                    })
                  }
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="session-timeout">Session Timeout (seconds)</Label>
                <Input
                  id="session-timeout"
                  type="number"
                  value={settings.security.sessionTimeout}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      security: {
                        ...settings.security,
                        sessionTimeout: parseInt(e.target.value),
                      },
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="max-login">Max Login Attempts</Label>
                <Input
                  id="max-login"
                  type="number"
                  value={settings.security.maxLoginAttempts}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      security: {
                        ...settings.security,
                        maxLoginAttempts: parseInt(e.target.value),
                      },
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rate-limit">API Rate Limit (requests/minute)</Label>
                <Input
                  id="rate-limit"
                  type="number"
                  value={settings.security.apiRateLimit}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      security: {
                        ...settings.security,
                        apiRateLimit: parseInt(e.target.value),
                      },
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ip-whitelist">IP Whitelist (comma-separated CIDRs)</Label>
                <Input
                  id="ip-whitelist"
                  value={settings.security.ipWhitelist.join(', ')}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      security: {
                        ...settings.security,
                        ipWhitelist: e.target.value.split(',').map((s) => s.trim()),
                      },
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Settings</CardTitle>
              <CardDescription>Optimize dashboard performance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Caching</Label>
                  <p className="text-sm text-muted-foreground">Cache API responses</p>
                </div>
                <Switch
                  checked={settings.performance.enableCaching}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      performance: { ...settings.performance, enableCaching: checked },
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Compression</Label>
                  <p className="text-sm text-muted-foreground">Compress API responses</p>
                </div>
                <Switch
                  checked={settings.performance.enableCompression}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      performance: { ...settings.performance, enableCompression: checked },
                    })
                  }
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="cache-timeout">Cache Timeout (seconds)</Label>
                <Input
                  id="cache-timeout"
                  type="number"
                  value={settings.performance.cacheTimeout}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      performance: {
                        ...settings.performance,
                        cacheTimeout: parseInt(e.target.value),
                      },
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="request-timeout">Request Timeout (seconds)</Label>
                <Input
                  id="request-timeout"
                  type="number"
                  value={settings.performance.requestTimeout}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      performance: {
                        ...settings.performance,
                        requestTimeout: parseInt(e.target.value),
                      },
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="max-concurrent">Max Concurrent Requests</Label>
                <Input
                  id="max-concurrent"
                  type="number"
                  value={settings.performance.maxConcurrentRequests}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      performance: {
                        ...settings.performance,
                        maxConcurrentRequests: parseInt(e.target.value),
                      },
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

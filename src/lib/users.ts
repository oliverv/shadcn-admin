/**
 * User management utilities
 * Integrates with Authentik user backend
 */

export interface User {
  id: string
  username: string
  displayName: string
  email: string
  groups: string[]
  enabled: boolean
  createdAt: string
  lastLogin?: string
  twoFactor: boolean
  role: 'admin' | 'user' | 'viewer'
}

export interface Group {
  id: string
  name: string
  description: string
  members: number
  permissions: string[]
}

export interface Session {
  id: string
  username: string
  ip: string
  userAgent: string
  createdAt: string
  lastActivity: string
  expiresAt: string
}

export interface AuditLog {
  id: string
  timestamp: string
  username: string
  action: string
  resource: string
  ip: string
  success: boolean
  details?: string
}

const API_URL = import.meta.env.VITE_AUTHENTIK_API_URL || 'https://auth.collabmind.dev/api/v3'
const TOKEN = import.meta.env.VITE_AUTHENTIK_TOKEN || ''

const headers = {
  Authorization: `Bearer ${TOKEN}`,
  Accept: 'application/json'
}

/**
 * Get all users from Authentik
 */
export async function getUsers(): Promise<User[]> {
  try {
    if (!TOKEN) return []
    const res = await fetch(`${API_URL}/core/users/`, { headers })
    if (!res.ok) return []
    const data = await res.json()
    return data.results.map((u: any) => ({
      id: u.pk.toString(),
      username: u.username,
      displayName: u.name || u.username,
      email: u.email || '',
      groups: [], 
      enabled: u.is_active,
      createdAt: u.last_login || new Date().toISOString(),
      lastLogin: u.last_login,
      twoFactor: false,
      role: u.is_superuser ? 'admin' : 'user'
    }))
  } catch {
    return []
  }
}

/**
 * Get all groups
 */
export async function getGroups(): Promise<Group[]> {
  try {
    if (!TOKEN) return []
    const res = await fetch(`${API_URL}/core/groups/`, { headers })
    if (!res.ok) return []
    const data = await res.json()
    return data.results.map((g: any) => ({
      id: g.pk.toString(),
      name: g.name,
      description: g.name,
      members: g.users?.length || 0,
      permissions: []
    }))
  } catch {
    return []
  }
}

/**
 * Get active sessions (mocked for now as Authentik sessions API is complex)
 */
export async function getSessions(): Promise<Session[]> {
  return []
}

/**
 * Get audit logs (events)
 */
export async function getAuditLogs(): Promise<AuditLog[]> {
  try {
    if (!TOKEN) return []
    const res = await fetch(`${API_URL}/events/events/?page_size=20`, { headers })
    if (!res.ok) return []
    const data = await res.json()
    return data.results.map((e: any) => ({
      id: e.pk.toString(),
      timestamp: e.created,
      username: e.user?.username || 'system',
      action: e.action,
      resource: e.app || 'core',
      ip: e.client_ip || 'unknown',
      success: true
    }))
  } catch {
    return []
  }
}

/**
 * Get user statistics
 */
export async function getUserStats() {
  const users = await getUsers()
  const groups = await getGroups()

  return {
    total: users.length,
    active: users.filter(u => u.enabled).length,
    disabled: users.filter(u => !u.enabled).length,
    with2FA: users.filter(u => u.twoFactor).length,
    admins: users.filter(u => u.role === 'admin').length,
    activeSessions: 0,
    totalGroups: groups.length,
  }
}

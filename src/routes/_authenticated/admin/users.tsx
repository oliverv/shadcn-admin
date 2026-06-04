import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Users as UsersIcon,
  Shield,
  UserPlus,
  CheckCircle2,
  XCircle,
  Key,
  Activity,
  UserCog,
} from 'lucide-react'
import { getUsers, getGroups, getSessions, getAuditLogs, getUserStats, User, Group, Session, AuditLog } from '@/lib/users'

export const Route = createFileRoute('/_authenticated/admin/users')({
  component: UsersPage,
})

function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [groups, setGroups] = useState<Group[]>([])
  const [sessions, setSessions] = useState<Session[]>([])
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [stats, setStats] = useState({ total: 0, active: 0, disabled: 0, with2FA: 0, admins: 0, activeSessions: 0, totalGroups: 0 })

  useEffect(() => {
    getUsers().then(setUsers)
    getGroups().then(setGroups)
    getSessions().then(setSessions)
    getAuditLogs().then(setAuditLogs)
    getUserStats().then(setStats)
  }, [])

  const getRoleBadge = (role: string) => {
    const config = {
      admin: { variant: 'destructive' as const, text: 'Admin' },
      user: { variant: 'default' as const, text: 'User' },
      viewer: { variant: 'secondary' as const, text: 'Viewer' },
    }

    const { variant, text } = config[role as keyof typeof config] || { variant: 'default', text: role }
    return <Badge variant={variant as any}>{text}</Badge>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
          <UsersIcon className="h-6 w-6 text-blue-500" />
        </div>
        <div>
          <h3 className="text-lg font-medium">User Management</h3>
          <p className="text-sm text-muted-foreground">
            Manage Authelia users, groups, and permissions
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.active} active, {stats.disabled} disabled
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Administrators</CardTitle>
            <Shield className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.admins}</div>
            <p className="text-xs text-muted-foreground">Full access</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">2FA Enabled</CardTitle>
            <Key className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.with2FA}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((stats.with2FA / stats.total) * 100)}% of users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeSessions}</div>
            <p className="text-xs text-muted-foreground">Currently logged in</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">Users ({stats.total})</TabsTrigger>
          <TabsTrigger value="groups">Groups ({stats.totalGroups})</TabsTrigger>
          <TabsTrigger value="sessions">Sessions ({stats.activeSessions})</TabsTrigger>
          <TabsTrigger value="audit">Audit Log</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Users</CardTitle>
                  <CardDescription>Manage Authelia user accounts</CardDescription>
                </div>
                <Button>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add User
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Groups</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>2FA</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium">{user.displayName}</p>
                          <p className="text-xs text-muted-foreground">@{user.username}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{user.email}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {user.groups.map((group) => (
                            <Badge key={group} variant="outline" className="text-xs">
                              {group}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>
                        {user.twoFactor ? (
                          <Badge variant="default" className="gap-1">
                            <Key className="h-3 w-3" />
                            Enabled
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="gap-1 text-muted-foreground">
                            <XCircle className="h-3 w-3" />
                            Disabled
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {user.lastLogin
                          ? new Date(user.lastLogin).toLocaleDateString()
                          : 'Never'}
                      </TableCell>
                      <TableCell>
                        {user.enabled ? (
                          <Badge variant="default" className="gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="gap-1">
                            <XCircle className="h-3 w-3" />
                            Disabled
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="groups" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Groups</CardTitle>
                  <CardDescription>User groups and permissions</CardDescription>
                </div>
                <Button>
                  <UserCog className="mr-2 h-4 w-4" />
                  New Group
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {groups.map((group) => (
                  <Card key={group.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{group.name}</CardTitle>
                        <Badge variant="secondary">{group.members} members</Badge>
                      </div>
                      <CardDescription>{group.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-2">
                          Permissions
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {group.permissions.map((perm) => (
                            <Badge key={perm} variant="outline" className="text-xs">
                              {perm}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="w-full">
                        Manage Group
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Sessions</CardTitle>
              <CardDescription>Currently logged in users</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>User Agent</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Last Activity</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sessions.map((session) => (
                    <TableRow key={session.id}>
                      <TableCell className="font-medium">{session.username}</TableCell>
                      <TableCell className="font-mono text-sm">{session.ip}</TableCell>
                      <TableCell className="max-w-xs truncate text-sm text-muted-foreground">
                        {session.userAgent}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(session.createdAt).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(session.lastActivity).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          Revoke
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Audit Log</CardTitle>
              <CardDescription>User activity and system events</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Resource</TableHead>
                    <TableHead>IP</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(log.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell className="font-medium">{log.username}</TableCell>
                      <TableCell className="font-mono text-sm">{log.action}</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {log.resource}
                      </TableCell>
                      <TableCell className="font-mono text-sm">{log.ip}</TableCell>
                      <TableCell>
                        {log.success ? (
                          <Badge variant="default" className="gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            Success
                          </Badge>
                        ) : (
                          <Badge variant="destructive" className="gap-1">
                            <XCircle className="h-3 w-3" />
                            Failed
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

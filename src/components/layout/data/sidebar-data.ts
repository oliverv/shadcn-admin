import {
  LayoutDashboard,
  Server,
  Activity,
  Database,
  Network,
  Container,
  FileCode,
  Settings,
  Shield,
  BarChart3,
  Layers,
  Boxes,
  Command,
} from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'Admin',
    email: 'admin@openmemory.local',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'OpenMemory',
      logo: Command,
      plan: 'Infrastructure',
    },
  ],
  navGroups: [
    {
      title: 'Overview',
      items: [
        {
          title: 'Dashboard',
          url: '/',
          icon: LayoutDashboard,
        },
        {
          title: 'Services',
          url: '/services',
          icon: Server,
        },
        {
          title: 'Metrics',
          url: '/metrics',
          icon: Activity,
        },
      ],
    },
    {
      title: 'Infrastructure',
      items: [
        {
          title: 'Containers',
          url: '/containers',
          icon: Container,
        },
        {
          title: 'Traefik',
          url: '/traefik',
          icon: Network,
        },
        {
          title: 'Vector Store',
          url: '/vector-store',
          icon: Layers,
        },
      ],
    },
    {
      title: 'Admin Tools',
      items: [
        {
          title: 'Database Admin',
          icon: Database,
          items: [
            {
              title: 'CloudBeaver',
              url: '/admin/cloudbeaver',
            },
            {
              title: 'Bytebase',
              url: '/admin/bytebase',
            },
            {
              title: 'NocoDB',
              url: '/admin/nocodb',
            },
          ],
        },
        {
          title: 'Content & CMS',
          icon: FileCode,
          items: [
            {
              title: 'Directus',
              url: '/admin/directus',
            },
          ],
        },
      ],
    },
    {
      title: 'Monitoring',
      items: [
        {
          title: 'Grafana',
          url: '/monitoring/grafana',
          icon: BarChart3,
        },
        {
          title: 'Beszel',
          url: '/monitoring/beszel',
          icon: Activity,
        },
        {
          title: 'Logs',
          url: '/logs',
          icon: FileCode,
        },
      ],
    },
    {
      title: 'System',
      items: [
        {
          title: 'LiteLLM Stack',
          url: '/litellm',
          icon: Boxes,
        },
        {
          title: 'Authentication',
          url: '/auth',
          icon: Shield,
        },
        {
          title: 'Settings',
          url: '/settings',
          icon: Settings,
        },
      ],
    },
  ],
}

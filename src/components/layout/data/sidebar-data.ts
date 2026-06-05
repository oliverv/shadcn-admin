import {
  Activity,
  BarChart3,
  BadgeCheck,
  Bell,
  BrainCircuit,
  Cloud,
  Command,
  Container,
  Database,
  FileText,
  LayoutDashboard,
  Layers,
  Mic,
  Monitor,
  Network,
  Search,
  Server,
  Settings,
  Shield,
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
      title: 'Dashboard',
      items: [
        {
          title: 'Home',
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
          icon: Network,
          items: [
            {
              title: 'Routes',
              url: '/traefik/routes',
            },
            {
              title: 'Dashboard',
              url: '/traefik/dashboard',
            },
          ],
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
          title: 'Users',
          url: '/admin/users',
          icon: Shield,
        },
        {
          title: 'Databases',
          url: '/admin/databases',
          icon: Database,
        },
        {
          title: 'Cloudflare',
          url: '/admin/cloudflare',
          icon: Cloud,
        },
        {
          title: 'OpenMetadata',
          url: '/admin/openmetadata',
          icon: Search,
        },
        {
          title: 'Mem0',
          url: '/admin/mem0',
          icon: BrainCircuit,
        },
      ],
    },
    {
      title: 'AI & Voice',
      items: [
        {
          title: 'Ara Voice Agent',
          url: '/voice/ara',
          icon: Mic,
        },
      ],
    },
    {
      title: 'Monitoring',
      items: [
        {
          title: 'Systems',
          url: '/monitoring/systems',
          icon: Monitor,
        },
        {
          title: 'Alerts',
          url: '/monitoring/alerts',
          icon: Bell,
        },
        {
          title: 'Logs',
          url: '/monitoring/logs',
          icon: FileText,
        },
        {
          title: 'Grafana',
          url: '/monitoring/grafana',
          icon: BarChart3,
        },
      ],
    },
    {
      title: 'System',
      items: [
        {
          title: 'Settings',
          url: '/settings',
          icon: Settings,
        },
        {
          title: 'Documentation',
          url: '/docs',
          icon: BadgeCheck,
        },
      ],
    },
  ],
}

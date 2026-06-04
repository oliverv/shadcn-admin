/**
 * Database connection information and utilities
 */

export interface DatabaseInfo {
  id: string
  name: string
  type: 'postgres' | 'redis' | 'vector'
  host: string
  port: number
  database?: string
  description: string
  status: 'connected' | 'disconnected' | 'unhealthy' | 'unknown'
  primaryUse: string
  backends: string[]
  container?: string
  adminTools: Array<{
    name: string
    url: string
    description: string
  }>
}

export interface AdminTool {
  id: string
  name: string
  description: string
  url: string
  localUrl: string
  port: number
  category: 'database' | 'migration' | 'admin'
  supports: string[]
  features: string[]
  container: string
  status: 'healthy' | 'running' | 'down'
}

/**
 * Get all database connections in the stack
 */
export function getDatabases(): DatabaseInfo[] {
  return [
    {
      id: 'openmemory-pg',
      name: 'OpenMemory PostgreSQL',
      type: 'postgres',
      host: 'host.docker.internal',
      port: 5432,
      database: 'openmemory',
      description: 'Primary metadata storage - sectors, waypoints, temporal graph',
      status: 'unhealthy',
      primaryUse: 'Metadata backend',
      backends: ['OM_METADATA_BACKEND=postgres', 'OM_VECTOR_BACKEND=postgres'],
      container: 'openmemory-pg',
      adminTools: [
        {
          name: 'CloudBeaver',
          url: 'http://localhost:8978',
          description: 'Universal database manager with SQL editor',
        },
        {
          name: 'Bytebase',
          url: 'http://localhost:8089',
          description: 'Database schema migration and version control',
        },
        {
          name: 'NocoDB',
          url: 'http://localhost:8083',
          description: 'Airtable-like interface for PostgreSQL',
        },
      ],
    },
    {
      id: 'valkey',
      name: 'Valkey',
      type: 'redis',
      host: 'localhost',
      port: 6379,
      description: 'Redis-compatible cache and optional vector backend',
      status: 'connected',
      primaryUse: 'Cache & vector storage',
      backends: ['OM_VECTOR_BACKEND=valkey'],
      container: 'valkey',
      adminTools: [],
    },
    {
      id: 'qdrant',
      name: 'Qdrant',
      type: 'vector',
      host: 'localhost',
      port: 6333,
      description: 'Vector database for embeddings (adapter not yet implemented)',
      status: 'connected',
      primaryUse: 'Vector storage (planned)',
      backends: ['OM_VECTOR_BACKEND=qdrant (planned)'],
      container: 'qdrant',
      adminTools: [
        {
          name: 'Qdrant Web UI',
          url: 'https://qdrant-openmemory.collabmind.dev',
          description: 'Native Qdrant dashboard',
        },
      ],
    },
  ]
}

/**
 * Get all database admin tools
 */
export function getAdminTools(): AdminTool[] {
  return [
    {
      id: 'nocodb',
      name: 'NocoDB',
      description: 'Airtable alternative - spreadsheet interface for databases',
      url: 'http://localhost:8083',
      localUrl: 'http://localhost:8083',
      port: 8083,
      category: 'database',
      supports: ['PostgreSQL', 'MySQL', 'SQLite'],
      features: [
        'Spreadsheet UI',
        'Forms & Views',
        'REST & GraphQL APIs',
        'Webhooks',
        'Collaboration',
        'Access Control',
      ],
      container: 'openmemory-nocodb',
      status: 'healthy',
    },
    {
      id: 'bytebase',
      name: 'Bytebase',
      description: 'Database CI/CD - schema migration and version control',
      url: 'http://localhost:8089',
      localUrl: 'http://localhost:8089',
      port: 8089,
      category: 'migration',
      supports: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis'],
      features: [
        'Schema Migration',
        'Version Control',
        'SQL Review',
        'Change History',
        'GitOps Integration',
        'Rollback Support',
      ],
      container: 'openmemory-bytebase',
      status: 'healthy',
    },
    {
      id: 'cloudbeaver',
      name: 'CloudBeaver',
      description: 'Universal database manager - DBeaver in the browser',
      url: 'http://localhost:8978',
      localUrl: 'http://localhost:8978',
      port: 8978,
      category: 'admin',
      supports: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'SQLite', 'Cassandra'],
      features: [
        'SQL Editor',
        'Data Browser',
        'ER Diagrams',
        'Query History',
        'Multi-DB Support',
        'User Management',
      ],
      container: 'openmemory-cloudbeaver',
      status: 'healthy',
    },
  ]
}

/**
 * Get database statistics
 */
export function getDatabaseStats() {
  const databases = getDatabases()
  const tools = getAdminTools()

  return {
    total: databases.length,
    connected: databases.filter((d) => d.status === 'connected').length,
    unhealthy: databases.filter((d) => d.status === 'unhealthy').length,
    postgres: databases.filter((d) => d.type === 'postgres').length,
    redis: databases.filter((d) => d.type === 'redis').length,
    vector: databases.filter((d) => d.type === 'vector').length,
    adminTools: tools.length,
    healthyTools: tools.filter((t) => t.status === 'healthy').length,
  }
}

/**
 * Get connection string for a database (sanitized - no password)
 */
export function getConnectionString(db: DatabaseInfo): string {
  switch (db.type) {
    case 'postgres':
      return `postgresql://user@${db.host}:${db.port}/${db.database}`
    case 'redis':
      return `redis://${db.host}:${db.port}`
    case 'vector':
      return `http://${db.host}:${db.port}`
    default:
      return `${db.host}:${db.port}`
  }
}

/**
 * Get recommended tool for database type
 */
export function getRecommendedTool(dbType: DatabaseInfo['type']): AdminTool | null {
  const tools = getAdminTools()

  switch (dbType) {
    case 'postgres':
      return tools.find((t) => t.id === 'cloudbeaver') || null
    case 'redis':
      return null // No specific tool for Redis
    case 'vector':
      return null // Qdrant has its own UI
    default:
      return null
  }
}

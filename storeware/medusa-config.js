const { loadEnv, Modules, defineConfig } = require('@medusajs/framework/utils')

loadEnv(process.env.NODE_ENV, process.cwd())

const backendUrl = process.env.RAILWAY_PUBLIC_DOMAIN_VALUE || 'http://localhost:9000';

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS,
      adminCors: process.env.ADMIN_CORS,
      authCors: process.env.AUTH_CORS,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    },
    workerMode: process.env.MEDUSA_WORKER_MODE,
    admin: {
      disable: process.env.DISABLE_MEDUSA_ADMIN === "true",
      backendUrl: process.env.MEDUSA_BACKEND_URL,
    },
    redisUrl: process.env.REDIS_URL
  },
  modules: {
    [Modules.FILE]: {
      resolve: '@medusajs/file',
      options: {
        providers: [
          {
            resolve: '@medusajs/file-local-next',
            id: 'local',
            options: {
              backend_url: `${backendUrl}/static`
            }
          }
        ]
      }
    },
    [Modules.CACHE]: {
      resolve: "@medusajs/cache-redis",
      options: {
        redisUrl: process.env.REDIS_URL,
      },
    },
    [Modules.EVENT_BUS]: {
      resolve: "@medusajs/event-bus-redis",
      options: {
        redisUrl: process.env.REDIS_URL,
      },
    },
    [Modules.WORKFLOW_ENGINE]: {
      resolve: "@medusajs/workflow-engine-redis",
      options: {
        redis: {
          url: process.env.REDIS_URL,
        },
      },
    },
  }
})

import { existsSync } from 'fs'

// Solo cargar .env si existe (desarrollo local)
if (existsSync('.env')) {
  process.loadEnvFile()
}

export const NODE_ENV = String(process.env.NODE_ENV ?? 'PRODUCTION') as
  | 'PRODUCTION'
  | 'DEVELOPMENT'

export const PORT = Number(process.env.PORT ?? 4000)

export const TURSO_DATABASE_URL = String(process.env.TURSO_DATABASE_URL)
export const TURSO_AUTH_TOKEN = String(process.env.TURSO_AUTH_TOKEN)

export const APP_CLIENT_HOST = String(process.env.APP_CLIENT_HOST)
export const JWT_SECRET = String(process.env.JWT_SECRET)
export const APP_HOST = String(process.env.APP_HOST)

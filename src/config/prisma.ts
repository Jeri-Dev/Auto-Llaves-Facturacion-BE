import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { PrismaLibSQL } from '@prisma/adapter-libsql'
import { TURSO_AUTH_TOKEN, TURSO_DATABASE_URL } from './enviroments'

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    // Use LibSQL adapter only if a valid Turso URL is provided.
    const hasTursoUrl = Boolean(
      TURSO_DATABASE_URL && TURSO_DATABASE_URL !== 'undefined',
    )

    if (hasTursoUrl) {
      const adapter = new PrismaLibSQL({
        url: TURSO_DATABASE_URL,
        authToken:
          TURSO_AUTH_TOKEN && TURSO_AUTH_TOKEN !== 'undefined'
            ? TURSO_AUTH_TOKEN
            : undefined,
      })

      super({
        adapter,
        errorFormat: 'pretty',
      })
    } else {
      // Fallback to local SQLite (datasource provider = "sqlite" in schema.prisma)
      super({
        errorFormat: 'pretty',
      })
    }
  }

  async onModuleInit() {
    await this.$connect()
  }

  async onModuleDestroy() {
    await this.$disconnect()
  }

  executeTransaction<T>(
    fn: (
      prisma: Omit<
        PrismaService,
        '$connect' | '$disconnect' | '$on' | '$transaction' | '$use'
      >,
    ) => Promise<T>,
  ): Promise<T> {
    return this.$transaction(fn)
  }
}

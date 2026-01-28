import { Module } from '@nestjs/common'
import { SalesService } from './sales.service'
import { SalesController } from './sales.controller'
import { PrismaService } from '@config/prisma'
import { SalesRepository } from '@repositories/sales.repo'

@Module({
  controllers: [SalesController],
  providers: [SalesService, PrismaService, SalesRepository],
})
export class SalesModule {}

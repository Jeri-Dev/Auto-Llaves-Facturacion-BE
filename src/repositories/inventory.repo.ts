import { PrismaService } from '@config/prisma'
import { Injectable } from '@nestjs/common'
import { Inventory } from '@prisma/client'
import { StandardRepository } from '@shared/standard/repository'

@Injectable()
export class InventoryRepository extends StandardRepository<
  Inventory,
  PrismaService['inventory']
> {}

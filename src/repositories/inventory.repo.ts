import { PrismaService } from '@config/prisma'
import { Injectable } from '@nestjs/common'
import { Inventory, Prisma } from '@prisma/client'
import { PaginationDTO } from '@shared/dto/pagination'
import { StandardRepository } from '@shared/standard/repository'

@Injectable()
export class InventoryRepository extends StandardRepository<
  Inventory,
  PrismaService['inventory']
> {
  constructor(prisma: PrismaService) {
    super(prisma.inventory)
  }

  pagination(pagination: PaginationDTO) {
    const filters: Prisma.InventoryWhereInput = {}

    if (pagination.search) {
      filters.OR = [
        { code: { contains: pagination.search } },
        { name: { contains: pagination.search } },
      ]
    }

    return this.paginate({
      ...pagination,
    })
  }
}

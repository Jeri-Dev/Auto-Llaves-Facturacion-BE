import { PrismaService } from '@config/prisma'
import { Injectable } from '@nestjs/common'
import { Customer, Prisma } from '@prisma/client'
import { PaginationDTO } from '@shared/dto/pagination'
import { StandardRepository } from '@shared/standard/repository'

@Injectable()
export class CustomerRepository extends StandardRepository<
  Customer,
  PrismaService['customer']
> {
  constructor(prisma: PrismaService) {
    super(prisma.customer)
  }

  async pagination(dto: PaginationDTO) {
    const filters: Prisma.CustomerWhereInput = {}

    if (dto.search) {
      filters.OR = [
        { name: { contains: dto.search } },
        { document: { contains: dto.search } },
      ]
    }

    return this.paginate({
      where: filters,
      ...dto,
    })
  }
}

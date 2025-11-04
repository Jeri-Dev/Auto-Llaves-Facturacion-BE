import { PrismaService } from '@config/prisma'
import { Injectable } from '@nestjs/common'
import { Customer } from '@prisma/client'
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
    return this.paginate({
      ...dto,
    })
  }
}

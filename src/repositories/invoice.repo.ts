import { PrismaService } from '@config/prisma'
import { Injectable } from '@nestjs/common'
import { Invoice, Prisma } from '@prisma/client'
import { PaginationDTO } from '@shared/dto/pagination'
import { StandardRepository } from '@shared/standard/repository'

@Injectable()
export class InvoiceRepository extends StandardRepository<
  Invoice,
  PrismaService['invoice']
> {
  constructor(prisma: PrismaService) {
    super(prisma.invoice)
  }

  async pagination(dto: PaginationDTO) {
    return this.paginate({
      ...dto,
      queryExtension: {
        include: {
          customer: true,
        },
      },
    })
  }

  async findInvoiceById(id: number) {
    return this.model.findUnique({
      where: { id },
      include: {
        customer: true,
      },
    })
  }
}

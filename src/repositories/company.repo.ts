import { PrismaService } from '@config/prisma'
import { Injectable } from '@nestjs/common'
import { Company } from '@prisma/client'
import { PaginationDTO } from '@shared/dto/pagination'
import { StandardRepository } from '@shared/standard/repository'

@Injectable()
export class CompanyInfoRepository extends StandardRepository<
  Company,
  PrismaService['company']
> {
  constructor(prisma: PrismaService) {
    super(prisma.company)
  }

  async pagination(dto: PaginationDTO) {
    return this.paginate({
      ...dto,
    })
  }
}

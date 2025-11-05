import { Module } from '@nestjs/common'
import { InvoicesService } from './invoices.service'
import { InvoicesController } from './invoices.controller'
import { InvoiceRepository } from '@repositories/invoice.repo'
import { CustomerRepository } from '@repositories/customer.repo'
import { CompanyInfoRepository } from '@repositories/company.repo'

@Module({
  controllers: [InvoicesController],
  providers: [
    InvoicesService,
    InvoiceRepository,
    CustomerRepository,
    CompanyInfoRepository,
  ],
})
export class InvoicesModule {}

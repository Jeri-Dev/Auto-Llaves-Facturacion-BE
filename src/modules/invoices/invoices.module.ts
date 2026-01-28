import { Module } from '@nestjs/common'
import { InvoicesService } from './invoices.service'
import { InvoicesController } from './invoices.controller'
import { InvoiceRepository } from '@repositories/invoice.repo'
import { CustomerRepository } from '@repositories/customer.repo'
import { CompanyInfoRepository } from '@repositories/company.repo'
import { SalesRepository } from '@repositories/sales.repo'

@Module({
  controllers: [InvoicesController],
  providers: [
    InvoicesService,
    InvoiceRepository,
    CustomerRepository,
    CompanyInfoRepository,
    SalesRepository,
  ],
})
export class InvoicesModule {}

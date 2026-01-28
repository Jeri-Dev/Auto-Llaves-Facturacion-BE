import { Global, Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { PrismaService } from '@config/prisma'
import { InvoicesModule } from './modules/invoices/invoices.module'
import { CustomersModule } from './modules/customers/customers.module'
import { MiscellaneousModule } from './modules/miscellaneous/miscellaneous.module'
import { CompanyInfoModule } from './modules/company-info/company-info.module'
import { InventoryModule } from './modules/inventory/inventory.module'
import { CompanyGuard } from './company.guard'
import { CompanyInfoRepository } from '@repositories/company.repo'
import { SalesModule } from './modules/sales/sales.module';

@Global()
@Module({
  controllers: [AppController],
  providers: [AppService, PrismaService, CompanyInfoRepository],
  exports: [PrismaService],
  imports: [
    InvoicesModule,
    CustomersModule,
    MiscellaneousModule,
    CompanyInfoModule,
    InventoryModule,
    SalesModule,
  ],
})
export class AppModule {}

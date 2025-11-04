import { Global, Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { PrismaService } from '@config/prisma'
import { InvoicesModule } from './modules/invoices/invoices.module'
import { CustomersModule } from './modules/customers/customers.module'
import { MiscellaneousModule } from './modules/miscellaneous/miscellaneous.module';

@Global()
@Module({
  controllers: [AppController],
  providers: [AppService, PrismaService],
  exports: [PrismaService],
  imports: [InvoicesModule, CustomersModule, MiscellaneousModule],
})
export class AppModule {}

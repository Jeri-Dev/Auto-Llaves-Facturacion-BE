import { Module } from '@nestjs/common'
import { CustomersService } from './customers.service'
import { CustomersController } from './customers.controller'
import { CustomerRepository } from '@repositories/customer.repo'

@Module({
  controllers: [CustomersController],
  providers: [CustomersService, CustomerRepository],
})
export class CustomersModule {}

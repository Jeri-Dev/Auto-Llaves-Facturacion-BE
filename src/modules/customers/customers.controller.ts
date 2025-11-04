import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common'
import { CustomersService } from './customers.service'
import { PaginationDTO } from '@shared/dto/pagination'
import { CreateCustomerDTO } from './dto/create-customer.dto'
import { UpdateCustomerDTO } from './dto/update-customer.dto'

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get('/')
  findAll(@Query() paginationDto: PaginationDTO) {
    return this.customersService.findAllCustomers(paginationDto)
  }

  @Get('/:id')
  findOne(@Param('id') id: number) {
    return this.customersService.findCustomerById(id)
  }

  @Post('/')
  create(@Body() dto: CreateCustomerDTO) {
    return this.customersService.createCustomer(dto)
  }

  @Patch('/:id')
  update(@Param('id') id: number, @Body() dto: UpdateCustomerDTO) {
    return this.customersService.updateCustomer(id, dto)
  }
}

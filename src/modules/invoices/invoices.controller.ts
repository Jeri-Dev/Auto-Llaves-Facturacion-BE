import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common'
import { InvoicesService } from './invoices.service'
import { PaginationDTO } from '@shared/dto/pagination'
import { CreateInvoiceDTO } from './dto/create-invoice.dto'

@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Get('/')
  findAll(@Query() dto: PaginationDTO) {
    return this.invoicesService.findAllInvoices(dto)
  }

  @Get('/:id')
  findById(@Param('id') id: number) {
    return this.invoicesService.findInvoiceById(id)
  }

  @Post('/')
  create(@Body() dto: CreateInvoiceDTO) {
    return this.invoicesService.createInvoice(dto)
  }
}

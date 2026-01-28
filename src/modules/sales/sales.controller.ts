import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common'
import { SalesService } from './sales.service'
import { PaginationDTO } from '@shared/dto/pagination'
import { CreateSaleDTO } from './dto/create-sale.dto'

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Get('/today')
  async getTodaySales() {
    return this.salesService.getTodaySales()
  }

  @Get('/month')
  async getMonthSales() {
    return this.salesService.getMonthSales()
  }

  @Get('/yearly')
  async getMonthlySalesTotal() {
    return this.salesService.getMonthlySalesTotal()
  }

  @Get('/by-day')
  async getSalesByDay(@Query() dto: PaginationDTO) {
    return this.salesService.getSalesByDay(dto)
  }

  @Post('/')
  async createSale(@Body() dto: CreateSaleDTO) {
    return this.salesService.createSale(dto)
  }

  @Delete('/:id')
  async deleteSale(@Param('id') id: number) {
    return this.salesService.deleteSale(Number(id))
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common'
import { InventoryService } from './inventory.service'
import { PaginationDTO } from '@shared/dto/pagination'
import { CreateInventoryDTO } from './dto/create-inventory.dto'
import { UpdateInventoryDto } from './dto/update-inventory.dto'

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get('/')
  findAll(@Query() pagination: PaginationDTO) {
    return this.inventoryService.getAll(pagination)
  }

  @Get('/code/:code')
  findByCode(@Param('code') code: string) {
    return this.inventoryService.getInventoryByCode(code)
  }

  @Get('/:id')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.inventoryService.getInventoryById(id)
  }

  @Post('/')
  create(@Body() createInventoryDto: CreateInventoryDTO) {
    return this.inventoryService.createInventoryItem(createInventoryDto)
  }

  @Put('/:id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateInventoryDto: UpdateInventoryDto,
  ) {
    return this.inventoryService.updateInventoryItem(id, updateInventoryDto)
  }

  @Delete('/:id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.inventoryService.deleteInventoryItem(id)
  }
}

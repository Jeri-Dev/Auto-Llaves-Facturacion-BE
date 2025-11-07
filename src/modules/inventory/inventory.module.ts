import { Module } from '@nestjs/common'
import { InventoryService } from './inventory.service'
import { InventoryController } from './inventory.controller'
import { InventoryRepository } from '@repositories/inventory.repo'

@Module({
  controllers: [InventoryController],
  providers: [InventoryService, InventoryRepository],
})
export class InventoryModule {}

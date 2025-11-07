import { PartialType } from '@nestjs/swagger'
import { CreateInventoryDTO } from './create-inventory.dto'

export class UpdateInventoryDto extends PartialType(CreateInventoryDTO) {}

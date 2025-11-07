import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { InventoryRepository } from '@repositories/inventory.repo'
import { PaginationDTO } from '@shared/dto/pagination'
import { CreateInventoryDTO } from './dto/create-inventory.dto'
import { UpdateInventoryDto } from './dto/update-inventory.dto'

@Injectable()
export class InventoryService {
  constructor(private readonly inventoryRepository: InventoryRepository) {}

  async getAll(pagination: PaginationDTO) {
    try {
      const data = await this.inventoryRepository.pagination(pagination)
      return data
    } catch {
      return new InternalServerErrorException()
    }
  }

  async getInventoryById(id: number) {
    try {
      const item = await this.inventoryRepository.findById(id)

      if (!item) {
        throw new NotFoundException('No se encontro el elemento')
      }

      return item
    } catch (error) {
      if (error instanceof NotFoundException) throw error
      throw new InternalServerErrorException()
    }
  }

  async getInventoryByCode(code: string) {
    try {
      const item = await this.inventoryRepository.findOne({
        code: code,
      })

      if (!item) {
        throw new NotFoundException('No se encontro el elemento')
      }

      return item
    } catch (error) {
      if (error instanceof NotFoundException) throw error
      throw new InternalServerErrorException()
    }
  }

  async createInventoryItem(dto: CreateInventoryDTO) {
    try {
      const existingItem = await this.inventoryRepository.findOne({
        code: dto.code,
      })

      if (existingItem)
        throw new BadRequestException('Ya existe un producto con este codigo')

      const data = await this.inventoryRepository.create(dto)

      return data
    } catch (error) {
      if (error instanceof BadRequestException) throw error
      throw new InternalServerErrorException()
    }
  }

  async updateInventoryItem(id: number, dto: UpdateInventoryDto) {
    try {
      const existingItem = await this.inventoryRepository.findById(id)

      if (!existingItem)
        throw new NotFoundException('Ya existe un producto con este codigo')

      const data = await this.inventoryRepository.create(dto)

      return data
    } catch (error) {
      if (error instanceof BadRequestException) throw error
      throw new InternalServerErrorException()
    }
  }

  async deleteInventoryItem(id: number) {
    try {
      const existingItem = await this.inventoryRepository.findById(id)

      if (!existingItem)
        throw new NotFoundException('No se encontro el elemento')

      await this.inventoryRepository.delete(id)

      return { message: 'Elemento eliminado correctamente' }
    } catch (error) {
      if (error instanceof NotFoundException) throw error
      throw new InternalServerErrorException()
    }
  }
}

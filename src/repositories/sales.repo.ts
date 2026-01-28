import { PrismaService } from '@config/prisma'
import { Injectable } from '@nestjs/common'
import { Sales, Prisma } from '@prisma/client'
import { PaginationDTO } from '@shared/dto/pagination'
import { StandardRepository } from '@shared/standard/repository'

@Injectable()
export class SalesRepository extends StandardRepository<
  Sales,
  PrismaService['sales']
> {
  constructor(private readonly prisma: PrismaService) {
    super(prisma.sales)
  }

  async pagination(dto: PaginationDTO) {
    const filters: Prisma.SalesWhereInput = {}

    if (dto.search) {
      filters.OR = [{ item: { contains: dto.search } }]
    }

    if (dto.startDate && dto.endDate) {
      filters.createdAt = {
        gte: new Date(dto.startDate),
        lte: new Date(dto.endDate),
      }
    }

    return this.paginate({
      where: filters,
      ...dto,
      queryExtension: {
        orderBy: {
          createdAt: dto.orderSort || 'desc',
        },
      },
    })
  }

  async findSalesByDateGrouped(dto: PaginationDTO) {
    const filters: Prisma.SalesWhereInput = {}

    if (dto.search) {
      filters.OR = [{ item: { contains: dto.search } }]
    }

    if (dto.startDate && dto.endDate) {
      filters.createdAt = {
        gte: new Date(dto.startDate),
        lte: new Date(dto.endDate),
      }
    }

    // Obtener todas las ventas que cumplen con los filtros
    const sales = await this.prisma.sales.findMany({
      where: filters,
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Agrupar ventas por día
    const salesByDay = new Map<string, typeof sales>()

    sales.forEach((sale) => {
      const dateKey = new Date(sale.createdAt).toISOString().split('T')[0]
      if (!salesByDay.has(dateKey)) {
        salesByDay.set(dateKey, [])
      }
      salesByDay.get(dateKey)!.push(sale)
    })

    // Convertir a array y ordenar por fecha
    const groupedData = Array.from(salesByDay.entries())
      .map(([date, daySales]) => {
        const totalAmount = daySales.reduce((sum, sale) => sum + sale.total, 0)
        return {
          date,
          totalAmount: Number(totalAmount.toFixed(2)),
          salesCount: daySales.length,
          sales: daySales,
        }
      })
      .sort((a, b) => {
        const dateA = new Date(a.date).getTime()
        const dateB = new Date(b.date).getTime()
        return dto.orderSort === 'asc' ? dateA - dateB : dateB - dateA
      })

    // Aplicar paginación
    const page = dto.page || 1
    const max = dto.max || 10
    const startIndex = (page - 1) * max
    const endIndex = startIndex + max

    const paginatedData = groupedData.slice(startIndex, endIndex)

    return {
      metadata: {
        total: groupedData.length,
        page,
        max,
        totalPages: Math.ceil(groupedData.length / max),
      },
      data: paginatedData,
    }
  }
}

import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { PrismaService } from '@config/prisma'
import { SalesRepository } from '@repositories/sales.repo'
import { PaginationDTO } from '@shared/dto/pagination'
import { CreateSaleDTO } from './dto/create-sale.dto'

@Injectable()
export class SalesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly salesRepository: SalesRepository,
  ) {}

  async getTodaySales() {
    try {
      const today = new Date()
      const startOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        0,
        0,
        0,
        0,
      )
      const endOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        23,
        59,
        59,
        999,
      )

      const sales = await this.prisma.sales.findMany({
        where: {
          createdAt: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      })

      const totalAmount = sales.reduce((sum, sale) => sum + sale.total, 0)
      const averageTicket = sales.length > 0 ? totalAmount / sales.length : 0

      return {
        totalAmount: Number(totalAmount.toFixed(2)),
        salesCount: sales.length,
        averageTicket: Number(averageTicket.toFixed(2)),
        sales,
      }
    } catch (error) {
      throw new InternalServerErrorException('Error fetching today sales')
    }
  }

  /**
   * Obtiene ventas del mes actual con comparativa del mes anterior
   * @returns { currentMonth: { totalAmount, salesCount }, previousMonth: { ... }, comparison: { ... } }
   */
  async getMonthSales() {
    try {
      const today = new Date()
      const currentYear = today.getFullYear()
      const currentMonth = today.getMonth() + 1

      // Mes anterior
      let previousYear = currentYear
      let previousMonth = currentMonth - 1
      if (previousMonth === 0) {
        previousMonth = 12
        previousYear = currentYear - 1
      }

      // Datos mes actual
      const currentMonthStart = new Date(
        currentYear,
        currentMonth - 1,
        1,
        0,
        0,
        0,
        0,
      )
      const currentMonthEnd = new Date(
        currentYear,
        currentMonth,
        0,
        23,
        59,
        59,
        999,
      )

      const currentMonthSales = await this.prisma.sales.findMany({
        where: {
          createdAt: {
            gte: currentMonthStart,
            lte: currentMonthEnd,
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      })

      // Datos mes anterior
      const previousMonthStart = new Date(
        previousYear,
        previousMonth - 1,
        1,
        0,
        0,
        0,
        0,
      )
      const previousMonthEnd = new Date(
        previousYear,
        previousMonth,
        0,
        23,
        59,
        59,
        999,
      )

      const previousMonthSales = await this.prisma.sales.findMany({
        where: {
          createdAt: {
            gte: previousMonthStart,
            lte: previousMonthEnd,
          },
        },
      })

      // Calcular métricas mes actual
      const currentMonthTotal = currentMonthSales.reduce(
        (sum, sale) => sum + sale.total,
        0,
      )
      const currentMonthAverage =
        currentMonthSales.length > 0
          ? currentMonthTotal / currentMonthSales.length
          : 0

      // Calcular métricas mes anterior
      const previousMonthTotal = previousMonthSales.reduce(
        (sum, sale) => sum + sale.total,
        0,
      )
      const previousMonthAverage =
        previousMonthSales.length > 0
          ? previousMonthTotal / previousMonthSales.length
          : 0

      // Calcular crecimiento
      const growth = currentMonthTotal - previousMonthTotal
      const growthPercentage =
        previousMonthTotal > 0
          ? Number(((growth / previousMonthTotal) * 100).toFixed(2))
          : 0

      const monthNames = [
        'Enero',
        'Febrero',
        'Marzo',
        'Abril',
        'Mayo',
        'Junio',
        'Julio',
        'Agosto',
        'Septiembre',
        'Octubre',
        'Noviembre',
        'Diciembre',
      ]

      return {
        currentMonth: {
          month: monthNames[currentMonth - 1],
          year: currentYear,
          totalAmount: Number(currentMonthTotal.toFixed(2)),
          salesCount: currentMonthSales.length,
          averageTicket: Number(currentMonthAverage.toFixed(2)),
          sales: currentMonthSales,
        },
        previousMonth: {
          month: monthNames[previousMonth - 1],
          year: previousYear,
          totalAmount: Number(previousMonthTotal.toFixed(2)),
          salesCount: previousMonthSales.length,
          averageTicket: Number(previousMonthAverage.toFixed(2)),
        },
        comparison: {
          growth: Number(growth.toFixed(2)),
          growthPercentage,
          growthStatus: growth >= 0 ? 'increase' : 'decrease',
        },
      }
    } catch (error) {
      throw new InternalServerErrorException('Error fetching month sales')
    }
  }

  /**
   * Obtiene el total de ventas por mes de los últimos 12 meses
   * @returns Array con amount total de cada mes
   */
  async getMonthlySalesTotal() {
    try {
      const monthlySales = []

      for (let i = 11; i >= 0; i--) {
        const date = new Date()
        date.setMonth(date.getMonth() - i)
        const month = date.getMonth() + 1
        const year = date.getFullYear()

        const monthStart = new Date(year, month - 1, 1, 0, 0, 0, 0)
        const monthEnd = new Date(year, month, 0, 23, 59, 59, 999)

        const sales = await this.prisma.sales.findMany({
          where: {
            createdAt: {
              gte: monthStart,
              lte: monthEnd,
            },
          },
        })

        const totalAmount = sales.reduce((sum, sale) => sum + sale.total, 0)

        const monthNames = [
          'Enero',
          'Febrero',
          'Marzo',
          'Abril',
          'Mayo',
          'Junio',
          'Julio',
          'Agosto',
          'Septiembre',
          'Octubre',
          'Noviembre',
          'Diciembre',
        ]

        monthlySales.push({
          month: monthNames[month - 1],
          year,
          totalAmount: Number(totalAmount.toFixed(2)),
          salesCount: sales.length,
        })
      }

      return monthlySales
    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching monthly sales total',
      )
    }
  }

  /**
   * Obtiene ventas agrupadas por día con paginación
   * @param dto PaginationDTO con page, max, search, startDate, endDate
   * @returns Datos paginados con ventas agrupadas por día
   */
  async getSalesByDay(dto: PaginationDTO) {
    try {
      return await this.salesRepository.findSalesByDateGrouped(dto)
    } catch (error) {
      throw new InternalServerErrorException('Error fetching sales by day')
    }
  }

  /**
   * Registra una nueva venta
   * @param dto CreateSaleDTO con los datos de la venta
   * @returns La venta creada
   */
  async createSale(dto: CreateSaleDTO) {
    try {
      // Validar que el total coincida con quantity * price
      const expectedTotal = dto.quantity * dto.price
      if (Math.abs(dto.total - expectedTotal) > 0.01) {
        throw new BadRequestException(
          `El total (${dto.total}) no coincide con quantity * price (${expectedTotal})`,
        )
      }

      // Crear la venta
      const sale = await this.prisma.sales.create({
        data: {
          item: dto.item,
          quantity: dto.quantity,
          price: dto.price,
          total: dto.total,
        },
      })

      return sale
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error
      }
      throw new InternalServerErrorException('Error creating sale')
    }
  }

  /**
   * Elimina una venta por ID
   * @param id ID de la venta a eliminar
   * @returns La venta eliminada
   */
  async deleteSale(id: number) {
    try {
      // Verificar que la venta existe
      const sale = await this.prisma.sales.findUnique({
        where: { id },
      })

      if (!sale) {
        throw new NotFoundException(`Venta con ID ${id} no encontrada`)
      }

      // Eliminar la venta
      await this.prisma.sales.delete({
        where: { id },
      })

      return {
        message: 'Venta eliminada exitosamente',
        sale,
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }
      throw new InternalServerErrorException('Error deleting sale')
    }
  }
}

import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { InvoiceRepository } from '@repositories/invoice.repo'
import { PaginationDTO } from '@shared/dto/pagination'
import { CreateInvoiceDTO } from './dto/create-invoice.dto'
import { CustomerRepository } from '@repositories/customer.repo'

@Injectable()
export class InvoicesService {
  constructor(
    private readonly invoiceRepository: InvoiceRepository,
    private readonly customerRepository: CustomerRepository,
  ) {}

  async findAllInvoices(dto: PaginationDTO) {
    try {
      const result = await this.invoiceRepository.pagination(dto)

      return {
        ...result,
        data: result.data.map((invoice) => ({
          ...invoice,
          items: JSON.parse(invoice.items as string),
        })),
      }
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException('Error fetching invoices')
    }
  }

  async findInvoiceById(id: number) {
    try {
      const invoice = await this.invoiceRepository.findInvoiceById(id)
      if (!invoice) {
        throw new HttpException('Invoice not found', 404)
      }
      return {
        ...invoice,
        items: JSON.parse(invoice.items as string),
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }
      throw new InternalServerErrorException('Error fetching invoice by ID')
    }
  }

  async createInvoice(data: CreateInvoiceDTO) {
    let document = data.document

    try {
      if (data.customerId && data.customerName) {
        throw new BadRequestException(
          'Provide either customerId or customerName, not both',
        )
      }

      if (data.customerId) {
        const customerExists = await this.customerRepository.findById(
          data.customerId,
        )
        if (!customerExists) {
          throw new BadRequestException(
            'Customer with provided ID does not exist',
          )
        }

        document = customerExists.document
      }

      const subtotal = data.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      )
      const taxes = subtotal * 0.18
      const total = subtotal + taxes

      const newInvoice = await this.invoiceRepository.create({
        ...data,
        document,
        subtotal,
        taxes,
        total,
        items: JSON.stringify(data.items),
      })

      return newInvoice
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException('Error creating invoice')
    }
  }
}

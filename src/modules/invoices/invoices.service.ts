import { SalesRepository } from '@repositories/sales.repo'
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
import { CompanyInfoRepository } from '@repositories/company.repo'
import { InvoiceType } from 'src/enums/invoice'
import { Sales } from '@prisma/client'

@Injectable()
export class InvoicesService {
  constructor(
    private readonly invoiceRepository: InvoiceRepository,
    private readonly customerRepository: CustomerRepository,
    private readonly companyInfoRepository: CompanyInfoRepository,
    private readonly salesRepository: SalesRepository,
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
      switch (data.type) {
        case InvoiceType.GOVERNMENTAL:
        case InvoiceType.CREDIT:
          if (!data.customerId) {
            throw new BadRequestException(
              `${data.type} invoices require a customerId`,
            )
          }
          if (data.customerName) {
            throw new BadRequestException(
              `${data.type} invoices do not accept customerName, only customerId`,
            )
          }
          break

        case InvoiceType.QUOTE:
          if (data.customerId) {
            throw new BadRequestException(
              'QUOTE invoices do not accept customerId, only customerName',
            )
          }
          if (!data.customerName) {
            throw new BadRequestException(
              'QUOTE invoices require a customerName',
            )
          }
          break

        case InvoiceType.BASIC:
          if (data.customerId) {
            throw new BadRequestException(
              'BASIC invoices do not accept customerId, only customerName',
            )
          }
          if (!data.customerName) {
            throw new BadRequestException(
              'BASIC invoices require a customerName',
            )
          }
          break

        case InvoiceType.ENDCONSUMER:
          if (data.customerId || data.customerName) {
            throw new BadRequestException(
              'ENDCONSUMER invoices do not accept customerId or customerName',
            )
          }
          break
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

      const company = await this.companyInfoRepository.findLast()
      if (!company) {
        throw new InternalServerErrorException('Company information not found')
      }

      let ncf: string | undefined
      let updateData: {
        nextGovernmentalNCF?: string
        nextCreditNCF?: string
        nextEndConsumerNCF?: string
      } = {}

      switch (data.type) {
        case InvoiceType.GOVERNMENTAL:
          ncf = company.nextGovernmentalNCF
          updateData.nextGovernmentalNCF = this.incrementNCF(
            company.nextGovernmentalNCF,
          )
          break
        case InvoiceType.CREDIT:
          ncf = company.nextCreditNCF
          updateData.nextCreditNCF = this.incrementNCF(company.nextCreditNCF)
          break
        case InvoiceType.ENDCONSUMER:
          ncf = company.nextEndConsumerNCF
          updateData.nextEndConsumerNCF = this.incrementNCF(
            company.nextEndConsumerNCF,
          )
          break
        case InvoiceType.QUOTE:
        case InvoiceType.BASIC:
          ncf = undefined
          break
      }

      const subtotal = data.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      )
      const taxes = subtotal * (data.type === InvoiceType.BASIC ? 0 : 0.18)
      const total = subtotal + taxes

      const sales = data.items.map((item) => ({
        item: item.name,
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity,
      }))

      const newInvoice = await this.invoiceRepository.create({
        ...data,
        document,
        subtotal,
        taxes,
        total,
        ncf,
        items: JSON.stringify(data.items),
      })

      if (Object.keys(updateData).length > 0) {
        await this.companyInfoRepository.update(company.id, updateData)
      }

      await this.salesRepository.createMany(sales)

      return newInvoice
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error
      }
      throw new InternalServerErrorException('Error creating invoice')
    }
  }

  private incrementNCF(currentNCF: string): string {
    const match = currentNCF.match(/^([A-Z]\d{2})(\d+)$/)
    if (!match) {
      throw new InternalServerErrorException('Invalid NCF format')
    }

    const prefix = match[1]
    const numericPart = match[2]
    const incrementedNumber = (parseInt(numericPart, 10) + 1)
      .toString()
      .padStart(numericPart.length, '0')

    return `${prefix}${incrementedNumber}`
  }
}

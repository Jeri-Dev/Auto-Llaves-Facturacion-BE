import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { CustomerRepository } from '@repositories/customer.repo'
import { PaginationDTO } from '@shared/dto/pagination'
import { CreateCustomerDTO } from './dto/create-customer.dto'

@Injectable()
export class CustomersService {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async findAllCustomers(dto: PaginationDTO) {
    try {
      return await this.customerRepository.pagination(dto)
    } catch (error) {
      throw new InternalServerErrorException('Error fetching customers')
    }
  }

  async findCustomerById(id: number) {
    try {
      const customer = await this.customerRepository.findById(id)
      if (!customer) {
        throw new InternalServerErrorException('Customer not found')
      }
      return customer
    } catch (error) {
      throw new InternalServerErrorException('Error fetching customer by ID')
    }
  }

  async createCustomer(data: CreateCustomerDTO) {
    try {
      const existingCustomer = await this.customerRepository.findOne({
        document: data.document,
      })

      if (existingCustomer) {
        throw new BadRequestException(
          'Customer with this document already exists',
        )
      }

      return await this.customerRepository.create(data)
    } catch (error) {
      throw new InternalServerErrorException('Error creating customer')
    }
  }

  async updateCustomer(id: number, data: any) {
    try {
      const customer = await this.customerRepository.findById(id)
      if (!customer) {
        throw new InternalServerErrorException('Customer not found')
      }
      return await this.customerRepository.update(id, data)
    } catch (error) {
      throw new InternalServerErrorException('Error updating customer')
    }
  }
}

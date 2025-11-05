import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { CompanyInfoRepository } from '@repositories/company.repo'
import { CreateCompanyInfoDTO } from './dto/create-company-info.dto'
import { UpdateCompanyInfoDTO } from './dto/update-company-info.dto'

@Injectable()
export class CompanyInfoService {
  constructor(private readonly companyInfoRepository: CompanyInfoRepository) {}

  async findCompanyInfo() {
    try {
      const companyInfo = await this.companyInfoRepository.findLast()
      if (!companyInfo) {
        throw new InternalServerErrorException('Company info not found')
      }
      return companyInfo
    } catch (error) {
      throw new InternalServerErrorException('Error fetching company info')
    }
  }

  async createCompanyInfo(data: CreateCompanyInfoDTO) {
    try {
      const existingCompanyInfo = await this.companyInfoRepository.findOne({
        rnc: data.rnc,
      })

      if (existingCompanyInfo) {
        throw new BadRequestException(
          'Company info with this RNC already exists',
        )
      }

      return await this.companyInfoRepository.create(data)
    } catch (error) {
      throw new InternalServerErrorException('Error creating company info')
    }
  }

  async updateCompanyInfo(data: UpdateCompanyInfoDTO) {
    try {
      const companyInfo = await this.companyInfoRepository.findLast()
      if (!companyInfo) {
        throw new InternalServerErrorException('Company info not found')
      }
      return await this.companyInfoRepository.update(companyInfo.id, data)
    } catch (error) {
      throw new InternalServerErrorException('Error updating company info')
    }
  }
}

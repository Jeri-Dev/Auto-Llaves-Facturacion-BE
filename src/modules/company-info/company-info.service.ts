import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { CompanyInfoRepository } from '@repositories/company.repo'
import { CreateCompanyInfoDTO } from './dto/create-company-info.dto'
import { UpdateCompanyInfoDTO } from './dto/update-company-info.dto'

@Injectable()
export class CompanyInfoService {
  constructor(private readonly companyInfoRepository: CompanyInfoRepository) {}

  async findCompanyInfo() {
    const companyInfo = await this.companyInfoRepository.findLast()
    if (!companyInfo) {
      throw new NotFoundException('Company info not found')
    }
    return companyInfo
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
      console.error(error)
      throw new InternalServerErrorException(
        'Hubo un error al guardar los datos',
      )
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

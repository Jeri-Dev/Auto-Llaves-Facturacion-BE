import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common'
import { CompanyInfoService } from './company-info.service'
import { CreateCompanyInfoDTO } from './dto/create-company-info.dto'
import { UpdateCompanyInfoDTO } from './dto/update-company-info.dto'

@Controller('company')
export class CompanyInfoController {
  constructor(private readonly companyInfoService: CompanyInfoService) {}

  @Get('/current')
  findCurrent() {
    return this.companyInfoService.findCompanyInfo()
  }

  @Post('/')
  create(@Body() dto: CreateCompanyInfoDTO) {
    return this.companyInfoService.createCompanyInfo(dto)
  }

  @Patch('/')
  update(@Body() dto: UpdateCompanyInfoDTO) {
    return this.companyInfoService.updateCompanyInfo(dto)
  }
}

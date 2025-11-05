import { Module } from '@nestjs/common'
import { CompanyInfoService } from './company-info.service'
import { CompanyInfoController } from './company-info.controller'
import { CompanyInfoRepository } from '@repositories/company.repo'

@Module({
  controllers: [CompanyInfoController],
  providers: [CompanyInfoService, CompanyInfoRepository],
  exports: [CompanyInfoService],
})
export class CompanyInfoModule {}

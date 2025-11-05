import { PartialType } from '@nestjs/swagger'
import { CreateCompanyInfoDTO } from './create-company-info.dto'

export class UpdateCompanyInfoDTO extends PartialType(CreateCompanyInfoDTO) {}

import { Body, Controller, Get, Query } from '@nestjs/common'
import { MiscellaneousService } from './miscellaneous.service'
import { GetRncDTO } from './dto/get-rnc.dto'

@Controller('miscellaneous')
export class MiscellaneousController {
  constructor(private readonly miscellaneousService: MiscellaneousService) {}

  @Get('rnc')
  async getRnc(@Query() dto: GetRncDTO) {
    return this.miscellaneousService.getRnc(dto.rnc)
  }
}

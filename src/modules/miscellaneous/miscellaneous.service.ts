import { RncService } from '@shared/services/rnc'
import { Injectable } from '@nestjs/common'

@Injectable()
export class MiscellaneousService {
  constructor(private readonly rncService: RncService) {}

  async getRnc(rnc: string) {
    const result = await this.rncService.getRnc(rnc)
    return result
  }
}

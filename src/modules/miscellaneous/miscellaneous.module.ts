import { Module } from '@nestjs/common'
import { MiscellaneousService } from './miscellaneous.service'
import { MiscellaneousController } from './miscellaneous.controller'
import { RncService } from '@shared/services/rnc'

@Module({
  controllers: [MiscellaneousController],
  providers: [MiscellaneousService, RncService],
})
export class MiscellaneousModule {}

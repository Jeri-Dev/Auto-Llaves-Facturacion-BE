import { INestApplication } from '@nestjs/common'
import helmet from 'helmet'

export const securitySetup = (app: INestApplication) => {
  app.use(
    helmet({
      crossOriginResourcePolicy: false,
    }),
  )
}

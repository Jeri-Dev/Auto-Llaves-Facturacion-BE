import { INestApplication } from '@nestjs/common'
import { json, urlencoded } from 'body-parser'

export const parserSetup = (app: INestApplication) => {
  app.use(json())
  app.use(urlencoded({ extended: true }))
}

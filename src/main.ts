import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { corsSetup } from '@config/cors'
import { loggerSetup } from '@config/logger'
import { parserSetup } from '@config/parser'
import { securitySetup } from '@config/security'
import { swaggerSetup } from '@config/swagger'
import { validationsSetup } from '@config/validations'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.setGlobalPrefix('api')

  corsSetup(app)
  validationsSetup(app)
  securitySetup(app)
  swaggerSetup(app)
  parserSetup(app)
  loggerSetup(app)

  await app.listen(3000)
}
bootstrap()

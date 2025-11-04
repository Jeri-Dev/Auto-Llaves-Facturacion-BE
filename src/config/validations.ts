import { HttpException, HttpStatus, INestApplication } from '@nestjs/common'
import { ValidationPipe, ValidationError } from '@nestjs/common'

const formatErrors: any = (errors: ValidationError[], parentPath = '') => {
  const result = []

  for (const error of errors) {
    const propertyPath = parentPath
      ? `${parentPath}.${error.property}`
      : error.property

    if (error.constraints) {
      const keys = Object.keys(error.constraints)
      const key = keys[0]
      const message = error.constraints[key]

      result.push({
        field: propertyPath,
        value: error.value,
        message,
      })
    }

    if (error.children && error.children.length > 0) {
      if (Array.isArray(error.value)) {
        error.children.forEach((child, index) => {
          const arrayItemPath = `${propertyPath}[${index}]`
          const childErrors = formatErrors([child], arrayItemPath)
          result.push(...childErrors)
        })
      } else {
        const childErrors = formatErrors(error.children, propertyPath)
        result.push(...childErrors)
      }
    }
  }

  return result
}

export const validationsSetup = (app: INestApplication) => {
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      exceptionFactory(errors) {
        const errorsFormatted = formatErrors(errors)

        throw new HttpException(
          {
            error: true,
            status: HttpStatus.BAD_REQUEST,
            messages: errorsFormatted,
          },
          HttpStatus.BAD_REQUEST,
        )
      },
    }),
  )
}

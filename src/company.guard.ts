import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { CompanyInfoRepository } from '@repositories/company.repo'
import { Observable } from 'rxjs'

@Injectable()
export class CompanyGuard implements CanActivate {
  constructor(private readonly repo: CompanyInfoRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const response = await this.repo.findLast()

      if (!response) {
        throw new ForbiddenException(
          'Primero debe configurar la información de la empresa',
        )
      }
    } catch (error) {
      throw new ForbiddenException(
        'Primero debe configurar la información de la empresa',
      )
    }

    return true
  }
}

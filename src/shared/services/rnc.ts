import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'

@Injectable()
export class RncService {
  async getRnc(rnc: string) {
    try {
      const response = await fetch(
        `https://consultarnc.com.do/api/search?rnc=${rnc}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )

      const data = await response.json()

      if (data.total < 1) {
        throw new NotFoundException('RNC not found')
      }

      return data.data[0]
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }
      throw new InternalServerErrorException('Error consulting RNC')
    }
  }
}

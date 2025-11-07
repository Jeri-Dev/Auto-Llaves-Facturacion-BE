import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsPositive, IsString } from 'class-validator'

export class CreateInventoryDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  code: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty()
  @IsPositive()
  price: number
}

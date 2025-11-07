import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsPositive, IsString, MaxLength } from 'class-validator'

export class CreateInventoryDTO {
  @ApiProperty()
  @IsString()
  @MaxLength(4)
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

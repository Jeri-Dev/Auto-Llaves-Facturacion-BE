import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateCustomerDTO {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  document: string

  @ApiProperty()
  @IsString()
  @IsOptional()
  address?: string

  @ApiProperty()
  @IsOptional()
  @IsString()
  phone?: string
}

import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator'

export class CreateCompanyInfoDTO {
  @ApiProperty({ example: 'Auto Llaves S.A.' })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({ example: '123456789' })
  @IsString()
  @IsNotEmpty()
  rnc: string

  @ApiProperty({ example: 'Av. Principal #123, Santo Domingo' })
  @IsString()
  @IsNotEmpty()
  address: string

  @ApiProperty({ example: '809-555-1234' })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string

  @ApiProperty({ example: '809-555-5678', required: false })
  @IsString()
  @IsOptional()
  secondPhoneNumber?: string

  @ApiProperty({ example: 'B0100000001' })
  @IsString()
  @IsNotEmpty()
  nextGovernmentalNCF: string

  @ApiProperty({ example: 'B0200000001' })
  @IsString()
  @IsNotEmpty()
  nextCreditNCF: string

  @ApiProperty({ example: 'B0300000001' })
  @IsString()
  @IsNotEmpty()
  nextEndConsumerNCF: string

  @ApiProperty({ example: 1, default: 1 })
  @IsInt()
  @Min(1)
  @IsOptional()
  nextQuoteNumber?: number
}

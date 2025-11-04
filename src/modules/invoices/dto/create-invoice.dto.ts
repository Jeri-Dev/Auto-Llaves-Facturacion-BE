import { ApiProperty } from '@nestjs/swagger'
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator'
import { Type } from 'class-transformer'
import { InvoiceType } from 'src/enums/invoice'

export class InvoiceItemDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty()
  @IsPositive()
  @IsNotEmpty()
  price: number

  @ApiProperty()
  @IsPositive()
  @IsNotEmpty()
  quantity: number
}

export class CreateInvoiceDTO {
  @ApiProperty()
  @IsInt()
  @IsOptional()
  customerId?: number

  @ApiProperty()
  @IsString()
  @IsOptional()
  customerName?: string

  @ApiProperty()
  @IsEnum(InvoiceType)
  @IsNotEmpty()
  type: InvoiceType

  @ApiProperty()
  @IsString()
  @IsOptional()
  document?: string

  @ApiProperty({ type: [InvoiceItemDTO] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InvoiceItemDTO)
  @IsNotEmpty()
  items: InvoiceItemDTO[]
}

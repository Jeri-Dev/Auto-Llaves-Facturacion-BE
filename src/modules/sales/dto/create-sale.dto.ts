import { ApiProperty } from '@nestjs/swagger'
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Min,
} from 'class-validator'

export class CreateSaleDTO {
  @ApiProperty({ description: 'Nombre del item/producto' })
  @IsString()
  @IsNotEmpty()
  item: string

  @ApiProperty({ description: 'Cantidad de items' })
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  quantity: number

  @ApiProperty({ description: 'Precio unitario' })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  price: number

  @ApiProperty({ description: 'Total de la venta' })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  total: number
}

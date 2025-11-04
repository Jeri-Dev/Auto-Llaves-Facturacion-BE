import { PAGINATION } from '@messages/General.json'
import { Transform } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'
import {
  IsEnum,
  IsNumber,
  IsString,
  IsOptional,
  IsDateString,
} from 'class-validator'

export class PaginationDTO {
  @ApiProperty({ required: false, default: 1 })
  @IsNumber({}, { message: PAGINATION.PAGE_NUMBER })
  @IsOptional()
  @Transform(({ value }) => {
    const number = parseInt(value)
    return isNaN(number) ? 1 : number === 0 ? 1 : number
  })
  page: number = 1

  @ApiProperty({ required: false, default: 10 })
  @IsNumber({}, { message: PAGINATION.MAX_NUMBER })
  @IsOptional()
  @Transform(({ value }) => {
    const number = parseInt(value)
    return isNaN(number) ? 1 : number === 0 ? 1 : number
  })
  max: number = 10

  @ApiProperty({ required: false })
  @IsString({ message: PAGINATION.SEARCH_STRING })
  @IsOptional()
  search?: string

  @ApiProperty({ required: false })
  @IsString({ message: PAGINATION.START_DATE })
  @IsOptional()
  @IsDateString({}, { message: PAGINATION.START_DATE })
  startDate?: string

  @ApiProperty({ required: false })
  @IsString({ message: PAGINATION.END_DATE })
  @IsOptional()
  @IsDateString({}, { message: PAGINATION.END_DATE })
  endDate?: string

  @ApiProperty({ required: false, enum: ['asc', 'desc'] })
  @IsString({ message: PAGINATION.SORT_ORDER })
  @IsEnum(['asc', 'desc'], { message: PAGINATION.SORT_ORDER })
  @IsOptional()
  orderSort: 'asc' | 'desc' = 'desc'
}

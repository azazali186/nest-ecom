import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateTranslationDto } from '../translation/create-translation.dto';
import { CreateStockDto } from '../stock/create-stock.dto';
import { CreateVariationDto } from '../variations/create-variation.dto';
export class CreateProductDto {
  @ApiProperty()
  @IsString()
  sku: string;

  @ApiProperty({ type: [Number] })
  @IsArray()
  @IsNumber({}, { each: true })
  categoryIds: number[];

  @ApiProperty({ type: [CreateVariationDto] })
  @IsArray()
  @IsOptional()
  variations?: CreateVariationDto[];

  @ApiProperty({ type: [CreateStockDto] })
  @IsArray()
  @IsOptional()
  stocks?: CreateStockDto[];

  @ApiProperty({ type: [CreateTranslationDto] })
  @IsNotEmpty({
    message: 'TRANSLATIONS_IS_REQUIRED',
  })
  @IsArray({
    message: 'TRANSLATIONS_IS_ARRAY',
  })
  translations: CreateTranslationDto[];

  @ApiPropertyOptional({ type: 'text' })
  @IsArray({
    message: 'IMAGES_IS_ARRAY',
  })
  images: string[];
}

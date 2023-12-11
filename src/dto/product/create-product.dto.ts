import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateTranslationDto } from '../translation/create-translation.dto';
import { CreateVariationDto } from '../variations/create-variation.dto';
import { PriceDto } from '../stock/price.dto';
import { CreateFeaturesDto } from './create-features.dto';
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

  @ApiProperty({ type: Number })
  @IsNumber()
  @IsOptional()
  quantity: number;

  @ApiProperty({ type: [PriceDto], required: false })
  @IsArray()
  @IsNotEmpty()
  prices?: PriceDto[];

  @ApiProperty({ type: [CreateTranslationDto] })
  @IsNotEmpty({
    message: 'TRANSLATIONS_IS_REQUIRED',
  })
  @IsArray({
    message: 'TRANSLATIONS_IS_ARRAY',
  })
  translations: CreateTranslationDto[];

  @ApiProperty({ type: [String], required: false })
  @IsArray({
    message: 'IMAGES_IS_ARRAY',
  })
  @IsOptional()
  @IsString({ each: true })
  images?: string[];

  @ApiProperty({ type: [CreateFeaturesDto], required: false })
  @IsOptional()
  features?: CreateFeaturesDto[];
}

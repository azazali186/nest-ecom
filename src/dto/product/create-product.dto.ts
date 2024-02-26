import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import { CreateTranslationDto } from '../translation/create-translation.dto';
import { CreateVariationDto } from '../variations/create-variation.dto';
import { PriceDto } from '../stock/price.dto';
import { CreateFeaturesDto } from './create-features.dto';
import { CombinationDto } from './combination-dto';
export class CreateProductDto {
  @ApiProperty()
  @IsString()
  sku: string;

  @ApiProperty()
  @IsString()
  slug: string;

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

  @ApiPropertyOptional({ type: [CreateFeaturesDto], required: false })
  @IsOptional()
  features?: CreateFeaturesDto[];

  @ApiPropertyOptional({ type: [CreateVariationDto] })
  @IsArray()
  @IsOptional()
  variations?: CreateVariationDto[];

  @ApiPropertyOptional({ type: [CombinationDto] })
  @IsArray()
  @IsOptional()
  combinations?: CombinationDto[];

  @ApiProperty({ type: [Number] })
  @IsArray()
  @IsNumber({}, { each: true })
  categoryIds: number[];

  @ApiPropertyOptional({ type: [String], required: false })
  @IsArray({
    message: 'IMAGES_IS_ARRAY',
  })
  @IsOptional()
  @IsString({ each: true })
  images?: string[];

  @ApiHideProperty()
  user: any;
}

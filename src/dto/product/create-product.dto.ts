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
import { ImagesDto } from '../images/image.dto';
export class CreateProductDto {
  @ApiProperty()
  @IsString()
  sku: string;

  @ApiProperty({ type: [Number] })
  @IsArray()
  @IsNumber({}, { each: true })
  categoryIds: number[];

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

  @ApiPropertyOptional({ type: [ImagesDto] })
  @IsArray({
    message: 'IMAGES_IS_ARRAY',
  })
  images: ImagesDto[];
}

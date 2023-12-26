import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiHideProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UpdateTranslationDto } from '../translation/update-translation.dto';
import { ProductStatus } from 'src/enum/product-status.enum';
import { UpdateStockDto } from '../stock/update-stock.dto';
import { UpdateImagesDto } from '../images/update-image.dto';
import { CreateVariationDto } from '../variations/create-variation.dto';
export class UpdateProductDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  sku: string;

  @ApiPropertyOptional({ enum: ProductStatus })
  @IsEnum(ProductStatus)
  @IsOptional()
  status: ProductStatus;

  @ApiPropertyOptional({ type: [Number] })
  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  categoryIds: number[];

  @ApiPropertyOptional({ type: [CreateVariationDto] })
  @IsArray()
  @IsOptional()
  variations?: CreateVariationDto[];

  @ApiPropertyOptional({ type: [UpdateStockDto] })
  @IsArray()
  @IsOptional()
  stocks?: UpdateStockDto[];

  @ApiPropertyOptional({ type: [UpdateTranslationDto] })
  @IsArray({
    message: 'TRANSLATIONS_IS_ARRAY',
  })
  @IsOptional()
  translations: UpdateTranslationDto[];

  @ApiPropertyOptional({ type: [UpdateImagesDto] })
  @IsArray({
    message: 'IMAGES_IS_ARRAY',
  })
  @IsOptional()
  images: UpdateImagesDto[];

  @ApiHideProperty()
  user: any;
}

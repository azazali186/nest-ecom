import { ApiHideProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsArray,
  IsOptional,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';
import { UpdateTranslationDto } from '../translation/update-translation.dto';
import { UpdatePriceDto } from './update-price.dto';
import { UpdateImagesDto } from '../images/update-image.dto';
import { Product } from 'src/entities/product.entity';

export class UpdateStockDto {
  @ApiPropertyOptional({ type: Number })
  @IsNumber()
  @IsOptional()
  id: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  sku: string;

  @ApiPropertyOptional({ type: Number })
  @IsNumber()
  @IsOptional()
  quantity: number;

  @ApiPropertyOptional({ type: [UpdateImagesDto], required: false })
  @IsArray()
  @IsOptional()
  images?: UpdateImagesDto[];

  @ApiPropertyOptional({ type: [UpdateTranslationDto], required: false })
  @IsArray()
  @IsNotEmpty()
  translations?: UpdateTranslationDto[];

  @ApiPropertyOptional({ type: [UpdatePriceDto], required: false })
  @IsArray()
  @IsNotEmpty()
  prices?: UpdatePriceDto[];

  @ApiPropertyOptional({ type: Product })
  @IsOptional()
  product: Product;

  @ApiHideProperty()
  user: any;
}

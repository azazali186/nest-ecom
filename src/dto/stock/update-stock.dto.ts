import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsArray, IsOptional, IsNotEmpty } from 'class-validator';
import { UpdateTranslationDto } from '../translation/update-translation.dto';
import { UpdatePriceDto } from './update-price.dto';
import { UpdateImagesDto } from '../images/update-image.dto';

export class UpdateStockDto {
  @ApiProperty({ type: Number })
  @IsString()
  id: number;

  @ApiPropertyOptional()
  @IsString()
  sku: string;

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
}

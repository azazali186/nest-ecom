import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import {
  IsString,
  IsArray,
  IsOptional,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';
import { PriceDto } from './price.dto';
import { CreateTranslationDto } from '../translation/create-translation.dto';
import { Product } from 'src/entities/product.entity';

export class CreateStockDto {
  @ApiProperty()
  @IsString()
  sku: string;

  @ApiPropertyOptional({ type: Number })
  @IsNumber()
  @IsOptional()
  quantity: number;

  @ApiProperty({ type: [CreateTranslationDto], required: false })
  @IsArray()
  @IsNotEmpty()
  translations?: CreateTranslationDto[];

  @ApiProperty({ type: [PriceDto], required: false })
  @IsArray()
  @IsNotEmpty()
  prices?: PriceDto[];

  @ApiPropertyOptional({ type: Product })
  @IsOptional()
  product: Product;

  @ApiHideProperty()
  user: any;
}

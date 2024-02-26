import { ApiHideProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber } from 'class-validator';

export class UpdateImagesDto {
  @ApiPropertyOptional({ type: 'number' })
  @IsOptional()
  @IsNumber()
  id: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  url: string;

  @ApiPropertyOptional({ type: 'number', required: false })
  @IsOptional()
  @IsNumber()
  category_id?: number;

  @ApiPropertyOptional({ type: 'number', required: false })
  @IsOptional()
  @IsNumber()
  product_id?: number;

  @ApiPropertyOptional({ type: 'number', required: false })
  @IsOptional()
  @IsNumber()
  stock_id?: number;

  @ApiPropertyOptional({ type: 'number', required: false })
  @IsOptional()
  @IsNumber()
  catalog_id?: number;

  @ApiHideProperty()
  user: any;
}

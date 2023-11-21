import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber } from 'class-validator';

export class UpdateImagesDto {
  @ApiProperty({ type: 'number' })
  @IsNumber()
  id: number;

  @ApiPropertyOptional()
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
}

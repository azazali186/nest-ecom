import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber } from 'class-validator';

export class ImagesDto {
  @ApiProperty()
  @IsString()
  url: string;

  @ApiProperty({ type: 'number', required: false })
  @IsOptional()
  @IsNumber()
  category_id?: number;

  @ApiProperty({ type: 'number', required: false })
  @IsOptional()
  @IsNumber()
  product_id?: number;

  @ApiProperty({ type: 'number', required: false })
  @IsOptional()
  @IsNumber()
  stock_id?: number;

  @ApiProperty({ type: 'number', required: false })
  @IsOptional()
  @IsNumber()
  catalog_id?: number;

  @ApiHideProperty()
  user: any;
}

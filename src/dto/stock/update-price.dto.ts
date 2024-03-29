import { ApiHideProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdatePriceDto {
  @ApiPropertyOptional({ type: Number })
  @IsNumber()
  @IsOptional()
  id: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  price: string;

  @ApiPropertyOptional({ type: 'number', required: false })
  @IsNotEmpty()
  @IsNumber()
  @IsOptional()
  currency_id: number;

  @ApiHideProperty()
  user: any;
}
